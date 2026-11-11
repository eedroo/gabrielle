import { HeroSection } from "@/components/home/HeroSection";
import { AboutPreview } from "@/components/home/AboutPreview";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { ConnectionSection } from "@/components/home/ConnectionSection";
import { LifestylePreview } from "@/components/home/LifestylePreview";
import { TravelsSection } from "@/components/home/TravelsSection";
import { SocialSection } from "@/components/home/SocialSection";
import { BookingCTA } from "@/components/home/BookingCTA";
import { DestinationBanner } from "@/components/home/DestinationBanner";
import { OccasionSection } from "@/components/home/OccasionSection";
import type { Metadata } from "next";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = (): Promise<Metadata> => pageMetadata({ ...site.seo, path: "/" });

// Re-render hourly so "current destination" and the ticker follow the calendar.
export const revalidate = 3600;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  description: site.seo.description,
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSection />
      <AboutPreview />
      <DestinationBanner />
      <OccasionSection />
      <GalleryPreview />
      <ConnectionSection />
      <SocialSection />
      <BookingCTA />
      <TravelsSection />
      <LifestylePreview />
    </>
  );
}
