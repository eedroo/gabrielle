import { home } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AboutPreview() {
  const { about } = home;
  return (
    <section id="about" className="section scroll-mt-20 bg-warm-ivory text-obsidian">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="order-2 max-w-lg lg:order-1" data-reveal>
          <SectionHeading eyebrow={about.eyebrow} title={about.title} tone="dark" />
          <Paragraphs items={about.paragraphs} className="mt-7 text-obsidian/75" />
          <Button href={about.cta.href} variant="outline-dark" className="mt-10">
            {about.cta.label}
          </Button>
        </div>
        <EditorialImage
          image={about.image}
          tone="warm"
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="order-1 aspect-[4/5] w-full lg:order-2 lg:aspect-[5/6]"
        />
      </div>
    </section>
  );
}
