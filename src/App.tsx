// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NewUser from "./pages/users/NewUser";
import NewTerritory from "./pages/territories/NewTerritory";
import AssignTerritory from "./pages/territories/AssignTerritory";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <nav className="bg-white shadow mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center text-blue-600 text-2xl font-bold">
                  <svg
                    className="w-8 h-8 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7l9-4 9 4v13a2 2 0 0 1-2 2h-5m-4 0H5a2 2 0 0 1-2-2z"
                    />
                  </svg>
                  Gestión de Territorios
                </div>
              </div>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="asignacion" element={<AssignTerritory />} />
            <Route path="territorio/nuevo" element={<NewTerritory />} />
            <Route path="usuario/nuevo" element={<NewUser />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
