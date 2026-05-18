'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BrainCircuit, Sparkles, Loader2, CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizResult {
  quiz: {
    id: string
    title: string
    difficulty: string
    questions: QuizQuestion[]
  }
}

type QuizState = 'setup' | 'taking' | 'results'

export default function QuizzesPage() {
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [questionCount, setQuestionCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [quiz, setQuiz] = useState<QuizResult['quiz'] | null>(null)
  const [quizState, setQuizState] = useState<QuizState>('setup')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [error, setError] = useState('')

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty, questionCount }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate quiz')
      }

      const data: QuizResult = await response.json()
      setQuiz(data.quiz)
      setSelectedAnswers(new Array(data.quiz.questions.length).fill(null))
      setQuizState('taking')
      setCurrentQuestion(0)
    } catch (err) {
      setError('Failed to generate quiz. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAnswer = (answerIndex: number) => {
    if (selectedAnswers[currentQuestion] !== null) return
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length ?? 0) - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    } else {
      setQuizState('results')
    }
  }

  const handleReset = () => {
    setTopic('')
    setQuiz(null)
    setQuizState('setup')
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setShowExplanation(false)
    setError('')
  }

  const calculateScore = () => {
    if (!quiz) return { correct: 0, total: 0, percentage: 0 }
    const correct = selectedAnswers.filter(
      (answer, index) => answer === quiz.questions[index].correctAnswer
    ).length
    return {
      correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100),
    }
  }

  // Setup State
  if (quizState === 'setup') {
    return (
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-secondary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Quiz Generator</h1>
          </div>
          <p className="text-muted-foreground">
            Generate custom quizzes on any topic to test your knowledge.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Your Quiz</CardTitle>
            <CardDescription>Choose a topic, difficulty, and number of questions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerateQuiz} className="space-y-6">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-foreground mb-2">
                  Quiz Topic
                </label>
                <Input
                  id="topic"
                  placeholder="e.g., World War II, Calculus, Python Programming"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      className={cn(
                        'py-3 px-4 rounded-lg border text-sm font-medium transition-colors capitalize',
                        difficulty === level
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-foreground border-border hover:border-primary/50'
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Number of Questions: {questionCount}
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="w-full accent-primary"
                  disabled={loading}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>3</span>
                  <span>10</span>
                </div>
              </div>

              {error && <div className="text-destructive text-sm">{error}</div>}

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={loading || !topic.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Quiz
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Taking Quiz State
  if (quizState === 'taking' && quiz) {
    const question = quiz.questions[currentQuestion]
    const selectedAnswer = selectedAnswers[currentQuestion]
    const isCorrect = selectedAnswer === question.correctAnswer

    return (
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm font-medium text-muted-foreground capitalize">
              {quiz.difficulty}
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrectAnswer = index === question.correctAnswer
              const showResult = selectedAnswer !== null

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={cn(
                    'w-full p-4 rounded-lg border text-left transition-all',
                    !showResult && 'hover:border-primary/50 hover:bg-muted/50',
                    showResult && isCorrectAnswer && 'bg-green-500/10 border-green-500 text-green-700',
                    showResult && isSelected && !isCorrectAnswer && 'bg-red-500/10 border-red-500 text-red-700',
                    !showResult && 'bg-background border-border'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                      showResult && isCorrectAnswer && 'bg-green-500 text-white',
                      showResult && isSelected && !isCorrectAnswer && 'bg-red-500 text-white',
                      !showResult && 'bg-muted text-muted-foreground'
                    )}>
                      {showResult && isCorrectAnswer ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : showResult && isSelected ? (
                        <XCircle className="w-5 h-5" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </span>
                    <span className={cn(
                      'flex-1',
                      showResult && isCorrectAnswer && 'font-medium'
                    )}>
                      {option}
                    </span>
                  </div>
                </button>
              )
            })}

            {showExplanation && (
              <div className={cn(
                'mt-4 p-4 rounded-lg',
                isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-primary/10 border border-primary/30'
              )}>
                <p className="font-medium mb-1">
                  {isCorrect ? 'Correct!' : 'Explanation:'}
                </p>
                <p className="text-sm text-muted-foreground">{question.explanation}</p>
              </div>
            )}

            {selectedAnswer !== null && (
              <Button onClick={handleNextQuestion} className="w-full mt-4">
                {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'See Results'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Results State
  if (quizState === 'results' && quiz) {
    const score = calculateScore()

    return (
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            <CardDescription>{quiz.title}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="py-6">
              <p className="text-5xl font-bold text-primary">{score.percentage}%</p>
              <p className="text-muted-foreground mt-2">
                You got {score.correct} out of {score.total} questions correct
              </p>
            </div>

            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${score.percentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                New Quiz
              </Button>
              <Button onClick={() => {
                setQuizState('taking')
                setCurrentQuestion(0)
                setSelectedAnswers(new Array(quiz.questions.length).fill(null))
                setShowExplanation(false)
              }} className="gap-2">
                <BrainCircuit className="w-4 h-4" />
                Retry Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
