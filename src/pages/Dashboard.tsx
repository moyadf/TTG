import { useEffect, useState } from "react";
import { getTerritorios } from "../services/territories";
import type { Territory } from "../types/territory";
import { differenceInDays, parseISO } from "date-fns";

export default function Dashboard() {
  const [territorios, setTerritorios] = useState<Territory[]>([]);

  useEffect(() => {
    getTerritorios()
      .then(setTerritorios)
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
    .map(t => ({
      ...t,
      diasRestantes: differenceInDays(parseISO(t.fecha_devolucion as string), new Date())
    }))
    .filter(t => t.diasRestantes >= 0 && t.diasRestantes <= 7)
    .sort((a, b) => a.diasRestantes - b.diasRestantes)
    .slice(0, 5);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen de Territorios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <SummaryCard color="blue" label="Total" value={total} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9-4 9 4v13a2 2 0 0 1-2 2h-5m-4 0H5a2 2 0 0 1-2-2z" />} />
          <SummaryCard color="green" label="Disponibles" value={disponibles} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />} />
          <SummaryCard color="yellow" label="En Uso" value={enUso} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />} />
          <SummaryCard color="red" label="Inhabilitados" value={inhabilitados} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />} />
          <SummaryCard color="purple" label="Caducados" value={caducados} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m0-4h.01M12 8v4h.01" />} />
        </div>

        {especiales > 0 && (
          <div className="mt-4 text-sm text-indigo-600">
            {especiales} territorio{especiales > 1 ? "s" : ""} marcado{especiales > 1 ? "s" : ""} como <strong>especial</strong>.
          </div>
        )}

        {proximosVencimientos.length > 0 && (
          <section className="mt-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Vencimientos Próximos</h3>
            <div className="space-y-4">
              {proximosVencimientos.map(t => (
                <div key={t.id} className="flex items-center justify-between bg-yellow-50 p-4 rounded shadow-sm">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Territorio #{t.numero}{t.nombre && ` - ${t.nombre}`}
                    </p>
                    <p className="text-sm text-gray-600">Vence en {t.diasRestantes} día{t.diasRestantes !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="text-right text-gray-700 font-medium">{t.usuario_asignado?.nombre || "Sin asignar"}</div>
                  <div className="text-orange-500 font-bold text-lg ml-4">!</div>
                </div>
              ))}
            </div>
          </section>
        )}
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
