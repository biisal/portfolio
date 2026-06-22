"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";

import { BlogContentEditor } from "./blog-content-editor";
import {
  BlogEditorProps,
  BlogFormSchema,
  BlogFormValues,
  getDefaultValues,
} from "./blog-editor-schema";
import { BlogLivePreview } from "./blog-live-preview";
import { BlogPostDetails } from "./blog-post-details";
import { useBlogDraft } from "./use-blog-draft";
import { useImageUpload } from "./use-image-upload";

export default function BlogEditor({ initialPost }: BlogEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(BlogFormSchema),
    defaultValues: getDefaultValues(initialPost),
  });

  const title = useWatch({ control: form.control, name: "title" }) || "";
  const excerpt = useWatch({ control: form.control, name: "excerpt" }) || "";
  const content = useWatch({ control: form.control, name: "content" }) || "";
  const authorName =
    useWatch({ control: form.control, name: "authorName" }) || "";
  const coverImage =
    useWatch({ control: form.control, name: "coverImage" }) || "";
  const slug = useWatch({ control: form.control, name: "slug" }) || "";
  const views = useWatch({ control: form.control, name: "views" }) ?? 0;
  const tags = useWatch({ control: form.control, name: "tags" }) || "";
  const isProject =
    useWatch({ control: form.control, name: "isProject" }) || false;
  const audio = useWatch({ control: form.control, name: "audio" }) || "";

  const watchedValues: BlogFormValues = {
    title,
    excerpt,
    content,
    authorName,
    coverImage,
    audio,
    slug,
    views,
    tags,
    isProject,
  };

  const { clearDraft } = useBlogDraft({
    form,
    initialPost,
    watchedValues,
  });

  const {
    isUploading,
    codeMirrorRef,
    imageInputRef,
    handleImageUpload,
    pasteImageExtension,
    triggerFilePicker,
  } = useImageUpload(form);

  const onSubmit = async (data: BlogFormValues, publish: boolean) => {
    setIsSaving(true);
    try {
      const finalSlug = data.slug || slugify(data.title);
      const method = initialPost ? "PUT" : "POST";

      const response = await fetch("/api/blog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          slug: finalSlug,
          author: { name: data.authorName },
          coverImage: data.coverImage || undefined,
          audio: data.audio || undefined,
          published: publish,
          originalSlug: initialPost?.slug,
          views: data.views,
          tags: data.tags,
          isProject: data.isProject,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save blog post");
      }

      toast.success(publish ? "Blog post published!" : "Draft saved!");
      clearDraft();
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

  return (
    <div className={"min-h-screen p-8 text-blog-fg"}>
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
            <BlogPostDetails control={form.control} title={title} slug={slug} />

            <BlogContentEditor
              control={form.control}
              codeMirrorRef={codeMirrorRef}
              imageInputRef={imageInputRef}
              isUploading={isUploading}
              pasteImageExtension={pasteImageExtension}
              onTriggerFilePicker={triggerFilePicker}
              onImageUpload={handleImageUpload}
            />

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

          <BlogLivePreview title={title} content={content} />
        </form>
      </div>
    </div>
  );
}
