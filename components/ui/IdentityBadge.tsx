"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

import { siteConfig } from "@/lib/config/site";
import { NAVIGATION_ANIMATION_CONFIG } from "@/lib/constants";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export default function IdentityBadge() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: reducedMotion
          ? 0.01
          : NAVIGATION_ANIMATION_CONFIG.entrance.to.duration,
        ease: "power3.out",
        delay: NAVIGATION_ANIMATION_CONFIG.entrance.to.delay,
      }
    );
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed right-6 bottom-6 z-40 opacity-0"
    >
      <div className="bg-warm-white/90 border-stone/70 rounded-xl border px-4 py-2 shadow-lg backdrop-blur-md">
        <p className="text-charcoal text-sm leading-tight font-semibold">
          {siteConfig.name}
        </p>
        <p className="text-charcoal/70 text-xs leading-tight font-medium">
          Fullstack Developer
        </p>
      </div>
    </div>
  );
}
