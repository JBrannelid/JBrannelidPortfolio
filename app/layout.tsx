import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

import Experience from "@/components/ExperienceClient";
import { siteConfig } from "@/lib/config/site";

const GA_MEASUREMENT_ID = "G-5Z8NYGYBQP";

// Person structured data (schema.org/JSON-LD) - tells search engines this
// domain represents this specific person, tying the name to the site the
// way a Knowledge-Panel-style entity lookup expects.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: "Fullstack Developer",
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.location.city,
    addressCountry: "SE",
  },
  sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* Root Layout Metadata */
export const metadata: Metadata = {
  // Basic metadata
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  ],
  creator: siteConfig.author.name,

  // Open Graph metadata (Facebook, LinkedIn, etc.)
  openGraph: {
    type: "website",
    locale: siteConfig.og.locale,
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.og.siteName,
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: siteConfig.twitter.card,
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.twitter.creator,
    images: [`${siteConfig.url}/og-image.png`],
  },

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons (favicons)
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  // Manifest for PWA support
  manifest: "/site.webmanifest",

  // Canonical URL - avoids any duplicate-content ambiguity (www vs.
  // non-www, query params, etc.)
  alternates: {
    canonical: siteConfig.url,
  },

  // Google Search Console ownership is verified via a DNS TXT record on
  // jbrannelid.com instead of the HTML-tag method, so no `verification`
  // meta tag is needed here.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Toast Notification Provider */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: "var(--color-warm-white)",
              color: "var(--color-charcoal)",
              border: "1px solid var(--color-stone)",
              borderRadius: "0.75rem",
              boxShadow: "var(--shadow-lg)",
            },
          }}
        />

        <Experience />
        {children}

        {/* Person structured data for search engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />

        {/* Google Analytics, loaded manually (instead of
            @next/third-parties' <GoogleAnalytics>, which hardcodes
            "afterInteractive") with strategy="lazyOnload" so it doesn't
            compete with the 3D experience's own script for main-thread
            time during load. Trade-off: very short visits that bounce
            before the browser goes idle won't be tracked. */}
        <Script
          id="_next-ga-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');`,
          }}
        />
        <Script
          id="_next-ga"
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
      </body>
    </html>
  );
}
