# Gabrielle — Website V1

Personal website for Gabrielle, independent high class companion.
*The beauty of a genuine connection.*

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js (App Router) + React + TypeScript** | SEO-friendly server rendering, native Vercel support, API routes for booking/calendar |
| Styling | **Tailwind CSS v4** with design tokens in `src/app/globals.css` | Tokens from the visual direction (Obsidian, Warm Ivory, Champagne…) |
| Fonts | Cormorant Garamond (display) + DM Sans (body) via `next/font` | Self-hosted, no layout shift |
| Hosting | GitHub → **Vercel** (auto deploy on push) · domain at GoDaddy | |
| Backoffice | `/admin` — **Neon** (Postgres) + **Vercel Blob** (photos/videos) + own email/password login | Travels, photos, videos, gallery, lifestyle and links managed without code |
| Availability (phase 2) | Google Calendar API, server-side only | Calendar stays the single source of availability |

## Backoffice (`/admin`)

English-language panel for Gabrielle (and the agency) to run the website:

| Section | What it manages |
| --- | --- |
| Dashboard | Next destination, counts, photos still temporary |
| Travels | Destinations and dates (ticker, home, Travels, Book Me cities) |
| Photos & videos | Every photo slot on the site + background videos; Official / Temporary / Missing |
| Gallery | Photos per collection, order, descriptions |
| Lifestyle | Fragrance, place and wishlist cards |
| Links & contacts | WhatsApp number, email, Instagram, OnlyFans, X, Telegram channel |
| Account | Change password, add/reset/remove access |

How it fits together:

- **Data**: Neon via `DATABASE_URL`. Migrations in `db/migrations` run automatically before every build (`scripts/migrate.mjs`).
- **Files**: uploaded from the browser straight to Vercel Blob (`/api/admin/upload`). Locally without a Blob token they go to `public/uploads` (git-ignored).
- **Fallbacks**: an official photo saved for a slot wins over the file in `public/images`, which wins over the gradient placeholder. Without a database, the site runs on `src/content`.
- **Live updates**: every save revalidates the public pages; no redeploy needed.
- **WhatsApp**: all links go through `/whatsapp`, which redirects to the number saved in the panel.
- **Login**: email + password (scrypt), signed 30-day cookie (`AUTH_SECRET`), 5 failed attempts lock an email for 15 minutes, changing the password signs out other devices. No public sign-up; the first account is created once at `/admin/setup` with `ADMIN_SETUP_CODE`.

### First-time setup

1. Vercel → project → **Storage**: Neon and Blob connected to this project (adds `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN`).
2. Vercel → **Settings → Environment Variables**: add `AUTH_SECRET` (random, 32+ characters) and `ADMIN_SETUP_CODE`.
3. Redeploy, open `/admin`, create the first account with the setup code, then add the second one in **Account**.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # migrations (if DATABASE_URL) + production build
npm run db:migrate
```

Copy `.env.example` to `.env.local` and fill `NEXT_PUBLIC_SITE_URL`.

## Project structure

```
src/
  app/                 routes (/, /about, /book-me, /travels, /lifestyle, /gallery, /api/availability, sitemap.xml, robots.txt, 404)
  components/
    layout/            Header, MobileMenu, TravelTicker, Footer, SocialLinks
    shared/            sections reused across pages (PageHero, ClosingCTA)
    travels/           travels page sections
    lifestyle/         lifestyle sections and cards
    gallery/           GalleryGrid (client: filters + lightbox)
    about/             about page sections
    book-me/           book me sections + EnquiryForm (client)
    home/              homepage sections (Hero, About, Gallery, Connection, Lifestyle, Travels, Social, Booking CTA)
    ui/                Button, EditorialImage, SectionHeading, Divider, Reveal
  content/             copy & settings (home.ts, about.ts, book-me.ts, travels-page.ts, lifestyle.ts, gallery.ts, site.ts, travels.ts)
  lib/
    data.ts            data access layer — the only place to swap for Supabase
    travels.ts         travel rules: chronological order, hide past trips, current destination
    availability.ts    Google Calendar availability (returns null until connected)
```

## Content still to replace before launch

- **Photography** — upload the official photos in the backoffice (**Photos & videos**, **Gallery**); the dashboard counts the ones still temporary. [`docs/IMAGES.md`](docs/IMAGES.md) lists every slot.
- **Videos** — background videos go in `public/videos/` (see docs/IMAGES.md, V1–V4).
- **Temporary photos** — the current files in `public/images/` are AI placeholders for the test link. Replace every one with Gabrielle's real photography before launch (same file names).
- **Share image (pending)** — `gabrielle-og-image` (1200 × 630) has not been uploaded yet; links shared on WhatsApp/social show no preview image until it is.
- **Social / contact links** — backoffice **Links & contacts** (defaults in `src/content/site.ts` are placeholders).
- **Travels** and **Lifestyle items** — the database starts with the copy-deck examples; replace them in the backoffice.

## Deploy (Vercel + GoDaddy)

1. Import the GitHub repo in Vercel (framework preset: Next.js). Set `NEXT_PUBLIC_SITE_URL`.
2. In Vercel → Project → Domains, add the domain (apex and `www`).
3. In GoDaddy DNS: `A @ 76.76.21.21` and `CNAME www cname.vercel-dns.com` (or the values Vercel shows).

## Roadmap

- [x] Homepage (copy V1.1), global header/ticker/footer, SEO base
- [x] About (copy V1)
- [x] Book Me (copy V1, revised): two-step enquiry in the video hero → prepared WhatsApp message, FAQ with FAQPage schema
- [x] Home revision: video hero (name, WhatsApp, scroll cue; H1 kept as the signature), destination banner, video statements with Book Now, new section order
- [x] Floating WhatsApp button on every page
- [x] Travels (copy V1): current destination, upcoming cards → Book Me with the city preselected
- [x] Lifestyle (copy V1): fragrance, place and wishlist cards
- [x] Gallery (copy V1): collections filled from numbered files, filters, lightbox
- [ ] Privacy & cookie policy
- [x] Backoffice `/admin` (Neon + Vercel Blob): dashboard, travels, photos & videos, gallery, lifestyle, links, accounts
- [ ] Google Calendar availability for Book Me
