import { home } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function BookingCTA() {
  const { booking } = home;
  return (
    <section className="relative isolate overflow-hidden">
      <EditorialImage image={booking.image} className="absolute inset-0 -z-20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian via-obsidian/75 to-obsidian/30 lg:bg-gradient-to-l lg:from-obsidian/95 lg:via-obsidian/70 lg:to-transparent" />
      <div className="container-site flex min-h-[640px] items-end py-[var(--section-spacing)] lg:items-center lg:justify-end">
        <div className="max-w-lg" data-reveal>
          <SectionHeading eyebrow={booking.eyebrow} title={booking.title} />
          <Paragraphs items={booking.paragraphs} className="mt-7 text-warm-ivory/75" />
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href={booking.primaryCta.href}>{booking.primaryCta.label}</Button>
            <Button href={booking.secondaryCta.href} variant="outline-light">
              {booking.secondaryCta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
