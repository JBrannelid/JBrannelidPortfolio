import { useEffect, useState } from "react";

// Mirrors the `lg` breakpoint used elsewhere (e.g. the loader's room-preview
// panel) so every "mobile vs desktop" decision on the page agrees.
const MOBILE_VIEWPORT_QUERY = "(max-width: 1023px)";

export function useIsMobileViewport(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_VIEWPORT_QUERY);
    setIsMobile(query.matches);

    const handleChange = (event: MediaQueryListEvent) =>
      setIsMobile(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}
