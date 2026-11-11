import type { Metadata } from "next";
import { bookMe } from "@/content/book-me";
import { getUpcomingTravels } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { formatRangeLong } from "@/lib/travels";
import { EnquiryForm, type CityOption } from "@/components/book-me/EnquiryForm";
import { FAQSection } from "@/components/book-me/FAQSection";
import { BackgroundMedia } from "@/components/ui/BackgroundMedia";
import { Paragraphs } from "@/components/ui/Paragraphs";

export const generateMetadata = (): Promise<Metadata> => pageMetadata({ ...bookMe.seo, path: "/book-me" });

// Cities follow the published travels.
export const revalidate = 3600;

export default async function BookMePage() {
  const { hero } = bookMe;
  const travels = await getUpcomingTravels();
  const cities: CityOption[] = travels.map((t) => ({
    id: t.id,
    label: t.city,
    startDate: t.startDate,
    endDate: t.endDate,
    range: formatRangeLong(t),
  }));

  return (
    <>
      {/* The whole enquiry lives in the hero, over the video */}
      <section className="relative isolate overflow-hidden">
        <BackgroundMedia image={hero.media} video={hero.media.video} priority />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-obsidian/70 via-obsidian/55 to-obsidian/85 lg:bg-gradient-to-r lg:from-obsidian/90 lg:via-obsidian/60 lg:to-obsidian/40" />
        <div className="container-site grid gap-12 py-14 lg:min-h-[calc(100svh-7.5rem)] lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16 lg:py-20">
          <div className="max-w-md">
            <p className="eyebrow text-champagne">{hero.eyebrow}</p>
            <h1 className="h1 mt-6 text-balance">{hero.title}</h1>
            <p className="mt-7 font-display text-2xl italic text-champagne">{hero.lead}</p>
            <Paragraphs items={hero.paragraphs} className="mt-4 text-warm-ivory/80 max-lg:sr-only" />
          </div>
          <EnquiryForm copy={bookMe.form} cities={cities} />
        </div>
      </section>
      <FAQSection />
    </>
  );
}
