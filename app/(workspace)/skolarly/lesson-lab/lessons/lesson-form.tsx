"use client";

import { Brain, Loader2, Sparkles } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { FileUpload } from "./file-upload";

interface Props {
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  loading: boolean;
  error: string;
  selectedFile: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  validationErrors?: Record<string, string>;
}

export function LessonForm({
  title,
  setTitle,
  content,
  setContent,
  loading,
  error,
  selectedFile,
  handleFileChange,
  removeFile,
  handleSubmit,
  validationErrors = {},
}: Props) {
  return (
    <Card className="border border-sky-100 shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-linear-to-r from-[#4cb1ff]/10 to-[#f7b801]/10 space-y-3">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Brain className="w-6 h-6 text-[#4cb1ff]" />
          Skolarly AI Explainer
        </CardTitle>

        <CardDescription className="text-base leading-7">
          Attach your files, notes, or lesson content for fast AI explanations.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Lesson Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Lesson Title
            </label>

            <Input
              placeholder="e.g., Introduction to Photosynthesis"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              className={`h-12 rounded-xl ${validationErrors.title ? "border-red-500" : ""}`}
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.title}
              </p>
            )}
          </div>

          {/* File Upload */}
          <FileUpload
            selectedFile={selectedFile}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
          />

          {/* Lesson Content */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Lesson Content
            </label>

            <Textarea
              placeholder="Paste lesson notes or textbook content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              disabled={loading}
              className={`resize-none rounded-2xl ${validationErrors.content ? "border-red-500" : ""}`}
            />
            {validationErrors.content && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.content}
              </p>
            )}
          </div>

          {/* Error */}
          {(error || validationErrors.file) && (
            <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-200">
              {error || validationErrors.file}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={
              loading || (!selectedFile && (!title.trim() || !content.trim()))
            }
            className="w-full h-14 rounded-2xl text-lg font-semibold bg-linear-to-r from-[#4cb1ff] to-[#6bc7ff] hover:opacity-90 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                AI is analyzing your lesson...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Explain Lesson
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
