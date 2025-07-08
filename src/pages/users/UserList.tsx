// src/pages/users/UserList.tsx
import { useEffect, useState } from "react";
import { getUsers, updateUser, deleteUser, deleteUsers } from "../../services/users";
import type { User } from "../../types/user";

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editTelefono, setEditTelefono] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getUsers();
    setUsers(data);
    setSelectedIds(new Set());
    setEditingId(null);
  }

  function toggleSelect(id: string) {
    const s = new Set(selectedIds);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelectedIds(s);
  }

  async function handleBulkDelete() {
    if (!confirm(`¿Borrar ${selectedIds.size} usuarios?`)) return;
    await deleteUsers(Array.from(selectedIds));
    load();
  }

  function startEdit(u: User) {
    setEditingId(u.id);
    setEditNombre(u.nombre);
    setEditTelefono(u.telefono || "");
  }

  async function saveEdit(id: string) {
    await updateUser(id, { nombre: editNombre, telefono: editTelefono });
    load();
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <button
        onClick={handleBulkDelete}
        disabled={selectedIds.size === 0}
        className="mb-2 px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
      >
        Borrar seleccionados
      </button>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                  onChange={e => {
                    if (e.target.checked) setSelectedIds(new Set(users.map(u => u.id)));
                    else setSelectedIds(new Set());
                  }}
                />
              </div>
            </th>
            <th scope="col" className="px-6 py-3">Nombre</th>
            <th scope="col" className="px-6 py-3">Teléfono</th>
            <th scope="col" className="px-6 py-3">Activo</th>
            <th scope="col" className="px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => {
            const isEditing = editingId === u.id;
            return (
              <tr
                key={u.id}
                className={`bg-white border-b border-gray-200 hover:bg-gray-50 ${
                  idx % 2 === 0 ? "" : ""
                }`}
              >
                <td className="w-4 p-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                    checked={selectedIds.has(u.id)}
                    onChange={() => toggleSelect(u.id)}
                  />
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {isEditing ? (
                    <input
                      value={editNombre}
                      onChange={e => setEditNombre(e.target.value)}
                      className="
                        bg-gray-50 border border-gray-300 text-gray-900 text-sm
                        rounded-lg focus:ring-blue-500 focus:border-blue-500
                        block w-full p-2.5
                      "
                    />
                  ) : (
                    u.nombre
                  )}
                </td>
                <td className="px-6 py-4">
                  {isEditing ? (
                    <input
                      value={editTelefono}
                      onChange={e => setEditTelefono(e.target.value)}
                      className="
                        bg-gray-50 border border-gray-300 text-gray-900 text-sm
                        rounded-lg focus:ring-blue-500 focus:border-blue-500
                        block w-full p-2.5
                      "
                    />
                  ) : (
                    u.telefono || "-"
                  )}
                </td>
                <td className="px-6 py-4">{u.activo ? "Sí" : "No"}</td>
                <td className="flex items-center px-6 py-4 space-x-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(u.id)}
                        className="text-blue-600 hover:underline"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:underline"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(u)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("¿Borrar este usuario?")) {
                            deleteUser(u.id).then(load);
                          }
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Borrar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
