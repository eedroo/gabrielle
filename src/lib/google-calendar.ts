import "server-only";
import { createSign } from "node:crypto";
import type { CalendarEvent } from "@/lib/availability-core";

/**
 * Minimal Google Calendar client using a service account (no SDK).
 * Env: GOOGLE_SERVICE_ACCOUNT_JSON (the key file, raw JSON or base64) and
 * GOOGLE_CALENDAR_ID (shared with the service account's email).
 */
type ServiceAccount = { client_email: string; private_key: string; token_uri?: string };

const SCOPE = "https://www.googleapis.com/auth/calendar.events.readonly";
// Overridable only so the integration can be tested against a local mock.
const API = process.env.GOOGLE_CALENDAR_API_URL || "https://www.googleapis.com/calendar/v3";

export class CalendarError extends Error {}

function serviceAccount(): ServiceAccount | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;
  try {
    const json = raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
    const parsed = JSON.parse(json) as ServiceAccount;
    if (!parsed.client_email || !parsed.private_key) throw new Error();
    return parsed;
  } catch {
    throw new CalendarError("GOOGLE_SERVICE_ACCOUNT_JSON is not a valid service account key.");
  }
}

export const calendarId = () => process.env.GOOGLE_CALENDAR_ID?.trim() || null;

export function isCalendarConfigured(): boolean {
  return Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim() && calendarId());
}

let cachedToken: { value: string; expires: number } | null = null;

async function accessToken(): Promise<string> {
  if (cachedToken && cachedToken.expires > Date.now() + 60_000) return cachedToken.value;
  const sa = serviceAccount();
  if (!sa) throw new CalendarError("GOOGLE_SERVICE_ACCOUNT_JSON is not set.");

  const now = Math.floor(Date.now() / 1000);
  const tokenUri = sa.token_uri ?? "https://oauth2.googleapis.com/token";
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({ iss: sa.client_email, scope: SCOPE, aud: tokenUri, iat: now, exp: now + 3600 })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(sa.private_key, "base64url");

  const res = await fetch(tokenUri, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error_description?: string };
  if (!res.ok || !data.access_token) throw new CalendarError(`Google sign-in failed: ${data.error_description ?? res.status}`);
  cachedToken = { value: data.access_token, expires: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return data.access_token;
}

async function api<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(API + path);
  for (const [k, v] of Object.entries(params ?? {})) url.searchParams.set(k, v);
  const res = await fetch(url, { headers: { authorization: `Bearer ${await accessToken()}` }, cache: "no-store" });
  const data = (await res.json().catch(() => ({}))) as T & { error?: { message?: string } };
  if (!res.ok) {
    if (res.status === 404) throw new CalendarError("Calendar not found — check GOOGLE_CALENDAR_ID and that it is shared with the service account.");
    throw new CalendarError(`Google Calendar error (${res.status}): ${data.error?.message ?? "unknown"}`);
  }
  return data;
}

/** Events overlapping [from, to), recurring events expanded. */
export async function listEvents(from: number, to: number): Promise<CalendarEvent[]> {
  const id = calendarId();
  if (!id) throw new CalendarError("GOOGLE_CALENDAR_ID is not set.");
  const events: CalendarEvent[] = [];
  let pageToken: string | undefined;
  do {
    const page = await api<{ items?: CalendarEvent[]; nextPageToken?: string }>(`/calendars/${encodeURIComponent(id)}/events`, {
      timeMin: new Date(from).toISOString(),
      timeMax: new Date(to).toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "250",
      fields: "items(summary,status,start,end),nextPageToken",
      ...(pageToken ? { pageToken } : {}),
    });
    events.push(...(page.items ?? []));
    pageToken = page.nextPageToken;
  } while (pageToken);
  return events;
}

/** Calendar name, used by the backoffice to confirm the connection. */
export async function calendarName(): Promise<string> {
  const id = calendarId();
  if (!id) throw new CalendarError("GOOGLE_CALENDAR_ID is not set.");
  const data = await api<{ summary?: string }>(`/calendars/${encodeURIComponent(id)}`);
  return data.summary ?? id;
}
