// types/entrega.ts
export interface Delivery {
  id: string;
  territorio_id: string;
  usuario_id: string;
  fecha_entrega: string;
  fecha_devolucion?: string;
  comentarios?: string;
  estado_territorio: "entregado" | "devuelto" | "extendido" | "especial";
}
