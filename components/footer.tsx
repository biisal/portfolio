import { ArrowUp } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const GITHUB_USERNAME = "biisal";
const WEEKS = 53;
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

type Contribution = {
  date: string;
  count: number;
  level: number;
};

type ContributionCell = Contribution & {
  week: number;
  day: number;
  delay: number;
  duration: number;
};

type ContributionResponse = {
  total: { lastYear?: number };
  contributions: Contribution[];
};

// Tints of the theme foreground so the graph follows the palette in globals.css.
const tone = (pct: number) =>
  `color-mix(in srgb, var(--foreground) ${pct}%, transparent)`;
// Empty -> full; the top level is the orange accent.
const LEVELS = [tone(6), tone(16), tone(32), tone(60), "var(--signal)"];

const toCells = (contributions: Contribution[]): ContributionCell[] => {
  if (contributions.length === 0) return [];

  // Align the grid to the Sunday on or before the first contribution date.
  const first = new Date(`${contributions[0].date}T00:00:00Z`);
  const origin = new Date(first);
  origin.setUTCDate(origin.getUTCDate() - origin.getUTCDay());

  return contributions.map((contribution, i) => {
    const date = new Date(`${contribution.date}T00:00:00Z`);
    const seed = Math.abs(Math.sin(i * 78.233) * 12345.6789) % 1;

    return {
      ...contribution,
      week: Math.floor(
        (date.getTime() - origin.getTime()) / (7 * 24 * 60 * 60 * 1000)
      ),
      day: date.getUTCDay(),
      delay: seed * 8,
      duration: 3 + seed * 4,
    };
  });
};

const getContributions = async () => {
  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) {
      throw new Error(`GitHub contributions: ${response.status}`);
    }

    const data = (await response.json()) as ContributionResponse;
    return {
      cells: toCells(data.contributions ?? []),
      total: data.total?.lastYear ?? 0,
    };
  } catch (error) {
    console.error("Failed to fetch GitHub contributions:", error);
    return { cells: [] as ContributionCell[], total: 0 };
  }
};

const labelClass = "font-mono text-xs uppercase tracking-[0.18em] text-blog-fg";

/** Activity grid for the weeks in the half-open range [start, end). */
const ContributionGraph = ({
  cells,
  start,
  end,
  className,
}: {
  cells: ContributionCell[];
  start: number;
  end: number;
  className?: string;
}) => {
  const weeks = end - start;
  const visible = cells.filter((cell) => cell.week >= start && cell.week < end);

  const monthLabels: { label: string; week: number }[] = [];
  const seenWeeks = new Set<number>();
  let lastMonth = -1;
  for (const cell of visible) {
    if (seenWeeks.has(cell.week)) continue;
    seenWeeks.add(cell.week);

    const month = new Date(`${cell.date}T00:00:00Z`).getUTCMonth();
    if (month !== lastMonth) {
      monthLabels.push({ label: MONTHS[month], week: cell.week - start });
      lastMonth = month;
    }
  }

  // Drop labels that would collide with the next one (e.g. a partial first month).
  const spacedLabels = monthLabels.filter((label, i) => {
    const next = monthLabels[i + 1];
    return !next || next.week - label.week >= 3;
  });

  return (
    <div
      className={cn("grid gap-[2px]", className)}
      style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
    >
      {spacedLabels.map(({ label, week }, i) => {
        const end = spacedLabels[i + 1]?.week ?? weeks;
        return (
          <span
            key={`${label}-${week}`}
            className={cn(labelClass, "pb-2")}
            style={{
              gridColumn: `${week + 1} / span ${Math.max(1, end - week)}`,
              gridRow: 1,
            }}
          >
            {label}
          </span>
        );
      })}
      {visible.map((cell) => (
        <span
          key={cell.date}
          className={cn(
            "aspect-square rounded-none",
            cell.level > 0 && "contrib-blink"
          )}
          style={{
            gridColumn: cell.week - start + 1,
            gridRow: cell.day + 2,
            backgroundColor: LEVELS[cell.level],
            animationDelay: `${cell.delay}s`,
            animationDuration: `${cell.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

const ContributionLegend = ({
  total,
  className,
}: {
  total: number;
  className?: string;
}) => (
  <div
    className={cn(
      labelClass,
      "flex flex-wrap items-center justify-between gap-2",
      className
    )}
  >
    <span>{total.toLocaleString("en-US")} contributions</span>
    <span className="flex items-center gap-2">
      less
      {LEVELS.map((level) => (
        <span
          key={level}
          className="size-2 rounded-none"
          style={{ backgroundColor: level }}
        />
      ))}
      more
    </span>
  </div>
);

const Footer = async () => {
  const { cells, total } = await getContributions();
  const totalWeeks = cells.length
    ? Math.max(...cells.map((cell) => cell.week)) + 1
    : WEEKS;
  const mobileStart = Math.max(0, totalWeeks - MOBILE_WEEKS);

  return (
    <footer className="mx-auto max-w-6xl px-6 pb-28 pt-8 md:px-10">
      <div className={cn(labelClass, "flex justify-end")}>
        <Link
          href="#intro"
          className="inline-flex items-center gap-1 transition-colors hover:text-blog-white"
        >
          Top
          <ArrowUp className="h-3.5 w-3.5" />
        </Link>
      </div>

      {cells.length > 0 ? (
        <div className="pt-20">
          <div className="hidden sm:block">
            <ContributionGraph cells={cells} start={0} end={totalWeeks} />
          </div>
          <div className="sm:hidden">
            <ContributionGraph
              cells={cells}
              start={mobileStart}
              end={totalWeeks}
            />
          </div>
          <ContributionLegend total={total} className="pt-4" />
        </div>
      ) : null}
    </footer>
  );
};

export default Footer;
