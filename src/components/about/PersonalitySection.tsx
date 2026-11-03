import { about } from "@/content/about";
import { Divider } from "@/components/ui/Divider";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function PersonalitySection() {
  const { personality } = about;
  return (
    <section className="section bg-obsidian">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div className="order-2 max-w-lg lg:order-1" data-reveal>
          <SectionHeading eyebrow={personality.eyebrow} title={personality.title} />
          <Paragraphs items={personality.paragraphs} className="mt-7 text-warm-ivory/70" />
          <Divider className="mt-10 max-w-40 text-champagne" />
          <p className="mt-8 font-display text-2xl italic leading-snug text-champagne lg:text-3xl">
            {personality.highlight}
          </p>
        </div>
        <EditorialImage
          image={personality.image}
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="order-1 aspect-[3/4] w-full lg:order-2"
        />
      </div>
    </section>
  );
}
