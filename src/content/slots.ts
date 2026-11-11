/**
 * Every photo (and video) slot on the website, as listed in the backoffice
 * Photos page. The slot name is the SEO file name used in /public/images.
 */
export type Slot = {
  slot: string;
  label: string;
  format: string;
  /** Background video allowed (photo is the cover) */
  video?: boolean;
};

export type SlotGroup = { page: string; href: string; slots: Slot[] };

const LANDSCAPE_RIGHT = "Landscape 16:9 · subject on the right";
const LANDSCAPE_LEFT = "Landscape 16:9 · subject on the left";
const LANDSCAPE = "Landscape 16:9";
const PORTRAIT_45 = "Portrait 4:5";
const PORTRAIT_34 = "Portrait 3:4";
const SQUARE = "Square 1:1";

export const slotGroups: SlotGroup[] = [
  {
    page: "Home",
    href: "/",
    slots: [
      { slot: "gabrielle-independent-companion-hero", label: "Hero", format: LANDSCAPE, video: true },
      { slot: "gabrielle-about-portrait-01", label: "Beyond first impressions", format: PORTRAIT_45 },
      { slot: "gabrielle-home-occasion", label: "Your time, your occasion", format: LANDSCAPE, video: true },
      { slot: "gabrielle-editorial-portrait-01", label: "Gallery preview 1", format: PORTRAIT_34 },
      { slot: "gabrielle-editorial-portrait-02", label: "Gallery preview 2 (widest)", format: PORTRAIT_34 },
      { slot: "gabrielle-editorial-portrait-03", label: "Gallery preview 3", format: PORTRAIT_34 },
      { slot: "gabrielle-editorial-portrait-04", label: "Gallery preview 4", format: PORTRAIT_34 },
      { slot: "gabrielle-editorial-portrait-05", label: "Gallery preview 5", format: PORTRAIT_34 },
      { slot: "gabrielle-home-connection", label: "Some things are better felt", format: LANDSCAPE, video: true },
      { slot: "gabrielle-book-me-portrait-01", label: "Let’s make time… (Book an Appointment)", format: LANDSCAPE_LEFT },
      { slot: "gabrielle-travels-city-skyline", label: "Destinations (default city photo)", format: PORTRAIT_45 },
      { slot: "gabrielle-lifestyle-fragrance-01", label: "A world of my own (tall)", format: "Vertical 3:5" },
      { slot: "gabrielle-lifestyle-wine-01", label: "A world of my own (top)", format: SQUARE },
      { slot: "gabrielle-lifestyle-places-01", label: "A world of my own (bottom)", format: SQUARE },
    ],
  },
  {
    page: "About",
    href: "/about",
    slots: [
      { slot: "gabrielle-about-hero", label: "Hero", format: LANDSCAPE_RIGHT },
      { slot: "gabrielle-about-portrait-02", label: "A curious mind, an open heart", format: PORTRAIT_45 },
      { slot: "gabrielle-about-personality-01", label: "Naturally curious. Genuinely present.", format: PORTRAIT_34 },
      { slot: "gabrielle-about-details-01", label: "Beauty is in the details", format: PORTRAIT_45 },
      { slot: "gabrielle-about-my-world-01", label: "A life shaped by curiosity (larger)", format: PORTRAIT_34 },
      { slot: "gabrielle-about-my-world-02", label: "A life shaped by curiosity (smaller)", format: PORTRAIT_45 },
      { slot: "gabrielle-about-closing", label: "Every connection has its own story", format: LANDSCAPE_LEFT },
    ],
  },
  {
    page: "Gallery",
    href: "/gallery",
    slots: [
      { slot: "gabrielle-gallery-hero", label: "Hero", format: LANDSCAPE_RIGHT },
      { slot: "gabrielle-gallery-closing", label: "There is always more to discover", format: LANDSCAPE_LEFT },
    ],
  },
  {
    page: "Travels",
    href: "/travels",
    slots: [
      { slot: "gabrielle-travels-hero", label: "Hero", format: LANDSCAPE_RIGHT },
      { slot: "gabrielle-travels-philosophy", label: "Every destination has its own story", format: PORTRAIT_45 },
      { slot: "gabrielle-travels-closing", label: "Make a moment of it", format: LANDSCAPE_LEFT },
    ],
  },
  {
    page: "Lifestyle",
    href: "/lifestyle",
    slots: [
      { slot: "gabrielle-lifestyle-hero", label: "Hero", format: LANDSCAPE_RIGHT },
      { slot: "gabrielle-lifestyle-introduction", label: "An appreciation for the finer details", format: PORTRAIT_45 },
      { slot: "gabrielle-lifestyle-gestures-01", label: "It’s the thought that makes it special", format: PORTRAIT_45 },
      { slot: "gabrielle-lifestyle-closing", label: "Every detail tells a story", format: LANDSCAPE_LEFT },
    ],
  },
  {
    page: "Book Me",
    href: "/book-me",
    slots: [{ slot: "gabrielle-book-me-hero", label: "Hero with the enquiry form", format: LANDSCAPE, video: true }],
  },
  {
    page: "Sharing",
    href: "/",
    slots: [{ slot: "gabrielle-og-image", label: "Preview when the link is shared (WhatsApp, social)", format: "Exactly 1200 × 630" }],
  },
];

export const allSlots = slotGroups.flatMap((g) => g.slots);
export const isKnownSlot = (slot: string) => allSlots.some((s) => s.slot === slot);
