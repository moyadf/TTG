// types/territorio.ts
import type { User } from "./user";

export interface Territory {
  id: string;
  numero: number;
  estado: string;
  usuario_asignado: User | null;
}
