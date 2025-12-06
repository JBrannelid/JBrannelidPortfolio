export const siteConfig = {
  // Basic site information
  name: "Johannes Brannelid",
  title: "Johannes Brannelid | Fullstack Developer",
  description:
    "Interactive 3D portfolio showcasing frontend development expertise in Next JS, React and modern web technologies. Explore projects, skills, and contact information through an immersive 3D experience.",

  // Production URL (set via environment variable)
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://jbrannelid.com/").replace(
    /\/$/,
    ""
  ),

  // SEO Keywords
  keywords: [
    // Core skills
    "fullstack developer",
    "frontend developer",
    "backend developer",
    ".NET developer",
    "React developer",

    // Technologies
    "Next.js",
    "TypeScript",
    "Three.js",
    "Azure",
    "React",
    ".NET Core",
    "Tailwind CSS",
    "GSAP animations",

    // Specializations
    "3D web experiences",
    "interactive portfolio",
    "web development",
    "fullstack development",
    "UX design",
    "Scandinavian design",

    // Location-based
    "Stockholm developer",
    "Sweden fullstack developer",
    "Nordic web developer",

    // Industry keywords
    "modern web applications",
    "scalable architecture",
    "responsive design",
    "accessible interfaces",
    "performance optimization",

    // Professional background
    "radiographer turned developer",
    "healthcare technology",
    "career transition",

    // Brand keywords
    "Johannes Brannelid portfolio",
    "interactive 3D portfolio",
    "immersive web experience",
  ] as const,

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

  // Open Graph / Social sharing defaults
  og: {
    type: "website",
    locale: "en_US",
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
