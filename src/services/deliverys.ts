// src/services/entregas.ts
import { supabase } from "./supabase";
import type { Delivery } from "../types/delivery";

export async function getEntregas(filter?: { territorio_id?: string }) {
  let query = supabase
    .from<Delivery, any>("entregas")
    .select(`
      id,
      territorio_id,
      usuario_id ( id, nombre ),
      fecha_entrega,
      fecha_devolucion,
      estado_territorio,
      comentarios,
      creado_en
    `)
    .order("creado_en", { ascending: false });

  if (filter?.territorio_id) {
    query = query.eq("territorio_id", filter.territorio_id);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}
