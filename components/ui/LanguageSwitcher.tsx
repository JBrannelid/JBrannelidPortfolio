"use client";

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
        aria-label={label}
        title={label}
        className={`bg-sand border-stone hover:bg-stone flex size-13 items-center justify-center rounded-lg border text-xl transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
      >
        <span aria-hidden="true">{nextLocale === "en" ? "🇬🇧" : "🇸🇪"}</span>
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
        aria-label={t("switchToEnglish")}
        aria-current={locale === "en" ? "true" : undefined}
        className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors duration-200 ${
          locale === "en" ? "bg-moss-dark/10" : "hover:bg-sand/60"
        }`}
      >
        <span aria-hidden="true" className="text-lg leading-none">
          🇬🇧
        </span>
        <span className="text-charcoal text-[0.65rem] leading-tight font-medium">
          {t("english")}
        </span>
      </Link>
      <Link
        href="/"
        locale="sv"
        aria-label={t("switchToSwedish")}
        aria-current={locale === "sv" ? "true" : undefined}
        className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors duration-200 ${
          locale === "sv" ? "bg-moss-dark/10" : "hover:bg-sand/60"
        }`}
      >
        <span aria-hidden="true" className="text-lg leading-none">
          🇸🇪
        </span>
        <span className="text-charcoal text-[0.65rem] leading-tight font-medium">
          {t("swedish")}
        </span>
      </Link>
    </div>
  );
}
