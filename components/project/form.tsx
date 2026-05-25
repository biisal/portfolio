"use client";

import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { default as NextImage } from "next/image";
import { useEffect, useRef, useState } from "react";
import { ZodIssue } from "zod";

import { ProjectFormSchema } from "@/lib/schema/project.types";

const ProjectForm = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    tags: [] as string[],
    technologies: [] as string[],
    thumbnail: "",
    slug: "",
    link: "",
    created_at: "",
    updated_at: "",
    description: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [previewHTML, setPreviewHTML] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "w-full",
          height: "auto",
        },
      }),
    ],
    content: "<p>Hello World!</p>",
    onUpdate: ({ editor }) => {
      setPreviewHTML(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const updatePreview = () => setPreviewHTML(editor.getHTML());

    editor.on("update", updatePreview);
    return () => {
      editor.off("update", updatePreview);
    };
  }, [editor]);

  const insertImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      if (typeof base64 === "string") {
        editor?.chain().focus().setImage({ src: base64 }).run();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const description = editor?.getHTML() || "";
    const dataToValidate = {
      ...formData,
      description,
      thumbnail: selectedImage || "",
    };

    const result = ProjectFormSchema.safeParse(dataToValidate);

    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue: ZodIssue) => {
        if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    console.log("Valid submission:", result.data);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result.data),
    });
    if (res.status === 201) {
      setFormData({
        title: "",
        excerpt: "",
        tags: [],
        technologies: [],
        thumbnail: "",
        slug: "",
        link: "",
        created_at: "",
        updated_at: "",
        description: "",
      });
      setSelectedImage(null);
      setErrors({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Project Details</h2>

          <ImageUpload
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Project title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Excerpt</label>
              <textarea
                name="excerpt"
                placeholder="Brief description"
                value={formData.excerpt}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.excerpt && (
                <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                type="text"
                name="slug"
                placeholder="project-slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.slug && (
                <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Project Link (Optional)
              </label>
              <input
                type="text"
                name="link"
                placeholder="https://example.com"
                value={formData.link || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <input
                type="text"
                placeholder="web, frontend, react (comma separated)"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.tags && (
                <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Technologies
              </label>
              <input
                type="text"
                placeholder="React, TypeScript, Node.js (comma separated)"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    technologies: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.technologies && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.technologies}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              {editor && (
                <EditorContent
                  editor={editor}
                  className="min-h-[150px] border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500"
                />
              )}
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="image-upload"
                className="block text-sm font-medium mb-1"
              >
                Insert Image into Description
              </label>
              <input
                type="file"
                accept="image/*"
                id="image-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) insertImage(file);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Submit Project
            </button>
          </div>
        </div>
        <div className="order-2 md:order-1">
          <div className="sticky top-4">
            <h2 className="text-lg font-semibold mb-3">Live Preview</h2>
            <div className="border rounded-lg p-4  min-h-[400px]">
              {selectedImage && (
                <NextImage
                  src={selectedImage}
                  alt="Project thumbnail"
                  width={500}
                  height={300}
                  unoptimized
                  className="w-full h-auto object-cover rounded-lg mb-4"
                />
              )}
              {formData.title && (
                <h3 className="text-xl font-bold mb-2">{formData.title}</h3>
              )}
              {formData.excerpt && (
                <p className="text-gray-600 mb-3 italic">{formData.excerpt}</p>
              )}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {formData.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              <div
                className="prose max-w-none prose-invert prose-sm"
                dangerouslySetInnerHTML={{ __html: previewHTML }}
              />
              {formData.link && (
                <div className="mt-4 pt-3 border-t">
                  <a
                    href={formData.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Project →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
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
  const handleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Project Thumbnail
      </label>
      <div
        className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors flex items-center justify-center"
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
          <NextImage
            src={selectedImage}
            alt="Thumbnail preview"
            width={128}
            height={128}
            unoptimized
            className="h-full w-full object-cover rounded-lg"
          />
        ) : (
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-1">+</div>
            <div className="text-xs">Add Image</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectForm;
