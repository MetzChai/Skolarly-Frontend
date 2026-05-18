'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { BookOpen, Sparkles, Loader2, FileText, CheckCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface LessonResult {
  explanation: string
  summary: string
  lesson: {
    id: string
    title: string
    created_at: string
  }
}

export default function LessonsPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<LessonResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      if (!response.ok) {
        throw new Error('Failed to explain lesson')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('Failed to generate explanation. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setTitle('')
    setContent('')
    setResult(null)
    setError('')
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Lesson Explainer</h1>
        </div>
        <p className="text-muted-foreground">
          Paste your lesson content and get AI-powered explanations with key concepts and summaries.
        </p>
      </div>

      {!result ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Enter Your Lesson
            </CardTitle>
            <CardDescription>
              Paste any lesson content, notes, or topic you want explained
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                  Lesson Title
                </label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to Photosynthesis"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
                  Lesson Content
                </label>
                <Textarea
                  id="content"
                  placeholder="Paste your lesson content, textbook excerpt, or notes here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  disabled={loading}
                  className="resize-none"
                />
              </div>

              {error && (
                <div className="text-destructive text-sm">{error}</div>
              )}

              <Button 
                type="submit" 
                className="w-full gap-2" 
                disabled={loading || !title.trim() || !content.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Explanation...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Explain This Lesson
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Success Header */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">{result.lesson.title}</h3>
                  <p className="text-sm text-muted-foreground">Explanation generated successfully</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleReset}>
                New Lesson
              </Button>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Points Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-foreground">
                <ReactMarkdown>{result.summary}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Full Explanation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary">
                <ReactMarkdown>{result.explanation}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
