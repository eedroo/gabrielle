import type { Metadata } from "next";
import { about } from "@/content/about";
import { pageMetadata } from "@/lib/seo";
import { AboutHero } from "@/components/about/AboutHero";
import { IntroductionSection } from "@/components/about/IntroductionSection";
import { PersonalitySection } from "@/components/about/PersonalitySection";
import { AppreciateSection } from "@/components/about/AppreciateSection";
import { MyWorldSection } from "@/components/about/MyWorldSection";
import { ClosingCTA } from "@/components/shared/ClosingCTA";

export const generateMetadata = (): Promise<Metadata> => pageMetadata({ ...about.seo, path: "/about" });

export default function AboutPage() {
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
