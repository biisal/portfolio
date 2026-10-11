"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { email, social } from "@/lib/config";
import { cn } from "@/lib/utils";

const sections = [
  { id: "blogs", label: "Writing" },
  { id: "experience", label: "Experience" },
  { id: "opensource", label: "Open source" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Work" },
  { id: "contact", label: "Contact" },
];

export const Sidebar = () => {
  const [active, setActive] = useState("");

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="flex flex-col gap-12 pb-4 pt-20 lg:sticky lg:top-0 lg:h-screen lg:justify-between lg:py-24">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="font-serif text-6xl leading-none tracking-normal text-blog-white lg:text-7xl">
            Avisek
            <br />
            <span className="italic text-signal">Ray</span>
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
          <ul className="flex flex-col gap-3">
            {sections.map((section) => {
              const isActive = active === section.id;
              return (
                <li key={section.id}>
                  <Link
                    href={`#${section.id}`}
                    className="group flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em]"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "h-px bg-current transition-all duration-300",
                        isActive
                          ? "w-12 text-blog-white"
                          : "w-6 text-blog-fg group-hover:w-12 group-hover:text-blog-white"
                      )}
                    />
                    <span
                      className={cn(
                        "transition-colors",
                        isActive
                          ? "text-blog-white"
                          : "text-blog-fg group-hover:text-blog-white"
                      )}
                    >
                      {section.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 lg:flex-col lg:gap-y-1.5">
          {social.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blog-fg transition-colors hover:text-blog-white"
              >
                {label}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={`mailto:${email}`}
          className="font-mono text-xs text-blog-fg transition-colors hover:text-blog-white"
        >
          {email}
        </Link>
      </div>
    </aside>
  );
};
