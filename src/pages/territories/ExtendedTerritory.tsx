// src/pages/territories/ExtendTerritory.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { updateTerritorio } from "../../services/territories";
import type { Territory } from "../../types/territory";
import { format, addMonths } from "date-fns";

export default function ExtendTerritory() {
  const [territorios, setTerritorios] = useState<Territory[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [currentExp, setCurrentExp] = useState<string>("");

  // 1) Función para cargar solo los territorios "en_uso"
  async function loadTerritorios() {
    const { data, error } = await supabase
      .from<Territory>("territorios")
      .select("id, numero, fecha_caducidad")
      .eq("estado", "en_uso")
      .order("numero", { ascending: true });

    if (error) {
      console.error("Error cargando territorios en uso:", error.message);
    } else {
      setTerritorios(data || []);
    }
  }

  // 2) Al montar, traemos la lista
  useEffect(() => {
    loadTerritorios();
  }, []);

  // 3) Cuando cambia la selección, actualizamos la fecha de caducidad en el formulario
  useEffect(() => {
    const t = territorios.find((t) => t.id === selectedId);
    setCurrentExp(t?.fecha_caducidad ?? "");
  }, [selectedId, territorios]);

  // 4) Handler de extensión (+1 mes)
  async function handleExtend() {
    if (!selectedId) {
      return alert("Por favor, selecciona un territorio en uso.");
    }
    if (!currentExp) {
      return alert("No se pudo obtener la fecha de caducidad actual.");
    }

    // calculamos nueva fecha +1 mes
    const nuevaFecha = addMonths(new Date(currentExp), 1);
    const iso = nuevaFecha.toISOString().slice(0, 10);

    // actualizamos en Supabase
    const { error } = await updateTerritorio(selectedId, {
      estado: "extendido",               // asegúrate de tener esta opción en tu CHECK
      fecha_caducidad: iso,
      comentarios: "Extensión +1 mes",
    });

    if (error) {
      return alert("Error al extender: " + error.message);
    }

    alert(`Vencimiento extendido al ${format(nuevaFecha, "dd/MM/yyyy")}`);

    // 5) Recargamos la lista y mantenemos selección para que se vea la nueva fecha
    await loadTerritorios();
    // selectedId no se limpia: así la useEffect de arriba volverá a setCurrentExp con el nuevo iso
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg space-y-6">
      <h2 className="text-2xl font-semibold text-center text-blue-600">
        Extender 1 Mes – Territorio
      </h2>

      {/* Select de territorios en uso */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Territorio a Extender
        </label>
        <select
          className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-full"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">Selecciona...</option>
          {territorios.map((t) => (
            <option key={t.id} value={t.id}>
              Territorio #{t.numero}
            </option>
          ))}
        </select>
      </div>

      {/* Fecha de caducidad actual */}
      {currentExp && (
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Caduca actualmente
          </label>
          <input
            type="text"
            readOnly
            value={format(new Date(currentExp), "dd/MM/yyyy")}
            className="bg-gray-100 border border-gray-300 rounded-lg p-2.5 w-full"
          />
        </div>
      )}

      {/* Botón de Extensión */}
      <button
        onClick={handleExtend}
        disabled={!selectedId}
        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-3.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
      >
        Extender 1 Mes
      </button>
    </div>
  );
}
