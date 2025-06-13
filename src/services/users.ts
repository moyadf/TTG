// src/services/users.ts
import type { User } from "../types"

export async function createUser(data: Pick<User, "nombre" | "telefono">) {
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY!}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify(data),
  });

  return res.ok;
}
