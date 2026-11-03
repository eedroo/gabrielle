import type { Metadata } from "next";
import { travelsPage } from "@/content/travels-page";
import { getCurrentTravel, getUpcomingTravels } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/PageHero";
import { ClosingCTA } from "@/components/shared/ClosingCTA";
import { CurrentDestination } from "@/components/travels/CurrentDestination";
import { UpcomingDestinations } from "@/components/travels/UpcomingDestinations";
import { PhilosophySection } from "@/components/travels/PhilosophySection";
import { OtherDestinations } from "@/components/travels/OtherDestinations";

export const metadata: Metadata = pageMetadata({ ...travelsPage.seo, path: "/travels" });

// Re-render hourly so the current destination follows the calendar.
export const revalidate = 3600;

export default async function TravelsPage() {
  const [current, upcoming] = await Promise.all([getCurrentTravel(), getUpcomingTravels()]);
  const next = upcoming.filter((t) => t.id !== current?.id);

  return (
    <>
      <PageHero {...travelsPage.hero} />
      {current && <CurrentDestination trip={current} />}
      <UpcomingDestinations trips={next} />
      <PhilosophySection />
      <OtherDestinations />
      <ClosingCTA content={travelsPage.closing} />
    </>
  );
}
