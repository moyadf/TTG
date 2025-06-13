// src/components/TerritoryForm.tsx
import { useState } from "react";
import { createTerritorio, updateTerritorio } from "../services/territories";
import type { Territory } from "../types";
import { supabase } from "../services/supabase";

type Props = {
  initialData?: Partial<Territory>;
  onSuccess: () => void;
};

export default function TerritorioForm({ initialData = {}, onSuccess }: Props) {
  const [numero, setNumero] = useState(initialData.numero || 0);
  const [estado, setEstado] = useState(initialData.estado || "");
  const [imagen, setImagen] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [archivoNombre, setArchivoNombre] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/", "application/pdf"];
    const maxSizeMB = 5;

    if (!allowedTypes.some(type => file.type.startsWith(type))) {
      alert("Solo se permiten imágenes o archivos PDF");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert("El archivo no debe superar los 5 MB");
      return;
    }

    setImagen(file);
    setArchivoNombre(file.name);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null); // PDF no tiene preview
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let imagen_url: string | undefined;

    if (imagen) {
      const filePath = `territorios/${Date.now()}_${imagen.name}`;
      const { data, error } = await supabase.storage
        .from("territorios")
        .upload(filePath, imagen);

      if (error) {
        alert("Error subiendo imagen");
        return;
      }

      imagen_url = supabase.storage.from("territorios").getPublicUrl(filePath).data.publicUrl;
    }

    const territorio = { numero, estado, imagen_url };

    try {
      if (initialData.id) {
        await updateTerritorio(initialData.id, territorio);
      } else {
        await createTerritorio(territorio);
      }
      onSuccess();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="number"
        value={numero}
        onChange={(e) => setNumero(Number(e.target.value))}
        placeholder="Número"
        required
        className="input"
      />
      <input
        type="text"
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        placeholder="Estado"
        required
        className="input"
      />

      <input
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileChange}
        className="input"
      />

      {previewUrl && (
        <img src={previewUrl} alt="Preview" className="max-w-xs rounded shadow" />
      )}
      {!previewUrl && archivoNombre && (
        <p className="text-sm text-gray-600">Archivo seleccionado: {archivoNombre}</p>
      )}

      <button type="submit" className="btn-primary">
        {initialData.id ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}