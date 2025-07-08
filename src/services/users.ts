// src/services/users.ts
import { supabase } from "./supabase";
import type { User } from "../types/user";

// 1. Traer todos los usuarios con activo y creado_en
export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from<User>("usuarios")
    .select("id, nombre, telefono, activo, creado_en")
    .order("nombre", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

// 2. Crear usuario (igual que antes)
export async function createUser(user: Pick<User, "nombre" | "telefono">) {
  const { data, error } = await supabase
    .from("usuarios")
    .insert([user])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// 3. Actualizar usuario
export async function updateUser(id: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from("usuarios")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// 4. Borrar un usuario
export async function deleteUser(id: string) {
  const { error } = await supabase.from("usuarios").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// 5. Borrar varios usuarios
export async function deleteUsers(ids: string[]) {
  const { error } = await supabase.from("usuarios").delete().in("id", ids);
  if (error) throw new Error(error.message);
}
