# Photos — file names to upload

Upload to **`public/images/`** using exactly these names (lowercase, hyphens).
Any of `.webp` (preferred), `.avif`, `.jpg` or `.png` works. The site picks the file up
automatically on the next deploy. Until then, a placeholder is shown.

Next.js serves every photo resized and converted to AVIF/WebP, so upload the best
quality you have (ideally under 3 MB, long side 2000–2500 px).

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
| 13 | `gabrielle-og-image` | Preview shared on WhatsApp/social | Exactly 1200 × 630 |

## Optional — one photo per destination

The Travels card uses `gabrielle-travels-<city>` when it exists, for example
`gabrielle-travels-munich`, `gabrielle-travels-vienna`, `gabrielle-travels-frankfurt`.
Otherwise it falls back to `gabrielle-travels-city-skyline`.

## Alt text

Each photo already has descriptive alt text in `src/content/home.ts`. Adjust it there
if a photo shows something different (e.g. "Gabrielle in a black dress at dinner").
