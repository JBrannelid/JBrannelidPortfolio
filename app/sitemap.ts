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

  // One <url> entry per locale (not just the default)
  return routing.locales.map((locale) => ({
    url: languages[locale],
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? 1.0 : 0.9,
    alternates: { languages },
    // Surfaces the room preview to Google Image Search too, not just web
    // search - a distinctive isometric render is exactly the kind of image
    // that can pull in traffic on its own.
    images: [`${baseUrl}/images/isometric_room.png`],
  }));
}
