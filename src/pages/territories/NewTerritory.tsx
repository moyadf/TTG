// src/pages/NewTerritory.tsx
import TerritoryForm from "../../components/TerritoryForm";
import { useNavigate } from "react-router-dom";

export default function NewTerritory() {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Registrar Nuevo Territorio</h1>
      <TerritoryForm onSuccess={() => navigate("/")} />
    </div>
  );
}
