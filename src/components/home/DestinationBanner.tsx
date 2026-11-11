import { home } from "@/content/home";
import { getCurrentTravel, getUpcomingTravels } from "@/lib/data";
import { formatRangeLong } from "@/lib/travels";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";

/** Slim banner with the current (or next) destination's city photo. */
export async function DestinationBanner() {
  const { destinationBanner: copy, travels } = home;
  const [current, upcoming] = await Promise.all([getCurrentTravel(), getUpcomingTravels()]);
  const trip = current ?? upcoming[0] ?? null;

  const image = trip ? { src: trip.image ?? travels.image.src, alt: `${trip.city}, ${trip.country}` } : travels.image;
  const href = trip ? `${copy.cta.href}?city=${encodeURIComponent(trip.id)}#enquiry` : copy.cta.href;

  return (
    <section className="relative isolate overflow-hidden">
      <EditorialImage image={image} tone="warm" sizes="100vw" className="absolute inset-0 -z-20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-obsidian/90 via-obsidian/70 to-obsidian/40" />
      <div className="container-site flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between lg:py-16" data-reveal>
        <div className="max-w-2xl">
          {trip && (
            <p className="eyebrow text-champagne">
              {current ? copy.currentLabel : copy.nextLabel} · {trip.city} · {formatRangeLong(trip)}
            </p>
          )}
          <h2 className="mt-4 font-display text-3xl leading-tight text-balance sm:text-4xl">{copy.title}</h2>
        </div>
        <Button href={href} className="shrink-0 self-start md:self-auto">
          {copy.cta.label}
        </Button>
      </div>
    </section>
  );
}
