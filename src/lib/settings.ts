import "server-only";
import { cache } from "react";
import { site } from "@/content/site";
import { sql } from "@/lib/db";
import type { Channel } from "@/lib/channels";

/** Editable in the backoffice (Settings → Links); defaults come from src/content/site.ts. */
export type SiteSettings = {
  whatsapp_number: string;
  email: string;
  instagram_url: string;
  onlyfans_url: string;
  x_url: string;
  telegram_channel_url: string;
};

export const SETTING_KEYS = [
  "whatsapp_number",
  "email",
  "instagram_url",
  "onlyfans_url",
  "x_url",
  "telegram_channel_url",
] as const satisfies readonly (keyof SiteSettings)[];

const defaults: SiteSettings = {
  whatsapp_number: site.contact.whatsappNumber,
  email: site.contact.email,
  instagram_url: site.social.instagram,
  onlyfans_url: site.social.onlyfans,
  x_url: site.social.x,
  telegram_channel_url: site.social.telegram,
};

export const getSettings = cache(async (): Promise<SiteSettings> => {
  if (!sql) return defaults;
  try {
    const rows = await sql<{ key: string; value: string }[]>`SELECT key, value FROM settings`;
    const saved = Object.fromEntries(rows.filter((r) => r.value.trim()).map((r) => [r.key, r.value]));
    return { ...defaults, ...saved };
  } catch (err) {
    console.error("[settings] falling back to defaults", err);
    return defaults;
  }
});

export const getChannels = cache(async (): Promise<{ social: Channel[]; contact: Channel[] }> => {
  const s = await getSettings();
  return {
    social: [
      { key: "instagram", label: "Instagram", href: s.instagram_url },
      { key: "onlyfans", label: "OnlyFans", href: s.onlyfans_url },
      { key: "x", label: "X / Twitter", href: s.x_url },
      { key: "telegram", label: "Telegram Channel", href: s.telegram_channel_url },
    ].filter((c) => c.href) as Channel[],
    contact: [
      { key: "whatsapp", label: "WhatsApp", href: "/whatsapp" },
      { key: "email", label: "Email", href: `mailto:${s.email}` },
    ],
  };
});
