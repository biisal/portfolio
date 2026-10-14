export interface ExperienceItem {
  role: string;
  company: string;
  period?: string;
  url?: string;
  summary: string;
  highlights?: string[];
  stack?: string[];
}

/** Newest first. Add past roles below; every field except role, company and summary is optional. */
export const experience: ExperienceItem[] = [
  {
    role: "Software Engineer & Team Lead",
    company: "EnhanceAI Art",
    period: "Dec 2025 — Oct 2026",
    summary:
      "Lead full-stack development of an AI creation platform and manage the engineering team - planning work, reviewing code, and shipping across web, API, and infrastructure.",
    highlights: [
      "Designed the AI generation pipeline (provider adapters, signed webhooks, and a background polling worker) powering image, video, audio, and text models.",
      "Built the public REST API for external developers - API-key auth, OpenAPI documentation, request validation, and a stable typed error contract.",
      "Delivered self-service API key and webhook management, usage-based billing, and user-owned storage uploads with automatic fallback.",
      "Raised test coverage with integration tests running against real Postgres, Redis, and Mongo containers.",
      "Managed the team day-to-day: implementing features, task breakdown, code reviews, PR standards, and mentoring.",
    ],
    stack: [
      "TypeScript",
      "Next.js",
      "NestJS",
      "tRPC",
      "Prisma",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Turborepo",
    ],
  },
];
