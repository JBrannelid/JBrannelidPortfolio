// Hint/label text lives in messages/{locale}.json under "Loader" - these ids
// just define which hints exist and in what order, locale-agnostically.
export const DESKTOP_NAVIGATION_HINT_IDS = [
  "drag",
  "click",
  "scroll-zoom",
] as const;

export const TOUCH_NAVIGATION_HINT_IDS = [
  "drag",
  "tap",
  "pinch-zoom",
] as const;

export const LOADER_PROGRESS_CONFIG = {
  minProgress: 0,
  maxProgress: 100,
  updateInterval: 100, // ms
} as const;
