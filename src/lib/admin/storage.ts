import "server-only";
import { del } from "@vercel/blob";

export const MAX_UPLOAD_BYTES = 200 * 1024 * 1024; // videos included
export const UPLOAD_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "video/mp4", "video/webm"] as const;

/** Vercel Blob is connected (BLOB_READ_WRITE_TOKEN is set by the Vercel integration). */
export const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/** Best-effort removal of a file we no longer reference. */
export async function removeStoredFile(url: string | null | undefined) {
  if (!url || !blobEnabled() || !url.includes(".blob.vercel-storage.com")) return;
  try {
    await del(url);
  } catch (err) {
    console.error("[storage] could not delete", url, err);
  }
}
