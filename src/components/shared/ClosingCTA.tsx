import type { ImageContent } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Cta = { readonly label: string; readonly href: string };

type Props = {
  content: {
    eyebrow: string;
    title: string;
    paragraphs: readonly string[];
    primaryCta: Cta;
    secondaryCta: Cta;
    image: ImageContent;
  };
};

/** Full-bleed photographic closing block with the final Book Me call to action. */
export function ClosingCTA({ content }: Props) {
  return (
    <section className="relative isolate overflow-hidden">
      <EditorialImage image={content.image} className="absolute inset-0 -z-20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian via-obsidian/75 to-obsidian/30 lg:bg-gradient-to-l lg:from-obsidian/95 lg:via-obsidian/70 lg:to-transparent" />
      <div className="container-site flex min-h-[640px] items-end py-[var(--section-spacing)] lg:items-center lg:justify-end">
        <div className="max-w-lg" data-reveal>
          <SectionHeading eyebrow={content.eyebrow} title={content.title} />
          <Paragraphs items={content.paragraphs} className="mt-7 text-warm-ivory/75" />
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href={content.primaryCta.href}>{content.primaryCta.label}</Button>
            <Button href={content.secondaryCta.href} variant="outline-light">
              {content.secondaryCta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
