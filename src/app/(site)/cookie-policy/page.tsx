import type { Metadata } from "next";
import { cookiePolicy } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";
import { LegalPageView } from "@/components/legal/LegalPageView";

export const generateMetadata = (): Promise<Metadata> =>
  pageMetadata({ title: cookiePolicy.seoTitle, description: cookiePolicy.description, path: cookiePolicy.path });

export default function Page() {
  return <LegalPageView page={cookiePolicy} />;
}
