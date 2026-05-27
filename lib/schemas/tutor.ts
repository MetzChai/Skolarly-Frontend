import { z } from "zod";

export const tutorChatInputSchema = z
  .object({
    input: z.string().max(5000, "Message must be less than 5000 characters"),
    file: z
      .custom<File | null>((val) => val === null || val instanceof File)
      .nullable()
      .refine(
        (file) => !file || file.size <= 25 * 1024 * 1024,
        "File size must be less than 25MB",
      )
      .refine(
        (file) =>
          !file ||
          /\.(pdf|doc|docx|ppt|pptx|txt|png|jpg|jpeg|webp)$/i.test(file.name),
        "File must be a valid document or image",
      ),
  })
  .refine((data) => data.input.trim().length > 0 || data.file, {
    message: "Please enter a message or attach a file",
    path: ["input"],
  });

export type TutorChatInputData = z.infer<typeof tutorChatInputSchema>;
