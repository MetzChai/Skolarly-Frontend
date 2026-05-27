import { Sparkles } from "lucide-react";
import { SUGGESTED_QUESTIONS } from "./constants";

interface TutorEmptyStateProps {
  onSelectQuestion: (question: string) => void;
}

export function TutorEmptyState({ onSelectQuestion }: TutorEmptyStateProps) {
  return (
    <div className="flex min-h-[min(420px,50vh)] flex-col items-center justify-center px-2 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-secondary/20 ring-1 ring-primary/20">
        <Sparkles className="size-8 text-primary" />
      </div>

      <h2 className="text-xl font-semibold text-foreground">
        How can I help you today?
      </h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        I can explain concepts, help with homework, answer questions, and share
        study tips.
      </p>

      <div className="mt-8 grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
        {SUGGESTED_QUESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => onSelectQuestion(question)}
            className="rounded-xl border border-border/80 bg-card p-3.5 text-left text-sm text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-muted/40 hover:shadow-md"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
