import type { Metadata } from "next";
import { site } from "@/content/site";
import { resolveImage } from "@/lib/images";
import { getMediaOverrides } from "@/lib/media-slots";

/** Full metadata for a page. Next replaces (not merges) openGraph per page, so build it whole. */
export async function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Promise<Metadata> {
  // Share image: the one saved in the backoffice, else the file in /public/images.
  const ogImage = (await getMediaOverrides()).get("gabrielle-og-image")?.image_url || resolveImage("gabrielle-og-image");
  const ogImages = ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: site.seo.title }] : undefined;
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
