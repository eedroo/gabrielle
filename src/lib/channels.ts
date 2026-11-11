/** A social or contact link, serialisable so server components can pass it to client ones. */
export type Channel = {
  key: "instagram" | "onlyfans" | "x" | "telegram" | "whatsapp" | "email";
  label: string;
  href: string;
};
