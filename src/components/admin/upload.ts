import { upload } from "@vercel/blob/client";

const slug = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * Uploads a file from the browser and returns its public URL.
 * `name` becomes the SEO file name, e.g. "gabrielle-about-hero" → photos/gabrielle-about-hero-x7k2.jpg
 */
export async function uploadFile(
  file: File,
  { folder, name, storage, onProgress }: { folder: string; name: string; storage: "blob" | "local"; onProgress?: (pct: number) => void },
): Promise<string> {
  const ext = (file.name.match(/\.[a-z0-9]+$/i)?.[0] ?? "").toLowerCase();
  const pathname = `${folder}/${slug(name) || "file"}${ext}`;

  if (storage === "blob") {
    const blob = await upload(pathname, file, {
      access: "public",
      handleUploadUrl: "/api/admin/upload",
      multipart: file.size > 20 * 1024 * 1024,
      onUploadProgress: ({ percentage }) => onProgress?.(percentage),
    });
    return blob.url;
  }

  const form = new FormData();
  form.set("file", file);
  form.set("pathname", pathname);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
  onProgress?.(100);
  return data.url;
}
