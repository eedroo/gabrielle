"use server";

import type { TransactionSql } from "postgres";
import { sql as maybeSql } from "@/lib/db";
import { FormError, handle, isHttpUrl, isUploadUrl, revalidateSite, text, type FormState } from "@/lib/admin/form";
import { requireAdmin } from "@/lib/admin/session";
import { removeStoredFile } from "@/lib/admin/storage";
import { collectionDefs } from "@/content/gallery";
import { isKnownSlot } from "@/content/slots";
import { SETTING_KEYS } from "@/lib/settings";

async function db() {
  await requireAdmin();
  if (!maybeSql) throw new FormError("The database is not connected.");
  return maybeSql;
}

const slug = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const isDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);

function uploadUrl(fd: FormData, key: string): string | null {
  const value = text(fd, key, { max: 1000 });
  if (!value) return null;
  if (!isUploadUrl(value)) throw new FormError("Invalid file address.");
  return value;
}

/* ───────────── Travels ───────────── */

export async function saveTravel(_: FormState, fd: FormData): Promise<FormState> {
  return handle(async () => {
    const q = await db();
    const id = text(fd, "id", { max: 120 });
    const city = text(fd, "city", { max: 80, required: true });
    const country = text(fd, "country", { max: 80, required: true });
    const countryCode = text(fd, "country_code", { max: 2, required: true }).toUpperCase();
    const start = text(fd, "start_date", { required: true });
    const end = text(fd, "end_date", { required: true });
    const published = fd.get("published") === "on";
    const image = uploadUrl(fd, "image_url");
    if (!/^[A-Z]{2}$/.test(countryCode)) throw new FormError("Country code must be 2 letters (e.g. DE, AT).");
    if (!isDate(start) || !isDate(end)) throw new FormError("Please choose both dates.");
    if (end < start) throw new FormError("The end date must be on or after the start date.");

    if (id) {
      const [old] = await q<{ image_url: string | null }[]>`SELECT image_url FROM travels WHERE id = ${id}`;
      if (!old) throw new FormError("This destination no longer exists.");
      await q`
        UPDATE travels SET city = ${city}, country = ${country}, country_code = ${countryCode},
          start_date = ${start}, end_date = ${end}, published = ${published}, image_url = ${image}, updated_at = now()
        WHERE id = ${id}`;
      if (old.image_url !== image) await removeStoredFile(old.image_url);
    } else {
      const base = `${slug(city)}-${start.slice(0, 7)}`;
      const [{ count }] = await q<{ count: number }[]>`SELECT count(*)::int AS count FROM travels WHERE id LIKE ${base + "%"}`;
      const newId = count ? `${base}-${count + 1}` : base;
      await q`
        INSERT INTO travels (id, city, country, country_code, start_date, end_date, published, image_url)
        VALUES (${newId}, ${city}, ${country}, ${countryCode}, ${start}, ${end}, ${published}, ${image})`;
    }
    revalidateSite();
    return id ? `${city} updated.` : `${city} added.`;
  });
}

export async function setTravelPublished(id: string, published: boolean) {
  const q = await db();
  await q`UPDATE travels SET published = ${published}, updated_at = now() WHERE id = ${id}`;
  revalidateSite();
}

export async function deleteTravel(id: string) {
  const q = await db();
  const [row] = await q<{ image_url: string | null }[]>`DELETE FROM travels WHERE id = ${id} RETURNING image_url`;
  await removeStoredFile(row?.image_url);
  revalidateSite();
}

/* ───────────── Photo & video slots ───────────── */

type MediaField = "image_url" | "video_url" | "video_mobile_url";
const MEDIA_FIELDS: MediaField[] = ["image_url", "video_url", "video_mobile_url"];

/** Saves (url) or clears (null) the official photo/video of a slot. */
export async function setSlotMedia(slot: string, field: MediaField, url: string | null) {
  const q = await db();
  if (!isKnownSlot(slot) || !MEDIA_FIELDS.includes(field)) throw new Error("Unknown slot");
  if (url !== null && !isUploadUrl(url)) throw new Error("Invalid file address");
  const [old] = await q<Record<MediaField, string | null>[]>`SELECT image_url, video_url, video_mobile_url FROM media_slots WHERE slot = ${slot}`;
  await q`
    INSERT INTO media_slots (slot, ${q(field)}) VALUES (${slot}, ${url})
    ON CONFLICT (slot) DO UPDATE SET ${q(field)} = ${url}, updated_at = now()`;
  if (old && old[field] !== url) await removeStoredFile(old[field]);
  revalidateSite();
}

export async function saveSlotAlt(_: FormState, fd: FormData): Promise<FormState> {
  return handle(async () => {
    const q = await db();
    const slot = text(fd, "slot");
    if (!isKnownSlot(slot)) throw new FormError("Unknown photo.");
    const alt = text(fd, "alt", { max: 200 }) || null;
    await q`
      INSERT INTO media_slots (slot, alt) VALUES (${slot}, ${alt})
      ON CONFLICT (slot) DO UPDATE SET alt = ${alt}, updated_at = now()`;
    revalidateSite();
    return "Description saved.";
  });
}

/* ───────────── Gallery ───────────── */

const isCollection = (c: string) => collectionDefs.some((d) => d.id === c);

export async function addGalleryPhoto(collection: string, url: string, alt: string) {
  const q = await db();
  if (!isCollection(collection) || !isUploadUrl(url)) throw new Error("Invalid photo");
  await q`
    INSERT INTO gallery_photos (collection, url, alt, position)
    VALUES (${collection}, ${url}, ${alt.slice(0, 200)},
      (SELECT coalesce(max(position), 0) + 1 FROM gallery_photos WHERE collection = ${collection}))`;
  revalidateSite();
}

