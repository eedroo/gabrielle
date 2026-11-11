/**
 * Data access layer. Pages only talk to these functions. With DATABASE_URL set
 * the data comes from the backoffice (Neon); otherwise, or if the database is
 * unreachable, from the static content in src/content.
 */
import "server-only";
import { cache } from "react";
import { travels as staticTravels } from "@/content/travels";
import { lifestyle } from "@/content/lifestyle";
import { sql } from "@/lib/db";
import { resolveImage } from "@/lib/images";
import { currentTravel, upcomingTravels, type Travel } from "@/lib/travels";

const slug = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** A trip without its own image uses "gabrielle-travels-<city>" if that file exists. */
const withImage = (trip: Travel): Travel => ({
  ...trip,
  image: trip.image ?? resolveImage(`gabrielle-travels-${slug(trip.city)}`),
});

async function fromDb<T>(label: string, query: () => Promise<T>, fallback: () => T): Promise<T> {
  if (!sql) return fallback();
  try {
    return await query();
  } catch (err) {
    console.error(`[data] ${label}: database unavailable, using static content`, err);
    return fallback();
  }
}

/** Every trip, published or not (backoffice list). */
export const getAllTravels = cache(
  (): Promise<Travel[]> =>
    fromDb(
      "travels",
      async (): Promise<Travel[]> => [
        ...(await sql!<Travel[]>`
          SELECT id, city, country, country_code AS "countryCode",
                 to_char(start_date, 'YYYY-MM-DD') AS "startDate",
                 to_char(end_date, 'YYYY-MM-DD') AS "endDate",
                 published, image_url AS image
          FROM travels ORDER BY start_date`),
      ],
      () => staticTravels,
    ),
);

export async function getUpcomingTravels(): Promise<Travel[]> {
  return upcomingTravels(await getAllTravels()).map(withImage);
}

export async function getCurrentTravel(): Promise<Travel | null> {
  const trip = currentTravel(await getAllTravels());
  return trip && withImage(trip);
}

export type GalleryRow = { id: number; collection: string; url: string; alt: string };

/** Gallery photos uploaded in the backoffice, in display order. */
export const getGalleryPhotos = cache(
  (): Promise<GalleryRow[]> =>
    fromDb(
      "gallery",
      async (): Promise<GalleryRow[]> => [...(await sql!<GalleryRow[]>`SELECT id, collection, url, alt FROM gallery_photos ORDER BY collection, position, id`)],
      () => [],
    ),
);

export type LifestyleCard = {
  id: string;
  title: string;
  subtitle: string;
  note?: string;
  image: string | null;
};
export type LifestyleSection = "fragrance" | "place" | "wishlist";

/** Published fragrance, place and wishlist cards. */
export const getLifestyleItems = cache(
  (): Promise<Record<LifestyleSection, LifestyleCard[]>> =>
    fromDb(
      "lifestyle",
      async () => {
        const rows = await sql!<(LifestyleCard & { section: LifestyleSection; id: number; note: string | null })[]>`
          SELECT id, section, title, subtitle, note, image_url AS image
          FROM lifestyle_items WHERE published ORDER BY position, id`;
        const by = (section: LifestyleSection) =>
          rows
            .filter((r) => r.section === section)
            .map((r) => ({ id: String(r.id), title: r.title, subtitle: r.subtitle, note: r.note ?? undefined, image: r.image }));
        return { fragrance: by("fragrance"), place: by("place"), wishlist: by("wishlist") };
      },
      () => ({
        fragrance: [...lifestyle.fragrances.items],
        place: [...lifestyle.places.items],
        wishlist: [...lifestyle.wishlist.items],
      }),
    ),
);
