// src/pages/territories/ReturnTerritory.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { Combobox } from "@headlessui/react";
import type { User } from "../../types/user";
import type { Territory } from "../../types/territory";

export default function ReturnTerritory() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [territorios, setTerritorios] = useState<Territory[]>([]);
  const [searchUser, setSearchUser] = useState("");
  const [selectedUserObj, setSelectedUserObj] = useState<User | null>(null);
  const [userTerritorios, setUserTerritorios] = useState<Territory[]>([]);
  const [selectedTerritorio, setSelectedTerritorio] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [comentarios, setComentarios] = useState("");

  useEffect(() => {
    async function fetchData() {
      // 1) Carga de territorios con usuario asignado
      const { data: terrs } = await supabase
        .from<Territory>("territorios")
        .select("id, numero, estado, usuario_asignado(id)");

      const asignados = terrs?.filter(t => t.usuario_asignado?.id) || [];

      // 2) Carga de usuarios que tengan asignados
      const { data: us } = await supabase
        .from<User>("usuarios")
        .select("id, nombre, telefono");

      const conTerritorio = us?.filter(u =>
        asignados.some(t => t.usuario_asignado?.id === u.id)
      ) || [];

      setUsuarios(conTerritorio);
      setTerritorios(asignados);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedUserObj) return;
    const relacionados = territorios.filter(
      t => t.usuario_asignado?.id === selectedUserObj.id
    );
    setUserTerritorios(relacionados);
    setSelectedTerritorio(relacionados.length === 1 ? relacionados[0].id : "");
  }, [selectedUserObj, territorios]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUserObj || !selectedTerritorio || !fechaSeleccionada) {
      return alert("Usuario, territorio y fecha son obligatorios");
    }

    // Validar fecha no futura
    const hoy = new Date().toISOString().slice(0, 10);
    if (fechaSeleccionada > hoy) {
      return alert("La fecha de devolución no puede ser futura.");
    }

    // Obtener la fecha de entrega original para calcular descanso
    const { data: territorioData, error: fetchError } = await supabase
      .from("territorios")
      .select("fecha_entrega")
      .eq("id", selectedTerritorio)
      .single();
    if (fetchError || !territorioData?.fecha_entrega) {
      return alert("Error al obtener fecha de entrega del territorio.");
    }

    // Calcula descansa_hasta = fechaSeleccionada + 6 meses
    const descansaHasta = new Date(
      new Date(fechaSeleccionada).setMonth(
        new Date(fechaSeleccionada).getMonth() + 6
      )
    )
      .toISOString()
      .slice(0, 10);

    // 1) Actualiza el territorio en la tabla principal
    const { error: updateTerrError } = await supabase
      .from("territorios")
      .update({
        estado: "inhabilitado",
        usuario_asignado: null,
        fecha_entrega: null,
        comentarios: null,
        es_campaña_especial: false,
        descansa_hasta: descansaHasta,
      })
      .eq("id", selectedTerritorio);
    if (updateTerrError) {
      return alert("Error al actualizar territorio: " + updateTerrError.message);
    }

    // 2) **Actualiza** la única fila de entregas donde estado_territorio = 'entregado'
    const { error: updateHistError } = await supabase
      .from("entregas")
      .update({
        fecha_devolucion: fechaSeleccionada,
        estado_territorio: "devuelto",
        comentarios,
      })
      .eq("territorio_id", selectedTerritorio)
      .eq("estado_territorio", "entregado");

    if (updateHistError) {
      return alert(
        "Territorio devuelto, pero error al actualizar historial: " +
          updateHistError.message
      );
    }

    alert("¡Territorio devuelto correctamente!");
    // refresca la página (o mejor: navegar, recargar lista, etc.)
    window.location.reload();
  }

  const filteredUsers =
    searchUser === ""
      ? usuarios
      : usuarios.filter(u =>
          u.nombre.toLowerCase().includes(searchUser.toLowerCase())
        );

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-600">
        Devolución de Territorio
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Usuario */}
        <div>
          <label className="block mb-1 font-medium">Usuario</label>
          <Combobox value={selectedUserObj} onChange={setSelectedUserObj}>
            <div className="relative">
              <Combobox.Input
                className="input w-full"
                placeholder="Buscar usuario..."
                onChange={e => setSearchUser(e.target.value)}
                displayValue={(u: User) => u?.nombre || ""}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                ▼
              </Combobox.Button>
              {filteredUsers.length > 0 && (
                <Combobox.Options className="absolute mt-1 w-full bg-white shadow max-h-60 overflow-auto z-10">
                  {filteredUsers.map(u => (
                    <Combobox.Option
                      key={u.id}
                      value={u}
                      className={({ active }) =>
                        `cursor-pointer select-none p-2 ${
                          active ? "bg-blue-100" : ""
                        }`
                      }
                    >
                      {u.nombre} – {u.telefono}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              )}
            </div>
          </Combobox>
        </div>

        {/* Territorio */}
        <div>
          <label className="block mb-1 font-medium">Territorio</label>
          {userTerritorios.length === 0 ? (
            <p className="text-sm text-gray-500">
              Este usuario no tiene territorios asignados.
            </p>
          ) : (
            <select
              required
              className="input w-full"
              value={selectedTerritorio}
              onChange={e => setSelectedTerritorio(e.target.value)}
            >
              <option value="">Seleccionar territorio</option>
              {userTerritorios.map(t => (
                <option key={t.id} value={t.id}>
                  Territorio #{t.numero}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Fecha */}
        <div>
          <label className="block mb-1 font-medium">Fecha</label>
          <input
            type="date"
            required
            className="input w-full"
            value={fechaSeleccionada}
            onChange={e => setFechaSeleccionada(e.target.value)}
          />
        </div>

        {/* Comentarios */}
        <div>
          <label className="block mb-1 font-medium">Comentarios</label>
          <textarea
            className="input w-full"
            rows={3}
            value={comentarios}
            onChange={e => setComentarios(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-3.5 w-full"
        >
          Registrar Devolución
        </button>
      </form>
    </div>
  );
}