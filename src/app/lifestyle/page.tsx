import type { Metadata } from "next";
import { lifestyle } from "@/content/lifestyle";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/PageHero";
import { ClosingCTA } from "@/components/shared/ClosingCTA";
import { EditorialCards } from "@/components/lifestyle/EditorialCards";
import { SplitSection } from "@/components/lifestyle/SplitSection";

export const metadata: Metadata = pageMetadata({ ...lifestyle.seo, path: "/lifestyle" });

export default function LifestylePage() {
  const { introduction, fragrances, gastronomy, places, gestures, wishlist } = lifestyle;
  return (
    <>
      <PageHero {...lifestyle.hero} />
      <SplitSection {...introduction} background="ivory" imageSide="left" />
      <SplitSection {...fragrances} background="obsidian">
        <EditorialCards items={fragrances.items} tone="dark" />
      </SplitSection>
      <SplitSection {...gastronomy} background="ivory" imageSide="left" />
      <SplitSection {...places} background="brown">
        <EditorialCards items={places.items} tone="dark" />
      </SplitSection>
      <SplitSection {...gestures} background="ivory" imageSide="left" />
      <SplitSection {...wishlist} background="obsidian">
        <EditorialCards items={wishlist.items} tone="dark" numbered />
      </SplitSection>
      <ClosingCTA content={lifestyle.closing} />
    </>
  );
}
