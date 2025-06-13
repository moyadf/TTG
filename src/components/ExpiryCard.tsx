import type { Territory } from "../types";

interface Props {
  territorio: Pick<Territory, "numero" | "fecha_devolucion" | "usuario_asignado">;
}

export default function ExpiryCard({ territorio }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-1">Territorio #{territorio.numero}</h3>
      <p className="text-sm text-gray-500">Vence: {territorio.fecha_devolucion?.slice(0, 10) || "-"}</p>
      <p className="text-sm">Responsable: {territorio.usuario_asignado?.nombre || "Ninguno"}</p>
    </div>
  );
}
