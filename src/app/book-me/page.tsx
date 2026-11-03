import type { Metadata } from "next";
import { bookMe } from "@/content/book-me";
import { getUpcomingTravels } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { formatRangeLong } from "@/lib/travels";
import { BookMeHero } from "@/components/book-me/BookMeHero";
import { BeforeSection } from "@/components/book-me/BeforeSection";
import { EnquiryForm, type CityOption } from "@/components/book-me/EnquiryForm";
import { ImportantSection } from "@/components/book-me/ImportantSection";
import { FAQSection } from "@/components/book-me/FAQSection";
import { ClosingCTA } from "@/components/shared/ClosingCTA";

export const metadata: Metadata = pageMetadata({ ...bookMe.seo, path: "/book-me" });

// Cities follow the published travels.
export const revalidate = 3600;

export default async function BookMePage() {
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
      <BookMeHero />
      <BeforeSection />
      <div className="bg-warm-ivory py-[var(--section-spacing)] text-obsidian">
        <div className="container-site max-w-4xl">
          <EnquiryForm copy={bookMe.form} cities={cities} />
        </div>
      </div>
      <ImportantSection />
      <FAQSection />
      <ClosingCTA content={bookMe.closing} />
    </>
  );
}
