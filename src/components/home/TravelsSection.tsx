import { home } from "@/content/home";
import { getCurrentTravel, getUpcomingTravels } from "@/lib/data";
import { flagEmoji, formatRangeLong } from "@/lib/travels";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Plane } from "@/components/ui/Icons";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function TravelsSection() {
  const { travels: copy } = home;
  const [current, upcoming] = await Promise.all([getCurrentTravel(), getUpcomingTravels()]);

  // Highlight the active trip; otherwise the next confirmed one. Never a city without valid data.
  const featured = current ?? upcoming[0] ?? null;
  const rest = upcoming.filter((t) => t.id !== featured?.id);

  return (
    <section className="section bg-warm-ivory text-obsidian">
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div className="max-w-lg" data-reveal>
          <SectionHeading eyebrow={copy.eyebrow} title={copy.title} tone="dark" />
          <Paragraphs items={copy.paragraphs} className="mt-7 text-obsidian/75" />

          {rest.length > 0 && (
            <div className="mt-10">
              <p className="eyebrow text-muted-gold">{copy.upcomingLabel}</p>
              <ul className="mt-4 divide-y divide-obsidian/10 border-y border-obsidian/10">
                {rest.map((t) => (
                  <li key={t.id} className="flex items-baseline justify-between gap-4 py-4">
                    <span className="font-display text-2xl">{t.city}</span>
                    <span className="text-sm text-obsidian/60">{formatRangeLong(t)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button href={copy.cta.href} variant="outline-dark" className="mt-10">
            {copy.cta.label}
          </Button>
        </div>

        <div className="relative">
          <EditorialImage
            image={featured?.image ? { src: featured.image, alt: `${featured.city} skyline` } : copy.image}
            tone="warm"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-[4/5] w-full lg:aspect-[5/6]"
          />
          <div className="absolute inset-x-4 bottom-4 border border-warm-ivory/15 bg-obsidian/85 p-6 text-warm-ivory backdrop-blur-sm sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-80">
            {featured ? (
              <>
                <p className="eyebrow text-champagne">{current ? copy.currentLabel : copy.nextLabel}</p>
                <p className="mt-3 font-display text-3xl">{featured.city}</p>
                <p className="text-sm text-soft-taupe">{featured.country}</p>
                <div className="mt-5 flex items-center justify-between border-t border-warm-ivory/10 pt-4 text-sm">
                  <span className="flex items-center gap-2">
                    <span aria-hidden>{flagEmoji(featured.countryCode)}</span>
                    {formatRangeLong(featured)}
                  </span>
                  <Plane width={16} height={16} className="text-champagne" />
                </div>
              </>
            ) : (
              <p className="font-display text-2xl">{copy.emptyText}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
