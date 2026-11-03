import type { ReactNode } from "react";
import type { ImageContent } from "@/content/home";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Paragraphs } from "@/components/ui/Paragraphs";

type Props = {
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  image: ImageContent;
  children?: ReactNode;
};

/** Photographic page hero with the page H1. */
export function PageHero({ eyebrow, title, paragraphs, image, children }: Props) {
  return (
    <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden lg:min-h-[min(72vh,700px)] lg:items-center">
      <EditorialImage image={image} priority className="absolute inset-0 -z-20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent lg:bg-gradient-to-r lg:from-obsidian/90 lg:via-obsidian/40" />
      <div className="container-site pb-16 pt-36 lg:py-24">
        <div className="max-w-xl" data-reveal>
          <p className="eyebrow text-champagne">{eyebrow}</p>
          <h1 className="h1 mt-6 text-balance">{title}</h1>
          <Paragraphs items={paragraphs} className="mt-7 max-w-md text-warm-ivory/80" />
          {children}
        </div>
      </div>
    </section>
  );
}
