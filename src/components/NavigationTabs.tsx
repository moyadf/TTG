// src/components/NavigationTabs.tsx
import { NavLink } from "react-router-dom";

const tabs = [
  { name: "Inicio", path: "/" },
  { name: "Territorios", path: "/asignacion" },
  { name: "Crear Territorio", path: "/territorio/nuevo" },
  { name: "Crear Usuario", path: "/usuario/nuevo" },
  { name: "Devolución", path: "/territorio/devolucion" },
  { name: "Historial", path: "/historial" },
  { name: "Campañas", path: "/campanas" },
  { name: "Reportes", path: "/reportes" },
];

export default function NavigationTabs() {

  return (
    <nav className="border-b border-gray-200 mb-6" aria-label="Tabs">
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={({ isActive }) =>
              `py-4 px-1 border-b-2 font-medium text-sm ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`
            }
          >
            {tab.name}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
