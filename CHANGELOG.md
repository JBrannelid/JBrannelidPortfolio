# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

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
