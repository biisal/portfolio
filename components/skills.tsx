"use client";
import { motion } from "framer-motion";
import Image from "next/image";

import { SectionHeading } from "@/components/section-heading";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";

interface Language {
  name: string;
  percent: number;
}

interface SkillsProps {
  languages: Language[];
}

interface Tool {
  name: string;
  icon: string;
}

interface ToolGroup {
  title: string;
  tools: Tool[];
}

const competencies = [
  "Backend development",
  "Frontend development",
  "Database architecture",
  "API design",
  "System optimization",
  "Cloud infrastructure",
];

const toolGroups: ToolGroup[] = [
  {
    title: "Languages",
    tools: [
      { name: "Python", icon: "/icons/Python-Dark.svg" },
      { name: "TypeScript", icon: "/icons/TypeScript.svg" },
      { name: "Go", icon: "/icons/Go.svg" },
    ],
  },
  {
    title: "Frameworks",
    tools: [
      { name: "Next.js", icon: "/icons/NextJS-Dark.svg" },
      { name: "React", icon: "/icons/React-Dark.svg" },
      { name: "FastAPI", icon: "/icons/FastAPI.svg" },
      { name: "NestJS", icon: "/icons/NestJS.svg" },
    ],
  },
  {
    title: "Data",
    tools: [
      { name: "PostgreSQL", icon: "/icons/PostgreSQL-Dark.svg" },
      { name: "MongoDB", icon: "/icons/MongoDB.svg" },
      { name: "Redis", icon: "/icons/Redis-Dark.svg" },
      { name: "Prisma", icon: "/icons/Prisma.svg" },
    ],
  },
  {
    title: "Infra & tooling",
    tools: [
      { name: "Docker", icon: "/icons/Docker.svg" },
      { name: "AWS", icon: "/icons/AWS-Dark.svg" },
      { name: "Nginx", icon: "/icons/Nginx.svg" },
      { name: "Linux", icon: "/icons/Linux-Dark.svg" },
      { name: "Git", icon: "/icons/Git.svg" },
      { name: "Turborepo", icon: "/icons/Turborepo.svg" },
    ],
  },
];

const Skills = ({ languages }: SkillsProps) => {
  const displayLanguages = languages ? languages.slice(0, 5) : [];

  return (
    <section
      id="skills"
      className={cn("relative flex w-full flex-col justify-center py-16")}
    >
      <SectionHeading
        index="03"
        label="skills"
        title="Skills & tools"
        description={competencies.join(" · ")}
        className="mb-8"
      />

      <div className="flex w-full flex-col gap-12">
        <BlurFade delay={0.2} inView>
          <dl className="divide-y divide-border border-y border-border">
            {toolGroups.map((group) => (
              <div
                key={group.title}
                className="grid gap-3 py-5 sm:grid-cols-[10rem_1fr]"
              >
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-blog-fg">
                  {group.title}
                </dt>
                <dd>
                  <ul className="flex flex-wrap gap-x-6 gap-y-3">
                    {group.tools.map((tool) => (
                      <li
                        key={tool.name}
                        className="flex items-center gap-2 text-sm text-blog-white"
                      >
                        <Image
                          src={tool.icon}
                          alt=""
                          width={16}
                          height={16}
                          className="h-4 w-4 object-contain"
                        />
                        {tool.name}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </BlurFade>

        {displayLanguages.length > 0 ? (
          <BlurFade delay={0.3} inView>
            <div className="max-w-md">
              <h3 className="text-sm text-blog-white">Languages this week</h3>
              <p className="mb-5 mt-1 text-xs text-blog-fg">
                Last 7 days via WakaTime, excluding company projects
              </p>
              <div className="flex flex-col gap-4">
                {displayLanguages.map((lang, idx) => (
                  <div key={lang.name}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-blog-white">{lang.name}</span>
                      <span className="font-mono text-xs text-blog-fg">
                        {lang.percent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-blog-selection-bg">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${lang.percent}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.8,
                          ease: "easeOut",
                          delay: 0.1 + idx * 0.08,
                        }}
                        className="h-full rounded-full bg-blog-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        ) : null}
      </div>
    </section>
  );
};

export default Skills;
