import { upload } from "@vercel/blob/client";

const slug = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Vercel functions accept request bodies up to 4.5 MB; bigger files go straight to Blob. */
const SERVER_UPLOAD_LIMIT = 4 * 1024 * 1024;
const DIRECT_UPLOAD_TIMEOUT_MS = 10 * 60 * 1000;

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

  if (storage === "blob" && file.size > SERVER_UPLOAD_LIMIT) {
    // The SDK retries silently on errors; stop waiting after a while and say so.
    const abortSignal = AbortSignal.timeout(DIRECT_UPLOAD_TIMEOUT_MS);
    try {
      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        multipart: file.size > 20 * 1024 * 1024,
        abortSignal,
        onUploadProgress: ({ percentage }) => onProgress?.(percentage),
      });
      return blob.url;
    } catch (err) {
      if (abortSignal.aborted) throw new Error("The upload took too long and was stopped. Please check your connection and try again.");
      throw err;
    }
  }

  // Small files go through our own server, which reports any error clearly.
  onProgress?.(0);
  const form = new FormData();
  form.set("file", file);
  form.set("pathname", pathname);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? `Upload failed (${res.status}).`);
  onProgress?.(100);
  return data.url;
}
