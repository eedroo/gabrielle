import type { MetadataRoute } from "next";
import { legalLinks, navigation, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...navigation.map((item) => ({
      url: new URL(item.href, site.url).toString(),
      changeFrequency: item.href === "/travels" ? ("weekly" as const) : ("monthly" as const),
      priority: item.href === "/" ? 1 : 0.7,
    })),
    ...legalLinks.map((item) => ({
      url: new URL(item.href, site.url).toString(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
