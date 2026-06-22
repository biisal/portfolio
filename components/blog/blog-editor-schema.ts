import { CompletionContext } from "@codemirror/autocomplete";
import * as z from "zod";

import { BlogPost } from "@/.generated/client";

export const BlogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  authorName: z.string().min(1, "Author name is required"),
  coverImage: z.string().optional(),
  audio: z.string().optional(),
  slug: z.string().optional(),
  views: z.number().int().min(0),
  tags: z.string().optional(),
  isProject: z.boolean().optional(),
});

export type BlogFormValues = z.infer<typeof BlogFormSchema>;

export interface BlogEditorProps {
  initialPost?: BlogPost | null;
}

export function getDefaultValues(
  initialPost?: BlogPost | null,
): BlogFormValues {
  return {
    title: initialPost?.title || "",
    excerpt: initialPost?.excerpt || "",
    content: initialPost?.content || "",
    authorName: initialPost?.authorName || "Avisek",
    coverImage: initialPost?.coverImage || "",
    audio: initialPost?.audio || "",
    slug: initialPost?.slug || "",
    views: initialPost?.views ?? 0,
    tags: initialPost?.tags?.join(", ") || "",
    isProject: initialPost?.isProject ?? false,
  };
}

export function markdownCompletions(context: CompletionContext) {
  const word = context.matchBefore(/^\w*/);
  if (!context.explicit && (!word || word.from === word.to)) return null;

  return {
    from: context.pos,
    options: [
      { label: "# ", type: "keyword", info: "Heading 1", detail: "H1" },
      { label: "## ", type: "keyword", info: "Heading 2", detail: "H2" },
      { label: "### ", type: "keyword", info: "Heading 3", detail: "H3" },
      { label: "**bold**", type: "keyword", info: "Bold Text", detail: "Bold" },
      {
        label: "*italic*",
        type: "keyword",
        info: "Italic Text",
        detail: "Italic",
      },
      { label: "[link](url)", type: "keyword", info: "Link", detail: "Link" },
      { label: "![alt](url)", type: "keyword", info: "Image", detail: "Image" },
      { label: "> ", type: "keyword", info: "Blockquote", detail: "Quote" },
      {
        label: "```\ncode\n```",
        type: "keyword",
        info: "Code Block",
        detail: "Code",
      },
      { label: "- ", type: "keyword", info: "Bullet List", detail: "List" },
      { label: "1. ", type: "keyword", info: "Ordered List", detail: "List" },
      { label: "---", type: "keyword", info: "Horizontal Rule", detail: "HR" },
      {
        label: "| Col | Col |\n| --- | --- |\n| Val | Val |",
        type: "keyword",
        info: "Table",
        detail: "Table",
      },
    ],
  };
}
