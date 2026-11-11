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

- **Photography** — upload the files listed in [`docs/IMAGES.md`](docs/IMAGES.md) to `public/images/`. Until then an on-brand placeholder labelled `Photo · …` is shown.
- **Videos** — background videos go in `public/videos/` (see docs/IMAGES.md, V1–V4).
- **Temporary photos** — the current files in `public/images/` are AI placeholders for the test link. Replace every one with Gabrielle's real photography before launch (same file names).
- **Share image (pending)** — `gabrielle-og-image` (1200 × 630) has not been uploaded yet; links shared on WhatsApp/social show no preview image until it is.
- **Social / contact links** — `src/content/site.ts` (marked `TODO`): WhatsApp number (international format, digits only), email, Instagram, OnlyFans, X and the public Telegram channel.
- **Travels** — `src/content/travels.ts` holds the example dates from the copy deck.
- **Lifestyle items** — the fragrances, places and wishlist in `src/content/lifestyle.ts` are examples; replace them with Gabrielle's own choices.

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
- [ ] Backoffice `/admin` (Supabase): dashboard, travels, gallery, content, social links, settings
- [ ] Google Calendar availability for Book Me