export async function updateGalleryPhoto(_: FormState, fd: FormData): Promise<FormState> {
  return handle(async () => {
    const q = await db();
    const id = Number(fd.get("id"));
    const alt = text(fd, "alt", { max: 200, required: true });
    const collection = text(fd, "collection");
    if (!isCollection(collection)) throw new FormError("Unknown collection.");
    await q`UPDATE gallery_photos SET alt = ${alt}, collection = ${collection} WHERE id = ${id}`;
    revalidateSite();
    return "Photo saved.";
  });
}

export async function moveGalleryPhoto(id: number, direction: -1 | 1) {
  const q = await db();
  await q.begin(async (tx) => {
    const [row] = await tx<{ collection: string }[]>`SELECT collection FROM gallery_photos WHERE id = ${id}`;
    if (!row) return;
    const ids = (await tx<{ id: number }[]>`SELECT id FROM gallery_photos WHERE collection = ${row.collection} ORDER BY position, id`).map((r) => r.id);
    await reorder(tx, "gallery_photos", ids, id, direction);
  });
  revalidateSite();
}

export async function deleteGalleryPhoto(id: number) {
  const q = await db();
  const [row] = await q<{ url: string }[]>`DELETE FROM gallery_photos WHERE id = ${id} RETURNING url`;
  await removeStoredFile(row?.url);
  revalidateSite();
}

/* ───────────── Lifestyle ───────────── */

const SECTIONS = ["fragrance", "place", "wishlist"] as const;

export async function saveLifestyleItem(_: FormState, fd: FormData): Promise<FormState> {
  return handle(async () => {
    const q = await db();
    const id = Number(fd.get("id")) || null;
    const section = text(fd, "section") as (typeof SECTIONS)[number];
    if (!SECTIONS.includes(section)) throw new FormError("Unknown section.");
    const title = text(fd, "title", { max: 120, required: true });
    const subtitle = text(fd, "subtitle", { max: 120, required: true });
    const note = text(fd, "note", { max: 300 }) || null;
    const published = fd.get("published") === "on";
    const image = uploadUrl(fd, "image_url");

    if (id) {
      const [old] = await q<{ image_url: string | null }[]>`SELECT image_url FROM lifestyle_items WHERE id = ${id}`;
      await q`
        UPDATE lifestyle_items SET title = ${title}, subtitle = ${subtitle}, note = ${note},
          image_url = ${image}, published = ${published}
        WHERE id = ${id}`;
      if (old && old.image_url !== image) await removeStoredFile(old.image_url);
    } else {
      await q`
        INSERT INTO lifestyle_items (section, title, subtitle, note, image_url, published, position)
        VALUES (${section}, ${title}, ${subtitle}, ${note}, ${image}, ${published},
          (SELECT coalesce(max(position), 0) + 1 FROM lifestyle_items WHERE section = ${section}))`;
    }
    revalidateSite();
    return id ? `“${title}” updated.` : `“${title}” added.`;
  });
}

export async function moveLifestyleItem(id: number, direction: -1 | 1) {
  const q = await db();
  await q.begin(async (tx) => {
    const [row] = await tx<{ section: string }[]>`SELECT section FROM lifestyle_items WHERE id = ${id}`;
    if (!row) return;
    const ids = (await tx<{ id: number }[]>`SELECT id FROM lifestyle_items WHERE section = ${row.section} ORDER BY position, id`).map((r) => r.id);
    await reorder(tx, "lifestyle_items", ids, id, direction);
  });
  revalidateSite();
}

export async function deleteLifestyleItem(id: number) {
  const q = await db();
  const [row] = await q<{ image_url: string | null }[]>`DELETE FROM lifestyle_items WHERE id = ${id} RETURNING image_url`;
  await removeStoredFile(row?.image_url);
  revalidateSite();
}

/** Moves `id` one place within `ids` and rewrites positions 1..n. */
async function reorder(tx: TransactionSql, table: "gallery_photos" | "lifestyle_items", ids: number[], id: number, direction: -1 | 1) {
  const from = ids.indexOf(id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= ids.length) return;
  [ids[from], ids[to]] = [ids[to], ids[from]];
  for (const [i, rowId] of ids.entries()) {
    await tx`UPDATE ${tx(table)} SET position = ${i + 1} WHERE id = ${rowId}`;
  }
}

/* ───────────── Links & contacts ───────────── */

export async function saveSettings(_: FormState, fd: FormData): Promise<FormState> {
  return handle(async () => {
    const q = await db();
    const values: Record<string, string> = {};
    for (const key of SETTING_KEYS) values[key] = text(fd, key, { max: 300 });

    values.whatsapp_number = values.whatsapp_number.replace(/[\s()+-]/g, "");
    if (!/^\d{7,15}$/.test(values.whatsapp_number)) throw new FormError("WhatsApp number: digits only, with country code (e.g. 4915112345678).");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) throw new FormError("Please enter a valid email address.");
    for (const key of ["instagram_url", "onlyfans_url", "x_url", "telegram_channel_url"] as const) {
      if (values[key] && !isHttpUrl(values[key])) throw new FormError(`“${key.replace(/_url$/, "").replace(/_/g, " ")}” must be a full link starting with https://`);
    }

    for (const [key, value] of Object.entries(values)) {
      await q`
        INSERT INTO settings (key, value) VALUES (${key}, ${value})
        ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = now()`;
    }
    revalidateSite();
    return "Links saved. The website is updated.";
  });
}
