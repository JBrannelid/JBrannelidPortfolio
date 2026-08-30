import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

// Next.js 16 renamed the "middleware.ts" file convention to "proxy.ts" -
// this still runs on every request, reads Accept-Language on first visit to
// route Swedish speakers to /sv (everyone else stays at /), and remembers an
// explicit choice via the NEXT_LOCALE cookie afterward.
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, and any request for a file with an
  // extension (static assets, models, textures, etc.)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
