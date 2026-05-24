import Link from 'next/link'
import {
  BookOpen,
  BrainCircuit,
  MessageSquare,
  Calendar,
  ArrowRight,
  TrendingUp,
  Clock,
  Target,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { cn } from '@/lib/utils'

const features = [
  {
    title: 'AI Lesson Explainer',
    description: 'Get AI-powered explanations for any topic or lesson content.',
    icon: BookOpen,
    href: '/dashboard/lessons',
    variant: 'primary' as const,
    badge: 'Understand',
  },
  {
    title: 'AI Quiz Generator',
    description: 'Create custom quizzes to test your knowledge on any subject.',
    icon: BrainCircuit,
    href: '/dashboard/quizzes',
    variant: 'secondary' as const,
    badge: 'Practice',
  },
  {
    title: 'AI Tutor Chat',
    description: 'Chat with an intelligent tutor for personalized help.',
    icon: MessageSquare,
    href: '/dashboard/chat',
    variant: 'primary' as const,
    badge: 'Ask',
  },
  {
    title: 'AI Study Planner',
    description: 'Create AI-generated study schedules for your goals.',
    icon: Calendar,
    href: '/dashboard/planner',
    variant: 'secondary' as const,
    badge: 'Plan',
  },
]

const quickStats = [
  {
    label: 'Learning streak',
    value: '0',
    unit: 'days',
    icon: TrendingUp,
    hint: 'Start a session today',
  },
  {
    label: 'Study time',
    value: '0',
    unit: 'hrs',
    icon: Clock,
    hint: 'Track your focus time',
  },
  {
    label: 'Quizzes taken',
    value: '0',
    unit: '',
    icon: Target,
    hint: 'Test what you learn',
  },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-br from-primary/10 via-card to-secondary/10 p-6 sm:p-8">
        <div className="absolute -top-12 -right-12 size-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 size-32 rounded-full bg-secondary/15 blur-2xl" />
        <div className="relative">
          <Badge variant="secondary" className="mb-3 gap-1 bg-background/60">
            <Sparkles className="size-3" />
            AI-powered learning
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {getGreeting()}, ready to learn?
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Pick a tool below to explain lessons, generate quizzes, chat with your tutor, or plan your
            week.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/dashboard/chat">
              <Button className="gap-2">
                <Zap className="size-4" />
                Start with AI Tutor
              </Button>
            </Link>
            <Link href="/dashboard/planner">
              <Button variant="outline">Plan my week</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {quickStats.map((stat) => (
          <Card
            key={stat.label}
            className="border-border/80 bg-card/80 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardContent className="flex items-center gap-4 p-4 sm:p-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
                <stat.icon className="size-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold tabular-nums text-foreground">
                  {stat.value}
                  {stat.unit && (
                    <span className="ml-1 text-sm font-medium text-muted-foreground">{stat.unit}</span>
                  )}
                </p>
                <p className="text-xs font-medium text-foreground">{stat.label}</p>
                <p className="truncate text-[11px] text-muted-foreground">{stat.hint}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Your study tools</h2>
            <p className="text-sm text-muted-foreground">Everything you need in one place</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href} className="group block h-full">
              <Card className="h-full border-border/80 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex size-12 items-center justify-center rounded-xl',
                          feature.variant === 'primary'
                            ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                            : 'bg-secondary/90 text-secondary-foreground ring-1 ring-secondary/30',
                        )}
                      >
                        <feature.icon className="size-6" />
                      </div>
                      <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wide">
                        {feature.badge}
                      </Badge>
                    </div>
                    <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <CardTitle className="mt-4 text-xl transition-colors group-hover:text-primary">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    Open {feature.title}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card className="mt-8 overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 text-primary" />
            Study tip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Use the <strong className="text-foreground">Lesson Explainer</strong> to understand new
            concepts, then test yourself with the <strong className="text-foreground">Quiz Generator</strong>.
            Stuck? Ask the <strong className="text-foreground">AI Tutor</strong> — and keep on track with
            the <strong className="text-foreground">Study Planner</strong>.
          </p>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
