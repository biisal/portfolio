import { useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";

import { BlogPost } from "@/.generated/client";

import { BlogFormValues, getDefaultValues } from "./blog-editor-schema";

interface UseBlogDraftOptions {
  form: UseFormReturn<BlogFormValues>;
  initialPost?: BlogPost | null;
  watchedValues: BlogFormValues;
}

export function useBlogDraft({
  form,
  initialPost,
  watchedValues,
}: UseBlogDraftOptions) {
  const draftStorageKey = `blog-editor-draft:${initialPost?.slug ?? "new"}`;
  const hasLoadedDraft = useRef(false);
  const draftSaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const savedDraft = localStorage.getItem(draftStorageKey);
    hasLoadedDraft.current = true;

    if (!savedDraft) return;

    try {
      const draft = JSON.parse(savedDraft) as Partial<BlogFormValues>;
      const defaults = getDefaultValues(initialPost);
      form.reset({
        title: draft.title ?? defaults.title,
        excerpt: draft.excerpt ?? defaults.excerpt,
        content: draft.content ?? defaults.content,
        authorName: draft.authorName ?? defaults.authorName,
        coverImage: draft.coverImage ?? defaults.coverImage,
        slug: draft.slug ?? defaults.slug,
        views: draft.views ?? defaults.views,
      });
    } catch {
      localStorage.removeItem(draftStorageKey);
    }
  }, [draftStorageKey, initialPost, form]);

  useEffect(() => {
    if (!hasLoadedDraft.current) return;

    if (draftSaveTimeout.current) {
      clearTimeout(draftSaveTimeout.current);
    }

    draftSaveTimeout.current = setTimeout(() => {
      localStorage.setItem(draftStorageKey, JSON.stringify(watchedValues));
    }, 500);

    return () => {
      if (draftSaveTimeout.current) {
        clearTimeout(draftSaveTimeout.current);
      }
    };
  }, [draftStorageKey, watchedValues]);

  const clearDraft = () => localStorage.removeItem(draftStorageKey);

  return { clearDraft };
}
