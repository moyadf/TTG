import { useEffect, useState } from "react";
import { getTerritoriosRest } from "../services/territories";
import type { Territorio } from "../services/territories";
import TerritoryCard from "../components/TerritoryCard";

export default function Dashboard() {
  const [territorios, setTerritorios] = useState<Territorio[]>([]);

  useEffect(() => {
    getTerritoriosRest()
      .then(setTerritorios)
      .catch((err) => console.error("Error cargando territorios:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold text-blue-600">Gestión de Territorios</h1>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {territorios.map((territorio) => (
            <TerritoryCard key={territorio.id} territorio={territorio} />
          ))}
        </div>
      </main>
    </div>
  );
}
