import type { ReactNode } from "react";
import type { ImageContent } from "@/content/home";
import { Divider } from "@/components/ui/Divider";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  highlight?: string;
  image?: ImageContent;
  background: "ivory" | "obsidian" | "brown";
  imageSide?: "left" | "right";
  children?: ReactNode;
};

const backgrounds = { ivory: "bg-warm-ivory text-obsidian", obsidian: "bg-obsidian", brown: "bg-deep-brown" };

/** Editorial text block with an optional photo beside it and optional content below. */
export function SplitSection({ eyebrow, title, paragraphs, highlight, image, background, imageSide = "right", children }: Props) {
  const light = background === "ivory";
  return (
    <section className={`section ${backgrounds[background]}`}>
      <div className="container-site">
        <div className={`grid items-center gap-12 lg:gap-20 ${image ? "lg:grid-cols-2" : ""}`}>
          <div className={`max-w-lg ${image && imageSide === "left" ? "lg:order-2" : ""}`} data-reveal>
            <SectionHeading eyebrow={eyebrow} title={title} tone={light ? "dark" : "light"} />
            <Paragraphs items={paragraphs} className={`mt-7 ${light ? "text-obsidian/75" : "text-warm-ivory/70"}`} />
            {highlight && (
              <>
                <Divider className={`mt-10 max-w-40 ${light ? "text-muted-gold" : "text-champagne"}`} />
                <p className={`mt-8 font-display text-2xl italic leading-snug lg:text-3xl ${light ? "text-muted-gold" : "text-champagne"}`}>{highlight}</p>
              </>
            )}
          </div>
          {image && (
            <EditorialImage
              image={image}
              tone={light ? "warm" : "dark"}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className={`aspect-[4/5] w-full ${imageSide === "left" ? "lg:order-1" : ""}`}
            />
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
