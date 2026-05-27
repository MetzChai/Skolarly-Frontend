"use client";

import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  selectedFile: File | null;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  removeFile: () => void;
}

export function FileUpload({
  selectedFile,
  handleFileChange,
  removeFile,
}: Props) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-3">
        Upload Lesson File
      </label>

      <div className="border-2 border-dashed border-[#4cb1ff]/40 rounded-2xl p-8 bg-sky-50/40 text-center transition hover:bg-sky-50">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-[#4cb1ff]/10 p-4 rounded-full">
            <Upload className="w-8 h-8 text-[#4cb1ff]" />
          </div>

          <div>
            <p className="font-medium text-lg">
              Drag & Drop your file here
            </p>

            <p className="text-sm text-muted-foreground">
              Supports PDF, DOCX, PPT, and PPTX
            </p>
          </div>

          <label>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx,.ppt,.pptx"
              onChange={handleFileChange}
            />

            <div className="cursor-pointer inline-flex items-center gap-2 bg-[#4cb1ff] hover:bg-[#38a4f5] text-white px-5 py-2 rounded-xl transition">
              <Upload className="w-4 h-4" />
              Attach File
            </div>
          </label>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-4 border rounded-2xl p-4 flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="bg-[#f7b801]/15 p-3 rounded-xl">
              <FileText className="w-5 h-5 text-[#f7b801]" />
            </div>

            <div>
              <p className="font-medium">{selectedFile.name}</p>

              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={removeFile}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}