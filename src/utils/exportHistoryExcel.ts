import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { supabase } from '../services/supabase';

type EntregaRow = {
  numero: number;
  nombre: string;
  fecha_entrega: string;
  fecha_devolucion: string;
};

export async function exportHistoryExcel() {
  const { data: rows, error } = await supabase
    .from('entregas')
    .select(`
      territorio:territorio_id ( numero ),
      usuario:usuario_id   ( nombre ),
      fecha_entrega,
      fecha_devolucion
    `)
    .eq('estado_territorio', 'devuelto');

  if (error) throw error;

  const entregas: EntregaRow[] = (rows || []).map(r => ({
    numero: r.territorio.numero,
    nombre: r.usuario.nombre.toUpperCase(),
    fecha_entrega: r.fecha_entrega!,
    fecha_devolucion: r.fecha_devolucion!,
  }));

  entregas.sort((a, b) => {
    if (a.numero !== b.numero) return a.numero - b.numero;
    return new Date(a.fecha_entrega).getTime() - new Date(b.fecha_entrega).getTime();
  });

  const byTerritorio = new Map<number, EntregaRow[]>();
  entregas.forEach(e => {
    if (!byTerritorio.has(e.numero)) byTerritorio.set(e.numero, []);
    byTerritorio.get(e.numero)!.push(e);
  });

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Mi App';
  wb.created = new Date();

  // Estilo de bordes y colores (como el original)
  const grayFill: ExcelJS.Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD9D9D9' } // Gris claro exacto
  };

  const thinGrayBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: 'FFBFBFBF' } },
    left: { style: 'thin', color: { argb: 'FFBFBFBF' } },
    right: { style: 'thin', color: { argb: 'FFBFBFBF' } },
    bottom: { style: 'thin', color: { argb: 'FFBFBFBF' } }
  };

  const maxTerr = Math.max(...byTerritorio.keys(), 1);

  for (let start = 1; start <= maxTerr; start += 5) {
    const end = Math.min(start + 4, maxTerr);
    const sheet = wb.addWorksheet(`${start}-${end}`);

    // --- CONFIGURACIÓN INICIAL ---
    sheet.properties.defaultRowHeight = 18;
    
    // Filas vacías como en el original
    sheet.getRow(1).height = 25;
    sheet.getRow(2).height = 5; // Espacio vacío
    sheet.getRow(3).height = 20;

    // --- TÍTULO (A1) ---
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'Registro de asignación de territorio';
    titleCell.font = { 
      name: 'Calibri', 
      size: 12, 
      bold: true,
      color: { argb: 'FF000000' }
    };
    titleCell.alignment = { 
      vertical: 'middle',
      horizontal: 'left'
    };

    // --- ENCABEZADOS DE TERRITORIO (FILA 3) ---
    for (let offset = 0; offset < end - start + 1; offset++) {
      const col1 = offset * 2 + 1;
      const col2 = col1 + 1;
      
      // Fusionar celdas para el territorio
      sheet.mergeCells(3, col1, 3, col2);
      
      const cell = sheet.getCell(3, col1);
      cell.value = `Num. ${start + offset}`;
      cell.font = { 
        name: 'Calibri', 
        size: 10, 
        bold: true,
        color: { argb: 'FF000000' }
      };
      cell.alignment = { 
        vertical: 'middle',
        horizontal: 'center'
      };
      cell.fill = grayFill;
      cell.border = thinGrayBorder;
    }

    // --- DATOS (NOMBRES Y FECHAS) ---
    let maxRows = 0;
    for (let t = start; t <= end; t++) {
      maxRows = Math.max(maxRows, byTerritorio.get(t)?.length || 0);
    }

    for (let i = 0; i < maxRows; i++) {
      const rowName = 4 + i * 2;
      const rowDate = rowName + 1;
      
      for (let offset = 0; offset <= end - start; offset++) {
        const terrNum = start + offset;
        const rec = byTerritorio.get(terrNum)?.[i];
        const col1 = offset * 2 + 1;
        const col2 = col1 + 1;

        // Celda de nombre (fusionada)
        sheet.mergeCells(rowName, col1, rowName, col2);
        const nameCell = sheet.getCell(rowName, col1);
        
        if (rec) {
          nameCell.value = rec.nombre;
        }
        
        nameCell.font = { 
          name: 'Calibri', 
          size: 10,
          color: { argb: 'FF000000' }
        };
        nameCell.alignment = { 
          vertical: 'middle',
          horizontal: 'center'
        };
        nameCell.border = thinGrayBorder;

        // Celdas de fecha
        const startDateCell = sheet.getCell(rowDate, col1);
        const endDateCell = sheet.getCell(rowDate, col2);
        
        if (rec) {
          startDateCell.value = format(new Date(rec.fecha_entrega), 'dd/MM/yyyy');
          endDateCell.value = format(new Date(rec.fecha_devolucion), 'dd/MM/yyyy');
        }
        
        [startDateCell, endDateCell].forEach(cell => {
          cell.font = { 
            name: 'Calibri', 
            size: 10,
            color: { argb: 'FF000000' }
          };
          cell.alignment = { 
            vertical: 'middle',
            horizontal: 'center'
          };
          cell.border = thinGrayBorder;
        });
      }
    }

    // --- AJUSTES FINALES DE FORMATO ---
    // Ajustar ancho de columnas (como el original)
    sheet.columns.forEach((col, idx) => {
      // Columnas de nombres (impares) más anchas
      if (idx % 2 === 0) {
        col.width = 22; 
      } 
      // Columnas de fechas (pares) más estrechas
      else {
        col.width = 12;
      }
    });

    // Agregar bordes a todas las celdas usadas
    const lastRow = 4 + maxRows * 2;
    for (let r = 3; r <= lastRow; r++) {
      for (let c = 1; c <= (end - start + 1) * 2; c++) {
        const cell = sheet.getCell(r, c);
        cell.border = thinGrayBorder;
      }
    }
  }

  // --- GENERAR Y DESCARGAR ARCHIVO ---
  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), 'S-13 Torrente Gornal.xlsx');
}