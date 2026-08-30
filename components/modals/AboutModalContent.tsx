"use client";

import { Lightbulb } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function AboutModalContent() {
  const t = useTranslations("About");

  return (
    <div className="p-8 md:p-12">
      {/* Header */}
      <div className="mb-8">
        <h2 id="modal-title" className="text-soft-black mb-2">
          {t("title")}
        </h2>
        <div className="divider"></div>
      </div>

      {/* Profile Image and Introduction */}
      <section className="mb-8 flex flex-col items-start gap-6 md:flex-row">
        {/* Profile Picture */}
        <div className="shrink-0">
          <div className="from-sage to-moss relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-linear-to-br shadow-lg">
            <Image
              src="/images/Profilbild1-removebg-preview.png"
              alt={t("profileAlt")}
              fill
              className="rounded-full object-cover"
              sizes="128px"
            />
          </div>
        </div>

        {/* Introduction Text Section */}
        <article className="flex-1">
          <h3 className="text-charcoal mb-3">{t("roleHeading")}</h3>
          <p className="text-slate mb-4 leading-relaxed">
            {t("bioIntro")}{" "}
            <span className="text-moss-dark! text-lg!">Johannes Brannelid</span>
            . {t("bioParagraph1")} <br />
            <br />
            {t("bioParagraph2")}
          </p>
        </article>
      </section>

      {/* Philosophy Section */}
      <section className="bg-frost/25 mb-8 rounded-lg p-6">
        <h3 className="text-charcoal mb-3 flex items-center gap-2 text-lg">
          <Lightbulb className="text-ice size-6" />
          {t("philosophyHeading")}
        </h3>
        <p className="text-slate leading-relaxed italic">
          &quot;{t("philosophyQuote")}&quot;
        </p>
      </section>

      {/* Skills Section */}
      <section className="mb-8">
        <h3 className="text-charcoal mb-4">{t("expertiseHeading")}</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Frontend Development */}
          <div className="bg-sand/50 rounded-lg p-4">
            <div className="mb-2 flex items-start gap-3">
              <div>
                <h4 className="text-charcoal mb-1">{t("frontend")} </h4>
                <p className="m text-slate">{t("frontendSkills")}</p>
              </div>
            </div>
          </div>

          {/* Backend & Cloud */}
          <div className="bg-sand/50 rounded-lg p-4">
            <div className="mb-2 flex items-start gap-3">
              <div>
                <h4 className="text-charcoal mb-1">{t("backendCloud")}</h4>
                <p className="text-slate">{t("backendCloudSkills")}</p>
              </div>
            </div>
          </div>

          {/* Tools */}
          <div className="bg-sand/50 rounded-lg p-4">
            <div className="mb-2 flex items-start gap-3">
              <div>
                <h4 className="text-charcoal mb-1">{t("tools")}</h4>
                <p className="text-slate">{t("toolsSkills")}</p>
              </div>
            </div>
          </div>

          {/* 3D & Animation */}
          <div className="bg-sand/50 rounded-lg p-4">
            <div className="mb-2 flex items-start gap-3">
              <div>
                <h4 className="text-charcoal mb-1">{t("animation3d")}</h4>
                <p className="text-slate">{t("animation3dSkills")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interests Section */}
      <section className="mb-12">
        <h3 className="text-charcoal mb-4 text-xl font-medium">
          {t("interestsHeading")}
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="badge">🎵 {t("interestMusic")}</span>
          <span className="badge">☕ {t("interestCoffee")}</span>
          <span className="badge">🏃‍♂️ {t("interestRunning")}</span>
          <span className="badge">👨‍👩‍👧‍👦 {t("interestFamily")}</span>
        </div>
      </section>
    </div>
  );
}
