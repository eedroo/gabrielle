import Link from "next/link";
import { getUpcomingTravels } from "@/lib/data";
import { formatRangeShort } from "@/lib/travels";

/** Global rotating bar with published, upcoming destinations (from the backoffice). */
export async function TravelTicker() {
  const travels = await getUpcomingTravels();
  if (travels.length === 0) return null;

  const items = travels.map((t) => (
    <span key={t.id} className="inline-flex items-center gap-2 px-6">
      <span className="font-medium text-warm-ivory">{t.city}</span>
      <span className="text-champagne/80">·</span>
      <span>{formatRangeShort(t)}</span>
    </span>
  ));

  return (
    <Link
      href="/travels"
      aria-label={`Upcoming destinations: ${travels.map((t) => `${t.city}, ${formatRangeShort(t)}`).join("; ")}. View all travels.`}
      className="group block border-y border-warm-ivory/10 bg-obsidian text-[0.6875rem] uppercase tracking-[0.2em] text-soft-taupe"
    >
      <div className="relative flex h-10 items-center overflow-hidden" aria-hidden>
        <div className="animate-ticker flex w-max shrink-0 whitespace-nowrap group-hover:[animation-play-state:paused]">
          {/* Repeated so the loop is seamless; enough copies to fill wide screens */}
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className="inline-flex">{items}</span>
          ))}
        </div>
        <span className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-obsidian to-transparent" />
        <span className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-obsidian to-transparent" />
      </div>
    </Link>
  );
}
