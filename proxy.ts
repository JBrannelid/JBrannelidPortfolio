import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Next.js 16 renamed the "middleware.ts" file convention to "proxy.ts" -
// this still runs on every request, reads Accept-Language on first visit to
// route Swedish speakers to /sv (everyone else stays at /), and remembers an
// explicit choice via the NEXT_LOCALE cookie afterward.
export default function proxy(request: NextRequest) {
  const response = intlMiddleware(request);

  // The locale redirect depends on the NEXT_LOCALE cookie, so a CDN that
  // caches it by URL alone (ignoring Cookie) can keep serving a stale
  // redirect to visitors who've since switched language - manifesting as
  // ERR_TOO_MANY_REDIRECTS. Explicitly forbidding caching on the redirect
  // itself closes that off regardless of the CDN's default cookie handling.
  if (response.status >= 300 && response.status < 400) {
    response.headers.set("Cache-Control", "no-store");
  }

  return response;
}

export const config = {
  // Skip API routes, Next internals, and any request for a file with an
  // extension (static assets, models, textures, etc.)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
