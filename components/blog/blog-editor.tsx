"use client";

import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import { markdown, markdownKeymap } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView, keymap } from "@codemirror/view";
import { zodResolver } from "@hookform/resolvers/zod";
import CodeMirror from "@uiw/react-codemirror";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { BlogPost } from "@/.generated/client";
import { BlogPreview } from "@/components/blog/blog-preview";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { JetBrainsMono } from "@/fonts";
import { cn, slugify } from "@/lib/utils";

interface BlogEditorProps {
  initialPost?: BlogPost | null;
}

const BlogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  authorName: z.string().min(1, "Author name is required"),
  coverImage: z.string().optional(),
  slug: z.string().optional(),
  views: z.number().int().min(0),
});

export default function BlogEditor({ initialPost }: BlogEditorProps) {
  const router = useRouter();
  const draftStorageKey = `blog-editor-draft:${initialPost?.slug ?? "new"}`;
  const [isSaving, setIsSaving] = useState(false);
  const hasLoadedDraft = useRef(false);
  const draftSaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof BlogFormSchema>>({
    resolver: zodResolver(BlogFormSchema),
    defaultValues: {
      title: initialPost?.title || "",
      excerpt: initialPost?.excerpt || "",
      content: initialPost?.content || "",
      authorName: initialPost?.authorName || "Avisek",
      coverImage: initialPost?.coverImage || "",
      slug: initialPost?.slug || "",
      views: initialPost?.views ?? 0,
    },
  });

  // Watch fields using compiler-safe useWatch hook
  const title = useWatch({ control: form.control, name: "title" }) || "";
  const excerpt = useWatch({ control: form.control, name: "excerpt" }) || "";
  const content = useWatch({ control: form.control, name: "content" }) || "";
  const authorName =
    useWatch({ control: form.control, name: "authorName" }) || "";
  const coverImage =
    useWatch({ control: form.control, name: "coverImage" }) || "";
  const slug = useWatch({ control: form.control, name: "slug" }) || "";
  const views = useWatch({ control: form.control, name: "views" }) ?? 0;

  const onSubmit = async (
    data: z.infer<typeof BlogFormSchema>,
    publish: boolean,
  ) => {
    setIsSaving(true);

    try {
      const finalSlug = data.slug || slugify(data.title);
      const method = initialPost ? "PUT" : "POST";

      const response = await fetch("/api/blog", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          slug: finalSlug,
          author: { name: data.authorName },
          coverImage: data.coverImage || undefined,
          published: publish,
          originalSlug: initialPost?.slug,
          views: data.views,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save blog post");
      }

      toast.success(publish ? "Blog post published!" : "Draft saved!");
      localStorage.removeItem(draftStorageKey);

      router.push("/blog");
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save blog post",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Custom markdown completions
  const markdownCompletions = (context: CompletionContext) => {
    const word = context.matchBefore(/^\w*/);
    if (!context.explicit && (!word || word.from === word.to)) return null;

    return {
      from: context.pos,
      options: [
        { label: "# ", type: "keyword", info: "Heading 1", detail: "H1" },
        { label: "## ", type: "keyword", info: "Heading 2", detail: "H2" },
        { label: "### ", type: "keyword", info: "Heading 3", detail: "H3" },
        {
          label: "**bold**",
          type: "keyword",
          info: "Bold Text",
          detail: "Bold",
        },
        {
          label: "*italic*",
          type: "keyword",
          info: "Italic Text",
          detail: "Italic",
        },
        { label: "[link](url)", type: "keyword", info: "Link", detail: "Link" },
        {
          label: "![alt](url)",
          type: "keyword",
          info: "Image",
          detail: "Image",
        },
        { label: "> ", type: "keyword", info: "Blockquote", detail: "Quote" },
        {
          label: "```\ncode\n```",
          type: "keyword",
          info: "Code Block",
          detail: "Code",
        },
        { label: "- ", type: "keyword", info: "Bullet List", detail: "List" },
        { label: "1. ", type: "keyword", info: "Ordered List", detail: "List" },
        {
          label: "---",
          type: "keyword",
          info: "Horizontal Rule",
          detail: "HR",
        },
        {
          label: "| Col | Col |\n| --- | --- |\n| Val | Val |",
          type: "keyword",
          info: "Table",
          detail: "Table",
        },
      ],
    };
  };

  useEffect(() => {
    const savedDraft = localStorage.getItem(draftStorageKey);
    hasLoadedDraft.current = true;

    if (!savedDraft) return;

    try {
      const draft = JSON.parse(savedDraft) as {
        title?: string;
        excerpt?: string;
        content?: string;
        authorName?: string;
        coverImage?: string;
        slug?: string;
        views?: number;
      };

      form.reset({
        title: draft.title ?? initialPost?.title ?? "",
        excerpt: draft.excerpt ?? initialPost?.excerpt ?? "",
        content: draft.content ?? initialPost?.content ?? "",
        authorName: draft.authorName ?? initialPost?.authorName ?? "Avisek",
        coverImage: draft.coverImage ?? initialPost?.coverImage ?? "",
        slug: draft.slug ?? initialPost?.slug ?? "",
        views: draft.views ?? initialPost?.views ?? 0,
      });
    } catch (error) {
      console.error("Failed to restore blog draft:", error);
      localStorage.removeItem(draftStorageKey);
    }
  }, [draftStorageKey, initialPost, form]);

  useEffect(() => {
    if (!hasLoadedDraft.current) return;

    if (draftSaveTimeout.current) {
      clearTimeout(draftSaveTimeout.current);
    }

    draftSaveTimeout.current = setTimeout(() => {
      localStorage.setItem(
        draftStorageKey,
        JSON.stringify({
          title,
          excerpt,
          content,
          authorName,
          coverImage,
          slug,
          views,
        }),
      );
    }, 500);

    return () => {
      if (draftSaveTimeout.current) {
        clearTimeout(draftSaveTimeout.current);
      }
    };
  }, [
    authorName,
    content,
    coverImage,
    draftStorageKey,
    excerpt,
    title,
    slug,
    views,
  ]);

  useEffect(() => {
    if (previewContainerRef.current) {
      const container = previewContainerRef.current;
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        150;

      if (isNearBottom) {
        const timeoutId = setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 10);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [content]);

  return (
    <div
      className={cn("min-h-screen p-8 text-blog-fg", JetBrainsMono.className)}
    >
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blog-orange mb-2">
            Blog Editor
          </h1>
          <p className="text-blog-fg opacity-80">
            Write your blog post with live preview
          </p>
        </div>

        <form
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="space-y-6">
            <div className="bg-blog-bg border border-blog-inactive-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-blog-orange mb-6">
                Post Details
              </h2>

              <FieldGroup>
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="text-blog-fg"
                        htmlFor="blog-editor-title"
                      >
                        Title *
                      </FieldLabel>
                      <Input
                        {...field}
                        id="blog-editor-title"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter post title"
                        className="mt-2 bg-blog-black border-blog-cyan text-blog-fg"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="excerpt"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="text-blog-fg"
                        htmlFor="blog-editor-excerpt"
                      >
                        Excerpt *
                      </FieldLabel>
                      <Input
                        {...field}
                        id="blog-editor-excerpt"
                        aria-invalid={fieldState.invalid}
                        placeholder="Short description of the post"
                        className="mt-2 bg-blog-black border-blog-cyan text-blog-fg"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="authorName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="text-blog-fg"
                        htmlFor="blog-editor-author"
                      >
                        Author Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="blog-editor-author"
                        aria-invalid={fieldState.invalid}
                        placeholder="Author name"
                        className="mt-2 bg-blog-black border-blog-cyan text-blog-fg"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="coverImage"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="text-blog-fg"
                        htmlFor="blog-editor-coverImage"
                      >
                        Cover Image URL (optional)
                      </FieldLabel>
                      <Input
                        {...field}
                        id="blog-editor-coverImage"
                        aria-invalid={fieldState.invalid}
                        placeholder="https://..."
                        className="mt-2 bg-blog-black border-blog-cyan text-blog-fg"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="slug"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="text-blog-fg"
                        htmlFor="blog-editor-slug"
                      >
                        Slug (optional)
                      </FieldLabel>
                      <Input
                        {...field}
                        id="blog-editor-slug"
                        aria-invalid={fieldState.invalid}
                        placeholder="custom-slug"
                        className="mt-2 bg-blog-black border-blog-cyan text-blog-fg"
                        autoComplete="off"
                      />
                      {!slug && title && (
                        <p className="text-blog-fg opacity-50 text-xs mt-1">
                          Generated:{" "}
                          <span className="font-mono">{slugify(title)}</span>
                        </p>
                      )}
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="views"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="text-blog-fg"
                        htmlFor="blog-editor-views"
                      >
                        Views
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        id="blog-editor-views"
                        aria-invalid={fieldState.invalid}
                        placeholder="0"
                        className="mt-2 bg-blog-black border-blog-cyan text-blog-fg"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>

            <div className="bg-blog-bg border border-blog-inactive-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-blog-orange mb-4">
                Content *
              </h2>
              <p className="text-sm text-blog-fg opacity-70 mb-4">
                Write your content in Markdown format (Ctrl+Space for
                suggestions)
              </p>
              <div className="h-[600px] overflow-hidden rounded-md border border-blog-cyan bg-blog-black">
                <Controller
                  name="content"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="h-full">
                      <CodeMirror
                        value={field.value}
                        height="600px"
                        theme={oneDark}
                        extensions={[
                          markdown(),
                          keymap.of(markdownKeymap),
                          autocompletion({
                            override: [markdownCompletions],
                          }),
                          EditorView.lineWrapping,
                        ]}
                        onChange={(value) => field.onChange(value)}
                        className="text-base"
                        basicSetup={{
                          lineNumbers: true,
                          highlightActiveLineGutter: true,
                          highlightSpecialChars: true,
                          history: true,
                          foldGutter: true,
                          drawSelection: true,
                          dropCursor: true,
                          allowMultipleSelections: true,
                          indentOnInput: true,
                          syntaxHighlighting: true,
                          bracketMatching: true,
                          closeBrackets: true,
                          autocompletion: true,
                          rectangularSelection: true,
                          crosshairCursor: true,
                          highlightActiveLine: true,
                          highlightSelectionMatches: true,
                          closeBracketsKeymap: true,
                          defaultKeymap: true,
                          searchKeymap: true,
                          historyKeymap: true,
                          foldKeymap: true,
                          completionKeymap: true,
                          lintKeymap: true,
                        }}
                      />
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="mt-1"
                        />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={form.handleSubmit((data) => onSubmit(data, false))}
                disabled={isSaving}
                variant="outline"
                className="flex-1 border-blog-cyan text-blog-fg hover:bg-blog-cyan hover:text-blog-bg"
              >
                {isSaving ? "Saving..." : "Save Draft"}
              </Button>
              <Button
                type="button"
                onClick={form.handleSubmit((data) => onSubmit(data, true))}
                disabled={isSaving}
                className="flex-1 bg-blog-orange text-blog-bg hover:bg-blog-orange/90"
              >
                {isSaving ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </div>

          <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
            <div
              ref={previewContainerRef}
              className="bg-blog-bg border border-blog-inactive-border rounded-lg p-6 h-full overflow-y-auto scroll-smooth"
            >
              <h2 className="text-2xl font-bold text-blog-orange mb-6">
                Live Preview
              </h2>

              {title && (
                <>
                  <h1 className="text-blog-white text-4xl font-bold mb-4">
                    {title}
                  </h1>
                  <div className="text-blog-black mb-8 font-mono">
                    {new Date().toLocaleDateString()}
                  </div>
                </>
              )}

              {content ? (
                <>
                  <BlogPreview content={content} />
                  <div className="h-32" />
                </>
              ) : (
                <p className="text-blog-fg opacity-50 italic">
                  Start writing to see the preview...
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
