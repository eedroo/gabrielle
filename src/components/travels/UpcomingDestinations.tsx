import Link from "next/link";
import { travelsPage } from "@/content/travels-page";
import type { Travel } from "@/lib/travels";
import { flagEmoji, formatRangeFull } from "@/lib/travels";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { ArrowRight } from "@/components/ui/Icons";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function UpcomingDestinations({ trips }: { trips: Travel[] }) {
  const { upcoming, fallbackCityImage } = travelsPage;
  return (
    <section id="upcoming" className="section scroll-mt-20 bg-obsidian">
      <div className="container-site">
        <div className="max-w-2xl" data-reveal>
          <SectionHeading eyebrow={upcoming.eyebrow} title={upcoming.title} />
          <Paragraphs items={upcoming.paragraphs} className="mt-7 text-warm-ivory/70" />
        </div>

        {trips.length === 0 ? (
          <p className="mt-12 font-display text-2xl italic text-champagne">{upcoming.emptyText}</p>
        ) : (
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <li key={trip.id} className="group flex flex-col border border-warm-ivory/10 bg-deep-brown/40" data-reveal>
                <EditorialImage
                  image={{ src: trip.image ?? fallbackCityImage.src, alt: `${trip.city}, ${trip.country}` }}
                  tone="warm"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[4/3] w-full"
                />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-3xl">{trip.city}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-soft-taupe">
                    <span aria-hidden>{flagEmoji(trip.countryCode)} </span>
                    {trip.country}
                  </p>
                  <p className="mt-5 flex-1 border-t border-warm-ivory/10 pt-5 text-sm text-warm-ivory/80">
                    {formatRangeFull(trip)}
                  </p>
                  <Link
                    href={`/book-me?city=${encodeURIComponent(trip.id)}#enquiry`}
                    aria-label={`${upcoming.cardCta} about ${trip.city}`}
                    className="mt-6 inline-flex min-h-12 items-center justify-center gap-3 border border-champagne/70 px-6 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-champagne transition hover:bg-champagne hover:text-obsidian"
                  >
                    {upcoming.cardCta}
                    <ArrowRight width={14} height={14} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
