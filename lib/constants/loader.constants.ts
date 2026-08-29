export const LOADER_MESSAGES = {
  kicker: "Welcome to my portfolio",
  tagline:
    "A minimalist isometric room, rendered in real time - designed and built by Johannes Brannelid.",
  loading: "Preparing your experience",
  ready: "Ready to Explore",
} as const;

export const DESKTOP_NAVIGATION_HINTS = [
  { id: "drag", label: "Drag to Look Around" },
  { id: "click", label: "Click to Explore" },
  { id: "scroll-zoom", label: "Scroll to Zoom" },
] as const;

export const TOUCH_NAVIGATION_HINTS = [
  { id: "drag", label: "Drag to Look Around" },
  { id: "tap", label: "Tap to Explore" },
  { id: "pinch-zoom", label: "Pinch to Zoom" },
] as const;

export const LOADER_PROGRESS_CONFIG = {
  minProgress: 0,
  maxProgress: 100,
  updateInterval: 100, // ms
} as const;
