"use client";

import { GitPullRequest } from "lucide-react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BlurFade } from "@/components/ui/blur-fade";
import { PULL_REQUESTS } from "@/lib/repos";

const Opensource = () => {
  return (
    <section
      id="opensource"
      className="relative flex w-full flex-col justify-center py-24"
    >
      <div className="mb-12">
        <BlurFade delay={0.25} inView>
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl md:text-5xl font-bold text-blog-white">
              <span className="text-blog-orange">Open Source</span>{" "}
              Contributions
            </h2>
            <p className="mt-2 text-base text-blog-fg/80 md:text-lg">
              Pull requests and features I&apos;ve contributed to the projects I
              use and love.
            </p>
          </div>
        </BlurFade>
      </div>

      <BlurFade delay={0.3} inView>
        <Accordion
          type="single"
          collapsible
          className="w-full flex flex-col gap-4"
        >
          {PULL_REQUESTS.map((repoData) => (
            <AccordionItem key={repoData.repo} value={repoData.repo}>
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <span>{repoData.repo}</span>
                  <span className="text-xs font-normal text-blog-fg/50 font-mono group-hover:text-blog-orange/70 transition-colors ml-1">
                    {repoData.prs.length}{" "}
                    {repoData.prs.length === 1 ? "PR" : "PRs"}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-6 pt-2 flex flex-col gap-4">
                  {repoData.prs.map((pr, prIdx) => (
                    <Link
                      key={prIdx}
                      href={pr.prUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-start gap-3 text-base text-blog-fg/80 hover:text-blog-white transition-colors"
                    >
                      <GitPullRequest className="h-5 w-5 text-blog-magenta shrink-0 mt-0.5 group-hover/link:text-blog-orange transition-colors" />
                      <span className="leading-relaxed border-b border-transparent group-hover/link:border-blog-orange transition-colors pb-0.5">
                        {pr.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </BlurFade>
    </section>
  );
};

export default Opensource;
