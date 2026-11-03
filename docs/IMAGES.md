# Photos — file names to upload

Upload to **`public/images/`** using exactly these names (lowercase, hyphens).
Any of `.webp` (preferred), `.avif`, `.jpg` or `.png` works. The site picks the file up
automatically on the next deploy. Until then, a placeholder is shown.

Next.js serves every photo resized and converted to AVIF/WebP, so upload the best
quality you have (ideally under 3 MB, long side 2000–2500 px).

## Home (`/`)

| # | File name (without extension) | Where | Format |
|---|---|---|---|
| 1 | `gabrielle-independent-companion-hero` | Home · Hero (main photo) | Landscape 16:9 or larger, subject on the right |
| 2 | `gabrielle-about-portrait-01` | Home · "Beyond first impressions" | Portrait 4:5 |
| 3 | `gabrielle-editorial-portrait-01` | Home · Gallery preview 1 | Portrait 3:4 |
| 4 | `gabrielle-editorial-portrait-02` | Home · Gallery preview 2 (widest) | Portrait 3:4 |
| 5 | `gabrielle-editorial-portrait-03` | Home · Gallery preview 3 | Portrait 3:4 |
| 6 | `gabrielle-editorial-portrait-04` | Home · Gallery preview 4 | Portrait 3:4 |
| 7 | `gabrielle-editorial-portrait-05` | Home · Gallery preview 5 | Portrait 3:4 |
| 8 | `gabrielle-lifestyle-fragrance-01` | Home · "A world of my own" (tall) | Vertical 3:5 |
| 9 | `gabrielle-lifestyle-wine-01` | Home · "A world of my own" | Square 1:1 |
| 10 | `gabrielle-lifestyle-places-01` | Home · "A world of my own" | Square 1:1 |
| 11 | `gabrielle-travels-city-skyline` | Home · Travels (default city photo) | Portrait 4:5 |
| 12 | `gabrielle-book-me-portrait-01` | Home · final "Let's make time…" | Landscape 16:9, subject on the left |
| 13 | `gabrielle-og-image` | Preview shared on WhatsApp/social (all pages) | Exactly 1200 × 630 |

## About (`/about`)

| # | File name (without extension) | Where | Format |
|---|---|---|---|
| 14 | `gabrielle-about-hero` | Hero "A woman beyond the photographs." | Landscape 16:9, subject on the right |
| 15 | `gabrielle-about-portrait-02` | "A curious mind, an open heart." | Portrait 4:5 |
| 16 | `gabrielle-about-personality-01` | "Naturally curious. Genuinely present." | Portrait 3:4 |
| 17 | `gabrielle-about-details-01` | "Beauty is in the details." (desktop only) | Portrait 4:5 |
| 18 | `gabrielle-about-my-world-01` | "A life shaped by curiosity." (larger) | Portrait 3:4 |
| 19 | `gabrielle-about-my-world-02` | "A life shaped by curiosity." (smaller) | Portrait 4:5 |
| 20 | `gabrielle-about-closing` | Final "Every connection has its own story." | Landscape 16:9, subject on the left |

## Book Me (`/book-me`)

| # | File name (without extension) | Where | Format |
|---|---|---|---|
| 21 | `gabrielle-book-me-hero` | Hero "Let's make time for something memorable." | Landscape 16:9, subject on the right |
| 22 | `gabrielle-book-me-introduction` | "A little about you." (desktop only) | Portrait 4:5 |
| 23 | `gabrielle-book-me-closing` | Final "A good introduction is always welcome." | Landscape 16:9, subject on the left |

## Travels (`/travels`)

| # | File name (without extension) | Where | Format |
|---|---|---|---|
| 24 | `gabrielle-travels-hero` | Hero "The world is more beautiful when explored." | Landscape 16:9, subject on the right |
| 25 | `gabrielle-travels-philosophy` | "Every destination has its own story." | Portrait 4:5 |
| 26 | `gabrielle-travels-closing` | Final "Make a moment of it." | Landscape 16:9, subject on the left |

Destination cards and "Currently exploring" use the per-city photos below
(landscape 4:3), or `gabrielle-travels-city-skyline` (#11) when a city has none.

## Optional — one photo per destination

The Travels card uses `gabrielle-travels-<city>` when it exists, for example
`gabrielle-travels-munich`, `gabrielle-travels-vienna`, `gabrielle-travels-frankfurt`.
Otherwise it falls back to `gabrielle-travels-city-skyline`.

## Alt text

Each photo already has descriptive alt text in `src/content/home.ts`, `src/content/about.ts`, `src/content/book-me.ts` and `src/content/travels-page.ts`. Adjust it there
if a photo shows something different (e.g. "Gabrielle in a black dress at dinner").
