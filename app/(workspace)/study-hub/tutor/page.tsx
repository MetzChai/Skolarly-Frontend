'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Send, Loader2, User, Bot, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import axiosInstance from "@/lib/axios";


interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const CHAT_STORAGE_KEY = "skolarly_chat_history";
const CHAT_SESSION_KEY = "skolarly_chat_session";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const autoResizeTextarea = () => {
    const textarea = inputRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
      setSessionId(savedSession)
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem(CHAT_SESSION_KEY, sessionId)
    }
  }, [sessionId])

  useEffect(() => {
    autoResizeTextarea()
  }, [input])

  useEffect(() => {
    autoResizeTextarea()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {

      const response = await axiosInstance.post('/api/ai/v1/ask', {
        question: input.trim(),
        history: [],
 
      })

      if (response.data.error) {
        throw new Error('Failed to send message')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.data.answer,
      }

      setMessages((prev) => [...prev, assistantMessage])
      if (response.data.sessionId) {
        setSessionId(response.data.sessionId)
      }
      setLoading(false);
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I'm sorry, I encountered an error. Please try again.",
        },
      ])
      setLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()
      const textarea = inputRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const nextValue = input.slice(0, start) + '\n' + input.slice(end)

      setInput(nextValue)
      window.requestAnimationFrame(() => {
        if (!textarea) return
        const nextPos = start + 1
        textarea.selectionStart = nextPos
        textarea.selectionEnd = nextPos
        autoResizeTextarea()
      })
    }
  }

  const suggestedQuestions = [
    'Explain quantum physics simply',
    'Help me understand calculus',
    'What are good study techniques?',
    'Explain the water cycle',
  ]

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.length === 0 ? (
              <div className="flex min-h-[min(420px,50vh)] flex-col items-center justify-center px-2 text-center">
                <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-secondary/20 ring-1 ring-primary/20">
                  <Sparkles className="size-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">How can I help you today?</h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  I can explain concepts, help with homework, answer questions, and share study tips.
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
                      'flex gap-3',
                      message.role === 'user' ? 'ml-auto max-w-[85%] flex-row-reverse sm:max-w-[75%]' : 'max-w-[85%] sm:max-w-[75%]',
                    )}
                  >
                    <div
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-full',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground ring-1 ring-border',
                      )}
                    >
                      {message.role === 'user' ? (
                        <User className="size-4" />
                      ) : (
                        <Bot className="size-4" />
                      )}
                    </div>
                    <Card
                      className={cn(
                        'shadow-sm',
                        message.role === 'user'
                          ? 'border-primary/30 bg-primary text-primary-foreground'
                          : 'border-border/80 bg-card',
                      )}
                    >
                      <CardContent className="p-3.5">
                        {message.role === 'assistant' ? (
                          <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary">
                            <ReactMarkdown>{message.content || '...'}</ReactMarkdown>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
                            {message.content}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
                {loading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex max-w-[75%] gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted ring-1 ring-border">
                      <Bot className="size-4 text-muted-foreground" />
                    </div>
                    <Card className="border-border/80 bg-card">
                      <CardContent className="flex items-center gap-2 p-3.5 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin text-primary" />
                        Thinking…
                      </CardContent>
                    </Card>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-border/80 bg-background/95 px-4 py-4 backdrop-blur-sm sm:px-6">
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl gap-2">
            <textarea
              ref={inputRef}
              placeholder="Ask me anything about your studies…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              rows={1}
              className="min-h-12 flex-1 resize-none rounded-xl border border-border/80 bg-muted/30 px-3.5 py-3 text-sm leading-6 shadow-sm outline-none transition-all duration-150 focus-visible:border-ring focus-visible:bg-background focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            />
            <Button
              type="submit"
              size="icon"
              className="size-11 shrink-0 rounded-xl"
              disabled={loading || !input.trim()}
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
  )
}
