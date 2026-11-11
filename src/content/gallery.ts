import { home } from "@/content/home";
import { getGalleryPhotos } from "@/lib/data";
import { listImages, photo } from "@/lib/images";

/**
 * Gallery page copy — V1
 * Editorial direction: Minimalist · Feminine · Sophisticated · Authentic
 *
 * Collections come from the backoffice (Gallery). Before any upload there,
 * they fill themselves from /public/images (gabrielle-gallery-<collection>-01,
 * -02, …). A collection without photos is not shown.
 */
export const collectionDefs = [
  { id: "editorial", label: "Editorial" },
  { id: "portraits", label: "Portraits" },
  { id: "moments", label: "Moments" },
  { id: "lifestyle", label: "Lifestyle" },
] as const;

export type GalleryPhoto = { src: string; alt: string; collection: string };

export async function getGalleryCollections() {
  const uploaded = await getGalleryPhotos();
  const collections = collectionDefs
    .map((c) => ({
      ...c,
      photos:
        uploaded.length > 0
          ? uploaded.filter((p) => p.collection === c.id).map((p): GalleryPhoto => ({ src: p.url, alt: p.alt, collection: c.id }))
          : listImages(`gabrielle-gallery-${c.id}`).map(
              (src, i): GalleryPhoto => ({ src, alt: `Gabrielle — ${c.label.toLowerCase()} photograph ${i + 1}`, collection: c.id }),
            ),
    }))
    .filter((c) => c.photos.length > 0);
  if (collections.length > 0) return collections;

  // No gallery uploads yet: show the homepage editorial selection instead of an empty page.
  const photos = home.gallery.images
    .flatMap((img): GalleryPhoto[] => (img.src ? [{ src: img.src, alt: img.alt, collection: "editorial" }] : []));
  return photos.length > 0 ? [{ ...collectionDefs[0], photos }] : [];
}

export const gallery = {
  seo: {
    title: "Gallery | Gabrielle — Independent High Class Companion",
    description:
      "Explore Gabrielle's personal gallery, featuring editorial portraits, feminine expressions and selected moments from her world.",
  },
  hero: {
    eyebrow: "The gallery",
    title: "A collection of moments.",
    paragraphs: [
      "A visual expression of my world, captured through different moments, moods and perspectives.",
      "An invitation to discover a little more of me, beyond words.",
    ],
    image: photo("gabrielle-gallery-hero", "Gabrielle, editorial portrait in warm evening light"),
  },
  introduction: {
    eyebrow: "Through my lens",
    title: "Different moods. One personality.",
    paragraphs: [
      "Every photograph tells a small part of a story.",
      "Some capture a mood, others a feeling or a particular moment in time. Together, they offer a glimpse into the different sides of my personality.",
    ],
  },
  collections: {
    title: "A closer look.",
    allLabel: "All",
  },
  closing: {
    eyebrow: "Beyond the frame",
    title: "There is always more to discover.",
    paragraphs: [
      "Photography captures a moment, but never the whole story.",
      "If you would like to know more about me, I would be delighted to hear from you.",
    ],
    primaryCta: { label: "Get to Know Me", href: "/about" },
    secondaryCta: { label: "Book Me", href: "/book-me" },
    image: photo("gabrielle-gallery-closing", "Gabrielle, portrait by candlelight"),
  },
} as const;
