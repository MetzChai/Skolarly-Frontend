import { FileText, ImageIcon, X } from "lucide-react";

interface TutorFilePreviewProps {
  file: File;
  onRemove: () => void;
}

export function TutorFilePreview({ file, onRemove }: TutorFilePreviewProps) {
  return (
    <div className="mb-3 flex items-center justify-between rounded-2xl border border-border bg-muted/40 px-4 py-3">
      <div className="flex items-center gap-3 overflow-hidden">
        {file.type.startsWith("image/") ? (
          <ImageIcon className="size-5 shrink-0 text-primary" />
        ) : (
          <FileText className="size-5 shrink-0 text-primary" />
        )}

        <div className="overflow-hidden">
          <p className="truncate text-sm font-medium">{file.name}</p>

          <p className="text-xs text-muted-foreground">{file.type}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-1 transition hover:bg-background"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
