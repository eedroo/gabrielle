import type { Metadata } from "next";
import { privacyPolicy } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";
import { LegalPageView } from "@/components/legal/LegalPageView";

export const generateMetadata = (): Promise<Metadata> =>
  pageMetadata({ title: privacyPolicy.seoTitle, description: privacyPolicy.description, path: privacyPolicy.path });

export default function Page() {
  return <LegalPageView page={privacyPolicy} />;
}
