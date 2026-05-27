"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axios";
import type { QuizResult, QuizState } from "./types";

export function useQuizLab() {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );
  const [quizType, setQuizType] = useState("multiple-choice");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizResult["quiz"] | null>(null);
  const [quizState, setQuizState] = useState<QuizState>("setup");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("difficulty", difficulty);
      formData.append("quizType", quizType);
      formData.append("file", selectedFile);

      const response = await axiosInstance.post(
        "/api/ai/v1/quiz-generator",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const data = response.data.data.quiz;
      console.log("Quiz data", data);

      setQuiz(data.quiz);
      setSelectedAnswers(new Array(data.quiz.questions.length).fill(null));
      setQuizState("taking");
      setCurrentQuestion(0);
    } catch (err) {
      setError("Failed to generate quiz. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExitQuiz = () => {
    const confirmExit = window.confirm(
      "Are you sure you want to exit the quiz? Your progress will be lost.",
    );
    if (!confirmExit) return;

    setQuiz(null);
    setQuizState("setup");
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResult(false);
    setError("");
  };

  const handleSelectAnswer = (answerIndex: number) => {
    if (selectedAnswers[currentQuestion] !== null) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length ?? 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowResult(false);
    } else {
      setQuizState("results");
    }
  };

  const handleReset = () => {
    setQuiz(null);
    setQuizState("setup");
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResult(false);
    setSelectedFile(null);
    setError("");
  };

  const handleRetryQuiz = () => {
    if (!quiz) return;

    setQuizState("taking");
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(null));
    setShowResult(false);
  };

  const calculateScore = () => {
    if (!quiz)
      return {
        correct: 0,
        total: 0,
        percentage: 0,
      };

    const correct = selectedAnswers.filter(
      (answer, index) => answer === quiz.questions[index].correctAnswer,
    ).length;

    return {
      correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100),
    };
  };

  return {
    difficulty,
    setDifficulty,
    quizType,
    setQuizType,
    selectedFile,
    loading,
    quiz,
    quizState,
    currentQuestion,
    selectedAnswers,
    showResult,
    error,
    handleFileChange,
    removeFile,
    handleGenerateQuiz,
    handleExitQuiz,
    handleSelectAnswer,
    handleNextQuestion,
    handleReset,
    handleRetryQuiz,
    calculateScore,
    setQuizState,
    setCurrentQuestion,
    setSelectedAnswers,
    setShowResult,
  };
}
