export interface QuizQuestion {
  type: "multiple-choice" | "true-false";
  question: string;
  options?: string[];
  correctAnswer: string | number;
}

export interface QuizResult {
  quiz: {
    id: string;
    title: string;
    difficulty: string;
    questions: QuizQuestion[];
  };
}

export type QuizState = "setup" | "taking" | "results";
