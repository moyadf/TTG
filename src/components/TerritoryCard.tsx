interface Props {
  territorio: {
    numero: number;
    estado: string;
    usuario_asignado: { nombre: string } | null;
  };
}

export default function TerritoryCard({ territorio }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 border border-gray-200">
      <h2 className="text-lg font-semibold">Territorio #{territorio.numero}</h2>
      <p className="text-sm text-gray-500 capitalize">
        Estado: {territorio.estado.replace("_", " ")}
      </p>
      <p className="text-sm">
        Responsable: {territorio.usuario_asignado?.nombre || "Ninguno"}
      </p>
      <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-xl text-sm">
        Entregar
      </button>
    </div>
  );
}
