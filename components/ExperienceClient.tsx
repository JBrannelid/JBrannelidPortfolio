"use client";

import dynamic from "next/dynamic";

// Code-split the entire 3D engine (Three.js/GSAP/GLTFLoader) out of the
// initial bundle - it was being parsed/executed before the user even sees
// the "Enter the room" landing screen. `ssr: false` is required here (and
// is why this lives in its own client component instead of being called
// straight from the server-rendered layout).
const Experience = dynamic(() => import("@/components/Experience"), {
  ssr: false,
  // No loading fallback here on purpose: InitialLoadingSkeleton (rendered
  // server-side in layout.tsx, sitting just behind this at a lower
  // z-index) is already visible for this entire window. A fallback here
  // would just paint an empty div over it while this chunk downloads.
});

export default Experience;
