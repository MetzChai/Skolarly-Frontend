'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageSquare, Send, Loader2, User, Bot, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content, sessionId }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
      }

      setMessages((prev) => [...prev, assistantMessage])

      let fullContent = ''
      const newSessionId = sessionId

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('0:')) {
              const textContent = line.slice(2).replace(/^"|"$/g, '')
              fullContent += textContent
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessage.id ? { ...msg, content: fullContent } : msg,
                ),
              )
            }
          }
        }
      }

      if (fullContent && (sessionId || newSessionId)) {
        await fetch('/api/chat/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionId || newSessionId,
            content: fullContent,
          }),
        })
      }

      if (!sessionId) {
        setSessionId(Date.now().toString())
      }
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
    } finally {
      setLoading(false)
      inputRef.current?.focus()
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
                <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 ring-1 ring-primary/20">
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
                          <p className="text-sm leading-relaxed">{message.content}</p>
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
            <Input
              ref={inputRef}
              placeholder="Ask me anything about your studies…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="h-11 flex-1 rounded-xl border-border/80 bg-muted/30 shadow-sm focus-visible:bg-background"
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
