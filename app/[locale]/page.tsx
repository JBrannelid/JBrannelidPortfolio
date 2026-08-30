import CrawlableSummary from "@/components/CrawlableSummary";

// The 3D experience itself is mounted globally in LocaleLayout
// (app/[locale]/layout.tsx) since this is a SPA site.
// This element only reserves a layer for future page-level UI on top of the
// canvas, and is also used to provide a crawlable summary of the portfolio content for search engines and screen readers
export default function Home() {
  return (
    <main style={{ position: "relative", zIndex: 1, pointerEvents: "none" }}>
      <CrawlableSummary />
    </main>
  );
}
