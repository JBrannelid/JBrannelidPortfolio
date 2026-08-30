import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "sv"],
  defaultLocale: "en",
  // English (default) stays at the bare root; Swedish gets a /sv prefix.
  localePrefix: "as-needed",
  // Persist an explicit language choice for a year via the NEXT_LOCALE
  // cookie (next-intl's default is a session-only cookie)
  localeCookie: {
    maxAge: 60 * 60 * 24 * 365,
  },
});

export type Locale = (typeof routing.locales)[number];
