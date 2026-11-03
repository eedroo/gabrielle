import type { Metadata } from "next";
import { site } from "@/content/site";
import { resolveImage } from "@/lib/images";

const ogImage = resolveImage("gabrielle-og-image");
const ogImages = ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: site.seo.title }] : undefined;

/** Full metadata for a page. Next replaces (not merges) openGraph per page, so build it whole. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_GB",
      url: path,
      title,
      description,
      images: ogImages,
    },
    twitter: { card: "summary_large_image", title, description, images: ogImage ? [ogImage] : undefined },
  };
}
