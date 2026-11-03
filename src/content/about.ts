import { photo } from "@/lib/images";

/**
 * About page copy — V1
 * Editorial direction: Sophisticated · Feminine · Authentic · Intimate
 *
 * Images: upload the files listed in docs/IMAGES.md to /public/images.
 */
export const about = {
  seo: {
    title: "About Gabrielle | Independent High Class Companion",
    description:
      "Get to know Gabrielle beyond the photographs. Discover her personality, interests, appreciation for travel and passion for genuine connections.",
  },
  hero: {
    eyebrow: "A little about me",
    title: "A woman beyond the photographs.",
    paragraphs: [
      "I believe that the most beautiful connections begin with curiosity — a genuine interest in discovering another person, sharing perspectives and enjoying the moments that unfold naturally.",
    ],
    signature: "I am Gabrielle. Welcome to my world.",
    cta: { label: "Discover My World", href: "#introduction" },
    image: photo("gabrielle-about-hero", "Gabrielle, portrait in warm natural light"),
  },
  introduction: {
    eyebrow: "Getting to know me",
    title: "A curious mind, an open heart.",
    paragraphs: [
      "I would describe myself as easy-going, curious and naturally drawn to the beauty of life’s little details.",
      "I enjoy discovering new places, experiencing different cultures and meeting people whose perspectives bring something unexpected to a conversation.",
      "I appreciate elegance, but never at the expense of authenticity. I value a good sense of humour, kindness, confidence and the ability to make others feel comfortable.",
      "For me, a meaningful encounter is never just about where you are or what you do. It is about the atmosphere you create together.",
    ],
    image: photo("gabrielle-about-portrait-02", "Gabrielle, relaxed and smiling portrait"),
  },
  personality: {
    eyebrow: "Beyond first impressions",
    title: "Naturally curious. Genuinely present.",
    paragraphs: [
      "I enjoy conversations that move effortlessly from light-hearted moments to more thoughtful subjects.",
      "I appreciate spontaneity, a little playfulness and the freedom to be yourself without expectations.",
      "There is something special about meeting someone with whom time seems to pass differently — where conversation feels natural, laughter comes easily and every moment has room to unfold.",
    ],
    highlight: "I believe that genuine chemistry is found in these little details.",
    image: photo("gabrielle-about-personality-01", "Gabrielle in an elegant evening setting"),
  },
  appreciate: {
    eyebrow: "The things that matter",
    title: "Beauty is in the details.",
    intro: "A few things I particularly appreciate:",
    items: [
      {
        title: "Meaningful conversations",
        text: "Exchanging ideas, stories and perspectives with someone who is genuinely interested.",
      },
      {
        title: "Beautiful surroundings",
        text: "Places with character, thoughtful interiors, intimate restaurants and destinations worth discovering.",
      },
      {
        title: "Thoughtful gestures",
        text: "The little details that show consideration and make an experience feel personal.",
      },
      {
        title: "Spontaneous moments",
        text: "Unexpected discoveries, shared laughter and plans that take an interesting turn.",
      },
      {
        title: "Authenticity",
        text: "Kindness, honesty and the freedom to be comfortable in one’s own presence.",
      },
    ],
    image: photo("gabrielle-about-details-01", "Gabrielle, close-up editorial detail"),
  },
  myWorld: {
    eyebrow: "A few of my favourite things",
    title: "A life shaped by curiosity.",
    paragraphs: [
      "I find inspiration in many places: the atmosphere of a beautiful city, the character of a fragrance, a memorable dinner or the simple pleasure of discovering somewhere new.",
      "Travel, culture, gastronomy, wine and the little rituals of everyday life all have a place in my world.",
      "I enjoy collecting experiences rather than simply ticking places off a list.",
    ],
    cta: { label: "Explore My Lifestyle", href: "/lifestyle" },
    images: [
      photo("gabrielle-about-my-world-01", "Gabrielle exploring a beautiful city"),
      photo("gabrielle-about-my-world-02", "A memorable dinner with a glass of wine"),
    ],
  },
  closing: {
    eyebrow: "A personal invitation",
    title: "Every connection has its own story.",
    paragraphs: [
      "Perhaps we share an appreciation for beautiful places, thoughtful conversation or simply the pleasure of good company.",
      "Whatever brings you here, I invite you to introduce yourself and tell me a little about what you have in mind.",
      "I look forward to discovering where our paths might cross.",
    ],
    primaryCta: { label: "Book Me", href: "/book-me" },
    secondaryCta: { label: "View My Gallery", href: "/gallery" },
    image: photo("gabrielle-about-closing", "Gabrielle, evening portrait"),
  },
} as const;
