"use client";

import { useQuizLab } from "./use-quiz-lab";
import { QuizSetupView } from "./quiz-setup-view";
import { QuizTakingView } from "./quiz-taking-view";
import { QuizResultsView } from "./quiz-results-view";

export default function QuizzesPage() {
  const quizLab = useQuizLab();

  if (quizLab.quizState === "setup") {
    return (
      <QuizSetupView
        difficulty={quizLab.difficulty}
        setDifficulty={quizLab.setDifficulty}
        quizType={quizLab.quizType}
        setQuizType={quizLab.setQuizType}
        selectedFile={quizLab.selectedFile}
        loading={quizLab.loading}
        error={quizLab.error}
        onFileChange={quizLab.handleFileChange}
        onRemoveFile={quizLab.removeFile}
        onSubmit={quizLab.handleGenerateQuiz}
        validationErrors={quizLab.validationErrors}
      />
    );
  }

  if (quizLab.quizState === "taking" && quizLab.quiz) {
    return (
      <QuizTakingView
        quiz={quizLab.quiz}
        currentQuestion={quizLab.currentQuestion}
        selectedAnswers={quizLab.selectedAnswers}
        showResult={quizLab.showResult}
        onExit={quizLab.handleExitQuiz}
        onSelectAnswer={quizLab.handleSelectAnswer}
        onNextQuestion={quizLab.handleNextQuestion}
      />
    );
  }

  if (quizLab.quizState === "results" && quizLab.quiz) {
    return (
      <QuizResultsView
        quiz={quizLab.quiz}
        score={quizLab.calculateScore()}
        onReset={quizLab.handleReset}
        onRetryQuiz={quizLab.handleRetryQuiz}
      />
    );
  }

  return null;
}
