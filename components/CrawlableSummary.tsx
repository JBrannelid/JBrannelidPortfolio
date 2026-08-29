/* Always present in the DOM (visually hidden, not display:none) so search
 * engines and screen readers reading the page before any interaction can
 * see the same facts that otherwise only appear once a modal is opened. */
export default function CrawlableSummary() {
  return (
    <div className="sr-only">
      <h1>Johannes Brannelid — Fullstack Developer</h1>
      <p>
        I come from a background in healthcare, leadership and sales. Today, I
        work as a Software Developer at Alma Health AB, where I develop and
        maintain solutions across the .NET ecosystem. My work includes backend
        development, SQL Server, external API integrations and improving
        existing systems. Outside of work, I spend time exploring modern
        frontend development and building personal projects with technologies
        such as Next.js, React, TypeScript and Three.js.
      </p>

      <h2>Work Experience</h2>
      <ul>
        <li>Software Developer, Alma Health AB — May 2026 - Ongoing</li>
        <li>Radiographer, Stockholm University Hospital — until Aug 2026</li>
        <li>First Line Manager, Stockholm University Hospital — 2021-2023</li>
        <li>Radiographer, Stockholm University Hospital — 2017-2021</li>
        <li>Deputy Store Manager / Staff — 2012-2017</li>
        <li>Waiter / Healthcare — 2008-2012</li>
      </ul>

      <h2>Education</h2>
      <ul>
        <li>Fullstack .NET, Chas Academy, Stockholm — 2024-ongoing</li>
        <li>Radiography, Uppsala University — 2014-2017</li>
      </ul>

      <h2>Technical Skills</h2>
      <p>
        Frontend: React, Next.js, TypeScript, JavaScript, Three.js, GSAP,
        Tailwind CSS, ASP.NET MVC, Bootstrap. Backend: .NET Core, .NET
        Framework, REST APIs, SQL Server, T-SQL. Tools & Cloud: Azure, Git,
        GitHub, Docker.
      </p>

      <h2>Contact</h2>
      <p>
        Based in Stockholm, Sweden. Available via the contact form on this site.
      </p>
    </div>
  );
}
