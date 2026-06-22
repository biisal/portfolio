"use client";

import { Control } from "react-hook-form";
import { Controller } from "react-hook-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/utils";

import { BlogFormValues } from "./blog-editor-schema";

interface BlogPostDetailsProps {
  control: Control<BlogFormValues>;
  title: string;
  slug: string;
}

export function BlogPostDetails({
  control,
  title,
  slug,
}: BlogPostDetailsProps) {
  return (
    <div className="bg-blog-bg border border-blog-inactive-border rounded-lg p-6">
      <h2 className="text-2xl font-bold text-blog-orange mb-6">Post Details</h2>

      <FieldGroup>
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-blog-fg" htmlFor="blog-editor-title">
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="excerpt"
          control={control}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="authorName"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-blog-fg" htmlFor="blog-editor-author">
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="coverImage"
          control={control}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="audio"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-blog-fg" htmlFor="blog-editor-audio">
                Audio URL (optional)
              </FieldLabel>
              <Input
                {...field}
                id="blog-editor-audio"
                aria-invalid={fieldState.invalid}
                placeholder="https://..."
                className="mt-2 bg-blog-black border-blog-cyan text-blog-fg"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="slug"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-blog-fg" htmlFor="blog-editor-slug">
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
                  Generated: <span className="font-mono">{slugify(title)}</span>
                </p>
              )}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="views"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-blog-fg" htmlFor="blog-editor-views">
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
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="tags"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-blog-fg" htmlFor="blog-editor-tags">
                Tags (comma separated)
              </FieldLabel>
              <Input
                {...field}
                id="blog-editor-tags"
                aria-invalid={fieldState.invalid}
                placeholder="project, coding, nextjs"
                className="mt-2 bg-blog-black border-blog-cyan text-blog-fg"
                autoComplete="off"
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="isProject"
          control={control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-row w-fit items-center gap-2"
            >
              <input
                type="checkbox"
                id="blog-editor-is-project"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="w-4 h-4 accent-blog-orange bg-blog-black border-blog-cyan rounded"
              />
              <FieldLabel
                className="text-blog-fg cursor-pointer m-0"
                htmlFor="blog-editor-is-project"
              >
                Is this a Project?
              </FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  );
}
