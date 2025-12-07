"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useToasts } from "@/lib/hooks/useToasts";
import {
  FingerprintPattern,
  Mouse,
  MousePointer2,
  ArrowBigRight,
} from "lucide-react";
import { ExperienceLoaderProps } from "@/lib/types";
import { LOADER_MESSAGES, LOADER_ANIMATION_CONFIG } from "@/lib/constants";

/* ExperienceLoader Component
 * A loading overlay for the 3D experience with progress bar and enter button */
export default function ExperienceLoader({
  isLoading,
  error,
  progress,
}: ExperienceLoaderProps) {
  const [showEnterButton, setShowEnterButton] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const loadingTextRef = useRef<HTMLParagraphElement>(null);
  const enterSectionRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

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
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          if (overlayRef.current) {
            overlayRef.current.style.display = "none";
          }
        },
      });
    }
  }, [error]);

  /* Add subtle pulse to progress bar as it fills */
  useEffect(() => {
    if (progressBarRef.current && progress > 0 && progress < 100) {
      gsap.to(progressBarRef.current, {
        scale: LOADER_ANIMATION_CONFIG.progressBar.scale,
        duration: LOADER_ANIMATION_CONFIG.progressBar.duration,
        ease: LOADER_ANIMATION_CONFIG.progressBar.ease,
        yoyo: true,
        repeat: -1,
      });
    }
  }, [progress]);

  /* Detect when loading completes and fade out loading text */
  useEffect(() => {
    if (progress >= 100 && !isLoading && !showEnterButton) {
      // Fade out loading text first
      if (loadingTextRef.current) {
        gsap.to(loadingTextRef.current, {
          opacity: LOADER_ANIMATION_CONFIG.loadingText.fadeOut.opacity,
          y: LOADER_ANIMATION_CONFIG.loadingText.fadeOut.y,
          duration: LOADER_ANIMATION_CONFIG.loadingText.fadeOut.duration,
          ease: LOADER_ANIMATION_CONFIG.loadingText.fadeOut.ease,
          onComplete: () => {
            setShowEnterButton(true);
          },
        });
      }
    }
  }, [progress, isLoading, showEnterButton]);

  /* Animate enter button section AFTER it has been rendered */
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
          duration: LOADER_ANIMATION_CONFIG.enterSection.fadeIn.to.duration,
          ease: LOADER_ANIMATION_CONFIG.enterSection.fadeIn.to.ease,
        }
      );
    }
  }, [showEnterButton]);

  /* Handle enter button click - fade out entire loader */
  const handleEnter = () => {
    if (!overlayRef.current) return;

    const timeline = gsap.timeline();

    timeline
      .to(contentRef.current, {
        opacity: LOADER_ANIMATION_CONFIG.overlayExit.content.opacity,
        scale: LOADER_ANIMATION_CONFIG.overlayExit.content.scale,
        y: LOADER_ANIMATION_CONFIG.overlayExit.content.y,
        duration: LOADER_ANIMATION_CONFIG.overlayExit.content.duration,
        ease: LOADER_ANIMATION_CONFIG.overlayExit.content.ease,
      })
      .to(
        overlayRef.current,
        {
          opacity: LOADER_ANIMATION_CONFIG.overlayExit.overlay.opacity,
          duration: LOADER_ANIMATION_CONFIG.overlayExit.overlay.duration,
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
      className="bg-charcoal fixed inset-0 z-50 flex flex-col items-center justify-center"
    >
      {/* Background */}
      <div className="bg-grid" />

      <div ref={contentRef} className="relative z-10 w-full max-w-md px-6">
        {/* Main Loading Content */}
        <div className="space-y-12">
          {/* Hero Title Section */}
          <div className="space-y-4 text-center">
            <h1 className="text-warm-white tracking-tight">Portfolio</h1>
            <div className="flex items-center justify-center gap-3">
              {/* Divider */}
              <div className="bg-moss h-px w-12"></div>
              <p className="text-moss text-sm font-medium tracking-widest uppercase">
                Interactive Experience
              </p>
              {/* Divider */}
              <div className="bg-moss h-px w-12"></div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="relative">
              {/* Background track */}
              <div className="bg-soft-black/50 h-1 w-full overflow-hidden rounded-full">
                {/* Animated Progress Fill */}
                <div
                  ref={progressBarRef}
                  className="bg-moss relative h-full rounded-full shadow-[0_0_16px_rgba(113,131,85,0.4)] transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                >
                  {/* Shimmer effect on progress bar */}
                  <div className="animate-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
              </div>

              {/* Progress percentage - floating above bar */}
              <div className="absolute -top-8 right-0 left-0 flex justify-center">
                <span className="text-warm-white text-xl! tabular-nums">
                  {Math.round(progress)}
                  <span className="text-moss text-lg!">%</span>
                </span>
              </div>
            </div>

            {/* Loading Status Text */}
            {!showEnterButton && (
              <p
                ref={loadingTextRef}
                className="text-moss-dark! text-center tracking-wide"
              >
                {LOADER_MESSAGES.loading}
                <span className="text-moss-dark! animate-pulse!">...</span>
              </p>
            )}
          </div>

          {/* Ready State - Enter Section */}
          {showEnterButton && (
            <div ref={enterSectionRef} className="space-y-8 opacity-0">
              {/* CTA*/}
              <div className="space-y-6 text-center">
                <div className="space-y-2">
                  <h2 className="text-warm-white flex flex-col font-light">
                    {LOADER_MESSAGES.ready}
                  </h2>
                </div>

                {/* Enter Button */}
                <button
                  onClick={handleEnter}
                  className="btn-primary items-center justify-center"
                >
                  <p className="text-warm-white text-2xl!"> Enter </p>
                  <ArrowBigRight className="text-warm-white size-5" />
                </button>
              </div>
              {/* Divider */}
              <div className="divider-full"></div>
              {/* Navigation Instructions */}
              <div className="flex items-center justify-center gap-8 pt-4">
                {/* Mouse Click */}
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="bg-soft-black/30 flex size-10 items-center justify-center rounded-full">
                    <MousePointer2 className="text-moss size-5" />
                  </div>
                  <p className="text-warm-white font-light">Click & Drag</p>
                </div>

                {/* Mouse Wheel */}
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="bg-soft-black/30 flex size-10 items-center justify-center rounded-full">
                    <Mouse className="text-moss size-5" />
                  </div>
                  <p className="text-warm-white font-light">Scroll to Zoom</p>
                </div>

                {/* Touch */}
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="bg-soft-black/30 flex size-10 items-center justify-center rounded-full">
                    <FingerprintPattern className="text-moss size-5" />
                  </div>
                  <p className="text-warm-white font-light">
                    Touch to navigate
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
