import { z } from "zod";

export const lessonFormSchema = z
  .object({
    title: z
      .string()
      .min(1, "Lesson title is required")
      .min(3, "Title must be at least 3 characters")
      .max(200, "Title must be less than 200 characters"),
    content: z
      .string()
      .min(1, "Lesson content is required")
      .min(10, "Content must be at least 10 characters"),
    file: z
      .instanceof(File)
      .optional()
      .refine(
        (file) => !file || file.size <= 10 * 1024 * 1024,
        "File size must be less than 10MB",
      )
      .refine(
        (file) => !file || /\.(pdf|txt|docx|png|jpg|jpeg)$/i.test(file.name),
        "File must be a valid document or image",
      ),
  })
  .refine((data) => data.file || (data.title && data.content), {
    message: "Either upload a file or provide both title and content",
    path: ["file"],
  });

export type LessonFormData = z.infer<typeof lessonFormSchema>;
