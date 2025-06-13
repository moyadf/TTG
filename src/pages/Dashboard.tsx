// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { getTerritorios } from "../services/territories";
import type { Territory } from "../types/territory";

export default function Dashboard() {
  const [territorios, setTerritorios] = useState<Territory[]>([]);

  useEffect(() => {
    getTerritorios()
      .then(setTerritorios)
      .catch(console.error);
  }, []);

  const total = territorios.length;
  const disponibles = territorios.filter(t => t.estado === "disponible").length;
  const enUso = territorios.filter(t => t.estado === "uso").length;
  const inhabilitados = territorios.filter(t => t.estado === "inhabilitado").length;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Resumen de Territorios */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen de Territorios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            color="blue"
            label="Total Territorios"
            value={total}
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9-4 9 4v13a2 2 0 0 1-2 2h-5m-4 0H5a2 2 0 0 1-2-2z" />
            }
          />
          <SummaryCard
            color="green"
            label="Disponibles"
            value={disponibles}
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
            }
          />
          <SummaryCard
            color="yellow"
            label="En Uso"
            value={enUso}
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            }
          />
          <SummaryCard
            color="red"
            label="Inhabilitados"
            value={inhabilitados}
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
            }
          />
        </div>

        {/* TODO: Gráficos, Vencimientos, Cards... */}
        {/* Puedes seguir extendiendo aquí */}
      </main>
    </div>
  );
}

type SummaryCardProps = {
  color: "blue" | "green" | "yellow" | "red";
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
