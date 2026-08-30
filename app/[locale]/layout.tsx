import "../globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Toaster } from "react-hot-toast";

import Experience from "@/components/ExperienceClient";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/config/site";

const GA_MEASUREMENT_ID = "G-5Z8NYGYBQP";

const OG_LOCALE: Record<string, string> = { en: "en_US", sv: "sv_SE" };

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const title = t("title");
  const description = t("description");
  const pageUrl = locale === routing.defaultLocale ? siteConfig.url : `${siteConfig.url}/${locale}`;

  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords: t.raw("keywords") as string[],
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    creator: siteConfig.author.name,

    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale] ?? OG_LOCALE[routing.defaultLocale],
      url: pageUrl,
      title,
      description,
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

    twitter: {
      card: siteConfig.twitter.card,
      title,
      description,
      creator: siteConfig.twitter.creator,
      images: [`${siteConfig.url}/og-image.png`],
    },

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

    icons: {
      icon: [
        { url: "/favicon/favicon.ico" },
        { url: "/favicon/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      ],
      apple: [
        { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },

    manifest: "/site.webmanifest",

    // hreflang: points search engines from either language version to both.
    alternates: {
      canonical: pageUrl,
      languages: {
        en: siteConfig.url,
        sv: `${siteConfig.url}/sv`,
      },
    },

    // Google Search Console ownership is verified via a DNS TXT record on
    // jbrannelid.com instead of the HTML-tag method, so no `verification`
    // meta tag is needed here.
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enables static rendering for this locale's Server Components.
  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "JsonLd" });

  // Person structured data (schema.org/JSON-LD) - tells search engines this
  // domain represents this specific person, tying the name to the site the
  // way a Knowledge-Panel-style entity lookup expects.
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: t("jobTitle"),
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressCountry: "SE",
    },
    sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
  };

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
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
        </NextIntlClientProvider>

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
