import { MetadataRoute } from "next";

import { getPathname } from "../i18n/navigation";
import { routing } from "../i18n/routing";
import { siteConfig } from "../lib/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const currentDate = new Date();

  const languages = Object.fromEntries(
    await Promise.all(
      routing.locales.map(async (locale) => [
        locale,
        baseUrl + (await getPathname({ locale, href: "/" })),
      ])
    )
  );

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 1.0,
      alternates: { languages },
    },
  ];
}
