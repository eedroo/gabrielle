import "server-only";
import { sql } from "@/lib/db";
import { resolveImage, resolveVideo } from "@/lib/images";
import { allSlots, slotGroups, type Slot } from "@/content/slots";
import type { MediaOverride } from "@/lib/media-slots";

/** Backoffice reads go straight to the database (no static fallback). */
function db() {
  if (!sql) throw new Error("Database not connected");
  return sql;
}

export type AdminTravel = {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  startDate: string;
  endDate: string;
  published: boolean;
  image: string | null;
};

export async function listTravels(): Promise<AdminTravel[]> {
  return [
    ...(await db()<AdminTravel[]>`
      SELECT id, city, country, country_code AS "countryCode",
             to_char(start_date, 'YYYY-MM-DD') AS "startDate", to_char(end_date, 'YYYY-MM-DD') AS "endDate",
             published, image_url AS image
      FROM travels ORDER BY start_date DESC`),
  ];
}

export type SlotState = Slot & {
  official: { image: string | null; video: string | null; videoMobile: string | null; alt: string | null };
  temporary: { image: string | null; video: string | null };
  status: "official" | "temporary" | "missing";
};

export async function listSlotStates(): Promise<{ page: string; href: string; slots: SlotState[] }[]> {
  const rows = await db()<MediaOverride[]>`SELECT slot, image_url, alt, video_url, video_mobile_url FROM media_slots`;
  const bySlot = new Map(rows.map((r) => [r.slot, r]));
  return slotGroups.map((g) => ({
    ...g,
    slots: g.slots.map((s) => {
      const o = bySlot.get(s.slot);
      const tempImage = resolveImage(s.slot);
      const tempVideo = s.video ? (resolveVideo(s.slot)?.src ?? null) : null;
      const official = { image: o?.image_url ?? null, video: o?.video_url ?? null, videoMobile: o?.video_mobile_url ?? null, alt: o?.alt ?? null };
      const status = official.image ? "official" : tempImage ? "temporary" : "missing";
      return { ...s, official, temporary: { image: tempImage, video: tempVideo }, status };
    }),
  }));
}

export async function slotSummary() {
  const groups = await listSlotStates();
  const slots = groups.flatMap((g) => g.slots);
  return {
    total: allSlots.length,
    official: slots.filter((s) => s.status === "official").length,
    temporary: slots.filter((s) => s.status === "temporary").length,
    missing: slots.filter((s) => s.status === "missing").length,
  };
}

export type AdminGalleryPhoto = { id: number; collection: string; url: string; alt: string };

export async function listGallery(): Promise<AdminGalleryPhoto[]> {
  return [...(await db()<AdminGalleryPhoto[]>`SELECT id, collection, url, alt FROM gallery_photos ORDER BY collection, position, id`)];
}

export type AdminLifestyleItem = {
  id: number;
  section: "fragrance" | "place" | "wishlist";
  title: string;
  subtitle: string;
  note: string | null;
  image: string | null;
  published: boolean;
};

export async function listLifestyle(): Promise<AdminLifestyleItem[]> {
  return [
    ...(await db()<AdminLifestyleItem[]>`
      SELECT id, section, title, subtitle, note, image_url AS image, published FROM lifestyle_items ORDER BY section, position, id`),
  ];
}

export type AdminAccount = { id: number; name: string; email: string; lastLogin: string | null };

export async function listAccounts(): Promise<AdminAccount[]> {
  return [
    ...(await db()<AdminAccount[]>`
      SELECT id, name, email, to_char(last_login_at, 'DD Mon YYYY, HH24:MI') AS "lastLogin" FROM admin_users ORDER BY id`),
  ];
}
