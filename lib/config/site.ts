export const siteConfig = {
  // Basic site information
  name: "Johannes Brannelid",

  // Production URL (set via environment variable)
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://jbrannelid.com/").replace(
    /\/$/,
    ""
  ),

  // Author information
  author: {
    name: "Johannes Brannelid",
    email: "J.Brannelid@icloud.com",
    url: (
      process.env.NEXT_PUBLIC_SITE_URL || "https://jbrannelid.com/"
    ).replace(/\/$/, ""),
  },

  // Social links
  links: {
    github: "https://github.com/JBrannelid",
    linkedin: "https://www.linkedin.com/in/johannes-brannelid/",
    email: "mailto:J.Brannelid@icloud.com",
  },

  // Location
  location: {
    city: "Stockholm",
    country: "Sweden",
    coordinates: {
      lat: 59.3293,
      lng: 18.0686,
    },
  },

  // Open Graph / Social sharing defaults. `locale` (e.g. "en_US"/"sv_SE") is
  // computed per-request in app/[locale]/layout.tsx, not stored here.
  og: {
    type: "website",
    siteName: "Johannes Brannelid Portfolio",
  },

  // Twitter card defaults
  twitter: {
    card: "summary_large_image",
    site: "@JBrannelid",
    creator: "@JBrannelid",
  },
} as const;

export type SiteConfig = typeof siteConfig;
