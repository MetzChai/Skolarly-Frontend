import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Target, ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-24 bg-primary/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <Target className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Ready to Transform Your Learning?</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Join students who are already learning smarter with Skolarly.
        </p>
        <div className="mt-10">
          <Link href="/study-hub">
            <Button size="lg" className="gap-2 px-8">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
