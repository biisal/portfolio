"use client";

import { autocompletion } from "@codemirror/autocomplete";
import { markdown, markdownKeymap } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView, keymap } from "@codemirror/view";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { ImageIcon, Loader2 } from "lucide-react";
import { RefObject } from "react";
import { Control, Controller } from "react-hook-form";

import { Field, FieldError } from "@/components/ui/field";

import { BlogFormValues, markdownCompletions } from "./blog-editor-schema";

interface BlogContentEditorProps {
  control: Control<BlogFormValues>;
  codeMirrorRef: RefObject<ReactCodeMirrorRef | null>;
  imageInputRef: RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pasteImageExtension: any;
  onTriggerFilePicker: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BlogContentEditor({
  control,
  codeMirrorRef,
  imageInputRef,
  isUploading,
  pasteImageExtension,
  onTriggerFilePicker,
  onImageUpload,
}: BlogContentEditorProps) {
  return (
    <div className="bg-blog-bg border border-blog-inactive-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blog-orange">Content *</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTriggerFilePicker}
            disabled={isUploading}
            title="Insert image"
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-blog-cyan text-blog-fg text-sm hover:bg-blog-cyan hover:text-blog-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading…</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4" />
                <span>Insert Image</span>
              </>
            )}
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageUpload}
            id="blog-editor-image-upload"
          />
        </div>
      </div>

      <p className="text-sm text-blog-fg opacity-70 mb-4">
        Write your content in Markdown format. Ctrl+Space for suggestions. Paste
        or upload images directly.
      </p>

      <div className="h-150 overflow-hidden rounded-md border border-blog-cyan bg-blog-black">
        <Controller
          name="content"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="h-full">
              <CodeMirror
                ref={codeMirrorRef}
                value={field.value}
                height="600px"
                theme={oneDark}
                extensions={[
                  markdown(),
                  keymap.of(markdownKeymap),
                  autocompletion({ override: [markdownCompletions] }),
                  EditorView.lineWrapping,
                  pasteImageExtension,
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
                <FieldError errors={[fieldState.error]} className="mt-1" />
              )}
            </Field>
          )}
        />
      </div>
    </div>
  );
}
