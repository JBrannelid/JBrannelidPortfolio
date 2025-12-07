"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { User, FileText, Mail, Github, Linkedin } from "lucide-react";
import { NavigationProps, NavButton } from "@/lib/types";
import {
  NAVIGATION_ANIMATION_CONFIG,
  NAVIGATION_BUTTON_COLORS,
} from "@/lib/constants";

/* Desktop: Right sidebar with floating buttons
 * Mobile: Top header with compact menu */
export default function Navigation({
  onAboutClick,
  onCVClick,
  onContactClick,
  onGitHubClick,
  onLinkedInClick,
}: NavigationProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Navigation buttons configuration
  const navButtons: NavButton[] = [
    {
      id: "about",
      label: "About",
      icon: User,
      onClick: onAboutClick,
      type: "internal",
      color: NAVIGATION_BUTTON_COLORS.moss,
    },
    {
      id: "cv",
      label: "CV",
      icon: FileText,
      onClick: onCVClick,
      type: "internal",
      color: NAVIGATION_BUTTON_COLORS.moss,
    },
    {
      id: "contact",
      label: "Contact",
      icon: Mail,
      onClick: onContactClick,
      type: "internal",
      color: NAVIGATION_BUTTON_COLORS.moss,
    },
    {
      id: "github",
      label: "GitHub",
      icon: Github,
      onClick: onGitHubClick,
      type: "external",
      color: NAVIGATION_BUTTON_COLORS.moss,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      onClick: onLinkedInClick,
      type: "external",
      color: NAVIGATION_BUTTON_COLORS.moss,
    },
  ];

  // GSAP entrance animation on mount
  useEffect(() => {
    if (!sidebarRef.current) return;

    const ctx = gsap.context(() => {
      // Stagger animation for buttons
      gsap.from(buttonsRef.current, {
        x: NAVIGATION_ANIMATION_CONFIG.entrance.from.x,
        opacity: NAVIGATION_ANIMATION_CONFIG.entrance.from.opacity,
        duration: NAVIGATION_ANIMATION_CONFIG.entrance.to.duration,
        stagger: NAVIGATION_ANIMATION_CONFIG.entrance.to.stagger,
        ease: NAVIGATION_ANIMATION_CONFIG.entrance.to.ease,
        delay: NAVIGATION_ANIMATION_CONFIG.entrance.to.delay, // Wait for loader to finish
      });
    }, sidebarRef.current);

    return () => ctx.revert();
  }, []);

  // Button hover animation - memoized to prevent re-creation
  const handleMouseEnter = useCallback((index: number) => {
    const button = buttonsRef.current[index];
    if (!button) return;

    // Animate scale and position on hover
    gsap.to(button, {
      scale: NAVIGATION_ANIMATION_CONFIG.hover.scale,
      x: NAVIGATION_ANIMATION_CONFIG.hover.x,
      duration: NAVIGATION_ANIMATION_CONFIG.hover.duration,
      ease: NAVIGATION_ANIMATION_CONFIG.hover.ease,
    });
  }, []);

  // Button mouse leave animation - memoized
  const handleMouseLeave = useCallback((index: number) => {
    const button = buttonsRef.current[index];
    if (!button) return;

    gsap.to(button, {
      scale: NAVIGATION_ANIMATION_CONFIG.hoverOut.scale,
      x: NAVIGATION_ANIMATION_CONFIG.hoverOut.x,
      duration: NAVIGATION_ANIMATION_CONFIG.hoverOut.duration,
      ease: NAVIGATION_ANIMATION_CONFIG.hoverOut.ease,
    });
  }, []);

  // Click animation
  const handleClick = useCallback((index: number, onClick: () => void) => {
    const button = buttonsRef.current[index];
    if (!button) return;

    gsap.to(button, {
      scale: NAVIGATION_ANIMATION_CONFIG.click.scale,
      duration: NAVIGATION_ANIMATION_CONFIG.click.duration,
      yoyo: NAVIGATION_ANIMATION_CONFIG.click.yoyo,
      repeat: NAVIGATION_ANIMATION_CONFIG.click.repeat,
      ease: NAVIGATION_ANIMATION_CONFIG.click.ease,
      onComplete: onClick,
    });
  }, []);

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        ref={sidebarRef}
        className="pointer-events-none fixed top-0 right-0 z-40 hidden h-screen flex-col items-end justify-center gap-4 md:flex"
        aria-label="Main navigation"
      >
        {navButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <button
              key={button.id}
              ref={(el) => {
                buttonsRef.current[index] = el;
              }}
              onClick={() => handleClick(index, button.onClick)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              className="group bg-warm-white border-stone pointer-events-auto relative flex items-center gap-3 rounded-l-full border-2 border-r-0 px-5 py-3 transition-colors duration-200"
              style={{
                willChange: "transform",
                boxShadow: `0 2px 10px ${button.color}, 0 0 20px ${button.color}`,
              }}
              aria-label={button.label}
            >
              {/* Icon */}
              <div className="flex size-6 items-center justify-center">
                <Icon className="text-charcoal group-hover:text-moss size-5 transition-colors duration-200" />
              </div>

              {/* Label */}
              <span className="text-charcoal group-hover:text-moss font-medium transition-colors duration-200">
                {button.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Navigation */}
      <header className="pointer-events-auto fixed top-0 right-0 left-0 z-40 md:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-end">
            {/* Mobile navigation buttons */}
            <nav
              className="flex items-center gap-4"
              aria-label="Main navigation"
            >
              {navButtons.map((button) => {
                const Icon = button.icon;
                return (
                  <button
                    key={button.id}
                    onClick={button.onClick}
                    className="bg-sand border-stone hover:bg-stone flex size-13 items-center justify-center rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95"
                    aria-label={button.label}
                    title={button.label}
                  >
                    <Icon className="text-charcoal size-5" />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
