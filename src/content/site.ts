/**
 * Global site settings.
 * `contact` and `social` are only defaults: the backoffice (Settings → Links)
 * overrides them when the database is connected. See src/lib/settings.ts.
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
    /** International format, digits only (e.g. 4915112345678) */
    whatsappNumber: "000000000", // TODO: official number
    email: "hello@example.com", // TODO: official email
  },
  social: {
    instagram: "https://instagram.com/username", // TODO
    onlyfans: "https://onlyfans.com/username", // TODO
    x: "https://x.com/username", // TODO
    /** Public Telegram channel (not a direct contact) */
    telegram: "https://t.me/channelname", // TODO
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

/**
 * WhatsApp links go through /whatsapp, which redirects to the number saved in
 * the backoffice — so changing the number updates every link at once.
 */
export const contactLinks = {
  whatsapp: (text?: string) => `/whatsapp${text ? `?text=${encodeURIComponent(text)}` : ""}`,
};

/** Links that leave the site (open in a new tab). */
export const isExternalHref = (href: string) => /^https?:\/\//.test(href) || href.startsWith("/whatsapp");
