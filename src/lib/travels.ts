export type Travel = {
  id: string;
  city: string;
  country: string;
  /** ISO 3166-1 alpha-2, used for the flag */
  countryCode: string;
  /** Inclusive, YYYY-MM-DD */
  startDate: string;
  /** Inclusive, YYYY-MM-DD */
  endDate: string;
  published: boolean;
  image: string | null;
};

const toDay = (iso: string) => new Date(`${iso}T00:00:00Z`).getTime();
const today = (now: Date) =>
  Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

/** Published, not yet finished, in chronological order. */
export function upcomingTravels(all: Travel[], now = new Date()): Travel[] {
  const t = today(now);
  return all
    .filter((trip) => trip.published && toDay(trip.endDate) >= t)
    .sort((a, b) => toDay(a.startDate) - toDay(b.startDate));
}

/** The trip happening today, if any. Never invents a destination. */
export function currentTravel(all: Travel[], now = new Date()): Travel | null {
  const t = today(now);
  return (
    upcomingTravels(all, now).find(
      (trip) => toDay(trip.startDate) <= t && t <= toDay(trip.endDate),
    ) ?? null
  );
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parts(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  return { m: m - 1, d: String(d).padStart(2, "0") };
}

/** "NOV 05–12" or "NOV 28 – DEC 03" */
export function formatRangeShort(trip: Travel): string {
  const s = parts(trip.startDate);
  const e = parts(trip.endDate);
  return s.m === e.m
    ? `${MONTHS[s.m]} ${s.d}–${e.d}`
    : `${MONTHS[s.m]} ${s.d} – ${MONTHS[e.m]} ${e.d}`;
}

/** "November 05–12" or "November 28 – December 03" */
export function formatRangeLong(trip: Travel): string {
  const s = parts(trip.startDate);
  const e = parts(trip.endDate);
  return s.m === e.m
    ? `${MONTHS_LONG[s.m]} ${s.d}–${e.d}`
    : `${MONTHS_LONG[s.m]} ${s.d} – ${MONTHS_LONG[e.m]} ${e.d}`;
}

export function flagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

/** "05 November — 12 November 2026" (year shown once when both dates share it) */
export function formatRangeFull(trip: Travel): string {
  const [sy] = trip.startDate.split("-");
  const [ey] = trip.endDate.split("-");
  const s = parts(trip.startDate);
  const e = parts(trip.endDate);
  const start = `${s.d} ${MONTHS_LONG[s.m]}${sy !== ey ? ` ${sy}` : ""}`;
  return `${start} — ${e.d} ${MONTHS_LONG[e.m]} ${ey}`;
}
