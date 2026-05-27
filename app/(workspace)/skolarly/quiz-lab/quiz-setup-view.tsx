import {
  BrainCircuit,
  Sparkles,
  Loader2,
  Upload,
  FileText,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkspaceShell } from "@/components/layout/workspace-shell";

interface QuizSetupViewProps {
  difficulty: "easy" | "medium" | "hard";
  setDifficulty: (level: "easy" | "medium" | "hard") => void;
  quizType: string;
  setQuizType: (type: string) => void;
  selectedFile: File | null;
  loading: boolean;
  error: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  onSubmit: (e: React.FormEvent) => void;
  validationErrors?: Record<string, string>;
}

export function QuizSetupView({
  difficulty,
  setDifficulty,
  quizType,
  setQuizType,
  selectedFile,
  loading,
  error,
  onFileChange,
  onRemoveFile,
  onSubmit,
  validationErrors = {},
}: QuizSetupViewProps) {
  return (
    <WorkspaceShell size="lg">
      <Card className="rounded-3xl border border-sky-100 shadow-xl overflow-hidden">
        <CardHeader className="bg-linear-to-r from-[#4cb1ff]/10 to-[#f7b801]/10">
          <CardTitle className="text-3xl flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-[#4cb1ff]" />
            AI Quiz Generator
          </CardTitle>

          <CardDescription className="text-base">
            Generate quizzes directly from uploaded lesson content.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3">
                Upload Lesson File
              </label>

              <div className="border-2 border-dashed border-[#4cb1ff]/40 rounded-3xl p-8 text-center bg-sky-50/40 hover:bg-sky-50 transition">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-[#4cb1ff]/10 p-4 rounded-full">
                    <Upload className="w-8 h-8 text-[#4cb1ff]" />
                  </div>

                  <div>
                    <p className="text-lg font-semibold">
                      Drag & Drop your lesson file
                    </p>

                    <p className="text-sm text-muted-foreground">
                      PDF, DOCX, PPTX, or PPT
                    </p>
                  </div>

                  <label>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,image/*"
                      onChange={onFileChange}
                    />

                    <div className="cursor-pointer inline-flex items-center gap-2 bg-[#4cb1ff] text-white px-5 py-2 rounded-xl hover:opacity-90">
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
                    onClick={onRemoveFile}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">
                Difficulty Level
              </label>

              <div className="grid grid-cols-3 gap-3">
                {(["easy", "medium", "hard"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={cn(
                      "py-4 rounded-2xl font-medium capitalize transition",
                      difficulty === level
                        ? "bg-[#4cb1ff] text-white shadow-lg"
                        : "bg-background border hover:border-[#4cb1ff]/40",
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">
                Quiz Type
              </label>

              <div className="grid grid-cols-3 gap-3">
                {["multiple-choice", "true-false", "mixed"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setQuizType(type)}
                    className={cn(
                      "rounded-2xl py-3 border text-sm font-medium transition capitalize",
                      quizType === type
                        ? "bg-[#f7b801] text-black border-[#f7b801]"
                        : "hover:border-[#f7b801]",
                    )}
                  >
                    {type.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium">{error}</div>
            )}

            {validationErrors.file && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                {validationErrors.file}
              </div>
            )}

            {validationErrors.difficulty && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                {validationErrors.difficulty}
              </div>
            )}

            {validationErrors.quizType && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                {validationErrors.quizType}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !selectedFile}
              className="w-full h-14 rounded-2xl text-lg font-semibold text-white bg-linear-to-r from-[#1f78d1] to-[#2f8fe8] hover:from-[#1669bd] hover:to-[#267fd6] shadow-xl border border-[#1669bd]/50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  AI is generating your quiz...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Quiz Fast
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </WorkspaceShell>
  );
}
