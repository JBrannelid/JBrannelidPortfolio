/**
 * External Links Constants
 * Social media and external platform URLs
 */

import { InteractiveTarget } from "@/lib/types";

export const EXTERNAL_LINKS = {
  [InteractiveTarget.GitHub]: {
    url: "https://github.com/JBrannelid",
    siteName: "GitHub",
  },
  [InteractiveTarget.LinkedIn]: {
    url: "https://www.linkedin.com/in/johannes-brannelid/",
    siteName: "LinkedIn",
  },
} as const;

export const SOCIAL_LINKS = {
  github: "https://github.com/JBrannelid",
  linkedin: "https://www.linkedin.com/in/johannes-brannelid/",
  email: "mailto:J.Brannelid@icloud.com",
} as const;

export const CONTACT_INFO = {
  email: "J.Brannelid@icloud.com",
  location: {
    city: "Stockholm",
    country: "Sweden",
  },
} as const;
