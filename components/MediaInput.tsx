"use client";

import { useRef, useState } from "react";
import { Upload, Link2, X, Loader2, CheckCircle2 } from "lucide-react";

interface Props {
  type: "image" | "video";
  creator: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}

type Mode = "url" | "upload";

export function MediaInput({ type, creator, value, onChange, required }: Props) {
  const [mode, setMode] = useState<Mode>("upload");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    setProgress(10);
    setUploadedName(file.name);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("creator", creator);

    // Simulate progress (XHR would give real progress, fetch doesn't)
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 15, 85));
    }, 400);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      clearInterval(interval);

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erro no upload.");
        setUploading(false);
        setUploadedName(null);
        return;
      }

      const { url } = await res.json();
      setProgress(100);
      onChange(url);
    } catch {
      clearInterval(interval);
      setError("Erro de conexão durante o upload.");
      setUploadedName(null);
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  const accept = type === "image" ? "image/*" : "video/*";
  const label = type === "image" ? "imagem" : "vídeo";
  const maxSize = type === "image" ? "20 MB" : "200 MB";

  return (
    <div className="flex flex-col gap-2">
      {/* Mode toggle */}
      <div className="flex gap-1 p-0.5 bg-white/5 rounded-lg w-fit">
        {(["upload", "url"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); onChange(""); setUploadedName(null); setError(null); setProgress(0); }}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              mode === m ? "bg-white/15 text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            {m === "upload" ? <Upload className="h-3 w-3" /> : <Link2 className="h-3 w-3" />}
            {m === "upload" ? "Upload" : "URL"}
          </button>
        ))}
      </div>

      {mode === "url" ? (
        <input
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`https://... (URL da ${label})`}
          className="rounded-xl border border-white/8 bg-[#1a1a1a] px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/20"
        />
      ) : (
        <>
          {/* Drop zone */}
          <div
            onClick={() => !uploading && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition cursor-pointer ${
              dragging
                ? "border-[#e89c30] bg-[#e89c30]/5"
                : uploading
                ? "border-white/10 bg-white/3 cursor-not-allowed"
                : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={onFileChange}
              disabled={uploading}
            />

            {uploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-[#e89c30] mb-2" />
                <p className="text-sm text-white/60 truncate max-w-full px-2">{uploadedName}</p>
                <div className="mt-3 w-full max-w-[200px] h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#e89c30] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-white/30">{progress}%</p>
              </>
            ) : value && progress === 100 ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-400 mb-2" />
                <p className="text-sm text-white/70 truncate max-w-full px-2">{uploadedName}</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onChange(""); setUploadedName(null); setProgress(0); if (inputRef.current) inputRef.current.value = ""; }}
                  className="mt-2 flex items-center gap-1 text-xs text-white/40 hover:text-white/70"
                >
                  <X className="h-3 w-3" /> Trocar arquivo
                </button>
              </>
            ) : (
              <>
                <Upload className="h-6 w-6 text-white/30 mb-2" />
                <p className="text-sm text-white/50">
                  Clique ou arraste a {label} aqui
                </p>
                <p className="mt-1 text-xs text-white/25">Máx. {maxSize}</p>
              </>
            )}
          </div>

          {/* Hidden input for form validation */}
          {required && (
            <input
              type="text"
              value={value}
              readOnly
              required
              className="sr-only"
              tabIndex={-1}
            />
          )}

          {error && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <X className="h-3 w-3" /> {error}
            </p>
          )}
        </>
      )}
    </div>
  );
}
