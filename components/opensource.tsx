"use client";

import { GitPullRequest } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
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
      className="relative flex w-full flex-col justify-center py-16"
    >
      <SectionHeading
        index="03"
        label="open source"
        title="Open source contributions"
        description="Pull requests and features I've contributed to the projects I use and love."
        className="mb-8"
      />

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
                  {repoData.icon && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={repoData.icon}
                      alt={repoData.repo}
                      className="h-6 w-6 object-cover shrink-0"
                    />
                  )}
                  <span>{repoData.repo}</span>
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
