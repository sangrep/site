import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-02");
  return [
    {
      changeFrequency: "weekly",
      lastModified,
      priority: 1,
      url: "https://sangrep.com/",
    },
    {
      changeFrequency: "yearly",
      lastModified,
      priority: 0.3,
      url: "https://sangrep.com/privacy",
    },
    {
      changeFrequency: "yearly",
      lastModified,
      priority: 0.3,
      url: "https://sangrep.com/terms",
    },
  ];
}
