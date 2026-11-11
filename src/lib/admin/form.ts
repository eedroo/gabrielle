import "server-only";
import { revalidatePath } from "next/cache";

/** Result shown by admin forms (useActionState). */
export type FormState = { ok?: string; error?: string } | undefined;

export function text(fd: FormData, key: string, { max = 500, required = false } = {}): string {
  const value = String(fd.get(key) ?? "").trim().slice(0, max);
  if (required && !value) throw new FormError(`Please fill in “${key.replace(/_/g, " ")}”.`);
  return value;
}

export class FormError extends Error {}

/** Runs a form action and turns validation errors into a message instead of a crash. */
export async function handle(fn: () => Promise<string | void>): Promise<FormState> {
  try {
    const ok = await fn();
    return { ok: ok || "Saved." };
  } catch (err) {
    if (err instanceof FormError) return { error: err.message };
    // Let Next.js redirects and notFound() pass through.
    if (err && typeof err === "object" && "digest" in err) throw err;
    console.error("[admin]", err);
    return { error: "Something went wrong. Please try again." };
  }
}

/** Refresh every public page after a change in the backoffice. */
export function revalidateSite() {
  revalidatePath("/", "layout");
}

export const isHttpUrl = (s: string) => /^https?:\/\/[^\s]+$/.test(s);
export const isUploadUrl = (s: string) => isHttpUrl(s) || /^\/uploads\/[a-z0-9./-]+$/.test(s);
