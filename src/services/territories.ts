// src/services/territorios.ts
import { supabase } from "./supabase";
import type { Territory } from "../types";

export async function getTerritorios() {
  const { data, error } = await supabase
    .from("territorios")
    .select("id, numero, estado, imagen_url, usuario_asignado(id, nombre)")
    .order("numero", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Territory[];
}

export async function createTerritorio(territorio: Partial<Territory>) {
  const { data, error } = await supabase
    .from("territorios")
    .insert([territorio])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateTerritorio(id: string, updates: Partial<Territory>) {
  const { data, error } = await supabase
    .from("territorios")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteTerritorio(id: string) {
  const { error } = await supabase.from("territorios").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getTerritoriosProximosVencer(limit = 5) {
  const { data, error } = await supabase
    .from("territorios")
    .select(
      "id, numero, estado, fecha_devolucion, usuario_asignado(id, nombre)"
    )
    .eq("estado", "en_uso")
    .gt("fecha_devolucion", new Date().toISOString())
    .order("fecha_devolucion", { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data as Territory[];
}
