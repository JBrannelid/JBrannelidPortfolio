"use client";

import { Github, Linkedin } from "lucide-react";

import { SOCIAL_LINKS } from "@/lib/constants";

export default function CVModalContent() {
  return (
    <div className="p-8 md:p-12">
      {/* Header */}
      <div className="mb-8">
        <h2 id="modal-title" className="text-soft-black mb-2">
          Career Overview
        </h2>
        {/* Divider */}
        <div className="divider"></div>
      </div>

      {/* Professional Summary */}
      <article className="mb-8">
        <h3 className="text-charcoal mb-3">Biography</h3>
        <p className="text-slate leading-relaxed">
          I come from a background in healthcare, leadership and sales. Today, I
          work as a Software Developer at Alma Health AB, where I develop and
          maintain solutions across the .NET ecosystem. My work includes backend
          development, SQL Server, external API integrations and improving
          existing systems. <br />
          <br />
          Outside of work, I spend time exploring modern frontend development
          and building personal projects with technologies such as Next.js.
        </p>
      </article>

      {/* Experience */}
      <section className="mb-8">
        <h3 className="text-charcoal mb-4">Work Experience</h3>
        <div className="space-y-6">
          {/* Experience Item 0 - Current Role */}
          <div className="border-moss border-l-2 pl-4">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <h5 className="text-charcoal">Software Developer</h5>
              <span className="text-slate text-sm">May 2026 - Ongoing</span>
            </div>
            <p className="text-slate mb-2 text-sm font-medium">
              Alma Health AB
            </p>
            <ul className="text-slate list-inside list-disc space-y-1 text-sm">
              <li>Full-time (100%)</li>
              <li>
                Development and maintenance of applications using VB.NET,
                WinForms, .NET Framework and .NET 7
              </li>
              <li>SQL Server and T-SQL development</li>
              <li>Data mapping and integrations with external APIs</li>
            </ul>
          </div>

          {/* Experience Item 1 */}
          <div className="border-moss border-l-2 pl-4">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <h5 className="text-charcoal">Radiographer</h5>
              <span className="text-slate text-sm">Aug 2026</span>
            </div>
            <p className="text-slate mb-2 text-sm font-medium">
              Stockholm - University Hospital
            </p>
            <ul className="text-slate list-inside list-disc space-y-1 text-sm">
              <li>Hourly employment</li>
              <li>Emergency care and trauma imaging</li>
            </ul>
          </div>

          {/* Experience Item 2 */}
          <div className="border-moss border-l-2 pl-4">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <h5 className="text-charcoal">First Line Manager</h5>
              <span className="text-slate text-sm">2021 - 2023</span>
            </div>
            <p className="text-slate mb-2 text-sm font-medium">
              Stockholm - University Hospital
            </p>
            <ul className="text-slate list-inside list-disc space-y-1 text-sm">
              <li>Team Leadership</li>
              <li>Staff Development</li>
              <li>Healthcare Administration</li>
            </ul>
          </div>
          {/* Experience Item 3 */}
          <div className="border-moss border-l-2 pl-4">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <h5 className="text-charcoal">Radiographer</h5>
              <span className="text-slate">2017 - 2021</span>
            </div>
            <p className="text-slate mb-2 font-medium">
              Stockholm - University Hospital
            </p>
            <ul className="text-slate list-inside list-disc space-y-1">
              <li>Radiography</li>
              <li>Unit Management</li>
              <li>Mentoring</li>
            </ul>
          </div>
          {/* Experience Item 4 */}
          <div className="border-moss border-l-2 pl-4">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <h5 className="text-charcoal">Deputy Store Manager / Staff</h5>
              <span className="text-slate">2012 - 2017</span>
            </div>
            <p className="text-slate mb-2 font-medium">
              Stockholm - University Hospital
            </p>
            <ul className="text-slate list-inside list-disc space-y-1">
              <li>Retail Management</li>
              <li>Customer Service</li>
              <li>Team Leadership</li>
              <li>Sales</li>
            </ul>
          </div>
          {/* Experience Item 5 */}
          <div className="border-moss border-l-2 pl-4">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <h5 className="text-charcoal">Waiter / HealtCare</h5>
              <span className="text-slate">2008 - 2012</span>
            </div>
            <p className="text-slate mb-2 font-medium">Stockholm</p>
            <ul className="text-slate list-inside list-disc space-y-1">
              <li>Customer Service</li>
              <li>Food Service</li>
              <li>Team Work</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Education */}
      <div className="mb-8">
        <h3 className="text-charcoal mb-4">Education</h3>
        {/* Education 1 */}

        <div className="border-ice border-l-2 pl-4">
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <h5 className="text-charcoal mb-1">Fullstack .NET</h5>
            <p className="text-slate">2024 - ongoing</p>
          </div>
          <p className="text-slate mb-1">Chas Academy | Stockholm</p>
        </div>

        <br />

        {/* Education 2 */}

        <div className="border-ice border-l-2 pl-4">
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <h5 className="text-charcoal mb-1">Radiography</h5>
            <p className="text-slate">2014 - 2017</p>
          </div>
          <p className="text-slate mb-1">Uppsala University </p>
        </div>
      </div>

      {/* Technical Skills */}
      <section className="mb-8">
        <h3 className="text-charcoal mb-4">Technical Expertise</h3>
        <div className="border-border-sand grid grid-cols-2 gap-4 border-l-2 pl-4 md:grid-cols-3">
          <div>
            <h5 className="text-charcoal mb-2 tracking-wide">Frontend</h5>
            <ul className="text-slate space-y-1">
              <li>React / Next.js </li>
              <li>Asp Net MVC</li>
              <li>TypeScript / JavaScript</li>
              <li>Tailwind CSS / BootStrap</li>
              <li>Three.js / GSAP</li>
            </ul>
          </div>
          <div>
            <h5 className="text-charcoal mb-2 tracking-wide">Backend</h5>
            <ul className="text-slate space-y-1">
              <li>.NET Core / .NET Framework</li>
              <li>REST APIs</li>
              <li>SQL Server / T-SQL</li>
            </ul>
          </div>
          <div>
            <h5 className="text-charcoal mb-2 font-medium tracking-wide">
              Tools & Cloud
            </h5>
            <ul className="text-slate space-y-1">
              <li>Azure</li>
              <li>Git / GitHub</li>
              <li>Docker</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="mb-8">
        <h3 className="text-charcoal mb-4">Certifications</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="bg-moss size-2 rounded-full"></div>
            <span className="text-slate">Leadership Training</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-moss size-2 rounded-full"></div>
            <span className="text-slate">Driver&apos;s License Type B</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="divider-full"></div>
      <section className="mb-12 pt-6">
        <p className="text-slate mb-4 text-center">
          Interested in seeing more projects or contacting me?
        </p>
        <div className="flex justify-center gap-3">
          {/* LinkedIn */}
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-charcoal text-warm-white! ease flex transform items-center gap-2 rounded-lg px-4 py-2 transition duration-600 hover:scale-105 hover:opacity-90"
          >
            <Linkedin className="size-4" />
            LinkedIn
          </a>

          {/* GitHub */}
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-charcoal text-warm-white! ease flex transform items-center gap-2 rounded-lg px-4 py-2 transition duration-600 hover:scale-105 hover:opacity-90"
          >
            <Github className="size-4" />
            GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
