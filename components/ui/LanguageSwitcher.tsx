"use client";

import { LoaderCircle } from "lucide-react";
import { useLinkStatus } from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

interface LanguageSwitcherProps {
  // "card": flag + visible text label under each option (landing screen,
  // desktop in-experience nav) - explicit and colorblind-safe, needs room.
  // "compact": single icon-button toggle matching the mobile nav row's
  // existing icon-only buttons (same aria-label/title pattern, no GSAP,
  // just the row's own hover/active Tailwind transitions) - for contexts
  // too tight for the full card.
  variant?: "card" | "compact";
  className?: string;
}

// Drawn as SVG rather than using flag emoji (🇬🇧/🇸🇪): Windows doesn't have
// flag glyphs in its emoji font and falls back to literal "GB"/"SE" text,
// while phones render the actual flags - so desktop and mobile were
// showing visibly different things. SVG renders identically everywhere.
function GBFlagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true">
      <rect width="60" height="40" rx="4" fill="#00247d" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#cf142b" strokeWidth="3" />
      <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="13" />
      <path d="M30,0 V40 M0,20 H60" stroke="#cf142b" strokeWidth="8" />
    </svg>
  );
}

function SEFlagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true">
      <rect width="60" height="40" rx="4" fill="#006aa7" />
      <rect x="20" width="8" height="40" fill="#fecc00" />
      <rect y="16" width="60" height="8" fill="#fecc00" />
    </svg>
  );
}

const FLAGS = { en: GBFlagIcon, sv: SEFlagIcon };

// Rendered as a Link's child, `useLinkStatus` reports whether *that*
// specific navigation is in flight - swaps the flag for the same spinner
// already used for the contact form's pending state, so switching language
// doesn't read as unresponsive while the new locale's page loads.
function FlagOrSpinner({
  locale,
  iconSize,
}: {
  locale: "en" | "sv";
  iconSize: string;
}) {
  const { pending } = useLinkStatus();
  if (pending) {
    return (
      <LoaderCircle className={`${iconSize} animate-spin`} aria-hidden="true" />
    );
  }
  const Flag = FLAGS[locale];
  return <Flag className={`${iconSize} rounded-sm`} />;
}

export default function LanguageSwitcher({
  variant = "card",
  className = "",
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations("LanguageSwitcher");

  if (variant === "compact") {
    const nextLocale = locale === "en" ? "sv" : "en";
    const label =
      nextLocale === "en" ? t("switchToEnglish") : t("switchToSwedish");

    return (
      <Link
        href="/"
        locale={nextLocale}
        prefetch={false}
        aria-label={label}
        title={label}
        className={`bg-sand border-stone hover:bg-stone flex size-13 items-center justify-center rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
      >
        <FlagOrSpinner locale={nextLocale} iconSize="size-6" />
      </Link>
    );
  }

  return (
    // `fixed` (not `absolute`) so this positions itself against the
    // viewport regardless of which container it's mounted in - both the
    // landing screen's full-bleed overlay and Navigation's plain fragment.
    <div
      className={`bg-warm-white/90 border-stone/70 fixed top-4 right-4 z-40 flex gap-1 rounded-xl border p-1 shadow-lg backdrop-blur-md md:top-6 md:right-6 ${className}`}
    >
      <Link
        href="/"
        locale="en"
        prefetch={false}
        aria-label={t("switchToEnglish")}
        aria-current={locale === "en" ? "true" : undefined}
        className={`flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 transition-colors duration-200 ${
          locale === "en" ? "bg-moss-dark/10" : "hover:bg-sand/60"
        }`}
      >
        <FlagOrSpinner locale="en" iconSize="size-5" />
        <span className="text-charcoal text-[0.65rem] leading-tight font-medium">
          {t("english")}
        </span>
      </Link>
      <Link
        href="/"
        locale="sv"
        prefetch={false}
        aria-label={t("switchToSwedish")}
        aria-current={locale === "sv" ? "true" : undefined}
        className={`flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 transition-colors duration-200 ${
          locale === "sv" ? "bg-moss-dark/10" : "hover:bg-sand/60"
        }`}
      >
        <FlagOrSpinner locale="sv" iconSize="size-5" />
        <span className="text-charcoal text-[0.65rem] leading-tight font-medium">
          {t("swedish")}
        </span>
      </Link>
    </div>
  );
}
