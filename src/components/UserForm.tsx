// src/components/UserForm.tsx
import { useState } from "react";
import { createUser } from "../services/users";

export default function UserForm() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({ nombre, telefono });
      alert("Usuario creado correctamente");
      setNombre("");
      setTelefono("");
    } catch (error) {
      console.error(error);
      alert("Error creando usuario");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg space-y-6"
    >

      {/* Nombre */}
      <div>
        <label
          htmlFor="nombre"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Nombre
        </label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Juan Pérez"
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>

      {/* Teléfono */}
      <div>
        <label
          htmlFor="telefono"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Teléfono
        </label>
        <input
          id="telefono"
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Ej. +34 600 123 456"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>

      {/* Botón */}
      <button
        type="submit"
        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-3.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Crear Usuario
      </button>
    </form>
  );
}
