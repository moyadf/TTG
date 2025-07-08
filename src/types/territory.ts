// src/types/territorio.ts
import type { User } from "./user";
// src/types/territory.ts
export interface Territory {
  id: string;
  numero: number;
  estado: string;
  fecha_entrega?: string;
  fecha_caducidad?: string;
  fecha_devolucion?: string;
  descansa_hasta?: string;
  comentarios?: string;
  usuario_asignado: User | null;
  imagen_url?: string;
  es_campaña_especial?: boolean;
  creado_en: string;
}
