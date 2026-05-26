"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Sparkles,
  Loader2,
  FileText,
  CheckCircle,
  Upload,
  X,
  Brain,
  Lightbulb,
  FileQuestion,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { PageHeader } from "@/components/layout/page-header";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import axiosInstance from "@/lib/axios";

export default function LessonsPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleCopy = async () => {
    const stripMarkdown = (text: string) => {
      return text
        .replace(/#{1,6}\s?/g, "") // remove headings #
        .replace(/\*\*/g, "") // remove bold **
        .replace(/\*/g, "") // remove bullets *
        .replace(/`/g, "") // remove code backticks
        .replace(/\[(.*?)\]\(.*?\)/g, "$1") // links [text](url)
        .replace(/\n{3,}/g, "\n\n") // clean extra spacing
        .trim();
    };
    const cleanText = stripMarkdown(result);

    await navigator.clipboard.writeText(cleanText);

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    // Auto-fill title from filename if empty
    if (!title.trim()) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }

    // OPTIONAL:
    // Auto-read text files
    if (file.type === "text/plain") {
      const text = await file.text();
      setContent(text);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Allow:
    // - File only
    // - Title + Content
    // Block:
    // - Empty form
    // - Only title
    // - Only content
    if (!selectedFile && (!title.trim() || !content.trim())) {
      return;
    }

    console.log("Title", title);
    console.log("Content", content);

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", content);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axiosInstance.post(
        "/api/ai/v1/lesson-explainer",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setResult(response.data.data.answer);
    } catch (err) {
      setError("Failed to generate explanation. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WorkspaceShell size="lg">
      <PageHeader
        title="Lesson Explainer"
        description="Upload your lesson files and get instant AI-powered explanations, summaries, and quizzes in seconds."
        icon={BookOpen}
      />

      {!result ? (
        <Card className="border border-sky-100 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#4cb1ff]/10 to-[#f7b801]/10">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Brain className="w-6 h-6 text-[#4cb1ff]" />
              AI Lesson Explainer
            </CardTitle>

            <CardDescription className="text-base">
              Attach your files, notes, or lesson content for fast AI
              explanations.
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
                  className="h-12 rounded-xl"
                />
              </div>

              {/* Upload Section */}
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
                        accept=".pdf,.docx,.ppt,.pptx/*"
                        onChange={handleFileChange}
                      />

                      <div className="cursor-pointer inline-flex items-center gap-2 bg-[#4cb1ff] hover:bg-[#38a4f5] text-white px-5 py-2 rounded-xl transition">
                        <Upload className="w-4 h-4" />
                        Attach File
                      </div>
                    </label>
                  </div>
                </div>

                {/* Uploaded File Preview */}
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
                  className="resize-none rounded-2xl"
                />
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  Key Concepts
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Summarize
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl gap-2"
                >
                  <FileQuestion className="w-4 h-4" />
                  Quiz Me
                </Button>
              </div>

              {/* Error */}
              {error && (
                <div className="text-red-500 text-sm font-medium">{error}</div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={
                  loading ||
                  (!selectedFile && (!title.trim() || !content.trim()))
                }
                className="w-full h-14 rounded-2xl text-lg font-semibold bg-gradient-to-r from-[#4cb1ff] to-[#6bc7ff] hover:opacity-90 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    AI is analyzing your lesson...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Explain Lesson Fast
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Success */}
          <Card className="relative">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  className="gap-2 transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              <div className="prose prose-sm max-w-none whitespace-pre-wrap select-text">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </WorkspaceShell>
  );
}
