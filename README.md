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
| Backoffice (phase 2) | **Supabase** (Auth + Postgres + Storage) under `/admin` | Travels, gallery photos and content managed without code |
| Availability (phase 2) | Google Calendar API, server-side only | Calendar stays the single source of availability |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Copy `.env.example` to `.env.local` and fill `NEXT_PUBLIC_SITE_URL`.

## Project structure

```
src/
  app/                 routes (/, sitemap.xml, robots.txt, 404)
  components/
    layout/            Header, MobileMenu, TravelTicker, Footer, SocialLinks
    home/              homepage sections (Hero, About, Gallery, Connection, Lifestyle, Travels, Social, Booking CTA)
    ui/                Button, EditorialImage, SectionHeading, Divider, Reveal
  content/             copy & settings (home.ts, site.ts, travels.ts)
  lib/
    data.ts            data access layer — the only place to swap for Supabase
    travels.ts         travel rules: chronological order, hide past trips, current destination
```

## Content still to replace before launch

- **Photography** — upload the files listed in [`docs/IMAGES.md`](docs/IMAGES.md) to `public/images/`. Until then an on-brand placeholder labelled `Photo · …` is shown.
- **Social / contact links** — `src/content/site.ts` (marked `TODO`).
- **Travels** — `src/content/travels.ts` holds the example dates from the copy deck.

## Deploy (Vercel + GoDaddy)

1. Import the GitHub repo in Vercel (framework preset: Next.js). Set `NEXT_PUBLIC_SITE_URL`.
2. In Vercel → Project → Domains, add the domain (apex and `www`).
3. In GoDaddy DNS: `A @ 76.76.21.21` and `CNAME www cname.vercel-dns.com` (or the values Vercel shows).

## Roadmap

- [x] Homepage (copy V1.1), global header/ticker/footer, SEO base
- [ ] About, Gallery (lightbox), Travels, Lifestyle, Book Me (booking flow + FAQ)
- [ ] Privacy & cookie policy
- [ ] Backoffice `/admin` (Supabase): dashboard, travels, gallery, content, social links, settings
- [ ] Google Calendar availability for Book Me
