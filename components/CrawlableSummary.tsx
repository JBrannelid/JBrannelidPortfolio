import { getTranslations } from "next-intl/server";

/* Always present in the DOM (visually hidden, not display:none) so search
 * engines and screen readers reading the page before any interaction can
 * see the same facts that otherwise only appear once a modal is opened. */
export default async function CrawlableSummary() {
  const t = await getTranslations("CrawlableSummary");
  const workExperience = t.raw("workExperience") as string[];
  const education = t.raw("education") as string[];

  return (
    <div className="sr-only">
      <h1>{t("heading")}</h1>
      <p>{t("bio")}</p>

      <h2>{t("workExperienceHeading")}</h2>
      <ul>
        {workExperience.map((entry) => (
          <li key={entry}>{entry}</li>
        ))}
      </ul>

      <h2>{t("educationHeading")}</h2>
      <ul>
        {education.map((entry) => (
          <li key={entry}>{entry}</li>
        ))}
      </ul>

      <h2>{t("technicalSkillsHeading")}</h2>
      <p>{t("technicalSkills")}</p>

      <h2>{t("contactHeading")}</h2>
      <p>{t("contactText")}</p>
    </div>
  );
}
