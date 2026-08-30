"use client";

import dynamic from "next/dynamic";

// Code-split the entire 3D engine (Three.js/GSAP/GLTFLoader) out of the
// initial bundle - it was being parsed/executed before the user even sees
// the "Enter the room" landing screen. `ssr: false` is required here (and
// is why this lives in its own client component instead of being called
// straight from the server-rendered layout).
const Experience = dynamic(() => import("@/components/Experience"), {
  ssr: false,
  // Matches the landing screen's own background so there's no flash while
  // the deferred chunk downloads.
  loading: () => <div className="bg-warm-white fixed inset-0 z-50" />,
});

export default Experience;
