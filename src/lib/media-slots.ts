import "server-only";
import { cache } from "react";
import { sql } from "@/lib/db";

export type MediaOverride = {
  slot: string;
  image_url: string | null;
  alt: string | null;
  video_url: string | null;
  video_mobile_url: string | null;
};

/** Official photos/videos saved in the backoffice, by slot name. One query per request. */
export const getMediaOverrides = cache(async (): Promise<Map<string, MediaOverride>> => {
  if (!sql) return new Map();
  try {
    const rows = await sql<MediaOverride[]>`SELECT slot, image_url, alt, video_url, video_mobile_url FROM media_slots`;
    return new Map(rows.map((r) => [r.slot, r]));
  } catch (err) {
    console.error("[media-slots] falling back to files", err);
    return new Map();
  }
});
