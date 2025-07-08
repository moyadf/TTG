// src/services/territorios.ts
import { supabase } from "./supabase";
import type { Territory } from "../types/territory";

// ① Listado completo (para la tabla)
export async function getTerritoriosList() {
  const { data, error } = await supabase
    .from<Territory, any>("territorios")
    .select(
      "id, numero, estado, imagen_url, fecha_entrega, fecha_caducidad, descansa_hasta, comentarios, usuario_asignado(id, nombre)"
    )
    .order("numero", { ascending: true });
  if (error) throw new Error(error.message);
  return data as Territory[];
}

// ② Crear (sin cambios)
export async function createTerritorio(territorio: Partial<Territory>) {
  const { data, error } = await supabase
    .from("territorios")
    .insert([territorio])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// ③ Actualizar (sin cambios)
export async function updateTerritorio(
  id: string,
  updates: Partial<Territory>
) {
  const { data, error } = await supabase
    .from("territorios")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// ④ Borrado único (sin cambios)
export async function deleteTerritorio(id: string) {
  const { error } = await supabase.from("territorios").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ⑤ Borrado múltiple (bulk delete)
export async function deleteTerritorios(ids: string[]) {
  const { error } = await supabase
    .from("territorios")
    .delete()
    .in("id", ids);
  if (error) throw new Error(error.message);
}