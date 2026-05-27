"use client";

import { useTutorChat } from "./use-tutor-chat";
import { TutorEmptyState } from "./tutor-empty-state";
import { TutorMessageList } from "./tutor-message-list";
import { TutorChatInput } from "./tutor-chat-input";

export default function ChatPage() {
  const chat = useTutorChat();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-6 pb-36 sm:px-6">
          <div className="mx-auto max-w-3xl space-y-4">
            {chat.messages.length === 0 ? (
              <TutorEmptyState onSelectQuestion={chat.setInput} />
            ) : (
              <TutorMessageList
                messages={chat.messages}
                loading={chat.loading}
                messagesEndRef={chat.messagesEndRef}
              />
            )}
          </div>
        </div>

        <TutorChatInput
          input={chat.input}
          loading={chat.loading}
          selectedFile={chat.selectedFile}
          inputRef={chat.inputRef}
          fileInputRef={chat.fileInputRef}
          onInputChange={chat.setInput}
          onSubmit={chat.handleSubmit}
          onKeyDown={chat.handleKeyDown}
          onFileButtonClick={chat.handleFileButtonClick}
          onFileChange={chat.handleFileChange}
          onRemoveFile={chat.removeFile}
          validationError={chat.validationError}
        />
      </div>
    </div>
  );
}
