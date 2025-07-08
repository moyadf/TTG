// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { getTerritoriosList } from "../services/territories";
import { getEntregas } from "../services/deliverys";
import type { Territory } from "../types/territory";
import type { Delivery } from "../types/delivery";
import { differenceInDays, parseISO, format } from "date-fns";
import { exportHistoryExcel } from '../utils/exportHistoryExcel'

export default function Dashboard() {
  const [territorios, setTerritorios] = useState<Territory[]>([]);
  const [historial, setHistorial] = useState<Delivery[]>([]);

  useEffect(() => {
    getTerritoriosList()
      .then(setTerritorios)
      .catch(console.error);

    // Cargar últimas 10 entradas de historial
    getEntregas()
      .then(data => setHistorial(data.slice(0, 10)))
      .catch(console.error);
  }, []);

  const total = territorios.length;
  const disponibles = territorios.filter(t => t.estado === "disponible").length;
  const enUso = territorios.filter(t => t.estado === "en_uso").length;
  const inhabilitados = territorios.filter(t => t.estado === "inhabilitado").length;
  const caducados = territorios.filter(t => t.estado === "caducado").length;
  const especiales = territorios.filter(t => t.estado === "especial").length;

  const proximosVencimientos = territorios
    .filter(t => t.estado === "en_uso" && t.fecha_devolucion)
    .map(t => {
      const diasRestantes = differenceInDays(
        parseISO(t.fecha_devolucion!),
        new Date()
      );
      return { ...t, diasRestantes };
    })
    .filter(t => t.diasRestantes >= 0 && t.diasRestantes <= 7)
    .sort((a, b) => a.diasRestantes - b.diasRestantes);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Resumen de Territorios
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <SummaryCard color="blue" label="Total" value={total} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9-4 9 4v13a2 2 0 0 1-2 2h-5m-4 0H5a2 2 0 0 1-2-2z" />} />
          <SummaryCard color="green" label="Disponibles" value={disponibles} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />} />
          <SummaryCard color="yellow" label="En Uso" value={enUso} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />} />
          <SummaryCard color="red" label="Inhabilitados" value={inhabilitados} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />} />
          <SummaryCard color="purple" label="Caducados" value={caducados} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m0-4h.01M12 8v4h.01" />} />
        </div>

        {especiales > 0 && (
          <div className="mt-4 text-sm text-indigo-600">
            {especiales} territorio{especiales > 1 ? "s" : ""} marcado
            {especiales > 1 ? "s" : ""} como <strong>especial</strong>.
          </div>
        )}

        {/* Vencimientos próximos */}
        {proximosVencimientos.length > 0 && (
          <section className="mt-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Vencimientos Próximos
            </h3>
            <div className="space-y-3">
              {proximosVencimientos.map((t) => (
                <div
                  key={t.id}
                  className="bg-yellow-50 text-gray-800 p-4 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">
                      Territorio #{t.numero}{t.usuario_asignado?.nombre ? ` - ${t.usuario_asignado.nombre}` : ""}
                    </p>
                    <p className="text-sm">
                      Vence en {t.diasRestantes} día{t.diasRestantes !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="font-medium">
                    {t.usuario_asignado?.nombre ?? "Sin asignar"}
                  </div>
                  <div className="text-yellow-600 font-bold text-xl">!</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={exportHistoryExcel}
            className="text-white cursor-pointer bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
          >
            📥 S-13 (Excel)
          </button>
        </div>

        {/* Historial reciente */}
        <section className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Historial Reciente
          </h3>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Territorio</th>
                  <th className="px-6 py-3">Usuario</th>
                  <th className="px-6 py-3">Entregado</th>
                  <th className="px-6 py-3">Fecha Devolución</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3">Comentarios</th>
                  <th className="px-6 py-3">Creado en</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((r) => (
                  <tr key={r.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">#{r.territorio_id.slice(0, 4)}</td>
                    <td className="px-6 py-4">{r.usuario_id.nombre}</td>
                    <td className="px-6 py-4">{format(new Date(r.fecha_entrega), "dd/MM/yyyy")}</td>
                    <td className="px-6 py-4">{r.fecha_devolucion ? format(new Date(r.fecha_devolucion), "dd/MM/yyyy") : "-"}</td>
                    <td className="px-6 py-4">{r.estado_territorio}</td>
                    <td className="px-6 py-4">{r.comentarios ?? "-"}</td>
                    <td className="px-6 py-4">{format(new Date(r.creado_en), "dd/MM/yyyy HH:mm")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

type SummaryCardProps = {
  color: "blue" | "green" | "yellow" | "red" | "purple";
  label: string;
  value: number;
  icon: JSX.Element;
};
function SummaryCard({ color, label, value, icon }: SummaryCardProps) {
  const bgMap = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
  };
  return (
    <div className="bg-white shadow rounded-lg p-5 flex items-center">
      <div className={`p-3 rounded-full ${bgMap[color]}`}>
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <div className="ml-4">
        <p className="text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-gray-700">{value}</p>
      </div>
    </div>
  );
}
