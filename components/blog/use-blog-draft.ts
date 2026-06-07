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
  const isEditing = !!initialPost;
  const draftStorageKey = "blog-editor-draft:new";
  const hasLoadedDraft = useRef(false);
  const draftSaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isEditing) return;

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
        tags: draft.tags ?? defaults.tags,
        isProject: draft.isProject ?? defaults.isProject,
      });
    } catch {
      localStorage.removeItem(draftStorageKey);
    }
  }, [draftStorageKey, initialPost, form, isEditing]);

  useEffect(() => {
    if (isEditing || !hasLoadedDraft.current) return;

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
  }, [draftStorageKey, watchedValues, isEditing]);

  const clearDraft = () => {
    if (!isEditing) {
      localStorage.removeItem(draftStorageKey);
    }
  };

  return { clearDraft };
}
