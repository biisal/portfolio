"use client";
import { motion } from "framer-motion";
import Image from "next/image";

import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";

interface Language {
  name: string;
  percent: number;
}

interface SkillsProps {
  languages: Language[];
}

const Skills = ({ languages }: SkillsProps) => {
  const competencies = [
    "Backend Development",
    "Frontend Development",
    "Database Architecture",
    "API Design",
    "System Optimization",
    "Cloud Infrastructure",
  ];

  const toolsGrid = [
    { name: "Python", icon: "/icons/Python-Dark.svg" },
    { name: "TypeScript", icon: "/icons/TypeScript.svg" },
    { name: "Go", icon: "/icons/Go.svg" },

    { name: "Next.js", icon: "/icons/NextJS-Dark.svg" },
    { name: "React", icon: "/icons/React-Dark.svg" },
    { name: "FastAPI", icon: "/icons/FastAPI.svg" },

    { name: "PostgreSQL", icon: "/icons/PostgreSQL-Dark.svg" },
    { name: "MongoDB", icon: "/icons/MongoDB.svg" },
    { name: "Redis", icon: "/icons/Redis-Dark.svg" },

    { name: "Docker", icon: "/icons/Docker.svg" },
    { name: "Git", icon: "/icons/Git.svg" },
    { name: "Linux", icon: "/icons/Linux-Dark.svg" },
    { name: "AWS", icon: "/icons/AWS-Dark.svg" },
    { name: "Nginx", icon: "/icons/Nginx.svg" },
  ];

  const displayLanguages = languages ? languages.slice(0, 5) : [];

  return (
    <section
      id="skills"
      className={cn("relative flex w-full flex-col justify-center py-24")}
    >
      <h2 className="mb-6 text-4xl font-bold text-blog-white md:text-5xl">
        <span className="text-blog-orange">Skills</span> & Tools
      </h2>
      <div className="z-10 px-4 flex w-full flex-col gap-8">
        <div className="flex flex-col gap-12">
          <BlurFade delay={0.25} inView>
            <div>
              <ul className="grid grid-cols-1 w-fit  sm:grid-cols-2 gap-x-24 gap-y-3 text-sm md:text-base text-blog-fg/80">
                {competencies.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex text-sm font-bold items-center gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blog-orange inline-block" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </BlurFade>

          <BlurFade delay={0.35} inView>
            <div className="flex  flex-wrap gap-8 max-w-sm items-center justify-start">
              {toolsGrid.map((tool, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform">
                    <Image
                      src={tool.icon}
                      alt={tool.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs text-blog-fg/80 font-medium group-hover:text-blog-white transition-colors">
                    {tool.name}
                  </span>
                </div>
              ))}
            </div>
          </BlurFade>

          <BlurFade delay={0.45} inView>
            <div className="w-full max-w-md mt-4">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-xl font-bold text-blog-orange uppercase tracking-wider">
                  Languages
                </h3>
                <span className="text-xs text-blog-fg/55">(Last 7 Days)</span>
              </div>
              <div className="flex flex-col gap-3">
                {displayLanguages.map((lang, idx) => (
                  <div key={idx} className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-blog-white font-medium">
                        {lang.name}
                      </span>
                      <span className="text-xs text-blog-fg/80">
                        {lang.percent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-1 w-full bg-blog-selection-bg rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${lang.percent}%` }}
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                          delay: 0.2 + idx * 0.1,
                        }}
                        className="h-full bg-blog-orange rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
};

export default Skills;
