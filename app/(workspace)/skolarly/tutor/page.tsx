"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Send,
  Loader2,
  User,
  Bot,
  Sparkles,
  Plus,
  X,
  FileText,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import axiosInstance from "@/lib/axios";
import { aiService } from "@/services/ai.service";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const CHAT_STORAGE_KEY = "skolarly_chat_history";
const CHAT_SESSION_KEY = "skolarly_chat_session";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // FILE STATE
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // AUTO SCROLL
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // AUTO RESIZE TEXTAREA
  const autoResizeTextarea = () => {
    const textarea = inputRef.current;

    if (!textarea) return;

    textarea.style.height = "0px";

    const scrollHeight = textarea.scrollHeight;

    textarea.style.height = Math.min(scrollHeight, 200) + "px";
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

  // FILE PICKER
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // FILE SELECT
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    // INVALID TYPE
    if (!allowedTypes.includes(file.type)) {
      alert("Unsupported file type.");
      return;
    }

    // FILE SIZE
    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 10MB limit.");
      return;
    }

    setSelectedFile(file);
  };

  // REMOVE FILE
  const removeFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // SEND MESSAGE
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if ((!input.trim() && !selectedFile) || loading) return;

    const currentInput = input.trim();

    const currentFile = selectedFile;

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
        selectedFile,
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
  };

  // ENTER / SHIFT ENTER
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      // SHIFT + ENTER = NEW LINE
      if (e.shiftKey) {
        return;
      }

      // ENTER = SEND
      e.preventDefault();

      await handleSubmit();
    }
  };

  const suggestedQuestions = [
    "Explain quantum physics simply",
    "Help me understand calculus",
    "What are good study techniques?",
    "Explain the water cycle",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.length === 0 ? (
              <div className="flex min-h-[min(420px,50vh)] flex-col items-center justify-center px-2 text-center">
                <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-secondary/20 ring-1 ring-primary/20">
                  <Sparkles className="size-8 text-primary" />
                </div>

                <h2 className="text-xl font-semibold text-foreground">
                  How can I help you today?
                </h2>

                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  I can explain concepts, help with homework, answer questions,
                  and share study tips.
                </p>

                <div className="mt-8 grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => setInput(question)}
                      className="rounded-xl border border-border/80 bg-card p-3.5 text-left text-sm text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-muted/40 hover:shadow-md"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user"
                        ? "ml-auto max-w-[85%] flex-row-reverse sm:max-w-[75%]"
                        : "max-w-[85%] sm:max-w-[75%]",
                    )}
                  >
                    {/* AVATAR */}
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground ring-1 ring-border",
                      )}
                    >
                      {message.role === "user" ? (
                        <User className="size-4" />
                      ) : (
                        <Bot className="size-4" />
                      )}
                    </div>

                    {/* MESSAGE */}
                    <Card
                      className={cn(
                        "shadow-sm",
                        message.role === "user"
                          ? "border-primary/30 bg-primary text-primary-foreground"
                          : "border-border/80 bg-card",
                      )}
                    >
                      <CardContent className="p-3.5">
                        {message.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none text-foreground">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                            {message.content}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}

                {/* LOADING */}
                {loading && (
                  <div className="flex max-w-[75%] gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted ring-1 ring-border">
                      <Bot className="size-4 text-muted-foreground" />
                    </div>

                    <Card className="border-border/80 bg-card">
                      <CardContent className="flex items-center gap-2 p-3.5 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin text-primary" />
                        Thinking...
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* CHAT INPUT */}
        <div className="sticky bottom-0 border-t border-border/80 bg-background/95 px-4 py-4 backdrop-blur-sm sm:px-6">
          <div className="mx-auto max-w-3xl">
            {/* FILE PREVIEW */}
            {selectedFile && (
              <div className="mb-3 flex items-center justify-between rounded-2xl border border-border bg-muted/40 px-4 py-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  {selectedFile.type.startsWith("image/") ? (
                    <ImageIcon className="size-5 shrink-0 text-primary" />
                  ) : (
                    <FileText className="size-5 shrink-0 text-primary" />
                  )}

                  <div className="overflow-hidden">
                    <p className="truncate text-sm font-medium">
                      {selectedFile.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {selectedFile.type}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="rounded-full p-1 transition hover:bg-background"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              {/* HIDDEN FILE INPUT */}
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="
                  .png,
                  .jpg,
                  .jpeg,
                  .webp,
                  .pdf,
                  .docx,
                  .txt
                "
                onChange={handleFileChange}
              />

              {/* PLUS BUTTON */}
              <Button
                type="button"
                size="icon"
                onClick={handleFileButtonClick}
                className="
                  size-11
                  shrink-0
                  rounded-full
                  border
                  border-border/60
                  bg-background
                  text-foreground
                  shadow-sm
                  transition-all
                  duration-200
                  hover:bg-muted
                  hover:scale-105
                  active:scale-95
                "
              >
                <Plus className="size-5" />
              </Button>

              {/* TEXTAREA */}
              <textarea
                ref={inputRef}
                placeholder="Ask me anything about your studies..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                rows={1}
                className="
                  min-h-[48px]
                  max-h-[200px]
                  flex-1
                  resize-none
                  overflow-y-auto
                  rounded-3xl
                  border
                  border-border/60
                  bg-background
                  px-5
                  py-3
                  text-sm
                  leading-6
                  shadow-sm
                  outline-none
                  transition-all
                  duration-200
                  whitespace-pre-wrap
                  break-words
                  focus-visible:border-primary/40
                  focus-visible:ring-2
                  focus-visible:ring-primary/20
                "
              />

              {/* SEND BUTTON */}
              <Button
                type="submit"
                size="icon"
                className="
                  size-11
                  shrink-0
                  rounded-full
                "
                disabled={loading || (!input.trim() && !selectedFile)}
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
