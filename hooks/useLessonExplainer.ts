"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { lessonFormSchema } from "@/lib/schemas/lesson";
import { ZodError } from "zod";

export function useLessonExplainer() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    if (!title.trim()) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }

    if (file.type === "text/plain") {
      const text = await file.text();
      setContent(text);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setError("");

    try {
      // Validate form data
      const validatedData = lessonFormSchema.parse({
        title,
        content,
        file: selectedFile,
      });

      setLoading(true);

      const formData = new FormData();
      formData.append("title", validatedData.title);
      formData.append("content", validatedData.content);

      if (validatedData.file) {
        formData.append("file", validatedData.file);
      }

      const response = await axiosInstance.post(
        "/api/ai/v1/lesson-explainer",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setResult(response.data.data.answer);
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach((error) => {
          const path = error.path.join(".");
          errors[path] = error.message;
        });
        setValidationErrors(errors);
      } else {
        console.error(err);
        setError("Failed to generate explanation.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    loading,
    result,
    error,
    selectedFile,
    handleFileChange,
    removeFile,
    handleSubmit,
    validationErrors,
  };
}
