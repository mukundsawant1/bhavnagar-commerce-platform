"use client";

import { useState } from "react";

type ProductUploadProps = {
  onUploadSuccess?: (url: string) => void;
};

export default function ProductUpload({ onUploadSuccess }: ProductUploadProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file || !name.trim()) {
      setStatus("Name and image are required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name.trim());
    formData.append("description", description.trim());

    setStatus("Uploading...");

    try {
      const res = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data?.error ?? "Upload failed.");
        return;
      }

      setStatus("Product uploaded successfully.");
      setName("");
      setDescription("");
      setFile(null);

      if (onUploadSuccess) {
        onUploadSuccess(data.image_url);
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Upload failed.");
    }
  };

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Upload Product Image</h2>
      <p className="mt-1 text-sm text-muted">Upload images through Supabase Storage and store URL in DB.</p>

      <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Product name"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          required
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows={3}
        />
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
          }}
          className="w-full text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-400"
        >
          Upload
        </button>
      </form>

      {status ? <p className="mt-2 text-sm text-slate-600">{status}</p> : null}
    </section>
  );
}
