import { InteractiveTarget } from "@/lib/types";

export const BOUNCE_CONFIG = {
  height: 0.08,
  duration: 0.8,
} as const;

export const HOVER_CONFIG = {
  scale: 1.05,
  rotation: 0.05, // ~3 degrees in radians
  duration: 0.3,
} as const;

export const CAMERA_ZOOM_DISTANCE = 3.5;

export const MODAL_ANIMATION_CONFIG = {
  overlay: {
    duration: 0.3,
    ease: "power2.out",
  },
  content: {
    duration: 0.5,
    ease: "back.out(1.7)",
    scale: {
      from: 0.8,
      to: 1,
    },
    y: {
      from: 30,
      to: 0,
    },
  },
  close: {
    duration: 0.3,
    ease: "power2.in",
  },
} as const;

export const EXTERNAL_LINK_MODAL_ANIMATION = {
  overlay: {
    duration: 0.2,
    ease: "power2.out",
  },
  modal: {
    duration: 0.3,
    ease: "back.out(1.4)",
    scale: {
      from: 0.9,
      to: 1,
    },
    y: {
      from: 20,
      to: 0,
    },
  },
  close: {
    duration: 0.2,
    ease: "power2.in",
  },
} as const;

export const NAVIGATION_ANIMATION_CONFIG = {
  entrance: {
    from: {
      x: 100,
      opacity: 0,
    },
    to: {
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(1.7)",
      delay: 1, // Wait for loader to finish
    },
  },
  hover: {
    scale: 1.1,
    x: -8,
    duration: 0.3,
    ease: "back.out(2)",
  },
  hoverOut: {
    scale: 1,
    x: 0,
    duration: 0.3,
    ease: "power2.out",
  },
  click: {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut",
  },
} as const;

export const LOADER_ANIMATION_CONFIG = {
  progressBar: {
    scale: 1.02,
    duration: 0.8,
    ease: "sine.inOut",
  },
  loadingText: {
    fadeOut: {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: "power2.in",
    },
  },
  enterSection: {
    fadeIn: {
      from: {
        opacity: 0,
        y: 30,
        scale: 0.95,
      },
      to: {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.4)",
      },
    },
  },
  overlayExit: {
    content: {
      opacity: 0,
      scale: 0.95,
      y: -30,
      duration: 0.5,
      ease: "power2.in",
    },
    overlay: {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
    },
  },
} as const;

export const CAMERA_ANIMATION_CONFIG = {
  zoom: {
    duration: 1.2,
    ease: "power3.inOut",
  },
  reset: {
    duration: 1.0,
    ease: "power3.inOut",
  },
} as const;

// Objects excluded from hover animations
export const HOVER_EXCLUDED_TARGETS: InteractiveTarget[] = [
  InteractiveTarget.TVScreen,
  InteractiveTarget.ComputerScreen,
] as const;
