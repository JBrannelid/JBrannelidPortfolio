export const LOADER_MESSAGES = {
  loading: "Preparing your experience",
  ready: "Ready to Explore",
} as const;

export const NAVIGATION_HINTS = [
  {
    id: "click-drag",
    label: "Click & Drag",
    icon: "MousePointer2",
  },
  {
    id: "scroll-zoom",
    label: "Scroll to Zoom",
    icon: "Mouse",
  },
  {
    id: "touch",
    label: "Touch to navigate",
    icon: "FingerprintPattern",
  },
] as const;

export const LOADER_PROGRESS_CONFIG = {
  minProgress: 0,
  maxProgress: 100,
  updateInterval: 100, // ms
} as const;
