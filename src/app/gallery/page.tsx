import type { Metadata } from "next";
import { gallery, getGalleryCollections } from "@/content/gallery";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/PageHero";
import { ClosingCTA } from "@/components/shared/ClosingCTA";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = pageMetadata({ ...gallery.seo, path: "/gallery" });

export default function GalleryPage() {
  const collections = getGalleryCollections();
  return (
    <>
      <PageHero {...gallery.hero} />
      <section className="section bg-warm-ivory text-obsidian">
        <div className="container-site max-w-3xl text-center" data-reveal>
          <SectionHeading eyebrow={gallery.introduction.eyebrow} title={gallery.introduction.title} tone="dark" align="center" />
          <Paragraphs items={gallery.introduction.paragraphs} className="mx-auto mt-8 max-w-xl text-obsidian/75" />
        </div>
      </section>
      {collections.length > 0 && (
        <section className="section bg-obsidian">
          <div className="container-site">
            <h2 className="h2">{gallery.collections.title}</h2>
            <GalleryGrid collections={collections} allLabel={gallery.collections.allLabel} />
          </div>
        </section>
      )}
      <ClosingCTA content={gallery.closing} />
    </>
  );
}
