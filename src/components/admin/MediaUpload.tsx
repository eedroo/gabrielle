"use client";

import { useRef, useState } from "react";
import { uploadFile } from "./upload";
import { buttonClass } from "./ui";

type Props = {
  /** SEO base name for the stored file */
  name: string;
  folder: "photos" | "videos" | "travels" | "gallery" | "lifestyle";
  kind?: "image" | "video";
  storage: "blob" | "local";
  label?: string;
  multiple?: boolean;
  /** Called once per uploaded file */
  onUploaded: (url: string, file: File) => Promise<void> | void;
};

/** File picker that uploads straight away and reports progress. */
export function MediaUpload({ name, folder, kind = "image", storage, label, multiple, onUploaded }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handle(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    try {
      for (const [i, file] of [...files].entries()) {
        if (kind === "image" && !file.type.startsWith("image/")) throw new Error("Please choose a photo (JPG, PNG or WebP).");
        if (kind === "video" && !file.type.startsWith("video/")) throw new Error("Please choose a video (MP4).");
        setProgress(0);
        const url = await uploadFile(file, {
          folder,
          name: multiple && files.length > 1 ? `${name}-${i + 1}` : name,
          storage,
          onProgress: setProgress,
        });
        await onUploaded(url, file);
      }
    } catch (err) {
      setError((err as Error).message || "Upload failed.");
    } finally {
      setProgress(null);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <input
        ref={input}
        type="file"
        hidden
        multiple={multiple}
        accept={kind === "image" ? "image/jpeg,image/png,image/webp,image/avif" : "video/mp4,video/webm"}
        onChange={(e) => handle(e.target.files)}
      />
      <button type="button" disabled={progress !== null} onClick={() => input.current?.click()} className={buttonClass.secondary}>
        {progress !== null ? (progress > 0 && progress < 100 ? `Uploading… ${Math.round(progress)}%` : "Uploading…") : (label ?? (kind === "image" ? "Upload photo" : "Upload video"))}
      </button>
      {error && <p className="mt-2 text-xs text-red-800">{error}</p>}
    </div>
  );
}
