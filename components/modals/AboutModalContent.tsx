"use client";

import { Lightbulb } from "lucide-react";
import Image from "next/image";

export default function AboutModalContent() {
  return (
    <div className="p-8 md:p-12">
      {/* Header */}
      <div className="mb-8">
        <h2 id="modal-title" className="text-soft-black mb-2">
          About Me
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
              alt="Profile picture of Johannes Brannelid"
              fill
              className="rounded-full object-cover"
              sizes="128px"
            />
          </div>
        </div>

        {/* Introduction Text Section */}
        <article className="flex-1">
          <h3 className="text-charcoal mb-3">
            Fullstack Developer & Radiographer
          </h3>
          <p className="text-slate mb-4 leading-relaxed">
            Hi, I am{" "}
            <span className="text-moss-dark! text-lg!">Johannes Brannelid</span>
            . A fullstack developer in the final phase of my education, actively
            developing my skills in both frontend and backend technologies. I
            create intuitive and engaging digital experiences while expanding my
            expertise in scalable backend systems and seamless frontend
            interfaces.
          </p>
        </article>
      </section>

      {/* Philosophy Section */}
      <section className="bg-frost/25 mb-8 rounded-lg p-6">
        <h3 className="text-charcoal mb-3 flex items-center gap-2 text-lg">
          <Lightbulb className="text-ice size-6" />
          My Design Philosophy
        </h3>
        <p className="text-slate leading-relaxed italic">
          &quot;Guided by a Scandinavian design philosophy, my work is
          minimalist, scalable and functional. Designed to deliver elegant
          solutions regardless of project size&quot;
        </p>
      </section>

      {/* Skills Section */}
      <section className="mb-8">
        <h3 className="text-charcoal mb-4">Areas of expertise</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Frontend Development */}
          <div className="bg-sand/50 rounded-lg p-4">
            <div className="mb-2 flex items-start gap-3">
              <div>
                <h4 className="text-charcoal mb-1">Frontend </h4>
                <p className="m text-slate">
                  React, Next.js, TypeScript, Three.js, Tailwind CSS, Asp Net
                  MVC, BootStrap
                </p>
              </div>
            </div>
          </div>

          {/* Backend & Cloud */}
          <div className="bg-sand/50 rounded-lg p-4">
            <div className="mb-2 flex items-start gap-3">
              <div>
                <h4 className="text-charcoal mb-1">Backend & Cloud</h4>
                <p className="text-slate">
                  .NET Core, Azure, REST APIs, Docker
                </p>
              </div>
            </div>
          </div>

          {/* Tools */}
          <div className="bg-sand/50 rounded-lg p-4">
            <div className="mb-2 flex items-start gap-3">
              <div>
                <h4 className="text-charcoal mb-1">Tools</h4>
                <p className="text-slate">Git, GitHub, Jira, Figma</p>
              </div>
            </div>
          </div>

          {/* 3D & Animation */}
          <div className="bg-sand/50 rounded-lg p-4">
            <div className="mb-2 flex items-start gap-3">
              <div>
                <h4 className="text-charcoal mb-1">3D & Animation</h4>
                <p className="text-slate">Three.js, Blender, GSAP</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interests Section */}
      <section className="mb-12">
        <h3 className="text-charcoal mb-4 text-xl font-medium">
          Beyond Coding
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="badge">🎵 Music</span>
          <span className="badge">☕ Coffee</span>
          <span className="badge">🏃‍♂️ Running</span>
          <span className="badge">👨‍👩‍👧‍👦 Family Activities</span>
        </div>
      </section>
    </div>
  );
}
