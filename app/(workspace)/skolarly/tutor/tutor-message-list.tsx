import type { RefObject } from "react";
import type { Message } from "./types";
import { TutorMessageBubble } from "./tutor-message-bubble";
import { TutorLoadingIndicator } from "./tutor-loading-indicator";

interface TutorMessageListProps {
  messages: Message[];
  loading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export function TutorMessageList({
  messages,
  loading,
  messagesEndRef,
}: TutorMessageListProps) {
  return (
    <>
      {messages.map((message) => (
        <TutorMessageBubble key={message.id} message={message} />
      ))}

      {loading && <TutorLoadingIndicator />}

      <div ref={messagesEndRef} />
    </>
  );
}
