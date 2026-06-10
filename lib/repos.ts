interface TPr {
  repo: string;
  repoUrl: string;
  icon?: string;
  prs: {
    title: string;
    prUrl: string;
  }[];
}

export const PULL_REQUESTS: TPr[] = [
  {
    repo: "Picoclaw",
    repoUrl: "https://github.com/sipeed/picoclaw",
    icon: "https://avatars.githubusercontent.com/u/44034752?s=48&v=4",
    prs: [
      {
        title:
          "Fix Reasoning Content Being Silently Dropped by Adding Channel-Aware Reasoning Routing #645",
        prUrl: "https://github.com/sipeed/picoclaw/pull/802",
      },

      {
        title: "Implemented Telegram Info Commands (/show, /list) #149",
        prUrl: "https://github.com/sipeed/picoclaw/pull/164",
      },
      {
        title: "Fix: LLM call failed: API error #132",
        prUrl: "https://github.com/sipeed/picoclaw/pull/133",
      },
      {
        title: "chore: Ignore the docker/data directory.",
        prUrl: "https://github.com/sipeed/picoclaw/pull/1782",
      },
    ],
  },
  {
    repo: "Polar",
    icon: "https://avatars.githubusercontent.com/u/105373340?s=48&v=4",
    repoUrl: "https://github.com/polarsource/polar",
    prs: [
      {
        title:
          "Fix Bug: Sandbox onboarding ignores API validation errors and shows generic failure message",
        prUrl: "https://github.com/polarsource/polar/pull/10869",
      },
    ],
  },

  {
    repo: "Crush Agent",
    repoUrl: "https://github.com/charmbracelet/crush",
    icon: "https://avatars.githubusercontent.com/u/57376114?s=48&v=4",
    prs: [
      {
        title: "Fix: Chinese text not copied correctly to clipboard (#2155)",
        prUrl: "https://github.com/charmbracelet/crush/pull/2171",
      },
    ],
  },
  {
    repo: "ai-website-cloner-template",
    repoUrl: "https://github.com/JCodesMore/ai-website-cloner-template",
    prs: [
      {
        title:
          "add Docker support with multi-stage production builds and development configuration",
        prUrl:
          "https://github.com/JCodesMore/ai-website-cloner-template/pull/16",
      },
    ],
  },
];
