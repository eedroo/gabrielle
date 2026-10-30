/**
 * Global site settings.
 * In phase 2 these values move to the backoffice (Supabase) — keep the shape.
 * Links marked TODO must be replaced with the official, validated URLs before launch.
 */
export const site = {
  name: "Gabrielle",
  signature: "The beauty of a genuine connection.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  seo: {
    title: "Gabrielle | Independent High Class Companion",
    description:
      "Discover Gabrielle, an independent high class companion. Explore her world, photography, lifestyle and upcoming destinations.",
  },
  contact: {
    whatsapp: "https://wa.me/000000000", // TODO: official number
    telegram: "https://t.me/username", // TODO: official handle
    email: "mailto:hello@example.com", // TODO: official email
  },
  social: {
    instagram: "https://instagram.com/username", // TODO
    onlyfans: "https://onlyfans.com/username", // TODO
    x: "https://x.com/username", // TODO
  },
} as const;

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Travels", href: "/travels" },
  { label: "Lifestyle", href: "/lifestyle" },
  { label: "Book Me", href: "/book-me" },
] as const;

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
] as const;
