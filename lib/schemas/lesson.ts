import { z } from "zod";

export const lessonFormSchema = z
  .object({
    file: z
      .instanceof(File)
      .optional()
      .refine(
        (file) => !file || file.size <= 10 * 1024 * 1024,
        "File size must be less than 10MB",
      )
      .refine(
        (file) => !file || /\.(docx|pptx?|pdf)$/i.test(file.name),
        "File must be one of: .docx, .ppt, .pptx, .pdf",
      ),
  })
  .refine((data) => data.file, {
    message: "Either upload a file or provide both title and content",
    path: ["file"],
  });

export type LessonFormData = z.infer<typeof lessonFormSchema>;
