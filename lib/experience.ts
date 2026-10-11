export interface ExperienceItem {
  role: string;
  company: string;
  /** e.g. "2024 — Present". Shown in the mono column on the left. */
  period?: string;
  /** Optional company link. */
  url?: string;
  /** One or two sentences on what you do / did. */
  summary: string;
  /** Optional bullet points: concrete things you shipped or improved. */
  highlights?: string[];
  /** Optional tools used in this role. */
  stack?: string[];
}

/** Newest first. Add past roles below; every field except role, company and summary is optional. */
export const experience: ExperienceItem[] = [
  {
    role: "Software Engineer",
    company: "EnhanceAI Art",
    period: "Present",
    summary: "Building full-stack systems and AI-powered products.",
    // Uncomment and fill in what you actually did:
    // highlights: [
    //   "Built X that does Y (result: Z).",
    //   "Designed the database / API for ...",
    //   "Cut latency / cost / bugs by ...",
    // ],
    // stack: ["TypeScript", "Go", "PostgreSQL"],
  },
];
