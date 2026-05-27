import { User, Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import type { Message } from "./types";

interface TutorMessageBubbleProps {
  message: Message;
}

export function TutorMessageBubble({ message }: TutorMessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex gap-3",
        message.role === "user"
          ? "ml-auto max-w-[85%] flex-row-reverse sm:max-w-[75%]"
          : "max-w-[85%] sm:max-w-[75%]",
      )}
    >
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
            <div className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
              {message.content}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
