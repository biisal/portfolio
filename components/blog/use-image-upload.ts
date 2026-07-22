import { EditorView } from "@codemirror/view";
import { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { useCallback, useMemo, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { BlogFormValues } from "./blog-editor-schema";

export function useImageUpload(form: UseFormReturn<BlogFormValues>) {
  const [isUploading, setIsUploading] = useState(false);
  const codeMirrorRef = useRef<ReactCodeMirrorRef>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const uploadImageFile = useCallback(
    async (file: File, view?: EditorView) => {
      setIsUploading(true);
      try {
        const uploadFile =
          file.name && !file.name.startsWith("image")
            ? file
            : new File(
                [file],
                `pasted-image-${Date.now()}.${file.type.split("/")[1] ?? "png"}`,
                { type: file.type }
              );

        const formData = new FormData();
        formData.append("file", uploadFile);

        const response = await fetch("/api/blog/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to upload image");
        }

        const { url } = (await response.json()) as { url: string };
        const altText = uploadFile.name.replace(/\.[^.]+$/, "") || "image";
        const markdownImage = `![${altText}](${url})`;

        if (view) {
          const { from } = view.state.selection.main;
          view.dispatch({
            changes: { from, insert: markdownImage },
            selection: { anchor: from + markdownImage.length },
          });
          view.focus();
        } else {
          const current = form.getValues("content");
          form.setValue("content", current + "\n" + markdownImage, {
            shouldDirty: true,
          });
        }

        toast.success("Image uploaded and inserted!");
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to upload image"
        );
      } finally {
        setIsUploading(false);
      }
    },
    [form]
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const view = codeMirrorRef.current?.view;
    await uploadImageFile(file, view);
  };

  const pasteImageExtension = useMemo(
    () =>
      EditorView.domEventHandlers({
        paste(event, view) {
          const items = Array.from(event.clipboardData?.items ?? []);
          const imageItem = items.find((item) =>
            item.type.startsWith("image/")
          );
          if (!imageItem) return false;

          event.preventDefault();
          const file = imageItem.getAsFile();
          if (!file) return false;

          void uploadImageFile(file, view);
          return true;
        },
      }),
    [uploadImageFile]
  );

  const triggerFilePicker = () => imageInputRef.current?.click();

  return {
    isUploading,
    codeMirrorRef,
    imageInputRef,
    handleImageUpload,
    pasteImageExtension,
    triggerFilePicker,
  };
}
