import { about } from "@/content/about";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function IntroductionSection() {
  const { introduction } = about;
  return (
    <section id="introduction" className="section scroll-mt-20 bg-warm-ivory text-obsidian">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <EditorialImage
          image={introduction.image}
          tone="warm"
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="aspect-[4/5] w-full lg:aspect-[5/6]"
        />
        <div className="max-w-lg" data-reveal>
          <SectionHeading eyebrow={introduction.eyebrow} title={introduction.title} tone="dark" />
          <Paragraphs items={introduction.paragraphs} className="mt-7 text-obsidian/75" />
        </div>
      </div>
    </section>
  );
}
