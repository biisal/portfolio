"use client";

import { FileText, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cvUrl, email, social } from "@/lib/config";
import { useScrollSpy } from "@/lib/use-scroll-spy";
import { cn } from "@/lib/utils";
import AngryBird from "./angry-bird";

const sections = [
  { id: "blogs", label: "Writing" },
  { id: "experience", label: "Experience" },
  { id: "opensource", label: "Open source" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Work" },
  { id: "contact", label: "Contact" },
];

const SECTION_IDS = sections.map((section) => section.id);

export const Sidebar = () => {
  const active = useScrollSpy(SECTION_IDS);

  return (
    <aside className="flex flex-col gap-12 pb-4 pt-20 lg:sticky lg:top-0 lg:h-screen lg:justify-between lg:py-24">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="font-serif text-6xl leading-none tracking-normal text-blog-white lg:text-7xl">
            Avisek
            <br />
            <span className="italic text-signal">Ray</span>
            <AngryBird size={52} className="ml-3" />
          </h1>
          <p className="font-mono text-xs leading-6 text-blog-fg">
            Software Engineer
            <br />
            EnhanceAI Art
          </p>
          <p className="max-w-[16rem] text-sm leading-relaxed text-blog-fg">
            Database, backend design and frontend engineering.
          </p>
        </div>

        <nav aria-label="Sections" className="hidden lg:block">
          <ul className="flex flex-col border-l border-border">
            {sections.map((section) => {
              const isActive = active === section.id;
              return (
                <li key={section.id}>
                  <Link
                    href={`#${section.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "-ml-px block border-l py-1.5 pl-4 text-sm transition-colors",
                      isActive
                        ? "border-signal text-blog-white"
                        : "border-transparent text-blog-fg hover:border-ring hover:text-blog-white"
                    )}
                  >
                    {section.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 lg:flex-col lg:gap-y-1.5">
          <li>
            <Link
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-sm text-blog-white transition-colors hover:text-signal"
            >
              <FileText className="h-4 w-4 text-signal" />
              Resume
            </Link>
          </li>
          {social.map(({ label, href, icon }) => (
            <li key={label}>
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-sm text-blog-fg transition-colors hover:text-blog-white"
              >
                <Image
                  src={icon}
                  alt=""
                  width={16}
                  height={16}
                  className="h-4 w-4 object-contain"
                />
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2.5 font-mono text-xs text-blog-fg transition-colors hover:text-blog-white"
        >
          <Mail className="h-4 w-4 text-signal" />
          {email}
        </Link>
      </div>
    </aside>
  );
};
