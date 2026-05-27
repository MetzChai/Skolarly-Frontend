import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Hero content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Learning
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight text-balance">
              Your Intelligent{" "}
              <span className="text-secondary">Study Companion</span>
            </h1>

            <p className="mt-5 text-center lg:text-left text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 text-pretty">
              Transform how you learn with AI-powered lesson explanations,
              personalized quizzes, an always-available tutor, and smart study
              planning.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
              <Link href="/skolarly">
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

          {/* Hero image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white">
              <Image
                src="/images/hero-image.png"
                alt="Skolarly - Your Intelligent Study Companion"
                width={800}
                height={500}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
