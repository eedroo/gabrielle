/**
 * Booking availability. Google Calendar is the only source of truth
 * (the backoffice never manages availability).
 *
 * Until the calendar integration is connected this returns `null`, and the
 * Book Me page shows "no availability shown" instead of inventing free slots.
 */
export type SlotAvailability = { time: string; available: boolean };

export type AvailabilityQuery = {
  /** YYYY-MM-DD */
  date: string;
  /** "HH:MM" candidates offered in the form */
  times: readonly string[];
  /** Requested duration; null when flexible */
  durationHours: number | null;
};

export function isCalendarConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CALENDAR_ID && process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
}

export async function getAvailability(query: AvailabilityQuery): Promise<SlotAvailability[] | null> {
  if (!isCalendarConfigured()) return null;
  // Phase 2: query the Calendar freeBusy API server-side for `query.date`
  // (in BOOKING_TIMEZONE) and mark a time unavailable when
  // [time, time + duration] overlaps a busy block. Credentials never reach the client.
  void query;
  return null;
}
