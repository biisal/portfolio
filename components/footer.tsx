import { ArrowUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { email } from "@/lib/config";
import { cn } from "@/lib/utils";
import { LocalTime } from "./local-time";

const WEEKS = 53;
const DAYS = 7;
const MOBILE_WEEKS = 27;
const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

// Tints of the theme foreground so the graph follows the palette in globals.css.
const tone = (pct: number) =>
  `color-mix(in srgb, var(--foreground) ${pct}%, transparent)`;
// Empty -> full; the top level is the orange accent.
const LEVELS = [tone(6), tone(16), tone(32), tone(60), "var(--signal)"];

// Deterministic pseudo-random so server and client render the same grid.
const cells = Array.from({ length: WEEKS * DAYS }, (_, i) => {
  const r = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
  const level = r < 0.4 ? 0 : r < 0.66 ? 1 : r < 0.84 ? 2 : r < 0.96 ? 3 : 4;
  const d = Math.abs(Math.sin(i * 78.233) * 12345.6789) % 1;
  return {
    week: Math.floor(i / DAYS),
    day: i % DAYS,
    level,
    delay: d * 8,
    duration: 3 + d * 4,
  };
});

const labelClass = "font-mono text-xs uppercase tracking-[0.18em] text-blog-fg";

/** Decorative activity grid showing the last `weeks` weeks, month labels pinned to their week columns. */
const ContributionGraph = ({
  weeks,
  className,
}: {
  weeks: number;
  className?: string;
}) => {
  const first = WEEKS - weeks;
  const months = MONTHS.slice(MONTHS.length - Math.round((weeks / WEEKS) * 12));

  return (
    <div aria-hidden className={cn("flex w-full flex-col gap-4", className)}>
      <div
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
      >
        {months.map((m, idx) => {
          const start = Math.floor((idx * weeks) / months.length);
          const end = Math.floor(((idx + 1) * weeks) / months.length);
          return (
            <span
              key={m}
              className={cn(labelClass, "pb-2")}
              style={{
                gridColumn: `${start + 1} / span ${end - start}`,
                gridRow: 1,
              }}
            >
              {m}
            </span>
          );
        })}
        {cells
          .filter((c) => c.week >= first)
          .map((c) => (
            <span
              key={`${c.week}-${c.day}`}
              className={cn(
                "aspect-square rounded-full",
                c.level > 0 && "contrib-blink"
              )}
              style={{
                gridColumn: c.week - first + 1,
                gridRow: c.day + 2,
                backgroundColor: LEVELS[c.level],
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
              }}
            />
          ))}
      </div>

      <div className={cn(labelClass, "flex items-center justify-end gap-2")}>
        less
        {LEVELS.map((l) => (
          <span
            key={l}
            className="size-2 rounded-full"
            style={{ backgroundColor: l }}
          />
        ))}
        more
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="mx-auto max-w-6xl px-6 pb-28 pt-8 md:px-10">
      {/* Same mono rule as SectionHeading, continuing the 01-06 numbering. */}
      <div className={cn(labelClass, "flex items-center gap-4")}>
        <span>07</span>
        <span>end of page</span>
        <span aria-hidden className="h-px flex-1 bg-border" />
        <Link
          href="#intro"
          className="inline-flex items-center gap-1 transition-colors hover:text-blog-white"
        >
          Top
          <ArrowUp className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex flex-col gap-6 pt-20 md:flex-row md:items-end md:justify-between">
        <h2 className="font-serif text-4xl leading-[1.05] tracking-normal text-blog-white  md:text-5xl">
          Thanks for scrolling.
          <br />
          <span className="italic text-signal">Say hello.</span>
        </h2>
        <Link
          href={`mailto:${email}`}
          className="group inline-flex w-fit items-center gap-2 pb-2 font-mono text-sm text-blog-fg transition-colors hover:text-signal"
        >
          {email}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="pt-20">
        <ContributionGraph weeks={WEEKS} className="hidden sm:flex" />
        <ContributionGraph weeks={MOBILE_WEEKS} className="sm:hidden" />
      </div>

      <div className="mt-16 grid gap-3 border-t border-border pt-6 font-mono text-xs text-blog-fg sm:grid-cols-3 sm:items-center">
        <span>© {new Date().getFullYear()} Avisek Ray</span>
        <span className="sm:justify-self-center">
          <LocalTime />
        </span>
        <span className="sm:justify-self-end">Built with Free Time</span>
      </div>
    </footer>
  );
};

export default Footer;
