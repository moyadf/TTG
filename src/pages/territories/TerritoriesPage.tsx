// src/pages/territories/TerritoriesPage.tsx
import { useState } from "react";
import TerritoriesList from "./TerritoriesList";
import NewTerritory from "./NewTerritory";
import ExtendTerritory from "./ExtendedTerritory";

export default function TerritoriesPage() {
  const [tab, setTab] = useState<"list"|"new"|"extend">("list");

  return (
    <div>
      <div className="border-b mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setTab("list")}
            className={`py-4 px-1 border-b-2 font-medium ${
              tab === "list"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Listado
          </button>
          <button
            onClick={() => setTab("new")}
            className={`py-4 px-1 border-b-2 font-medium ${
              tab === "new"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Nuevo Territorio
          </button>
          <button
            onClick={() => setTab("extend")}
            className={`py-4 px-1 border-b-2 font-medium ${
              tab === "extend"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Extender Territorio
          </button>
        </nav>
      </div>

      <div>
        {tab === "list" && <TerritoriesList />}
        {tab === "new" && <NewTerritory onSuccess={() => setTab("list")} />}
        {tab === "extend" && <ExtendTerritory onSuccess={() => setTab("list")} />}
      </div>
    </div>
  );
}
