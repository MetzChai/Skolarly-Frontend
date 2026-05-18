'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Sparkles, Loader2, Clock, CheckCircle, Circle, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StudyTask {
  id: string
  title: string
  description: string | null
  scheduled_date: string
  duration_minutes: number
  is_completed: boolean
}

interface StudyPlan {
  id: string
  title: string
  description: string | null
  start_date: string
  end_date: string
}

interface PlanResult {
  plan: StudyPlan
  tasks: StudyTask[]
}

type ViewState = 'create' | 'view'

export default function PlannerPage() {
  const [viewState, setViewState] = useState<ViewState>('create')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [topics, setTopics] = useState('')
  const [durationDays, setDurationDays] = useState(7)
  const [hoursPerDay, setHoursPerDay] = useState(2)
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<PlanResult | null>(null)
  const [tasks, setTasks] = useState<StudyTask[]>([])
  const [error, setError] = useState('')

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !topics.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/study-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          topics,
          duration_days: durationDays,
          hours_per_day: hoursPerDay,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate study plan')
      }

      const data: PlanResult = await response.json()
      setPlan(data)
      setTasks(data.tasks)
      setViewState('view')
    } catch (err) {
      setError('Failed to generate study plan. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleTask = async (taskId: string, isCompleted: boolean) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: !isCompleted }),
      })

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, is_completed: !isCompleted } : task
        )
      )
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }

  const handleReset = () => {
    setTitle('')
    setDescription('')
    setTopics('')
    setPlan(null)
    setTasks([])
    setViewState('create')
    setError('')
  }

  const groupTasksByDate = (tasks: StudyTask[]) => {
    const grouped: Record<string, StudyTask[]> = {}
    tasks.forEach((task) => {
      const date = task.scheduled_date
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(task)
    })
    return grouped
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
  }

  const completedCount = tasks.filter((t) => t.is_completed).length
  const progressPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  // Create View
  if (viewState === 'create') {
    return (
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Calendar className="w-5 h-5 text-secondary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Study Planner</h1>
          </div>
          <p className="text-muted-foreground">
            Generate an AI-powered study schedule tailored to your goals and available time.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Study Plan</CardTitle>
            <CardDescription>
              Tell us what you want to study and we&apos;ll create a personalized schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGeneratePlan} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                  Plan Title
                </label>
                <Input
                  id="title"
                  placeholder="e.g., Final Exam Preparation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="topics" className="block text-sm font-medium text-foreground mb-2">
                  Topics to Study
                </label>
                <Textarea
                  id="topics"
                  placeholder="e.g., Chapter 1-5 of Biology, Algebra equations, Essay writing techniques"
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  rows={3}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                  Additional Notes (Optional)
                </label>
                <Textarea
                  id="description"
                  placeholder="Any specific goals, deadlines, or preferences..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Duration: {durationDays} days
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="30"
                    value={durationDays}
                    onChange={(e) => setDurationDays(parseInt(e.target.value))}
                    className="w-full accent-primary"
                    disabled={loading}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>3 days</span>
                    <span>30 days</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Hours/Day: {hoursPerDay}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                    className="w-full accent-primary"
                    disabled={loading}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1 hour</span>
                    <span>8 hours</span>
                  </div>
                </div>
              </div>

              {error && <div className="text-destructive text-sm">{error}</div>}

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={loading || !title.trim() || !topics.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Study Plan
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // View Plan
  if (viewState === 'view' && plan) {
    const groupedTasks = groupTasksByDate(tasks)

    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{plan.plan.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {new Date(plan.plan.start_date).toLocaleDateString()} - {new Date(plan.plan.end_date).toLocaleDateString()}
            </p>
          </div>
          <Button variant="outline" onClick={handleReset}>
            New Plan
          </Button>
        </div>

        {/* Progress Card */}
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedCount} of {tasks.length} tasks
              </span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-center text-2xl font-bold text-primary mt-3">{progressPercentage}%</p>
          </CardContent>
        </Card>

        {/* Tasks by Date */}
        <div className="space-y-6">
          {Object.entries(groupedTasks)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .map(([date, dateTasks]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-foreground">{formatDate(date)}</h3>
                </div>
                <div className="space-y-2">
                  {dateTasks.map((task) => (
                    <Card
                      key={task.id}
                      className={cn(
                        'transition-all cursor-pointer hover:shadow-md',
                        task.is_completed && 'opacity-60'
                      )}
                      onClick={() => handleToggleTask(task.id, task.is_completed)}
                    >
                      <CardContent className="p-4 flex items-start gap-3">
                        <button className="mt-0.5 flex-shrink-0">
                          {task.is_completed ? (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              'font-medium text-foreground',
                              task.is_completed && 'line-through'
                            )}
                          >
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0">
                          <Clock className="w-4 h-4" />
                          {task.duration_minutes} min
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    )
  }

  return null
}
