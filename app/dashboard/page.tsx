import Link from 'next/link'
import { BookOpen, BrainCircuit, MessageSquare, Calendar, ArrowRight, TrendingUp, Clock, Target } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const features = [
  {
    title: 'Lesson Explainer',
    description: 'Get AI-powered explanations for any topic or lesson content.',
    icon: BookOpen,
    href: '/dashboard/lessons',
    color: 'bg-primary/10 text-primary',
  },
  {
    title: 'Quiz Generator',
    description: 'Create custom quizzes to test your knowledge on any subject.',
    icon: BrainCircuit,
    href: '/dashboard/quizzes',
    color: 'bg-secondary text-secondary-foreground',
  },
  {
    title: 'AI Tutor Chat',
    description: 'Chat with an intelligent tutor for personalized help.',
    icon: MessageSquare,
    href: '/dashboard/chat',
    color: 'bg-primary/10 text-primary',
  },
  {
    title: 'Study Planner',
    description: 'Create AI-generated study schedules for your goals.',
    icon: Calendar,
    href: '/dashboard/planner',
    color: 'bg-secondary text-secondary-foreground',
  },
]

const quickStats = [
  { label: 'Learning Streak', value: '0 days', icon: TrendingUp },
  { label: 'Study Time', value: '0 hrs', icon: Clock },
  { label: 'Quizzes Taken', value: '0', icon: Target },
]

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome to Skolarly</h1>
        <p className="text-muted-foreground mt-2">Your AI-powered study companion. Choose a tool to get started.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="bg-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <CardTitle className="text-xl mt-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                  Open {feature.title}
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Tips Section */}
      <Card className="mt-8 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">Study Tip</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Use the <strong>Lesson Explainer</strong> to understand new concepts, then test your knowledge with the <strong>Quiz Generator</strong>. 
            Ask the <strong>AI Tutor</strong> any questions, and use the <strong>Study Planner</strong> to stay organized!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
