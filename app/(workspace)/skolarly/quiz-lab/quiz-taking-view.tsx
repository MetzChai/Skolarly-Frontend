import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import type { QuizResult } from "./types";

interface QuizTakingViewProps {
  quiz: QuizResult["quiz"];
  currentQuestion: number;
  selectedAnswers: (number | null)[];
  showResult: boolean;
  onExit: () => void;
  onSelectAnswer: (answerIndex: number) => void;
  onNextQuestion: () => void;
}

export function QuizTakingView({
  quiz,
  currentQuestion,
  selectedAnswers,
  showResult,
  onExit,
  onSelectAnswer,
  onNextQuestion,
}: QuizTakingViewProps) {
  const question = quiz.questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <WorkspaceShell size="md">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>

            <span className="capitalize text-sm">{quiz.difficulty}</span>
          </div>

          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4cb1ff] transition-all"
              style={{
                width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <Button className="ml-4 rounded-xl" onClick={onExit}>
          Exit
        </Button>
      </div>

      <Card className="rounded-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl leading-relaxed">
            {question.question}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {question.options?.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === question.correctAnswer;

            return (
              <button
                key={index}
                onClick={() => onSelectAnswer(index)}
                disabled={selectedAnswer !== null}
                className={cn(
                  "w-full p-4 rounded-2xl border text-left transition-all",
                  selectedAnswer === null && "hover:border-[#4cb1ff]",
                  selectedAnswer !== null &&
                    isCorrectAnswer &&
                    "bg-green-500/10 border-green-500",
                  selectedAnswer !== null &&
                    isSelected &&
                    !isCorrectAnswer &&
                    "bg-red-500/10 border-red-500",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {String.fromCharCode(65 + index)}
                  </div>

                  <span>{option}</span>
                </div>
              </button>
            );
          })}

          {showResult && (
            <div
              className={cn(
                "p-4 rounded-2xl border",
                isCorrect
                  ? "bg-green-500/10 border-green-500"
                  : "bg-red-500/10 border-red-500",
              )}
            >
              <p className="font-semibold">{isCorrect ? "Correct!" : "Wrong Answer"}</p>
            </div>
          )}

          {selectedAnswer !== null && (
            <Button onClick={onNextQuestion} className="w-full rounded-2xl h-12">
              {currentQuestion < quiz.questions.length - 1
                ? "Next Question"
                : "See Results"}
            </Button>
          )}
        </CardContent>
      </Card>
    </WorkspaceShell>
  );
}
