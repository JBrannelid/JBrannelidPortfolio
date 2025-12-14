import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Experience from "@/components/Experience";
import { siteConfig } from "@/lib/config/site";
import { GoogleAnalytics } from "@next/third-parties/google";

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

  // Verification for search engines (add your verification codes)
  verification: {
    // google: "your-google-verification-code",
    // bing: "your-bing-verification-code",
  },
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
        <GoogleAnalytics gaId="G-5Z8NYGYBQP" />
      </body>
    </html>
  );
}
