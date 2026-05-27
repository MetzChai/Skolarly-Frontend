"use client";

import { useState, useRef, useEffect } from "react";
import { aiService } from "@/services/ai.service";
import { tutorChatInputSchema } from "@/lib/schemas/tutor";
import { ZodError } from "zod";
import { CHAT_STORAGE_KEY, CHAT_SESSION_KEY, MAX_FILE_SIZE } from "./constants";
import type { Message } from "./types";

export function useTutorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const autoResizeTextarea = () => {
    const textarea = inputRef.current;

    if (!textarea) return;

    // Let the browser recompute height so it can shrink as text is deleted.
    textarea.style.height = "auto";

    const nextHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${Math.max(nextHeight, 48)}px`;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);

    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }

    const savedSession = localStorage.getItem(CHAT_SESSION_KEY);

    if (savedSession) {
      setSessionId(savedSession);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem(CHAT_SESSION_KEY, sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    autoResizeTextarea();
  }, [input]);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Unsupported file type.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 10MB limit.");
      return;
    }

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setValidationError("");

    if (loading) return;

    try {
      // Validate input data
      const validatedData = tutorChatInputSchema.parse({
        input,
        file: selectedFile,
      });

      const currentInput = validatedData.input.trim();
      const currentFile = validatedData.file;
      const fileText = currentFile ? `\n File: ${currentFile.name}` : "";

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: currentInput + fileText,
      };

      setMessages((prev) => [...prev, userMessage]);

      setInput("");
      if (inputRef.current) {
        inputRef.current.style.height = "48px";
      }

      setLoading(true);

      try {
        const response = await aiService.ask(
          currentInput,
          messages,
          currentFile,
        );

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.data.answer,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Chat error:", error);

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: "I'm sorry, I encountered an error. Please try again.",
          },
        ]);
      } finally {
        setSelectedFile(null);
        setLoading(false);
      }
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map((e) => e.message).join(", ");
        setValidationError(errors);
      } else {
        setValidationError("An error occurred. Please try again.");
      }
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      }

      e.preventDefault();

      await handleSubmit();
    }
  };

  return {
    messages,
    input,
    setInput,
    loading,
    selectedFile,
    messagesEndRef,
    inputRef,
    fileInputRef,
    validationError,
    handleFileButtonClick,
    handleFileChange,
    removeFile,
    handleSubmit,
    handleKeyDown,
  };
}
