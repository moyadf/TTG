import { useState } from "react"
import { createUser } from "../services/users"
import type { User } from "../types"

export default function UserForm() {
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nuevoUsuario: User = { nombre, telefono }

    try {
      const user = await createUser(nuevoUsuario)
      alert("Usuario creado correctamente")
    } catch (error) {
      console.error(error)
      alert("Error creando usuario")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-center text-blue-600">
        Registrar Usuario
      </h2>

      <input
        className="w-full border border-gray-300 rounded p-2"
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        className="w-full border border-gray-300 rounded p-2"
        type="text"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
      >
        Crear Usuario
      </button>
    </form>
  )
}
