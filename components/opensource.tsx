"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { SectionHeading } from "@/components/section-heading";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { PULL_REQUESTS } from "@/lib/repos";

/** Projects shown before "Show all". */
const REPO_LIMIT = 4;
/** Pull requests shown per project before "+N more". */
const PR_LIMIT = 2;

const prNumber = (url: string) => url.match(/\/pull\/(\d+)/)?.[1];

const Opensource = () => {
  const [showAllRepos, setShowAllRepos] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const repoCount = PULL_REQUESTS.length;
  const prCount = PULL_REQUESTS.reduce((sum, repo) => sum + repo.prs.length, 0);
  const visibleRepos = showAllRepos
    ? PULL_REQUESTS
    : PULL_REQUESTS.slice(0, REPO_LIMIT);

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
        className="mb-6"
      />

      <BlurFade delay={0.2} inView>
        <p className="mb-6 font-mono text-xs text-blog-fg">
          {repoCount} projects · {prCount} pull requests
        </p>

        <ul className="divide-y divide-border border-y border-border">
          {visibleRepos.map((repo) => {
            const isOpen = !!expanded[repo.repo];
            const visiblePrs = isOpen ? repo.prs : repo.prs.slice(0, PR_LIMIT);
            const hiddenCount = repo.prs.length - PR_LIMIT;

            return (
              <li
                key={repo.repo}
                className="grid gap-4 py-6 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8"
              >
                <div className="flex items-start gap-3">
                  {repo.icon ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={repo.icon}
                      alt=""
                      loading="lazy"
                      className="h-6 w-6 shrink-0 rounded-md border border-border object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="h-6 w-6 shrink-0 rounded-md border border-border"
                    />
                  )}
                  <div className="min-w-0">
                    {repo.repoUrl ? (
                      <a
                        href={repo.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-words font-medium leading-6 text-blog-white transition-colors hover:text-signal"
                      >
                        {repo.repo}
                      </a>
                    ) : (
                      <span className="break-words font-medium leading-6 text-blog-white">
                        {repo.repo}
                      </span>
                    )}
                    <p className="mt-0.5 font-mono text-xs text-blog-fg">
                      {repo.prs.length} {repo.prs.length === 1 ? "PR" : "PRs"}
                    </p>
                  </div>
                </div>

                <div>
                  <ul className="flex flex-col gap-3">
                    {visiblePrs.map((pr) => {
                      const number = prNumber(pr.prUrl);
                      return (
                        <li key={pr.prUrl}>
                          <a
                            href={pr.prUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-baseline gap-4"
                          >
                            <span className="w-16 shrink-0 font-mono text-xs text-blog-fg">
                              {number ? `#${number}` : "PR"}
                            </span>
                            <span className="min-w-0 flex-1 text-sm leading-relaxed text-blog-fg transition-colors group-hover:text-signal">
                              {pr.title}
                            </span>
                            <ArrowUpRight className="h-4 w-4 shrink-0 self-center text-blog-fg opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal group-hover:opacity-100" />
                          </a>
                        </li>
                      );
                    })}
                  </ul>

                  {hiddenCount > 0 ? (
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() =>
                        setExpanded((prev) => ({
                          ...prev,
                          [repo.repo]: !prev[repo.repo],
                        }))
                      }
                      className="mt-3 cursor-pointer pl-20 font-mono text-xs text-blog-fg transition-colors hover:text-blog-white sm:pl-20"
                    >
                      {isOpen ? "Show less" : `+${hiddenCount} more`}
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>

        {repoCount > REPO_LIMIT ? (
          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              aria-expanded={showAllRepos}
              onClick={() => setShowAllRepos((value) => !value)}
            >
              {showAllRepos
                ? "Show fewer projects"
                : `Show all ${repoCount} projects`}
            </Button>
          </div>
        ) : null}
      </BlurFade>
    </section>
  );
};

export default Opensource;
