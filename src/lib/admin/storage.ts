import "server-only";
import { del } from "@vercel/blob";

export const MAX_UPLOAD_BYTES = 200 * 1024 * 1024; // videos included
export const UPLOAD_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "video/mp4", "video/webm"] as const;

/**
 * The Vercel Blob read-write token. The integration names it BLOB_READ_WRITE_TOKEN,
 * or <PREFIX>_READ_WRITE_TOKEN when a custom prefix was chosen while connecting
 * the store, so any variable holding a Blob read-write token is accepted.
 */
export function blobToken(): string | null {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  for (const value of Object.values(process.env)) {
    if (value?.startsWith("vercel_blob_rw_")) return value;
  }
  return null;
}

export const blobEnabled = () => Boolean(blobToken());

/** Why uploads cannot work in production, for the admin (variable names only, never values). */
export function storageProblem(): string | null {
  if (blobEnabled() || process.env.NODE_ENV !== "production") return null;
  const names = Object.keys(process.env).filter((k) => /BLOB/i.test(k));
  return (
    "Photo and video uploads are not connected yet. In Vercel, open Storage → your Blob store → Projects, " +
    "connect it to this project (keep the prefix BLOB), then redeploy. " +
    `Blob variables the server can see: ${names.length ? names.join(", ") : "none"}.`
  );
}

/** Best-effort removal of a file we no longer reference. */
export async function removeStoredFile(url: string | null | undefined) {
  const token = blobToken();
  if (!url || !token || !url.includes(".blob.vercel-storage.com")) return;
  try {
    await del(url, { token });
  } catch (err) {
    console.error("[storage] could not delete", url, err);
  }
}
