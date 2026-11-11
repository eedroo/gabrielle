import Image from "next/image";
import type { LifestyleCard } from "@/lib/data";

type Props = { items: readonly LifestyleCard[]; tone?: "light" | "dark"; numbered?: boolean };

/** Fragrance, place and wishlist cards. The photo is optional per card. */
export function EditorialCards({ items, tone = "light", numbered }: Props) {
  if (items.length === 0) return null;
  const dark = tone === "dark";
  return (
    <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <li
          key={item.id}
          data-reveal
          className={`flex flex-col border ${dark ? "border-warm-ivory/10 bg-deep-brown/40" : "border-obsidian/10 bg-white/40"}`}
        >
          {item.image && (
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image src={item.image} alt={`${item.title}, ${item.subtitle}`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            </div>
          )}
          <div className="flex flex-1 flex-col p-7">
            {numbered && (
              <span className={`font-display text-lg ${dark ? "text-champagne" : "text-muted-gold"}`} aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
            )}
            <h3 className="mt-2 font-display text-3xl">{item.title}</h3>
            <p className={`mt-1 text-xs uppercase tracking-[0.2em] ${dark ? "text-soft-taupe" : "text-obsidian/55"}`}>{item.subtitle}</p>
            {item.note && (
              <p className={`mt-5 border-t pt-5 font-display text-lg italic ${dark ? "border-warm-ivory/10 text-warm-ivory/80" : "border-obsidian/10 text-obsidian/75"}`}>
                {item.note}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
