import { home } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function LifestylePreview() {
  const { lifestyle } = home;
  const [a, b, c] = lifestyle.images;
  return (
    <section className="section bg-deep-brown">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div className="max-w-lg" data-reveal>
          <SectionHeading eyebrow={lifestyle.eyebrow} title={lifestyle.title} />
          <Paragraphs items={lifestyle.paragraphs} className="mt-7 text-warm-ivory/70" />
          <Button href={lifestyle.cta.href} variant="outline-light" className="mt-10">
            {lifestyle.cta.label}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <EditorialImage image={a} tone="warm" sizes="(min-width: 1024px) 25vw, 50vw" className="row-span-2 aspect-[3/5] h-full w-full" />
          <EditorialImage image={b} sizes="(min-width: 1024px) 25vw, 50vw" className="aspect-square w-full" />
          <EditorialImage image={c} tone="warm" sizes="(min-width: 1024px) 25vw, 50vw" className="aspect-square w-full" />
        </div>
      </div>
    </section>
  );
}
