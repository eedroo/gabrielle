import { about } from "@/content/about";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function MyWorldSection() {
  const { myWorld } = about;
  const [a, b] = myWorld.images;
  return (
    <section className="section bg-deep-brown">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div className="grid grid-cols-[1.2fr_1fr] items-end gap-3">
          <EditorialImage image={a} tone="warm" sizes="(min-width: 1024px) 30vw, 55vw" className="aspect-[3/4] w-full" />
          <EditorialImage image={b} sizes="(min-width: 1024px) 25vw, 45vw" className="mb-12 aspect-[4/5] w-full" />
        </div>
        <div className="max-w-lg" data-reveal>
          <SectionHeading eyebrow={myWorld.eyebrow} title={myWorld.title} />
          <Paragraphs items={myWorld.paragraphs} className="mt-7 text-warm-ivory/70" />
          <Button href={myWorld.cta.href} variant="outline-light" className="mt-10">
            {myWorld.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
