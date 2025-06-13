// src/pages/users/NewUser.tsx

import { useState } from "react";
import { createUser } from "../../services/users";
import { useNavigate } from "react-router-dom";

export default function NewUser() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createUser({ nombre, telefono });

    if (success) {
      navigate("/usuarios");
    } else {
      alert("Error al crear usuario");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Registrar Nuevo Usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}
