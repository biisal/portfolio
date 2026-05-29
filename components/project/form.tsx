"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Eye,
  Globe,
  Image as ImageIcon,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProjectFormSchema } from "@/lib/schema/project.types";
import { cn, slugify } from "@/lib/utils";

// Define a schema for Form-only fields, making tags & tech strings for user input
const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  slug: z.string().min(1, "Slug is required"),
  link: z.string().optional(),
  tags: z.string().min(1, "At least one tag is required"),
  technologies: z.string().min(1, "At least one technology is required"),
});

const ProjectForm = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewHTML, setPreviewHTML] = useState(
    "<p>Write your beautiful project description here...</p>",
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      slug: "",
      link: "",
      tags: "",
      technologies: "",
    },
  });

  const title = useWatch({ control: form.control, name: "title" }) || "";
  const excerpt = useWatch({ control: form.control, name: "excerpt" }) || "";
  const link = useWatch({ control: form.control, name: "link" }) || "";
  const rawTags = useWatch({ control: form.control, name: "tags" }) || "";
  const rawTech =
    useWatch({ control: form.control, name: "technologies" }) || "";

  // Dynamic slug generation when title changes
  useEffect(() => {
    if (title) {
      form.setValue("slug", slugify(title), { shouldValidate: true });
    }
  }, [title, form]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "w-full rounded-lg my-4 border border-blog-inactive-border",
          height: "auto",
        },
      }),
    ],
    content: "<p>Write your beautiful project description here...</p>",
    onUpdate: ({ editor }) => {
      setPreviewHTML(editor.getHTML());
    },
  });

  const insertImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      if (typeof base64 === "string") {
        editor?.chain().focus().setImage({ src: base64 }).run();
        toast.success("Image inserted into editor");
      }
    };
    reader.readAsDataURL(file);
  };

  const parsedTags = React.useMemo(() => {
    return rawTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }, [rawTags]);

  const parsedTech = React.useMemo(() => {
    return rawTech
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }, [rawTech]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!selectedImage) {
      toast.error("Project thumbnail is required");
      return;
    }

    const descriptionHTML = editor?.getHTML() || "";
    if (
      !descriptionHTML ||
      descriptionHTML === "<p></p>" ||
      descriptionHTML.includes("beautiful project description")
    ) {
      toast.error("Project description content is required");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: data.title,
      excerpt: data.excerpt,
      slug: data.slug,
      link: data.link || null,
      thumbnail: selectedImage,
      description: descriptionHTML,
      tags: parsedTags,
      technologies: parsedTech,
    };

    const validationResult = ProjectFormSchema.safeParse(payload);
    if (!validationResult.success) {
      toast.error("Form validation failed. Check fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      });

      if (res.ok || res.status === 201) {
        toast.success("Project submitted successfully!");
        form.reset();
        setSelectedImage(null);
        editor?.commands.setContent(
          "<p>Write your beautiful project description here...</p>",
        );
        router.push("/projects");
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed to create project");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error(
        error instanceof Error ? error.message : "Error creating project",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 bg-blog-bg text-blog-fg">
      <div className="max-w-[1700px] mx-auto">
        <header className="mb-10 flex items-center justify-between border-b border-blog-inactive-border pb-6">
          <div>
            <h1 className="text-4xl font-bold text-blog-orange mb-2 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-blog-orange animate-pulse" />
              Project Creator
            </h1>
            <p className="text-blog-fg opacity-80 text-sm md:text-base">
              Add a dynamic, styled project with rich content and live preview.
            </p>
          </div>
        </header>

        <form
          className="grid grid-cols-1 lg:grid-cols-2 gap-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Editor Side */}
          <div className="space-y-8">
            <div className="bg-[#0b0e1e]/90 border-2 border-blog-inactive-border rounded-xl p-6 md:p-8 shadow-2xl relative">
              <h2 className="text-2xl font-bold text-blog-orange mb-6 flex items-center gap-2 border-b border-blog-inactive-border/30 pb-3">
                <ImageIcon className="w-5 h-5 text-blog-orange" />
                Project Details
              </h2>

              <FieldGroup className="space-y-6">
                {/* Thumbnail upload */}
                <Field>
                  <FieldLabel className="text-blog-fg font-semibold mb-2">
                    Project Thumbnail *
                  </FieldLabel>
                  <ImageUpload
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                  />
                </Field>

                {/* Title */}
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="text-blog-fg font-semibold"
                        htmlFor="proj-title"
                      >
                        Title *
                      </FieldLabel>
                      <Input
                        {...field}
                        id="proj-title"
                        placeholder="Enter project title"
                        className="mt-2 bg-blog-black border-blog-cyan/30 focus-visible:border-blog-orange text-blog-fg"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Excerpt */}
                <Controller
                  name="excerpt"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="text-blog-fg font-semibold"
                        htmlFor="proj-excerpt"
                      >
                        Excerpt *
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id="proj-excerpt"
                        rows={2}
                        placeholder="Provide a brief summary of the project"
                        className="mt-2 bg-blog-black border-blog-cyan/30 focus-visible:border-blog-orange text-blog-fg resize-none min-h-[80px]"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Slug */}
                <Controller
                  name="slug"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="text-blog-fg font-semibold"
                        htmlFor="proj-slug"
                      >
                        Slug *
                      </FieldLabel>
                      <Input
                        {...field}
                        id="proj-slug"
                        placeholder="project-slug-here"
                        className="mt-2 bg-blog-black border-blog-cyan/30 focus-visible:border-blog-orange text-blog-fg font-mono text-sm"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Project Link */}
                <Controller
                  name="link"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="text-blog-fg font-semibold"
                        htmlFor="proj-link"
                      >
                        Project Link (Optional)
                      </FieldLabel>
                      <Input
                        {...field}
                        id="proj-link"
                        placeholder="https://github.com/... or deployment url"
                        className="mt-2 bg-blog-black border-blog-cyan/30 focus-visible:border-blog-orange text-blog-fg font-mono text-sm"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Tags */}
                <Controller
                  name="tags"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="text-blog-fg font-semibold"
                        htmlFor="proj-tags"
                      >
                        Tags (comma separated) *
                      </FieldLabel>
                      <Input
                        {...field}
                        id="proj-tags"
                        placeholder="web, frontend, nextjs"
                        className="mt-2 bg-blog-black border-blog-cyan/30 focus-visible:border-blog-orange text-blog-fg"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Technologies */}
                <Controller
                  name="technologies"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="text-blog-fg font-semibold"
                        htmlFor="proj-tech"
                      >
                        Technologies (comma separated) *
                      </FieldLabel>
                      <Input
                        {...field}
                        id="proj-tech"
                        placeholder="React, TypeScript, Tailwind"
                        className="mt-2 bg-blog-black border-blog-cyan/30 focus-visible:border-blog-orange text-blog-fg"
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

            {/* Description Editor Box */}
            <div className="bg-[#0b0e1e]/90 border-2 border-blog-inactive-border rounded-xl p-6 md:p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-blog-orange mb-4 flex items-center gap-2">
                Project Description
              </h2>
              <p className="text-sm text-blog-fg opacity-70 mb-4 font-mono">
                Provide a structured details overview for the project.
              </p>

              <div className="border border-blog-cyan/20 rounded-lg bg-blog-black text-blog-fg min-h-[220px] overflow-hidden focus-within:border-blog-orange transition-all duration-200 shadow-inner">
                {editor && (
                  <EditorContent
                    editor={editor}
                    className="p-4 min-h-[200px] outline-none [&_.tiptap]:outline-none prose prose-invert max-w-none text-base"
                  />
                )}
              </div>

              {/* Rich editor base64 image loader */}
              <div className="mt-5 pt-4 border-t border-blog-inactive-border/30">
                <label
                  htmlFor="editor-image-file"
                  className="block text-sm font-semibold text-blog-fg mb-2"
                >
                  Insert Image into Description
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="editor-image-file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) insertImage(file);
                  }}
                  className="w-full text-xs text-blog-fg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blog-selection-bg file:text-blog-cyan hover:file:bg-blog-selection-bg/85 cursor-pointer file:cursor-pointer"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-blog-orange text-blog-bg font-bold hover:bg-blog-orange/90 text-base shadow-[0_0_20px_rgba(255,158,100,0.15)] hover:shadow-[0_0_25px_rgba(255,158,100,0.3)] transition-all duration-300 rounded-lg cursor-pointer"
            >
              {isSubmitting ? "Creating Project..." : "Create Project"}
            </Button>
          </div>

          {/* Sticky Preview Side */}
          <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-6rem)]">
            <div className="bg-[#0b0e1e]/95 border-2 border-blog-inactive-border rounded-xl p-6 md:p-8 h-full overflow-y-auto scroll-smooth flex flex-col shadow-2xl">
              <h2 className="text-2xl font-bold text-blog-orange mb-6 flex items-center gap-2 border-b border-blog-inactive-border/30 pb-3">
                <Eye className="w-5 h-5 text-blog-orange" />
                Live Preview
              </h2>

              <div className="flex-1 flex flex-col">
                {selectedImage ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-blog-cyan/20 mb-6 bg-blog-black group shadow-lg">
                    <NextImage
                      src={selectedImage}
                      alt="Project preview thumbnail"
                      fill
                      unoptimized
                      className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="relative w-full aspect-video rounded-xl border-2 border-dashed border-blog-inactive-border/50 mb-6 bg-blog-black/50 flex flex-col items-center justify-center text-blog-fg/50 font-mono text-sm">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-40 text-blog-orange animate-bounce" />
                    <span>Thumbnail Preview Panel</span>
                  </div>
                )}

                <div className="space-y-4 flex-1">
                  {title ? (
                    <h3 className="text-3xl font-extrabold text-blog-white tracking-tight leading-tight">
                      {title}
                    </h3>
                  ) : (
                    <h3 className="text-3xl font-extrabold text-blog-fg/30 italic">
                      Project Title
                    </h3>
                  )}

                  {excerpt ? (
                    <p className="text-lg text-blog-fg/90 border-l-2 border-blog-orange pl-4 italic leading-relaxed">
                      {excerpt}
                    </p>
                  ) : (
                    <p className="text-lg text-blog-fg/30 border-l-2 border-blog-inactive-border pl-4 italic">
                      Project excerpt summary...
                    </p>
                  )}

                  {/* Render Tags */}
                  {parsedTags.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-xs uppercase tracking-wider text-blog-fg/50 font-mono">
                        Tags:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {parsedTags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded font-mono text-xs bg-blog-selection-bg text-blog-cyan border border-blog-cyan/25"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Render Technologies */}
                  {parsedTech.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-xs uppercase tracking-wider text-blog-fg/50 font-mono">
                        Technologies:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {parsedTech.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded font-mono text-xs bg-blog-selection-bg text-blog-green border border-blog-green/25"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project URL CTA */}
                  {link && (
                    <div className="pt-3">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blog-selection-bg text-blog-cyan border border-blog-cyan/30 hover:bg-blog-cyan hover:text-blog-bg transition-all duration-300 font-mono text-sm shadow-md"
                      >
                        <Globe className="w-4 h-4" />
                        Explore Project
                      </a>
                    </div>
                  )}

                  {/* Rich Content Render */}
                  <div className="pt-6 mt-6 border-t border-blog-inactive-border/30">
                    <span className="text-xs uppercase tracking-wider text-blog-fg/50 font-mono block mb-4">
                      Description Content:
                    </span>
                    <div
                      className="prose prose-invert prose-sm max-w-none text-blog-fg opacity-90 leading-relaxed font-mono"
                      dangerouslySetInnerHTML={{ __html: previewHTML }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const ImageUpload = ({
  selectedImage,
  setSelectedImage,
}: {
  selectedImage: string | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        toast.success("Thumbnail uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
    if (inputRef.current) inputRef.current.value = "";
    toast.info("Thumbnail removed");
  };

  return (
    <div className="mb-4">
      <div
        className={cn(
          "w-full h-44 border-2 border-dashed rounded-xl cursor-pointer bg-blog-black transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden group shadow-inner",
          selectedImage
            ? "border-blog-cyan/40 hover:border-blog-orange"
            : "border-blog-inactive-border hover:border-blog-orange",
        )}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleUpdate}
          hidden
        />

        {selectedImage ? (
          <>
            <NextImage
              src={selectedImage}
              alt="Thumbnail preview"
              fill
              unoptimized
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Remove button */}
            <button
              onClick={handleRemove}
              className="absolute top-3 right-3 bg-blog-bg/80 hover:bg-blog-orange hover:text-blog-bg text-blog-white p-1.5 rounded-full border border-blog-inactive-border/30 transition-colors duration-200 cursor-pointer shadow-lg z-10"
              title="Remove Thumbnail"
            >
              <X className="w-4 h-4" />
            </button>
            {/* Overlay instruction */}
            <div className="absolute inset-0 bg-[#090b17]/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <span className="text-blog-white font-mono text-xs uppercase bg-blog-selection-bg px-3 py-1.5 rounded border border-blog-cyan/30">
                Change Image
              </span>
            </div>
          </>
        ) : (
          <div className="text-center p-6 flex flex-col items-center group-hover:translate-y-[-2px] transition-transform duration-300">
            <Upload className="w-8 h-8 text-blog-orange mb-3 opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="text-sm font-semibold text-blog-fg/80 group-hover:text-blog-white transition-colors mb-1">
              Upload Project Image
            </div>
            <div className="text-xs text-blog-fg/45 font-mono">
              Drag & drop or browse (Aspect: 16:9 recommended)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectForm;
