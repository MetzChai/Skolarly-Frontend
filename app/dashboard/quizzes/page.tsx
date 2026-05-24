'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  BrainCircuit,
  Sparkles,
  Loader2,
  CheckCircle,
  XCircle,
  RotateCcw,
  Trophy,
  Upload,
  FileText,
  X,
  Clock3,
  FileQuestion,
  BookOpen,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/dashboard/page-header'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'

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
  const [difficulty, setDifficulty] = useState<
    'easy' | 'medium' | 'hard'
  >('medium')

  const [questionCount, setQuestionCount] = useState(10)

  const [quizType, setQuizType] = useState('multiple-choice')

  const [timedQuiz, setTimedQuiz] = useState(false)

  const [generateAnswerKey, setGenerateAnswerKey] = useState(true)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)

  const [quiz, setQuiz] = useState<QuizResult['quiz'] | null>(null)

  const [quizState, setQuizState] =
    useState<QuizState>('setup')

  const [currentQuestion, setCurrentQuestion] = useState(0)

  const [selectedAnswers, setSelectedAnswers] = useState<
    (number | null)[]
  >([])

  const [showExplanation, setShowExplanation] =
    useState(false)

  const [error, setError] = useState('')

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    setSelectedFile(file)
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  const handleGenerateQuiz = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    if (!topic.trim() && !selectedFile) return

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()

      formData.append('topic', topic)
      formData.append('difficulty', difficulty)
      formData.append(
        'questionCount',
        questionCount.toString()
      )

      formData.append('quizType', quizType)

      formData.append(
        'generateAnswerKey',
        generateAnswerKey.toString()
      )

      formData.append('timedQuiz', timedQuiz.toString())

      if (selectedFile) {
        formData.append('file', selectedFile)
      }

      const response = await fetch('/api/quizzes', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to generate quiz')
      }

      const data: QuizResult = await response.json()

      setQuiz(data.quiz)

      setSelectedAnswers(
        new Array(data.quiz.questions.length).fill(null)
      )

      setQuizState('taking')

      setCurrentQuestion(0)
    } catch (err) {
      setError(
        'Failed to generate quiz. Please try again.'
      )

      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAnswer = (
    answerIndex: number
  ) => {
    if (selectedAnswers[currentQuestion] !== null)
      return

    const newAnswers = [...selectedAnswers]

    newAnswers[currentQuestion] = answerIndex

    setSelectedAnswers(newAnswers)

    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    if (
      currentQuestion <
      (quiz?.questions.length ?? 0) - 1
    ) {
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
    setSelectedFile(null)
    setError('')
  }

  const calculateScore = () => {
    if (!quiz)
      return {
        correct: 0,
        total: 0,
        percentage: 0,
      }

    const correct = selectedAnswers.filter(
      (answer, index) =>
        answer === quiz.questions[index].correctAnswer
    ).length

    return {
      correct,
      total: quiz.questions.length,
      percentage: Math.round(
        (correct / quiz.questions.length) * 100
      ),
    }
  }

  // =========================
  // SETUP SCREEN
  // =========================

  if (quizState === 'setup') {
    return (
      <DashboardShell size="lg">
        <PageHeader
          title="Quiz Generator"
          description="Upload your lesson files or enter a topic to instantly generate AI-powered quizzes."
          icon={BrainCircuit}
          variant="secondary"
        />

        <Card className="rounded-3xl border border-sky-100 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#4cb1ff]/10 to-[#f7b801]/10">
            <CardTitle className="text-3xl flex items-center gap-3">
              <BrainCircuit className="w-8 h-8 text-[#4cb1ff]" />
              AI Quiz Generator
            </CardTitle>

            <CardDescription className="text-base">
              Generate quizzes from files, notes, or any study topic.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form
              onSubmit={handleGenerateQuiz}
              className="space-y-6"
            >
              {/* Topic */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Quiz Topic
                </label>

                <Input
                  placeholder="e.g., Calculus, World War II, Python"
                  value={topic}
                  onChange={(e) =>
                    setTopic(e.target.value)
                  }
                  disabled={loading}
                  className="h-12 rounded-xl"
                />
              </div>

              {/* Upload Section */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Upload Lesson File
                </label>

                <div className="border-2 border-dashed border-[#4cb1ff]/40 rounded-3xl p-8 text-center bg-sky-50/40 hover:bg-sky-50 transition">
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-[#4cb1ff]/10 p-4 rounded-full">
                      <Upload className="w-8 h-8 text-[#4cb1ff]" />
                    </div>

                    <div>
                      <p className="text-lg font-semibold">
                        Drag & Drop your lesson file
                      </p>

                      <p className="text-sm text-muted-foreground">
                        PDF, DOCX, PPTX, TXT, or Images
                      </p>
                    </div>

                    <label>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,image/*"
                        onChange={handleFileChange}
                      />

                      <div className="cursor-pointer inline-flex items-center gap-2 bg-[#4cb1ff] text-white px-5 py-2 rounded-xl hover:opacity-90">
                        <Upload className="w-4 h-4" />
                        Attach File
                      </div>
                    </label>
                  </div>
                </div>

                {/* File Preview */}
                {selectedFile && (
                  <div className="mt-4 border rounded-2xl p-4 flex items-center justify-between bg-muted/40">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#f7b801]/15 p-3 rounded-xl">
                        <FileText className="w-5 h-5 text-[#f7b801]" />
                      </div>

                      <div>
                        <p className="font-medium">
                          {selectedFile.name}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {(
                            selectedFile.size / 1024
                          ).toFixed(1)}{' '}
                          KB
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={removeFile}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Difficulty Level
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {(
                    ['easy', 'medium', 'hard'] as const
                  ).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setDifficulty(level)
                      }
                      className={cn(
                        'py-4 rounded-2xl font-medium capitalize transition',
                        difficulty === level
                          ? 'bg-[#4cb1ff] text-white shadow-lg'
                          : 'bg-background border hover:border-[#4cb1ff]/40'
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold">
                    Number of Questions
                  </label>

                  <span className="text-sm font-medium text-[#4cb1ff]">
                    {questionCount} Questions Selected
                  </span>
                </div>

                <input
                  type="range"
                  min="5"
                  max="60"
                  value={questionCount}
                  onChange={(e) =>
                    setQuestionCount(
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full accent-[#4cb1ff]"
                />

                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>5</span>
                  <span>60</span>
                </div>
              </div>

              {/* Quiz Type */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Quiz Type
                </label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    'multiple-choice',
                    'identification',
                    'true-false',
                    'mixed',
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setQuizType(type)
                      }
                      className={cn(
                        'rounded-2xl py-3 border text-sm font-medium transition capitalize',
                        quizType === type
                          ? 'bg-[#f7b801] text-black border-[#f7b801]'
                          : 'hover:border-[#f7b801]'
                      )}
                    >
                      {type.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between border rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <Clock3 className="w-5 h-5 text-[#4cb1ff]" />
                    <span className="font-medium">
                      Timed Quiz
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    checked={timedQuiz}
                    onChange={() =>
                      setTimedQuiz(!timedQuiz)
                    }
                    className="w-5 h-5"
                  />
                </div>

                <div className="flex items-center justify-between border rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#f7b801]" />
                    <span className="font-medium">
                      Generate Answer Key
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    checked={generateAnswerKey}
                    onChange={() =>
                      setGenerateAnswerKey(
                        !generateAnswerKey
                      )
                    }
                    className="w-5 h-5"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="text-red-500 text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={
                  loading ||
                  (!topic.trim() && !selectedFile)
                }
                className="w-full h-14 rounded-2xl text-lg font-semibold bg-gradient-to-r from-[#4cb1ff] to-[#6bc7ff] hover:opacity-90 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    AI is generating your quiz...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Quiz Fast
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </DashboardShell>
    )
  }

  // =========================
  // TAKING QUIZ
  // =========================

  if (quizState === 'taking' && quiz) {
    const question = quiz.questions[currentQuestion]

    const selectedAnswer =
      selectedAnswers[currentQuestion]

    const isCorrect =
      selectedAnswer === question.correctAnswer

    return (
      <DashboardShell size="md">
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of{' '}
              {quiz.questions.length}
            </span>

            <span className="capitalize text-sm">
              {quiz.difficulty}
            </span>
          </div>

          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4cb1ff] transition-all"
              style={{
                width: `${
                  ((currentQuestion + 1) /
                    quiz.questions.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        <Card className="rounded-3xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl leading-relaxed">
              {question.question}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {question.options.map((option, index) => {
              const isSelected =
                selectedAnswer === index

              const isCorrectAnswer =
                index === question.correctAnswer

              const showResult =
                selectedAnswer !== null

              return (
                <button
                  key={index}
                  onClick={() =>
                    handleSelectAnswer(index)
                  }
                  disabled={selectedAnswer !== null}
                  className={cn(
                    'w-full p-4 rounded-2xl border text-left transition-all',
                    !showResult &&
                      'hover:border-[#4cb1ff]',
                    showResult &&
                      isCorrectAnswer &&
                      'bg-green-500/10 border-green-500',
                    showResult &&
                      isSelected &&
                      !isCorrectAnswer &&
                      'bg-red-500/10 border-red-500'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {String.fromCharCode(65 + index)}
                    </div>

                    <span>{option}</span>
                  </div>
                </button>
              )
            })}

            {showExplanation && (
              <div className="p-4 rounded-2xl border bg-primary/5">
                <p className="font-semibold mb-1">
                  {isCorrect
                    ? 'Correct!'
                    : 'Explanation'}
                </p>

                <p className="text-sm text-muted-foreground">
                  {question.explanation}
                </p>
              </div>
            )}

            {selectedAnswer !== null && (
              <Button
                onClick={handleNextQuestion}
                className="w-full rounded-2xl h-12"
              >
                {currentQuestion <
                quiz.questions.length - 1
                  ? 'Next Question'
                  : 'See Results'}
              </Button>
            )}
          </CardContent>
        </Card>
      </DashboardShell>
    )
  }

  // =========================
  // RESULTS
  // =========================

  if (quizState === 'results' && quiz) {
    const score = calculateScore()

    return (
      <DashboardShell size="md">
        <Card className="rounded-3xl shadow-xl">
          <CardHeader className="text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-[#4cb1ff]/10 flex items-center justify-center mb-4">
              <Trophy className="w-12 h-12 text-[#4cb1ff]" />
            </div>

            <CardTitle className="text-3xl">
              Quiz Complete!
            </CardTitle>

            <CardDescription>
              {quiz.title}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            <div>
              <p className="text-6xl font-bold text-[#4cb1ff]">
                {score.percentage}%
              </p>

              <p className="text-muted-foreground mt-2">
                You got {score.correct} out of{' '}
                {score.total} correct
              </p>
            </div>

            <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4cb1ff]"
                style={{
                  width: `${score.percentage}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handleReset}
                className="rounded-2xl gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                New Quiz
              </Button>

              <Button
                onClick={() => {
                  setQuizState('taking')
                  setCurrentQuestion(0)
                  setSelectedAnswers(
                    new Array(
                      quiz.questions.length
                    ).fill(null)
                  )
                  setShowExplanation(false)
                }}
                className="rounded-2xl gap-2"
              >
                <FileQuestion className="w-4 h-4" />
                Retry Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardShell>
    )
  }

  return null
}