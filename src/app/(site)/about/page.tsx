import type { Metadata } from "next";
import { getTexts } from "@/lib/texts";
import { pageMetadata } from "@/lib/seo";
import { AboutHero } from "@/components/about/AboutHero";
import { IntroductionSection } from "@/components/about/IntroductionSection";
import { PersonalitySection } from "@/components/about/PersonalitySection";
import { AppreciateSection } from "@/components/about/AppreciateSection";
import { MyWorldSection } from "@/components/about/MyWorldSection";
import { ClosingCTA } from "@/components/shared/ClosingCTA";

export const generateMetadata = async (): Promise<Metadata> =>
  pageMetadata({ ...(await getTexts("about")).seo, path: "/about" });

export default async function AboutPage() {
  const about = await getTexts("about");
  return (
    <>
      <AboutHero />
      <IntroductionSection />
      <PersonalitySection />
      <AppreciateSection />
      <MyWorldSection />
      <ClosingCTA content={about.closing} />
    </>
  );
}
