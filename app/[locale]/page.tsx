import CrawlableSummary from "@/components/CrawlableSummary";

// The 3D experience itself is mounted globally in LocaleLayout
// (app/[locale]/layout.tsx) since this is a single-route-per-locale site.
// This element only reserves a layer for future page-level UI on top of the
// canvas; pointerEvents stays "none" so clicks pass through to the 3D scene
// beneath it.
export default function Home() {
  return (
    <main style={{ position: "relative", zIndex: 1, pointerEvents: "none" }}>
      <CrawlableSummary />
    </main>
  );
}
