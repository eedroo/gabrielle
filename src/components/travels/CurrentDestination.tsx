import { travelsPage } from "@/content/travels-page";
import type { Travel } from "@/lib/travels";
import { cityImage, flagEmoji, formatRangeFull } from "@/lib/travels";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Only rendered when today falls inside a published trip. */
export function CurrentDestination({ trip }: { trip: Travel }) {
  const { current, fallbackCityImage } = travelsPage;
  const image = cityImage(trip, fallbackCityImage);
  return (
    <section className="section bg-warm-ivory text-obsidian">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <EditorialImage image={image} tone="warm" sizes="(min-width: 1024px) 55vw, 100vw" className="aspect-[4/3] w-full" />
        <div className="max-w-lg" data-reveal>
          <SectionHeading eyebrow={current.eyebrow} title={current.title.replace("{city}", trip.city)} tone="dark" />
          <div className="mt-8 border-y border-obsidian/10 py-6">
            <p className="font-display text-4xl">{trip.city}</p>
            <p className="mt-1 text-sm uppercase tracking-[0.2em] text-obsidian/55">
              <span aria-hidden>{flagEmoji(trip.countryCode)} </span>
              {trip.country}
            </p>
            <p className="mt-4 text-obsidian/75">{formatRangeFull(trip)}</p>
          </div>
          <p className="body-copy mt-6 text-obsidian/70">{current.text}</p>
          <Button href={current.cta.href} variant="dark" className="mt-10">
            {current.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
