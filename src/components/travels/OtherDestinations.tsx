import { travelsPage } from "@/content/travels-page";
import { Button } from "@/components/ui/Button";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function OtherDestinations() {
  const { other } = travelsPage;
  return (
    <section className="section bg-deep-brown">
      <div className="container-site max-w-3xl text-center" data-reveal>
        <SectionHeading eyebrow={other.eyebrow} title={other.title} align="center" />
        <Paragraphs items={other.paragraphs} className="mx-auto mt-8 max-w-xl text-warm-ivory/70" />
        <Button href={other.cta.href} variant="outline-light" className="mt-10">
          {other.cta.label}
        </Button>
      </div>
    </section>
  );
}
