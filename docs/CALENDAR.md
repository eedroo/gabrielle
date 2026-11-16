# Availability calendar (Google Calendar)

The Book Me page reads a **dedicated availability calendar**. The logic is inverted:

| In the calendar | On the website |
| --- | --- |
| An event (any title) | Gabrielle is **available** during that time |
| An event titled `Booked …` | A confirmed appointment: that time **plus 60 min before and after** is not offered |
| Nothing on a day | No times offered — the form says “Please get in touch directly” |

Other rules (`src/lib/availability.ts`): at least **1 h 30** notice, times in **Europe/Berlin**
(override with `BOOKING_TIMEZONE`), a slot is offered only if the whole requested duration
fits inside an availability event. All-day events count as available all day; back-to-back
events merge.

## Setup

1. **Calendar** — in Google Calendar (any account, e.g. the agency’s), create a calendar
   called “Gabrielle — Availability” and share it with Gabrielle with
   *Make changes to events*, so she adds availability from her own phone.
2. **Google Cloud** (same or another account) — create a project, enable the
   **Google Calendar API**, create a **service account**, then *Keys → Add key → JSON*.
3. **Share the calendar with the service account’s email** (`…@….iam.gserviceaccount.com`)
   with *See all event details* (needed to read the “Booked” titles).
4. **Vercel → Settings → Environment Variables**:
   - `GOOGLE_SERVICE_ACCOUNT_JSON` — the whole JSON key file content
   - `GOOGLE_CALENDAR_ID` — *Calendar settings → Integrate calendar → Calendar ID*
5. Redeploy. The backoffice dashboard shows **Connected** and the number of available
   periods in the next 14 days, or the error if something is wrong.

The key never reaches the browser; visitors only receive which times are free.
