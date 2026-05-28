import { z } from "zod";

export const quizSetupSchema = z.object({
  difficulty: z
    .enum(["easy", "medium", "hard"])
    .refine((val) => val, "Difficulty level is required"),
  quizType: z
    .string()
    .min(1, "Quiz type is required")
    .min(3, "Quiz type must be at least 3 characters"),
  file: z
    .instanceof(File)
    .refine((file) => !!file, "File is required")
    .refine(
      (file) => file.size <= 25 * 1024 * 1024,
      "File size must be less than 25MB",
    )
    .refine(
      (file) => /\.(pdf|doc|docx|ppt|pptx)$/i.test(file.name),
      "File must be a valid document or image",
    ),
});

export type QuizSetupData = z.infer<typeof quizSetupSchema>;
