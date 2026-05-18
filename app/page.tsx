import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { BookOpen, BrainCircuit, MessageSquare, Calendar, ArrowRight, Sparkles, Target } from 'lucide-react'
import { AuthModal } from '@/components/auth-modal'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/skolarly-logo.png"
                alt="Skolarly Logo"
                width={140}
                height={40}
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-foreground">Skolarly</span>
            </Link>
            <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                How it works
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <AuthModal />
              <Link href="/dashboard">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Learning
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight text-balance">
                Your Intelligent{' '}
                <span className="text-secondary">Study Companion</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl text-pretty">
                Transform how you learn with AI-powered lesson explanations, personalized quizzes, an always-available tutor, and smart study planning.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2 px-8">
                    Start Learning Free <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline" className="px-8">
                    See How It Works
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right hero image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/hero-image.png"
                  alt="Skolarly - Your Intelligent Study Companion"
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Everything You Need to Excel
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful AI tools designed to make learning efficient and enjoyable
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<BookOpen className="w-6 h-6" />}
              title="Lesson Explainer"
              description="Upload any lesson content and get clear, detailed explanations with summaries and key concepts."
              href="/dashboard/lessons"
              color="primary"
            />
            <FeatureCard
              icon={<BrainCircuit className="w-6 h-6" />}
              title="Quiz Generator"
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
              title="Study Planner"
              description="Create AI-generated study schedules tailored to your goals and available time."
              href="/dashboard/planner"
              color="secondary"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              How Skolarly Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to transform your learning experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="01"
              title="Choose Your Tool"
              description="Select from lesson explanations, quiz generation, AI tutoring, or study planning."
            />
            <StepCard
              number="02"
              title="Input Your Content"
              description="Paste your lesson, enter a topic, or describe what you want to learn."
            />
            <StepCard
              number="03"
              title="Learn Effectively"
              description="Get instant AI-powered responses tailored to your learning needs."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Ready to Transform Your Learning?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join students who are already learning smarter with Skolarly.
          </p>
          <div className="mt-10">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 px-8">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/skolarly-logo.png"
                alt="Skolarly Logo"
                width={120}
                height={36}
                className="h-9 w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm">
              Learn Smarter. Achieve More.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  href,
  color 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  href: string
  color: 'primary' | 'secondary'
}) {
  return (
    <Link href={href} className="group">
      <div className="h-full p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
          color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-secondary/80 text-secondary-foreground'
        }`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm">
          {description}
        </p>
      </div>
    </Link>
  )
}

function StepCard({ 
  number, 
  title, 
  description 
}: { 
  number: string
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary text-xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
