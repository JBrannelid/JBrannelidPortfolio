"use client";

import gsap from "gsap";
import { ArrowBigRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  DESKTOP_NAVIGATION_HINTS,
  LOADER_ANIMATION_CONFIG,
  LOADER_MESSAGES,
  TOUCH_NAVIGATION_HINTS,
} from "@/lib/constants";
import { useIsMobileViewport } from "@/lib/hooks/useIsMobileViewport";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useToasts } from "@/lib/hooks/useToasts";
import { ExperienceLoaderProps } from "@/lib/types";

/* ExperienceLoader Component
 * "Editorial Threshold" landing screen: a light, asymmetric entry point
 * shown before the 3D room finishes loading. Progress is expressed as a
 * typographic counter + filling rule, and the room preview on the right
 * resolves from a soft, misty state into full clarity as loading completes. */
export default function ExperienceLoader({
  isLoading,
  error,
  progress,
}: ExperienceLoaderProps) {
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const loadingTextRef = useRef<HTMLParagraphElement>(null);
  const enterSectionRef = useRef<HTMLDivElement>(null);
  const ruleFillRef = useRef<HTMLSpanElement>(null);
  const lastAnnouncedRef = useRef(-1);
  const reducedMotion = useReducedMotion();
  const isMobileViewport = useIsMobileViewport();
  const navigationHints = isMobileViewport
    ? TOUCH_NAVIGATION_HINTS
    : DESKTOP_NAVIGATION_HINTS;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  /* Convert error to toast notification state */
  const errorState = error
    ? {
        errors: {
          form: [error.message || "Failed to load 3D experience"],
        },
      }
    : undefined;

  /* Display error toasts and hide loader on error */
  useToasts(errorState, {
    duration: Infinity,
  });

  /* Fade out loader when error occurs */
  useEffect(() => {
    if (error && overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: reducedMotion ? 0.01 : 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          if (overlayRef.current) {
            overlayRef.current.style.display = "none";
          }
        },
      });
    }
  }, [error, reducedMotion]);

  /* Fill the progress rule via a composited transform (scaleX) instead of
   * animating width, which forces layout on every frame */
  useEffect(() => {
    if (!ruleFillRef.current) return;
    gsap.to(ruleFillRef.current, {
      scaleX: clampedProgress / 100,
      duration: reducedMotion ? 0.01 : 0.5,
      ease: "power2.out",
    });
  }, [clampedProgress, reducedMotion]);

  /* Add a subtle "breathing" pulse to the progress rule as it fills */
  useEffect(() => {
    if (reducedMotion) return;
    if (ruleFillRef.current && progress > 0 && progress < 100) {
      gsap.to(ruleFillRef.current, {
        scaleY: LOADER_ANIMATION_CONFIG.progressBar.scaleY,
        duration: LOADER_ANIMATION_CONFIG.progressBar.duration,
        ease: LOADER_ANIMATION_CONFIG.progressBar.ease,
        yoyo: true,
        repeat: -1,
      });
    }
  }, [progress, reducedMotion]);

  /* Detect when loading completes and fade out loading text */
  useEffect(() => {
    if (progress >= 100 && !isLoading && !showEnterButton) {
      if (loadingTextRef.current) {
        gsap.to(loadingTextRef.current, {
          opacity: LOADER_ANIMATION_CONFIG.loadingText.fadeOut.opacity,
          y: LOADER_ANIMATION_CONFIG.loadingText.fadeOut.y,
          duration: reducedMotion
            ? 0.01
            : LOADER_ANIMATION_CONFIG.loadingText.fadeOut.duration,
          ease: LOADER_ANIMATION_CONFIG.loadingText.fadeOut.ease,
          onComplete: () => {
            setShowEnterButton(true);
          },
        });
      }
    }
  }, [progress, isLoading, showEnterButton, reducedMotion]);

  /* Animate enter section AFTER it has been rendered */
  useEffect(() => {
    if (showEnterButton && enterSectionRef.current) {
      gsap.fromTo(
        enterSectionRef.current,
        {
          opacity: LOADER_ANIMATION_CONFIG.enterSection.fadeIn.from.opacity,
          y: LOADER_ANIMATION_CONFIG.enterSection.fadeIn.from.y,
          scale: LOADER_ANIMATION_CONFIG.enterSection.fadeIn.from.scale,
        },
        {
          opacity: LOADER_ANIMATION_CONFIG.enterSection.fadeIn.to.opacity,
          y: LOADER_ANIMATION_CONFIG.enterSection.fadeIn.to.y,
          scale: LOADER_ANIMATION_CONFIG.enterSection.fadeIn.to.scale,
          duration: reducedMotion
            ? 0.01
            : LOADER_ANIMATION_CONFIG.enterSection.fadeIn.to.duration,
          ease: LOADER_ANIMATION_CONFIG.enterSection.fadeIn.to.ease,
        }
      );
    }
  }, [showEnterButton, reducedMotion]);

  /* Throttled screen-reader progress announcements (avoid announcing every
   * single percent as items finish loading) */
  useEffect(() => {
    if (showEnterButton) {
      if (lastAnnouncedRef.current !== 100) {
        lastAnnouncedRef.current = 100;
        setLiveMessage(
          `${LOADER_MESSAGES.ready}. Press Enter the room to continue.`
        );
      }
      return;
    }

    const checkpoint = Math.floor(Math.min(progress, 99) / 25) * 25;
    if (checkpoint !== lastAnnouncedRef.current) {
      lastAnnouncedRef.current = checkpoint;
      setLiveMessage(`${LOADER_MESSAGES.loading}, ${checkpoint} percent.`);
    }
  }, [progress, showEnterButton]);

  /* Handle enter button click - fade out entire loader */
  const handleEnter = () => {
    if (!overlayRef.current) return;

    const d = (duration: number) => (reducedMotion ? 0.01 : duration);
    const timeline = gsap.timeline();

    timeline
      .to(contentRef.current, {
        opacity: LOADER_ANIMATION_CONFIG.overlayExit.content.opacity,
        scale: LOADER_ANIMATION_CONFIG.overlayExit.content.scale,
        y: LOADER_ANIMATION_CONFIG.overlayExit.content.y,
        duration: d(LOADER_ANIMATION_CONFIG.overlayExit.content.duration),
        ease: LOADER_ANIMATION_CONFIG.overlayExit.content.ease,
      })
      .to(
        overlayRef.current,
        {
          opacity: LOADER_ANIMATION_CONFIG.overlayExit.overlay.opacity,
          duration: d(LOADER_ANIMATION_CONFIG.overlayExit.overlay.duration),
          ease: LOADER_ANIMATION_CONFIG.overlayExit.overlay.ease,
        },
        "-=0.3"
      )
      .call(() => {
        if (overlayRef.current) {
          overlayRef.current.style.display = "none";
        }
      });
  };

  /* Don't render if error occurred */
  if (error) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="bg-warm-white fixed inset-0 z-50 overflow-hidden"
    >
      {/* Texture */}
      <div className="bg-grain" />

      <div
        ref={contentRef}
        className="relative z-10 grid h-full w-full lg:grid-cols-[1.15fr_0.85fr]"
      >
        {/* Left: text + progress + CTA */}
        <div className="flex flex-col justify-center px-[7vw] py-[6vh] lg:px-[6vw]">
          <div className="flex max-w-lg flex-col gap-9 md:max-w-2xl lg:max-w-lg">
            <span className="text-moss-dark font-mono text-[0.9rem] font-semibold tracking-[0.22em] uppercase">
              {LOADER_MESSAGES.kicker}
            </span>

            <div className="flex flex-col gap-6">
              <h1 className="text-charcoal text-[clamp(3rem,7vw,5rem)] leading-[0.95] font-semibold tracking-[-0.035em] text-balance">
                Portfolio
              </h1>
              <p className="text-slate max-w-[32ch] text-[1.05rem] leading-relaxed">
                {LOADER_MESSAGES.tagline}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div
                className="flex items-baseline gap-5"
                role="progressbar"
                aria-label="Loading portfolio experience"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(clampedProgress)}
              >
                <span
                  className="text-charcoal font-mono text-[clamp(2.5rem,5vw,3.5rem)] leading-none tabular-nums"
                  aria-hidden="true"
                >
                  {Math.round(clampedProgress)}
                  <sup className="text-moss-dark text-[1.1rem]">%</sup>
                </span>
                <span className="bg-stone h-0.5 flex-1 overflow-hidden rounded-full">
                  <span
                    ref={ruleFillRef}
                    className="bg-moss block h-full w-full origin-left scale-x-0"
                  />
                </span>
              </div>

              {!showEnterButton && (
                <p
                  ref={loadingTextRef}
                  className="text-slate text-[0.8rem] tracking-wide"
                >
                  {LOADER_MESSAGES.loading}
                  <span className="animate-pulse">...</span>
                </p>
              )}

              {/* Screen-reader-only progress announcements */}
              <p className="sr-only" role="status" aria-live="polite">
                {liveMessage}
              </p>
            </div>

            {showEnterButton && (
              <div
                ref={enterSectionRef}
                className="flex flex-wrap items-center gap-7 opacity-0"
              >
                <button
                  onClick={handleEnter}
                  className="btn-primary gap-2 px-8"
                >
                  Enter the room
                  <ArrowBigRight className="size-4" />
                </button>

                <div className="text-slate flex flex-wrap gap-5 font-mono text-[0.68rem] tracking-wide uppercase">
                  {navigationHints.map((hint) => (
                    <span key={hint.id}>{hint.label}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: room preview, desktop only. Hidden (not lazily deferred)
            below `lg` so mobile visitors never fetch this image at all. */}
        <div className="from-sand to-stone relative hidden overflow-hidden rounded-l-[2.5rem] bg-linear-to-br lg:flex lg:items-center lg:justify-center">
          <div className="bg-frost absolute h-[60vw] w-[60vw] rounded-full opacity-40 blur-[70px]" />
          <div className="relative aspect-square w-[min(64%,24rem)]">
            <Image
              src="/images/isometric_room.png"
              alt="Isometric render of the 3D portfolio room"
              fill
              sizes="420px"
              loading="eager"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
