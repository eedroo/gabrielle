import fs from "node:fs";
import path from "node:path";

/**
 * Photos live in /public/images with SEO-friendly names, e.g.
 * "gabrielle-editorial-portrait-01.webp". Content refers to the base name only;
 * the extension is resolved at build time so .webp, .avif, .jpg or .png all work.
 * Missing files fall back to the on-brand placeholder.
 */
const DIR = path.join(process.cwd(), "public", "images");
const EXTENSIONS = [".webp", ".avif", ".jpg", ".jpeg", ".png"];

export function resolveImage(name: string): string | null {
  for (const ext of EXTENSIONS) {
    if (fs.existsSync(path.join(DIR, name + ext))) return `/images/${name}${ext}`;
  }
  return null;
}
