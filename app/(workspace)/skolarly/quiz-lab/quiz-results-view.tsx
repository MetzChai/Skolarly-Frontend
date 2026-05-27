import { RotateCcw, Trophy, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import type { QuizResult } from "./types";

interface Score {
  correct: number;
  total: number;
  percentage: number;
}

interface QuizResultsViewProps {
  quiz: QuizResult["quiz"];
  score: Score;
  onReset: () => void;
  onRetryQuiz: () => void;
}

export function QuizResultsView({
  quiz,
  score,
  onReset,
  onRetryQuiz,
}: QuizResultsViewProps) {
  return (
    <WorkspaceShell size="md">
      <Card className="rounded-3xl shadow-xl">
        <CardHeader className="text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-[#4cb1ff]/10 flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-[#4cb1ff]" />
          </div>

          <CardTitle className="text-3xl">Quiz Complete!</CardTitle>

          <CardDescription>{quiz.title}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <div>
            <p className="text-6xl font-bold text-[#4cb1ff]">{score.percentage}%</p>

            <p className="text-muted-foreground mt-2">
              You got {score.correct} out of {score.total} correct
            </p>
          </div>

          <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4cb1ff]"
              style={{
                width: `${score.percentage}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={onReset} className="rounded-2xl gap-2">
              <RotateCcw className="w-4 h-4" />
              New Quiz
            </Button>

            <Button onClick={onRetryQuiz} className="rounded-2xl gap-2">
              <FileQuestion className="w-4 h-4" />
              Retry Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </WorkspaceShell>
  );
}
