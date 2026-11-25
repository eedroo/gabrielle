import type { Metadata } from "next";
import { getTexts } from "@/lib/texts";
import { getCurrentTravel, getUpcomingTravels } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/PageHero";
import { ClosingCTA } from "@/components/shared/ClosingCTA";
import { CurrentDestination } from "@/components/travels/CurrentDestination";
import { UpcomingDestinations } from "@/components/travels/UpcomingDestinations";
import { PhilosophySection } from "@/components/travels/PhilosophySection";
import { OtherDestinations } from "@/components/travels/OtherDestinations";

export const generateMetadata = async (): Promise<Metadata> =>
  pageMetadata({ ...(await getTexts("travels")).seo, path: "/travels" });

// Re-render hourly so the current destination follows the calendar.
export const revalidate = 3600;

export default async function TravelsPage() {
  const travelsPage = await getTexts("travels");
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
