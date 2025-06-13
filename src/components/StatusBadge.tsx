import clsx from "clsx";

type Props = {
  estado: string;
};

const colorMap: Record<string, string> = {
  disponible: "bg-green-100 text-green-800",
  en_uso: "bg-yellow-100 text-yellow-800",
  inhabilitado: "bg-gray-200 text-gray-800",
  caducado: "bg-red-100 text-red-800",
  especial: "bg-purple-100 text-purple-800",
};

export default function StatusBadge({ estado }: Props) {
  const classes = colorMap[estado] || "bg-gray-100 text-gray-800";
  return (
    <span
      className={clsx(
        "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
        classes
      )}
    >
      {estado.replace("_", " ")}
    </span>
  );
}
