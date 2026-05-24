import StepCard from './StepCard'

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">How Skolarly Works</h2>
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
  )
}
