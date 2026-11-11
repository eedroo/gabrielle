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

/** Photo by SEO file name (see docs/IMAGES.md) + descriptive alt text. */
export const photo = (name: string, alt: string) => ({ src: resolveImage(name), alt });

/**
 * Every photo named "<prefix>-NN.<ext>" (e.g. gabrielle-gallery-editorial-01.jpg),
 * in number order. Lets a collection grow just by uploading files.
 */
export function listImages(prefix: string): string[] {
  if (!fs.existsSync(DIR)) return [];
  const pattern = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-(\\d+)(\\.[a-z]+)$`);
  return fs
    .readdirSync(DIR)
    .map((file) => ({ file, match: file.match(pattern) }))
    .filter(({ match }) => match && EXTENSIONS.includes(match[2]))
    .sort((a, b) => Number(a.match![1]) - Number(b.match![1]))
    .map(({ file }) => `/images/${file}`);
}

const VIDEO_DIR = path.join(process.cwd(), "public", "videos");
const VIDEO_EXTENSIONS = [".mp4", ".webm"];

export type VideoSource = { src: string; mobileSrc: string | null };

function findVideo(name: string): string | null {
  for (const ext of VIDEO_EXTENSIONS) {
    if (fs.existsSync(path.join(VIDEO_DIR, name + ext))) return `/videos/${name}${ext}`;
  }
  return null;
}

/**
 * Background video "<name>.mp4" in /public/videos, sharing its base name with
 * the photo used as cover/fallback. An optional "<name>-mobile.mp4" (vertical)
 * is served on phones.
 */
export function resolveVideo(name: string): VideoSource | null {
  const src = findVideo(name);
  return src ? { src, mobileSrc: findVideo(`${name}-mobile`) } : null;
}

/** Photo + optional background video sharing one SEO base name. */
export const media = (name: string, alt: string) => ({ ...photo(name, alt), video: resolveVideo(name) });
