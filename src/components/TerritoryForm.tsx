// src/components/TerritoryForm.tsx
import { useState, useEffect } from "react";
import { createTerritorio, updateTerritorio } from "../services/territories";
import type { Territory } from "../types/territory";
import { supabase } from "../services/supabase";

type Props = {
  initialData?: Partial<Territory>;
  onSuccess: () => void;
};

export default function TerritoryForm({ initialData = {}, onSuccess }: Props) {
  const [numero, setNumero] = useState<number>(initialData.numero || 0);
  const [estado, setEstado] = useState<string>(initialData.estado ?? "disponible");
  const [imagen, setImagen] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [archivoNombre, setArchivoNombre] = useState<string | null>(null);

  useEffect(() => {
    if (initialData.id) return;
    async function loadNextNumero() {
      const { data, error } = await supabase
        .from<Territory>("territorios")
        .select("numero")
        .order("numero", { ascending: false })
        .limit(1)
        .single();
      if (!error && data) setNumero(data.numero + 1);
      else if (!data) setNumero(1);
    }
    loadNextNumero();
  }, [initialData.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/", "application/pdf"];
    if (!allowed.some(t => file.type.startsWith(t))) {
      return alert("Solo imágenes o PDF (max 5 MB)");
    }
    if (file.size > 5 * 1024 * 1024) {
      return alert("El archivo no debe superar 5 MB");
    }
    setImagen(file);
    setArchivoNombre(file.name);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let imagen_url: string | undefined;

    if (imagen) {
      const filePath = `territorios/${Date.now()}_${imagen.name}`;
      const { error: upErr } = await supabase.storage
        .from("territorios")
        .upload(filePath, imagen);
      if (upErr) return alert("Error subiendo archivo");
      imagen_url = supabase.storage
        .from("territorios")
        .getPublicUrl(filePath)
        .data.publicUrl;
    }

    const payload = { numero, estado, imagen_url };
    try {
      if (initialData.id) {
        await updateTerritorio(initialData.id, payload);
      } else {
        await createTerritorio(payload);
      }
      onSuccess();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg space-y-6">
      {/* Número */}
      <div className="mb-6">
        <label htmlFor="numero" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Número de Territorio
        </label>
        <input
          id="numero"
          type="number"
          value={numero}
          onChange={e => setNumero(+e.target.value)}
          disabled={!initialData.id}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>

      {/* Estado */}
      <div className="mb-6">
        <label htmlFor="estado" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Estado
        </label>
        <input
          id="estado"
          type="text"
          value={estado}
          onChange={e => setEstado(e.target.value)}
          disabled={!initialData.id}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>

      {/* Subir archivo */}
      <div className="mb-6">
        <label htmlFor="file_input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Subir Imagen o PDF
        </label>
        <input
          id="file_input"
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none p-2.5"
        />
      </div>

      {/* Vista previa */}
      {previewUrl && (
        <div className="mb-6">
          <img src={previewUrl} alt="Preview" className="max-w-xs rounded shadow" />
        </div>
      )}
      {!previewUrl && archivoNombre && (
        <p className="mb-6 text-sm text-gray-500">Archivo seleccionado: {archivoNombre}</p>
      )}

      {/* Botón */}
      <button
        type="submit"
        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-3.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        {initialData.id ? "Actualizar Territorio" : "Crear Territorio"}
      </button>
    </form>
  );
}
