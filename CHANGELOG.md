# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

## [1.4.1] - 2026-08-30

### Changed

- Switching language now shows a spinner on the clicked flag while the new
  locale's page loads, instead of appearing to do nothing.

## [1.4.0] - 2026-08-30

### Added

- Browser language auto-detection on first visit (Swedish → `/sv`, everyone
  else → English), with the choice persisted for a year via cookie once a
  visitor picks one explicitly.
- Language switcher: flag + text-labelled choice on the landing screen,
  plus a toggle in the main navigation
- Every page string translated to Swedish: navigation, landing screen,
  About/CV/Contact content, form validation messages, and the SEO summary
  block.

### Fixed

- Heading hierarchy: removed a duplicate `<h1>`, and closed an `h3`→`h5`
  skip in the CV modal.
- Contact form validation errors are now actually shown next to their
  field - the `aria-describedby` referenced elements that didn't exist.

## [1.3.0] - 2026-08-30

### Added

- Person structured data (JSON-LD) so search engines can associate
  jbrannelid.com with Johannes Brannelid by name.
- Canonical URL in page metadata.
- Domain ownership verified in Google Search Console (DNS) and sitemap
  submitted.

### Changed

- The 3D engine (Three.js/GSAP) is now lazy-loaded after initial paint
  instead of shipping in the initial bundle, cutting main-thread work
  before the room is even shown.
- Updated dependencies to their latest compatible patch/minor versions
  (gsap, prettier, tailwindcss, zod, eslint, various `@types/*`, and
  others).

### Fixed

- Insufficient color contrast on the "Enter the room" button (WCAG AA).

### Removed

- Unused dependency: `@next/third-parties`.

## [1.2.1] - 2026-08-30

### Fixed

- TV/computer screen zoom now frames the photo centered and straight-on
  instead of skewed from the side
- Tapping the TV/computer screen on mobile no longer sends the camera
  flying off

## [1.2.0] - 2026-08-29

### Added

- Name/title badge on main view
- SEO performance

### Fixed

- A camera-rotation drag ending over an object no longer opens it by
  mistake, on both mouse and touch.
- Onboarding hints now match the actual controls, and differ for desktop
  vs. touch devices.

### Changed

- Clearer heading type scale, calmer animation easing, faster modals.

## [1.1.0] - 2026-08-29

### Added

- Redesigned pre-Enter landing screen
- New Work Experience entry (Software Developer, Alma Health AB)
- Server-side Zod re-validation on the contact form's Netlify Function -
  previously the schema only ran in the browser.
- A working honeypot: the hidden anti-spam field is now actually submitted
  and checked server-side

### Changed

- Textures and the GLB model now load concurrently instead of sequentially,
  fixing a progress bar that visibly jumped backward on first load
  (most noticeable on mobile).
- `globals.css` base typography rules moved into Tailwind's `@layer base`,
  removing the need for the `!important`-modifier overrides
- ESLint now runs solely on the modern flat config (`eslint.config.mjs`)

### Fixed

- `window.open` for external links (GitHub/LinkedIn) now passes
  `noopener,noreferrer`.
- Two pre-existing ESLint errors (unescaped apostrophes) in the contact form.

### Security

- Bumped Next.js 16.0.10 -> 16.3.3 and resolved all `npm audit` findings
  (11 advisories, one directly affecting Next.js itself).

### Removed

- Unused dependencies: `sass`, `rimraf`, `eslint-plugin-jsx-a11y`.

## [1.0.0] - 2026

Initial public release of the interactive 3D portfolio.
