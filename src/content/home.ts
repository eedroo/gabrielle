import { resolveImage } from "@/lib/images";

/** Photo by SEO file name (see docs/IMAGES.md) + descriptive alt text. */
const img = (name: string, alt: string) => ({ src: resolveImage(name), alt });

/**
 * Homepage copy — V1.1
 * Editorial direction: Sophisticated · Elegant · Intimate · Timeless
 *
 * Images: upload the files listed in docs/IMAGES.md to /public/images.
 * While a file is missing an on-brand placeholder is rendered.
 */
export const home = {
  hero: {
    eyebrow: "Independent High Class Companion",
    title: "The beauty of a genuine connection.",
    text: "An appreciation for meaningful encounters, thoughtful conversations and the beauty of shared experiences. A curious spirit, an open mind and a presence that feels entirely her own.",
    primaryCta: { label: "Book Me", href: "/book-me" },
    secondaryCta: { label: "Discover My World", href: "#about" },
    image: img("gabrielle-independent-companion-hero", "Gabrielle in soft evening light"),
  },
  about: {
    eyebrow: "A little about me",
    title: "Beyond first impressions.",
    paragraphs: [
      "There is always more to discover beyond a first impression.",
      "Curious by nature and drawn to the beauty of everyday details, I appreciate genuine conversation, unexpected laughter and the kind of chemistry that cannot be planned.",
      "I believe that the most memorable moments are often found in the simplest things: a shared thought, a beautiful setting or the pleasure of being fully present.",
    ],
    cta: { label: "Get to Know Me", href: "/about" },
    image: img("gabrielle-about-portrait-01", "Portrait of Gabrielle by the window"),
  },
  gallery: {
    eyebrow: "A glimpse into my world",
    title: "An expression of femininity.",
    paragraphs: [
      "A collection of moments, moods and expressions.",
      "Each photograph reveals a different side of my personality — sometimes delicate, sometimes playful, always authentic. A visual diary of femininity, confidence and individuality.",
    ],
    cta: { label: "Explore the Gallery", href: "/gallery" },
    images: [
      img("gabrielle-editorial-portrait-01", "Gabrielle, editorial portrait"),
      img("gabrielle-editorial-portrait-02", "Gabrielle, editorial photoshoot"),
      img("gabrielle-editorial-portrait-03", "Gabrielle, black and white portrait"),
      img("gabrielle-editorial-portrait-04", "Gabrielle, intimate evening portrait"),
      img("gabrielle-editorial-portrait-05", "Gabrielle, elegant detail"),
    ],
  },
  connection: {
    eyebrow: "The art of connection",
    title: "Some things are better felt than described.",
    paragraphs: [
      "I am drawn to people with stories to tell, places that inspire and conversations that flow effortlessly.",
      "I value kindness, curiosity, humour and the little gestures that make an encounter feel personal. For me, connection is not something to define, but something to experience.",
    ],
  },
  lifestyle: {
    eyebrow: "Little things I love",
    title: "A world of my own.",
    paragraphs: [
      "A few of the things that make life beautiful.",
      "From favourite fragrances and a good glass of wine to inspiring places, thoughtful gestures and the pleasure of discovering something new.",
      "An intimate glimpse into the details, tastes and experiences that shape my world.",
    ],
    cta: { label: "Explore My Personal Notes", href: "/lifestyle" },
    images: [
      img("gabrielle-lifestyle-fragrance-01", "A favourite fragrance"),
      img("gabrielle-lifestyle-wine-01", "A glass of wine at dinner"),
      img("gabrielle-lifestyle-places-01", "An inspiring place"),
    ],
  },
  travels: {
    eyebrow: "On the move",
    title: "Perhaps our paths will cross.",
    paragraphs: [
      "I enjoy discovering new places as much as returning to cities that feel familiar.",
      "Here you can find a glimpse of my upcoming travels and the places where our paths might cross.",
    ],
    currentLabel: "Current destination",
    nextLabel: "Next destination",
    upcomingLabel: "Upcoming destinations",
    emptyText: "New destinations will be announced soon.",
    cta: { label: "View All Destinations", href: "/travels" },
    image: img("gabrielle-travels-city-skyline", "City skyline at dusk"),
  },
  social: {
    eyebrow: "Stay connected",
    title: "A little more of me.",
    paragraphs: [
      "This website is a personal introduction — a place to discover more about who I am and what I appreciate.",
      "For a closer look into my world, you are welcome to follow my official social channels.",
    ],
  },
  booking: {
    eyebrow: "Your next chapter begins here",
    title: "Let’s make time for something memorable.",
    paragraphs: [
      "Whether you are planning ahead or simply curious about my availability, I would be delighted to hear from you.",
      "Tell me a little about yourself, when you have in mind and the kind of experience you are looking forward to.",
      "I look forward to hearing from you.",
    ],
    primaryCta: { label: "Book Me", href: "/book-me" },
    secondaryCta: { label: "Get in Touch", href: "/book-me#contact" },
    image: img("gabrielle-book-me-portrait-01", "Gabrielle, evening portrait"),
  },
} as const;

export type ImageContent = { readonly src: string | null; readonly alt: string };
