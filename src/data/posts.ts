import type { PostMeta } from "@/lib/types";

/**
 * Every blog post: metadata here, body in `content/blog/<file>`.
 * To add a post, drop an HTML file in content/blog and add an entry.
 */
export const posts: PostMeta[] = [
  {
    slug: "i-fixed-the-lag-in-my-ai-agent",
    file: "i-fixed-the-lag-in-my-ai-agent.html",
    title: "I fixed the lag in my AI agent!",
    excerpt:
      "From arrays to strings to segments - how I fixed lag and styling bugs while streaming AI responses in a terminal UI, written in Go.",
    coverImage:
      "https://res.cloudinary.com/dorxspa9g/image/upload/v1790446718/blog-content/duas9w2t6bk4px15qg17.jpg",
    audio:
      "https://res.cloudinary.com/dorxspa9g/video/upload/v1786291802/output_f08d7o.wav",
    authorName: "Avisek",
    tags: ["project", "go", "bai"],
    isProject: true,
    published: true,
    date: "2026-08-09T16:16:39.366Z",
    updated: "2026-11-20T03:18:23.111Z",
  },
  {
    slug: "i-built-a-multi-database-management-tool-rowsql",
    file: "i-built-a-multi-database-management-tool-rowsql.html",
    title: "I built a multi-database management tool - RowSQL",
    excerpt:
      "I built a web-based database management tool using Go that lets you manage multiple databases from your browser.",
    coverImage:
      "https://res.cloudinary.com/dorxspa9g/image/upload/v1782060358/blog-content/khjpvbflmmbvhojxcypo.png",
    audio:
      "https://res.cloudinary.com/dorxspa9g/video/upload/v1782148718/output_ywjgq4.wav",
    authorName: "Avisek",
    tags: [
      "project",
      "rowsql",
      "go",
      "react",
      "sql",
      "postgresql",
      "sqlite",
      "mysql",
    ],
    isProject: true,
    published: true,
    date: "2026-06-21T16:18:58.334Z",
    updated: "2026-11-20T02:32:00.967Z",
  },
  {
    slug: "i-fixed-my-habit-of-starting-projects-but-not-finishing-them",
    file: "i-fixed-my-habit-of-starting-projects-but-not-finishing-them.html",
    title: "I fixed my habit of starting projects but not finishing them",
    excerpt:
      "I think I have fixed my habit of starting projects but not finishing them.",
    coverImage:
      "https://res.cloudinary.com/dorxspa9g/image/upload/v1781883863/blog-content/g5ivotesxtpq9wdldgdv.jpg",
    audio:
      "https://res.cloudinary.com/dorxspa9g/video/upload/v1782536341/project-buiild-guild_shgdkq.wav",
    authorName: "Avisek",
    tags: ["project", "rowsql"],
    isProject: false,
    published: true,
    date: "2026-06-18T16:44:19.366Z",
    updated: "2026-11-19T23:04:31.472Z",
  },
  {
    slug: "ci-setup-i-use-for-almost-all-go-applications",
    file: "ci-setup-i-use-for-almost-all-go-applications.html",
    title: "CI setup I use for almost all Go Applications",
    excerpt:
      "Go applications don't need complex CI. Here's the exact pipeline I copy-paste into every project.",
    coverImage:
      "https://res.cloudinary.com/dorxspa9g/image/upload/v1781076884/blog-content/cmjefo8wj96haxbxzwh4.png",
    audio: null,
    authorName: "Avisek",
    tags: [],
    isProject: false,
    published: true,
    date: "2026-06-10T07:10:35.801Z",
    updated: "2026-11-19T21:38:49.495Z",
  },
  {
    slug: "i-learned-mcp-from-anthropics-course-in-2-days",
    file: "i-learned-mcp-from-anthropics-course-in-2-days.html",
    title: "I Learned MCP From Anthropic's Course in 2 Days",
    excerpt:
      "I Learned MCP in weekend from Anthropic's Course. MCP client, server, tools, prompts, resources all.",
    coverImage:
      "https://res.cloudinary.com/dorxspa9g/image/upload/v1780770428/blog-content/s328j53sksiw5nlzghdh.png",
    audio:
      "https://res.cloudinary.com/dorxspa9g/video/upload/v1782151448/mcp_pydo12.wav",
    authorName: "Avisek",
    tags: [
      "MCP",
      "AI",
      "Claude",
      "Antrophic",
      "Model Context Protocol",
      "OpenAI",
      "Sarvam AI",
    ],
    isProject: false,
    published: true,
    date: "2026-06-06T11:36:56.029Z",
    updated: "2026-11-19T19:47:54.791Z",
  },
  {
    slug: "only-terminal-shell-config-you-need",
    file: "only-terminal-shell-config-you-need.html",
    title: "The only shell (terminal) config you need",
    excerpt:
      "A minimal and powerful Zsh setup with fuzzy search, autosuggestions, smart navigation, and a clean terminal workflow for Linux and macOS",
    coverImage:
      "https://res.cloudinary.com/dorxspa9g/image/upload/v1779956535/shell-blog-comp_pshwy4.png",
    audio: null,
    authorName: "Avisek",
    tags: [],
    isProject: false,
    published: true,
    date: "2026-05-27T18:19:20.314Z",
    updated: "2026-11-20T02:13:03.862Z",
  },
  {
    slug: "what-is-null",
    file: "what-is-null.html",
    title: "Is NULL Nothing? 🤔",
    excerpt: "I explored how NULL is implemented in various languages",
    coverImage:
      "https://res.cloudinary.com/dorxspa9g/image/upload/v1779774035/null-dog-comp_ooakti.jpg",
    audio: null,
    authorName: "Avisek",
    tags: [],
    isProject: false,
    published: true,
    date: "2026-05-23T17:40:34.342Z",
    updated: "2026-11-19T18:18:37.303Z",
  },
  {
    slug: "understanding-hmac-internals-through-webhook-verification-in-go",
    file: "understanding-hmac-internals-through-webhook-verification-in-go.html",
    title: "Understanding HMAC Internals Through Webhook Verification in Go",
    excerpt:
      "Exploring how webhook verification works in Go and breaking down the internals of HMAC signatures using only the standard library.",
    coverImage:
      "https://res.cloudinary.com/dorxspa9g/image/upload/v1779294184/435shots_so_uek1uo.png",
    audio: null,
    authorName: "Avisek",
    tags: [],
    isProject: false,
    published: true,
    date: "2026-05-20T16:25:28.798Z",
    updated: "2026-11-20T00:45:19.035Z",
  },
  {
    slug: "linkedin-is-spamming-to-your-device",
    file: "linkedin-is-spamming-to-your-device.html",
    title: "LinkedIn is spamming to your device",
    excerpt: "LinkedIn is doing AED brute-force scanning",
    coverImage:
      "https://res.cloudinary.com/dorxspa9g/image/upload/v1779347250/1778517767491_ao20ej.jpg",
    audio: null,
    tags: [],
    isProject: false,
    published: true,
    date: "2026-05-11T17:32:31.941Z",
    updated: "2026-11-18T23:19:15.334Z",
  },
  {
    slug: "sudo-simplified-understanding-root-setuid-secure-command-execution",
    file: "sudo-simplified-understanding-root-setuid-secure-command-execution.html",
    title: "Become GOD of your system :)",
    excerpt:
      "Learn how Linux’s sudo works—from root privileges and setuid to secure, audited command execution. This step-by-step guide explains user UIDs, sudoers configuration, timestamp caching, fork‑exec flow, and logging best practices.",
    coverImage:
      "https://res.cloudinary.com/dorxspa9g/image/upload/v1750849212/yimmuzt2i2kwxotwcpcs.png",
    audio: null,
    authorName: "Avisek",
    tags: [],
    isProject: false,
    published: true,
    date: "2026-05-01T10:54:09.236Z",
    updated: "2026-11-19T15:57:54.315Z",
  },
  {
    slug: "audit-logging-isn-t-hard-but-it-is",
    file: "audit-logging-isn-t-hard-but-it-is.html",
    title: "Audit logging isn't hard but it is 🙂",
    excerpt:
      "Audit logging can look intimidating, but the core ideas are surprisingly straightforward",
    coverImage: null,
    audio: null,
    authorName: "Avisek",
    tags: [],
    isProject: false,
    published: false,
    date: "2026-04-29T07:38:35.954Z",
    updated: "2026-05-29T08:46:46.006Z",
  },
  {
    slug: "done-is-better-than-perfect-ft-gitalink",
    file: "done-is-better-than-perfect-ft-gitalink.html",
    title: "Done is better than perfect (ft. Gitalink)",
    excerpt: "This project took 1.5 years and a lot of messy learning.",
    coverImage: null,
    audio: null,
    authorName: "Avisek",
    tags: [],
    isProject: false,
    published: true,
    date: "2026-04-08T17:38:01.117Z",
    updated: "2026-11-19T13:15:04.149Z",
  },
  {
    slug: "write-tests-before-actual-function",
    file: "write-tests-before-actual-function.html",
    title: "Write tests before actual function",
    excerpt: "Why should you write tests before the actual function?",
    coverImage: null,
    audio: null,
    authorName: "Avisek",
    tags: [],
    isProject: false,
    published: true,
    date: "2026-01-26T11:23:01.580Z",
    updated: "2026-11-18T19:28:06.222Z",
  },
  {
    slug: "i-built-my-own-ai-agent-godo",
    file: "i-built-my-own-ai-agent-godo.html",
    title: "How I Built my own AI Agent - GODO",
    excerpt:
      "I built an AI agent that runs in your terminal and can do almost manything",
    coverImage:
      "https://raw.githubusercontent.com/biisal/godo/main/assets/agent-home.png",
    audio: null,
    authorName: "Avisek",
    tags: ["golang", "ai agent", "ai", "openai", "claude", "terminal"],
    isProject: true,
    published: true,
    date: "2025-10-16T08:21:14.747Z",
    updated: "2026-11-20T01:44:52.071Z",
  },
  {
    slug: "linux-learnig-platform-with-live-terminal",
    file: "linux-learnig-platform-with-live-terminal.html",
    title: "Linux learnig platform with live terminal",
    excerpt:
      "CodeLtix is a developer platform focused on Linux, full-stack development, automation, and hands-on learning.",
    coverImage:
      "https://res.cloudinary.com/dorxspa9g/image/upload/v1751909593/erqpw8cpmvaflgchznfq.png",
    audio: null,
    authorName: "Avisek",
    tags: ["project", "nextjs"],
    isProject: true,
    published: true,
    date: "2025-07-07T17:33:14.058Z",
    updated: "2026-11-20T03:09:11.210Z",
  },
];
