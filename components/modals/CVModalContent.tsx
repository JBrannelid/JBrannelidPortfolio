"use client";

import { Github, Linkedin } from "lucide-react";
import { useTranslations } from "next-intl";

import { SOCIAL_LINKS } from "@/lib/constants";

interface ExperienceEntry {
  title: string;
  period: string;
  company: string;
  bullets: string[];
}

interface EducationEntry {
  title: string;
  period: string;
  school: string;
}

export default function CVModalContent() {
  const t = useTranslations("CV");
  const experience = t.raw("experience") as ExperienceEntry[];
  const education = t.raw("education") as EducationEntry[];
  const frontendItems = t.raw("frontendItems") as string[];
  const backendItems = t.raw("backendItems") as string[];
  const toolsCloudItems = t.raw("toolsCloudItems") as string[];

  return (
    <div className="p-8 md:p-12">
      {/* Header */}
      <div className="mb-8">
        <h2 id="modal-title" className="text-soft-black mb-2">
          {t("title")}
        </h2>
        {/* Divider */}
        <div className="divider"></div>
      </div>

      {/* Professional Summary */}
      <article className="mb-8">
        <h3 className="text-charcoal mb-3">{t("biographyHeading")}</h3>
        <p className="text-slate leading-relaxed">
          {t("biographyParagraph1")} <br />
          <br />
          {t("biographyParagraph2")}
        </p>
      </article>

      {/* Experience */}
      <section className="mb-8">
        <h3 className="text-charcoal mb-4">{t("workExperienceHeading")}</h3>
        <div className="space-y-6">
          {experience.map((entry, index) => (
            <div key={index} className="border-moss border-l-2 pl-4">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="text-charcoal">{entry.title}</h4>
                <span className="text-slate text-sm">{entry.period}</span>
              </div>
              <p className="text-slate mb-2 text-sm font-medium">
                {entry.company}
              </p>
              <ul className="text-slate list-inside list-disc space-y-1 text-sm">
                {entry.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <div className="mb-8">
        <h3 className="text-charcoal mb-4">{t("educationHeading")}</h3>
        {education.map((entry, index) => (
          <div key={index}>
            <div className="border-ice border-l-2 pl-4">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="text-charcoal mb-1">{entry.title}</h4>
                <p className="text-slate">{entry.period}</p>
              </div>
              <p className="text-slate mb-1">{entry.school}</p>
            </div>
            {index < education.length - 1 && <br />}
          </div>
        ))}
      </div>

      {/* Technical Skills */}
      <section className="mb-8">
        <h3 className="text-charcoal mb-4">
          {t("technicalExpertiseHeading")}
        </h3>
        <div className="border-border-sand grid grid-cols-2 gap-4 border-l-2 pl-4 md:grid-cols-3">
          <div>
            <h4 className="text-charcoal mb-2 tracking-wide">
              {t("frontendLabel")}
            </h4>
            <ul className="text-slate space-y-1">
              {frontendItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-charcoal mb-2 tracking-wide">
              {t("backendLabel")}
            </h4>
            <ul className="text-slate space-y-1">
              {backendItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-charcoal mb-2 font-medium tracking-wide">
              {t("toolsCloudLabel")}
            </h4>
            <ul className="text-slate space-y-1">
              {toolsCloudItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="mb-8">
        <h3 className="text-charcoal mb-4">{t("certificationsHeading")}</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="bg-moss size-2 rounded-full"></div>
            <span className="text-slate">{t("certLeadership")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-moss size-2 rounded-full"></div>
            <span className="text-slate">{t("certDriversLicense")}</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="divider-full"></div>
      <section className="mb-12 pt-6">
        <p className="text-slate mb-4 text-center">{t("footerPrompt")}</p>
        <div className="flex justify-center gap-3">
          {/* LinkedIn */}
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-charcoal text-warm-white! ease flex transform items-center gap-2 rounded-lg px-4 py-2 transition duration-600 hover:scale-105 hover:opacity-90"
          >
            <Linkedin className="size-4" />
            {t("linkedinButton")}
          </a>

          {/* GitHub */}
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-charcoal text-warm-white! ease flex transform items-center gap-2 rounded-lg px-4 py-2 transition duration-600 hover:scale-105 hover:opacity-90"
          >
            <Github className="size-4" />
            {t("githubButton")}
          </a>
        </div>
      </section>
    </div>
  );
}
