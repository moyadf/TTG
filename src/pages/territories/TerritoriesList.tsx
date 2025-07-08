// src/pages/territories/TerritoriesList.tsx
import { useEffect, useState } from "react";
import {
  getTerritoriosList,
  updateTerritorio,
  deleteTerritorio,
  deleteTerritorios,
} from "../../services/territories";
import type { Territory } from "../../types/territory";
import { format } from "date-fns";

export default function TerritoriesList() {
  const [territorios, setTerritorios] = useState<Territory[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNumero, setEditNumero] = useState<number>(0);
  const [editEstado, setEditEstado] = useState<string>("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getTerritoriosList();
    setTerritorios(data);
    setSelectedIds(new Set());
    setEditingId(null);
  }

  function toggleSelect(id: string) {
    const s = new Set(selectedIds);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelectedIds(s);
  }

  async function handleBulkDelete() {
    if (!confirm(`¿Borrar ${selectedIds.size} territorios?`)) return;
    await deleteTerritorios(Array.from(selectedIds));
    load();
  }

  function startEdit(t: Territory) {
    setEditingId(t.id);
    setEditNumero(t.numero);
    setEditEstado(t.estado);
  }

  async function saveEdit(id: string) {
    await updateTerritorio(id, { numero: editNumero, estado: editEstado });
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
            <th scope="col" className="p-4"><div className="flex items-center"><input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2" onChange={e => {
                if (e.target.checked) setSelectedIds(new Set(territorios.map(t => t.id)));
                else setSelectedIds(new Set());
              }} /></div></th><th scope="col" className="px-6 py-3">Número</th><th scope="col" className="px-6 py-3">Estado</th><th scope="col" className="px-6 py-3">Asignado a</th><th scope="col" className="px-6 py-3">Entregado</th><th scope="col" className="px-6 py-3">Caduca</th><th scope="col" className="px-6 py-3">Descansa hasta</th><th scope="col" className="px-6 py-3">Comentarios</th><th scope="col" className="px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {territorios.map((t, idx) => {
            const isEditing = editingId === t.id;
            return (
              <tr
                key={t.id}
                className="bg-white border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="w-4 p-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                    checked={selectedIds.has(t.id)}
                    onChange={() => toggleSelect(t.id)}
                  />
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {isEditing ? (
                    <input
                      type="number"
                      className="input-sm"
                      value={editNumero}
                      onChange={(e) => setEditNumero(+e.target.value)}
                    />
                  ) : (
                    t.numero
                  )}
                </td>
                <td className="px-6 py-4">
                  {isEditing ? (
                    <select
                      className="input-sm"
                      value={editEstado}
                      onChange={(e) => setEditEstado(e.target.value)}
                    >
                      <option value="disponible">disponible</option>
                      <option value="en_uso">en_uso</option>
                      <option value="caducado">caducado</option>
                      <option value="inhabilitado">inhabilitado</option>
                      <option value="especial">especial</option>
                    </select>
                  ) : (
                    t.estado
                  )}
                </td>
                <td className="px-6 py-4">{t.usuario_asignado?.nombre ?? "-"}</td>
                <td className="px-6 py-4">
                  {t.fecha_entrega
                    ? format(new Date(t.fecha_entrega), "dd/MM/yyyy")
                    : "-"}
                </td>
                <td className="px-6 py-4">
                  {t.fecha_caducidad
                    ? format(new Date(t.fecha_caducidad), "dd/MM/yyyy")
                    : "-"}
                </td>
                <td className="px-6 py-4">
                  {t.descansa_hasta
                    ? format(new Date(t.descansa_hasta), "dd/MM/yyyy")
                    : "-"}
                </td>
                <td className="px-6 py-4">
                  {t.comentarios ?? "-"}
                </td>
                <td className="flex items-center px-6 py-4 space-x-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(t.id)}
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
                        onClick={() => startEdit(t)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("¿Borrar este territorio?")) {
                            deleteTerritorio(t.id).then(load);
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
