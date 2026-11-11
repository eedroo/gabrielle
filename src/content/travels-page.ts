import { photo } from "@/lib/images";

/**
 * Travels page copy — V1
 * Editorial direction: Cosmopolitan · Sophisticated · Travel-inspired · Personal
 * Destinations themselves come from the travels data (backoffice in phase 2).
 */
export const travelsPage = {
  seo: {
    title: "Travels & Upcoming Destinations | Gabrielle",
    description:
      "Discover Gabrielle's upcoming travel destinations and find out where your paths might cross next.",
  },
  hero: {
    eyebrow: "Places & journeys",
    title: "The world is more beautiful when explored.",
    paragraphs: [
      "I have always enjoyed the feeling of discovering somewhere new — different streets, unfamiliar places, new perspectives and the little details that make every destination unique.",
      "Here you can discover where my travels may take me next.",
    ],
    image: photo("gabrielle-travels-hero", "Gabrielle travelling, looking over a European city"),
  },
  current: {
    eyebrow: "Currently exploring",
    /** {city} is replaced with the current destination */
    title: "A moment in {city}.",
    text: "A little glimpse of where I am at the moment.",
    cta: { label: "Get in Touch", href: "/book-me" },
  },
  upcoming: {
    eyebrow: "Where to next?",
    title: "Perhaps our paths will cross.",
    paragraphs: [
      "Some places invite you to return, while others are waiting to be discovered.",
      "Here are the destinations currently on my travel calendar. If you happen to be nearby, I would be happy to hear from you.",
    ],
    cardCta: "Enquire",
    emptyText: "New destinations will be announced soon.",
  },
  philosophy: {
    eyebrow: "The joy of discovery",
    title: "Every destination has its own story.",
    paragraphs: [
      "I love the character of different cities, the atmosphere of their streets, beautiful architecture and the experiences that make a place memorable.",
      "Whether it is a familiar destination or somewhere entirely new, every journey brings something different.",
    ],
    image: photo("gabrielle-travels-philosophy", "Gabrielle walking through historic city streets"),
  },
  other: {
    eyebrow: "Somewhere else in mind?",
    title: "Not every journey is already on the map.",
    paragraphs: [
      "If you have a particular destination in mind, feel free to get in touch.",
      "I am always open to discussing travel possibilities and exploring where our plans might meet.",
    ],
    cta: { label: "Get in Touch", href: "/book-me" },
  },
  closing: {
    eyebrow: "When our paths cross",
    title: "Make a moment of it.",
    paragraphs: [
      "If you are interested in meeting during one of my upcoming travels, I invite you to introduce yourself and share your plans.",
      "I look forward to hearing from you.",
    ],
    primaryCta: { label: "Book Me", href: "/book-me" },
    secondaryCta: { label: "View My Lifestyle", href: "/lifestyle" },
    image: photo("gabrielle-travels-closing", "Gabrielle, evening portrait by the window"),
  },
  /** Used on cards for cities without their own photo (gabrielle-travels-<city>) */
  fallbackCityImage: photo("gabrielle-travels-city-skyline", "City skyline at dusk"),
} as const;
