export const TOAST_DURATION = {
  DEFAULT: 5000,
  SHORT: 3000,
  LONG: 8000,
  INFINITE: Infinity,
} as const;

export const SCROLLBAR_CONFIG = {
  width: 8,
  height: 8,
} as const;

export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;
export const DESKTOP_BREAKPOINT = 1440;

export const isMobileDevice = (): boolean => {
  return typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;
};

export const ICON_SIZES = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export const NAVIGATION_BUTTON_COLORS = {
  moss: "#71835560", // Moss/Sage with transparency
} as const;
