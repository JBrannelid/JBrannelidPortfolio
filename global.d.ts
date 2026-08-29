// Ambient module declarations for asset imports not covered by Next.js's
// own types (next/types/global.d.ts only declares "*.module.css").
// Keeps plain side-effect imports like `import "./globals.css"` valid even
// if TypeScript's `noUncheckedSideEffectImports` is ever enabled by default.
// See: https://github.com/microsoft/TypeScript/issues/63181
declare module "*.css";
