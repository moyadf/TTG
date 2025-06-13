// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NewUser from "./pages/users/NewUser";
import NewTerritory from "./pages/territories/newTerritory";


function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <header className="bg-white shadow p-4">
          <h1 className="text-2xl font-bold text-blue-600">Gestión de Territorios</h1>
        </header>
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/usuarios/nuevo" element={<NewUser />} />
            <Route path="/territorios/nuevo" element={<NewTerritory />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
