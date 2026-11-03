import { travelsPage } from "@/content/travels-page";
import { Divider } from "@/components/ui/Divider";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function PhilosophySection() {
  const { philosophy } = travelsPage;
  return (
    <section className="section bg-warm-ivory text-obsidian">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="order-2 max-w-lg lg:order-1" data-reveal>
          <SectionHeading eyebrow={philosophy.eyebrow} title={<em className="font-light">{philosophy.title}</em>} tone="dark" />
          <Divider className="mt-10 max-w-40 text-muted-gold" />
          <Paragraphs items={philosophy.paragraphs} className="mt-10 text-obsidian/75" />
        </div>
        <EditorialImage
          image={philosophy.image}
          tone="warm"
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="order-1 aspect-[4/5] w-full lg:order-2"
        />
      </div>
    </section>
  );
}
