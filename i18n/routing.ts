import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "sv"],
  defaultLocale: "sv",
  // Swedish (default) stays at the bare root; English gets an /en prefix.
  localePrefix: "as-needed",
  // Persist an explicit language choice for a year via the NEXT_LOCALE
  // cookie (next-intl's default is a session-only cookie)
  localeCookie: {
    maxAge: 60 * 60 * 24 * 365,
  },
  // No Accept-Language-based auto-redirect: Google explicitly warns against
  // redirecting visitors (including crawlers) based on perceived language -
  // the same URL can then look like a redirect or different content
  // depending on what a given crawl request sends, which is what produced
  // the "Page with redirect" status in Search Console. Language choice is
  // instead entirely up to the visitor via LanguageSwitcher.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
