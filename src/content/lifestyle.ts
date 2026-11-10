import { photo, resolveImage } from "@/lib/images";

/**
 * Lifestyle page copy — V1
 * Editorial direction: Personal · Refined · Feminine · Curated
 *
 * EXAMPLE ITEMS — fragrances, places and wishlist below are illustrative
 * and must be replaced with Gabrielle's own choices (backoffice in phase 2).
 * Card photos are optional: upload gabrielle-lifestyle-<section>-<item-id>
 * (e.g. gabrielle-lifestyle-fragrance-santal-33) and it appears on the card.
 */
type Item = { id: string; title: string; subtitle: string; note?: string };

const withPhoto = (section: string) => (item: Item) => ({
  ...item,
  image: resolveImage(`gabrielle-lifestyle-${section}-${item.id}`),
});

const fragrances: Item[] = [
  { id: "baccarat-rouge-540", title: "Baccarat Rouge 540", subtitle: "Maison Francis Kurkdjian", note: "Warm, luminous and unforgettable." },
  { id: "santal-33", title: "Santal 33", subtitle: "Le Labo", note: "Woody, soft and quietly confident." },
  { id: "soleil-blanc", title: "Soleil Blanc", subtitle: "Tom Ford", note: "Summer evenings in a bottle." },
];

const places: Item[] = [
  { id: "hotel-sacher", title: "Hotel Sacher", subtitle: "Vienna, Austria", note: "Old-world elegance and the perfect slice of cake." },
  { id: "lake-como", title: "Lake Como", subtitle: "Lombardy, Italy", note: "Slow mornings and views that stay with you." },
  { id: "opera-night", title: "A night at the opera", subtitle: "Munich, Germany", note: "Music, velvet and a little drama." },
];

const wishlist: Item[] = [
  { id: "silk-scarf", title: "Silk scarf", subtitle: "Hermès" },
  { id: "first-edition", title: "A beautiful first edition", subtitle: "A classic novel, beautifully bound" },
  { id: "tasting-dinner", title: "A tasting menu", subtitle: "An evening at a chef’s table" },
];

export const lifestyle = {
  seo: {
    title: "Lifestyle & Personal Interests | Gabrielle",
    description:
      "Discover Gabrielle's personal world, from favourite fragrances and gastronomy to travel inspirations, beautiful places and thoughtful gestures.",
  },
  hero: {
    eyebrow: "My world, my inspiration",
    title: "The little things that make life beautiful.",
    paragraphs: [
      "A collection of things I love, places that inspire me and experiences I enjoy.",
      "From fragrances and gastronomy to travel, art and the simple pleasures of everyday life — these are some of the details that make my world a little more interesting.",
    ],
    image: photo("gabrielle-lifestyle-hero", "Gabrielle relaxing with a glass of wine in an elegant interior"),
  },
  introduction: {
    eyebrow: "A personal collection",
    title: "An appreciation for the finer details.",
    paragraphs: [
      "I believe that personality often reveals itself in the smallest things.",
      "A favourite fragrance, the atmosphere of a beautiful restaurant, a thoughtfully prepared dinner or a place that stays in your memory long after you leave.",
      "I enjoy discovering, collecting and appreciating these little details. They are part of what makes life feel personal.",
    ],
    image: photo("gabrielle-lifestyle-introduction", "Gabrielle, personal portrait at home"),
  },
  fragrances: {
    eyebrow: "Scent & sensibility",
    title: "A fragrance can tell a story.",
    paragraphs: [
      "I have always found something fascinating about perfume.",
      "Some fragrances evoke memories, others create an atmosphere or become part of the way we are remembered.",
      "A selection of scents I particularly enjoy, appreciate or would love to discover.",
    ],
    image: photo("gabrielle-lifestyle-fragrance-01", "A favourite fragrance on a vanity table"),
    items: fragrances.map(withPhoto("fragrance")),
  },
  gastronomy: {
    eyebrow: "At the table",
    title: "Good taste is meant to be shared.",
    paragraphs: [
      "A beautiful setting, a thoughtfully prepared meal and a good glass of wine can turn an ordinary evening into something special.",
      "I appreciate gastronomy not only for its flavours, but also for the atmosphere, creativity and stories that surround it.",
    ],
    image: photo("gabrielle-lifestyle-wine-01", "A glass of wine at an intimate dinner"),
  },
  places: {
    eyebrow: "Places that inspire",
    title: "Some places stay with you.",
    paragraphs: [
      "From intimate restaurants and elegant hotels to beautiful cities and unexpected discoveries, I find inspiration in the places and experiences that make us feel something.",
      "A little collection of places I admire and experiences worth remembering.",
    ],
    image: photo("gabrielle-lifestyle-places-01", "An elegant hotel interior"),
    items: places.map(withPhoto("place")),
  },
  gestures: {
    eyebrow: "A little thought goes a long way",
    title: "It’s the thought that makes it special.",
    paragraphs: [
      "I appreciate the beauty of a thoughtful gesture.",
      "It could be a favourite fragrance, a beautiful book, flowers or something unexpected that reflects genuine attention.",
    ],
    highlight: "It is never about the gesture itself, but the consideration behind it.",
    image: photo("gabrielle-lifestyle-gestures-01", "Flowers and a handwritten note"),
  },
  wishlist: {
    eyebrow: "Little wishes",
    title: "Things I would love to discover.",
    paragraphs: [
      "A small collection of things that have caught my attention — objects, fragrances, experiences and little pleasures I would be delighted to discover.",
      "Sometimes the loveliest surprises are the ones chosen with a little thought.",
    ],
    items: wishlist.map(withPhoto("wishlist")),
  },
  closing: {
    eyebrow: "A little more to discover",
    title: "Every detail tells a story.",
    paragraphs: [
      "I hope you have enjoyed discovering some of the things that inspire me and make my world what it is.",
      "There is always more to discover, and I would be delighted to hear from you.",
    ],
    primaryCta: { label: "Get to Know Me", href: "/about" },
    secondaryCta: { label: "Book Me", href: "/book-me" },
    image: photo("gabrielle-lifestyle-closing", "Gabrielle, evening portrait"),
  },
} as const;

export type LifestyleCard = (typeof lifestyle.fragrances.items)[number];
