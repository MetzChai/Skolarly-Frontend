import { BookOpen, BrainCircuit, MessageSquare } from "lucide-react";
import FeatureCard from "./feature-card";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Everything You Need to Excel
          </h2>

          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful AI tools designed to make learning efficient and enjoyable
          </p>
        </div>

        {/* Cards Grid (FIXED RESPONSIVE LAYOUT) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<BookOpen className="w-6 h-6" />}
            title="AI Lesson Explainer"
            description="Upload any lesson content and get clear, detailed explanations with summaries and key concepts."
            href="/skolarly/lesson-lab"
            color="primary"
          />

          <FeatureCard
            icon={<BrainCircuit className="w-6 h-6" />}
            title="AI Quiz Generator"
            description="Generate customized quizzes on any topic with adjustable difficulty and instant feedback."
            href="/skolarly/quiz-lab"
            color="secondary"
          />

          <FeatureCard
            icon={<MessageSquare className="w-6 h-6" />}
            title="AI Tutor Chat"
            description="Chat with an intelligent tutor that can explain concepts, answer questions, and help with homework."
            href="/skolarly/tutor"
            color="primary"
          />
        </div>
      </div>
    </section>
  );
}
