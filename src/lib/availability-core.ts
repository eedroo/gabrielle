/**
 * Availability maths, kept free of I/O so it can be tested on its own.
 *
 * Inverted calendar logic: in Gabrielle's availability calendar every event is
 * a window when she IS available. Events whose title starts with "Booked" mark
 * a confirmed appointment instead: that time and a buffer around it are taken.
 */
export type Interval = { start: number; end: number };

export type CalendarEvent = {
  summary?: string;
  status?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
};

export type SlotResult = { time: string; available: boolean };

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

/** Milliseconds `tz` is ahead of UTC at the given instant. */
function tzOffset(utcMs: number, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const p = Object.fromEntries(parts.map((x) => [x.type, Number(x.value)]));
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - utcMs;
}

/** "2026-11-18" + "20:00" in `tz` → epoch ms (DST-safe). */
export function zonedToUtc(date: string, time: string, tz: string): number {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const naive = Date.UTC(y, m - 1, d, hh, mm);
  const first = naive - tzOffset(naive, tz);
  return naive - tzOffset(first, tz);
}

/** Next calendar day as YYYY-MM-DD. */
export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

export const isBookedEvent = (e: CalendarEvent) => /^\s*booked\b/i.test(e.summary ?? "");

function toInterval(e: CalendarEvent, tz: string): Interval | null {
  const start = e.start.dateTime ? Date.parse(e.start.dateTime) : e.start.date ? zonedToUtc(e.start.date, "00:00", tz) : NaN;
  const end = e.end.dateTime ? Date.parse(e.end.dateTime) : e.end.date ? zonedToUtc(e.end.date, "00:00", tz) : NaN;
  return Number.isFinite(start) && Number.isFinite(end) && end > start ? { start, end } : null;
}

/** Sorted, merged intervals (back-to-back windows become one). */
function merge(intervals: Interval[]): Interval[] {
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  const out: Interval[] = [];
  for (const i of sorted) {
    const last = out[out.length - 1];
    if (last && i.start <= last.end) last.end = Math.max(last.end, i.end);
    else out.push({ ...i });
  }
  return out;
}

export function computeSlots({
  date,
  times,
  durationHours,
  events,
  tz,
  now,
  minNoticeMinutes,
  bufferMinutes,
}: {
  date: string;
  times: readonly string[];
  /** null = flexible; checked as one hour */
  durationHours: number | null;
  events: CalendarEvent[];
  tz: string;
  now: number;
  minNoticeMinutes: number;
  bufferMinutes: number;
}): SlotResult[] {
  const live = events.filter((e) => e.status !== "cancelled");
  const windows = merge(live.filter((e) => !isBookedEvent(e)).flatMap((e) => toInterval(e, tz) ?? []));
  const booked = live.filter(isBookedEvent).flatMap((e) => toInterval(e, tz) ?? []);
  const length = (durationHours ?? 1) * HOUR;
  const buffer = bufferMinutes * MINUTE;
  const earliest = now + minNoticeMinutes * MINUTE;

  return times.map((time) => {
    const start = zonedToUtc(date, time, tz);
    const end = start + length;
    const available =
      start >= earliest &&
      windows.some((w) => w.start <= start && end <= w.end) &&
      !booked.some((b) => start < b.end + buffer && end > b.start - buffer);
    return { time, available };
  });
}
