import "server-only";
/**
 * Booking availability from Gabrielle's availability calendar (Google Calendar).
 * Events in that calendar are the times she is available; events titled
 * "Booked …" are confirmed appointments (see availability-core.ts).
 *
 * Returns null when the calendar is not connected or cannot be reached: the
 * Book Me page then shows "please get in touch directly" and never invents slots.
 */
import { addDays, computeSlots, zonedToUtc, type SlotResult } from "@/lib/availability-core";
import { CalendarError, calendarName, isCalendarConfigured, listEvents } from "@/lib/google-calendar";

export type SlotAvailability = SlotResult;

export const BOOKING_RULES = {
  /** Meetings happen in Germany/Austria; all times on the site are local there. */
  timeZone: process.env.BOOKING_TIMEZONE?.trim() || "Europe/Berlin",
  minNoticeMinutes: 90,
  bufferMinutes: 60,
};

export type AvailabilityQuery = {
  /** YYYY-MM-DD */
  date: string;
  /** "HH:MM" candidates offered in the form */
  times: readonly string[];
  /** Requested duration; null when flexible */
  durationHours: number | null;
};

// Short cache so a visitor clicking through times does not hit Google every time.
const cache = new Map<string, { at: number; events: Awaited<ReturnType<typeof listEvents>> }>();
const CACHE_MS = 60_000;

export async function getAvailability({ date, times, durationHours }: AvailabilityQuery): Promise<SlotAvailability[] | null> {
  if (!isCalendarConfigured()) return null;
  const { timeZone, minNoticeMinutes, bufferMinutes } = BOOKING_RULES;
  // Long bookings starting late need the following days too; bookings before need the day before.
  const from = zonedToUtc(addDays(date, -1), "00:00", timeZone);
  const to = zonedToUtc(addDays(date, 3), "00:00", timeZone);

  try {
    let entry = cache.get(date);
    if (!entry || Date.now() - entry.at > CACHE_MS) {
      entry = { at: Date.now(), events: await listEvents(from, to) };
      cache.set(date, entry);
      if (cache.size > 200) cache.delete(cache.keys().next().value!);
    }
    return computeSlots({ date, times, durationHours, events: entry.events, tz: timeZone, now: Date.now(), minNoticeMinutes, bufferMinutes });
  } catch (err) {
    console.error("[availability]", err instanceof CalendarError ? err.message : err);
    return null;
  }
}

export type CalendarHealth =
  | { state: "not-configured" }
  | { state: "connected"; name: string; windowsNext14Days: number }
  | { state: "error"; message: string };

/** For the backoffice: is the calendar reachable, and how many availability windows are coming up. */
export async function calendarHealth(): Promise<CalendarHealth> {
  if (!isCalendarConfigured()) return { state: "not-configured" };
  try {
    const now = Date.now();
    const [name, events] = await Promise.all([calendarName(), listEvents(now, now + 14 * 24 * 3600_000)]);
    const windows = events.filter((e) => e.status !== "cancelled" && !/^\s*booked\b/i.test(e.summary ?? "")).length;
    return { state: "connected", name, windowsNext14Days: windows };
  } catch (err) {
    return { state: "error", message: err instanceof Error ? err.message : "Unknown error" };
  }
}
