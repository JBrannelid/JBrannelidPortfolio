import Image from "next/image";
import { getTranslations } from "next-intl/server";

/* InitialLoadingSkeleton
 * SSR placeholder for ExperienceLoader. The real 3D experience is a client-only
 * dynamic import (three.js/GSAP/GLTFLoader, ~290KB gzipped)
 * Sits at z-40 (ExperienceLoader is z-50) and earlier in the DOM */
export default async function InitialLoadingSkeleton() {
  const t = await getTranslations("Loader");

  return (
    <div
      id="initial-loading-skeleton"
      className="bg-warm-white fixed inset-0 z-40 overflow-hidden"
    >
      <div className="bg-grain" />

      <div className="relative z-10 grid h-full w-full lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left: text + indeterminate loading indicator */}
        <div className="relative flex flex-col justify-center px-[7vw] py-[6vh] lg:px-[6vw]">
          <p className="text-charcoal absolute top-24 right-[7vw] z-50 font-mono text-4xl leading-[0.95] font-semibold tracking-[0.2em] text-balance uppercase lg:top-6 lg:right-[6vw]">
            {t("heading")}
          </p>

          <div className="flex max-w-lg flex-col gap-9 md:max-w-2xl lg:max-w-lg">
            <span className="text-moss-dark font-mono text-[0.9rem] font-semibold tracking-[0.22em] uppercase">
              {t("kicker")}
            </span>

            <div className="flex flex-col gap-6">
              <p className="text-slate max-w-[32ch] text-[1.05rem] leading-relaxed">
                {t("tagline")}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {/* Progress isn't known yet (no JS has run), so this shows
                  motion without a number  */}
              <span className="bg-stone relative h-0.5 w-full max-w-60 overflow-hidden rounded-full">
                <span className="via-moss animate-shimmer absolute inset-0 bg-linear-to-r from-transparent to-transparent" />
              </span>

              <p className="text-slate text-[0.8rem] tracking-wide">
                {t("loadingLabel")}
                <span className="animate-pulse">...</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: room preview, desktop only - matches ExperienceLoader */}
        <div className="from-sand to-stone relative hidden overflow-hidden rounded-l-[2.5rem] bg-linear-to-br lg:flex lg:items-center lg:justify-center">
          <div className="bg-frost absolute h-[60vw] w-[60vw] rounded-full opacity-40 blur-[70px]" />
          <div className="relative aspect-square w-[min(64%,24rem)]">
            <Image
              src="/images/isometric_room.png"
              alt={t("roomPreviewAlt")}
              fill
              sizes="420px"
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
