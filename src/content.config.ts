import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Frontmatter of every `src/content/blog/<slug>.mdx`, validated at build time.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    coverImage: z.string().nullable().default(null),
    audio: z.string().nullable().default(null),
    authorName: z.string().default("Avisek Ray"),
    tags: z.array(z.string()).default([]),
    isProject: z.boolean().default(false),
    published: z.boolean().default(false),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { blog };
