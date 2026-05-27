import type { RefObject } from "react";
import { Send, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TutorFilePreview } from "./tutor-file-preview";

interface TutorChatInputProps {
  input: string;
  loading: boolean;
  selectedFile: File | null;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onInputChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onFileButtonClick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  validationError?: string;
}

export function TutorChatInput({
  input,
  loading,
  selectedFile,
  inputRef,
  fileInputRef,
  onInputChange,
  onSubmit,
  onKeyDown,
  onFileButtonClick,
  onFileChange,
  onRemoveFile,
  validationError = "",
}: TutorChatInputProps) {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-20 border-t border-border/80 bg-background/95 px-4 py-4 backdrop-blur-sm sm:px-6">
      <div className="mx-auto max-w-3xl">
        {validationError && (
          <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {validationError}
          </div>
        )}

        {selectedFile && (
          <TutorFilePreview file={selectedFile} onRemove={onRemoveFile} />
        )}

        <form onSubmit={onSubmit} className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="
                  .png,
                  .jpg,
                  .jpeg,
                  .webp,
                  .pdf,
                  .docx,
                  .txt
                "
            onChange={onFileChange}
          />

          <Button
            type="button"
            size="icon"
            onClick={onFileButtonClick}
            className="
                  size-11
                  shrink-0
                  rounded-full
                  border
                  border-border/60
                  bg-background
                  text-foreground
                  shadow-sm
                  transition-all
                  duration-200
                  hover:bg-muted
                  hover:scale-105
                  active:scale-95
                "
          >
            <Plus className="size-5" />
          </Button>

          <textarea
            ref={inputRef}
            placeholder="Ask me anything about your studies..."
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={loading}
            rows={1}
            className="
              min-h-12
                  max-h-50
                  flex-1
                  resize-none
                  overflow-y-auto
                  rounded-3xl
                  border
                  border-border/60
                  bg-background
                  px-5
                  py-3
                  text-sm
                  leading-6
                  shadow-sm
                  outline-none
                  transition-all
                  duration-200
                  whitespace-pre-wrap
                  wrap-break-word
                  focus-visible:border-primary/40
                  focus-visible:ring-2
                  focus-visible:ring-primary/20
                "
          />

          <Button
            type="submit"
            size="icon"
            className="
                  size-11
                  shrink-0
                  rounded-full
                "
            disabled={loading || (!input.trim() && !selectedFile)}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
