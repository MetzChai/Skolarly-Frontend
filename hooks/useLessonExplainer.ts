"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axios";

export function useLessonExplainer() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
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

    if (!selectedFile && (!title.trim() || !content.trim())) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", content);

      if (selectedFile) {
        formData.append("file", selectedFile);
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
      console.error(err);
      setError("Failed to generate explanation.");
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
  };
}