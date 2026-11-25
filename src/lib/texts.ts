import "server-only";
import { cache } from "react";
import { about } from "@/content/about";
import { bookMe } from "@/content/book-me";
import { gallery } from "@/content/gallery";
import { home } from "@/content/home";
import { lifestyle } from "@/content/lifestyle";
import { site } from "@/content/site";
import { travelsPage } from "@/content/travels-page";
import { sql } from "@/lib/db";

/**
 * Editable texts. The copy in src/content is the default; anything saved in the
 * backoffice (Texts) replaces it, keyed by its path, e.g. "home.hero.title".
 * A list of paragraphs is edited as one text with blank lines between them.
 */
const pages = {
  home: { seo: site.seo, ...home },
  about,
  gallery,
  travels: travelsPage,
  lifestyle,
  bookMe,
  site: { signature: site.signature },
};

export type TextPageId = keyof typeof pages;

export const textPageLabels: Record<TextPageId, string> = {
  home: "Home",
  about: "About",
  gallery: "Gallery",
  travels: "Travels",
  lifestyle: "Lifestyle",
  bookMe: "Book Me",
  site: "All pages",
};

/** Links, photos and form values are not texts (photos have their own page). */
const SKIP_KEYS = new Set(["href", "src", "alt", "slot", "video", "media", "image", "images", "fallbackCityImage", "times", "durations"]);
/** Lifestyle cards are managed in the backoffice Lifestyle page. */
const SKIP_PATHS = new Set(["lifestyle.fragrances.items", "lifestyle.places.items", "lifestyle.wishlist.items"]);

const isStringList = (v: unknown): v is string[] => Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === "string");
export const splitParagraphs = (s: string) =>
  s
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

function apply(value: unknown, path: string, overrides: Map<string, string>): unknown {
  if (SKIP_PATHS.has(path)) return value;
  if (typeof value === "string") return overrides.get(path) ?? value;
  if (isStringList(value)) {
    const saved = overrides.get(path);
    return saved ? splitParagraphs(saved) : value;
  }
  if (Array.isArray(value)) return value.map((v, i) => apply(v, `${path}.${i}`, overrides));
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, SKIP_KEYS.has(k) ? v : apply(v, `${path}.${k}`, overrides)]),
    );
  }
  return value;
}

export const getTextOverrides = cache(async (): Promise<Map<string, string>> => {
  if (!sql) return new Map();
  try {
    const rows = await sql<{ key: string; value: string }[]>`SELECT key, value FROM content_texts`;
    return new Map(rows.map((r) => [r.key, r.value]));
  } catch (err) {
    console.error("[texts] using defaults", err);
    return new Map();
  }
});

/** A page's copy with the backoffice edits applied. */
export async function getTexts<K extends TextPageId>(id: K): Promise<(typeof pages)[K]> {
  return apply(pages[id], id, await getTextOverrides()) as (typeof pages)[K];
}

/* ───────────── Backoffice field list ───────────── */

export type TextField = {
  key: string;
  section: string;
  label: string;
  defaultValue: string;
  kind: "line" | "text" | "paragraphs";
  /** Placeholders like {city} that must stay in the text */
  placeholders: string[];
};

const WORDS: Record<string, string> = { q: "Question", a: "Answer", cta: "Button", seo: "Search engines (SEO)", primaryCta: "Main button", secondaryCta: "Second button" };
const humanize = (key: string) =>
  /^\d+$/.test(key)
    ? `Item ${Number(key) + 1}`
    : (WORDS[key] ?? key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase()));

export function listTextFields(id: TextPageId): TextField[] {
  const fields: TextField[] = [];
  const walk = (value: unknown, parts: string[]) => {
    const key = [id, ...parts].join(".");
    if (SKIP_PATHS.has(key)) return;
    const section = parts[0] ?? "general";
    const label = parts.length > 1 ? parts.slice(1).map(humanize).join(" · ") : humanize(parts[0] ?? id);
    if (typeof value === "string") {
      fields.push({ key, section, label, defaultValue: value, kind: value.length > 90 ? "text" : "line", placeholders: value.match(/\{\w+\}/g) ?? [] });
    } else if (isStringList(value)) {
      fields.push({ key, section, label, defaultValue: value.join("\n\n"), kind: "paragraphs", placeholders: [] });
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => walk(v, [...parts, String(i)]));
    } else if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) if (!SKIP_KEYS.has(k)) walk(v, [...parts, k]);
    }
  };
  walk(pages[id], []);
  return fields;
}

/** Sections of a page for the backoffice, titled by their heading where there is one. */
export function listTextSections(id: TextPageId) {
  const fields = listTextFields(id);
  const order = [...new Set(fields.map((f) => f.section))];
  return order.map((section) => {
    const sectionFields = fields.filter((f) => f.section === section);
    const heading = sectionFields.find((f) => f.key.endsWith(`.${section}.title`))?.defaultValue;
    return { section, title: humanize(section), heading, fields: sectionFields };
  });
}
