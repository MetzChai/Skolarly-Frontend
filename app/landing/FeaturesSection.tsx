import { BookOpen, BrainCircuit, MessageSquare, Calendar } from 'lucide-react'
import FeatureCard from './FeatureCard'

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Everything You Need to Excel</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful AI tools designed to make learning efficient and enjoyable
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<BookOpen className="w-6 h-6" />}
            title="AI   Lesson Explainer"
            description="Upload any lesson content and get clear, detailed explanations with summaries and key concepts."
            href="/dashboard/lessons"
            color="primary"
          />
          <FeatureCard
            icon={<BrainCircuit className="w-6 h-6" />}
            title="AI Quiz Generator"
            description="Generate customized quizzes on any topic with adjustable difficulty and instant feedback."
            href="/dashboard/quizzes"
            color="secondary"
          />
          <FeatureCard
            icon={<MessageSquare className="w-6 h-6" />}
            title="AI Tutor Chat"
            description="Chat with an intelligent tutor that can explain concepts, answer questions, and help with homework."
            href="/dashboard/chat"
            color="primary"
          />
          <FeatureCard
            icon={<Calendar className="w-6 h-6" />}
            title="AI Study Planner"
            description="Create AI-generated study schedules tailored to your goals and available time."
            href="/dashboard/planner"
            color="secondary"
          />
        </div>
      </div>
    </section>
  )
}
