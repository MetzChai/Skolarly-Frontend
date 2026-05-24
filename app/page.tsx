import Navbar from '@/app/landing/Navbar'
import HeroSection from '@/app/landing/HeroSection'
import FeaturesSection from '@/app/landing/FeaturesSection'
import HowItWorksSection from '@/app/landing/HowItWorksSection'
import CTASection from '@/app/landing/CTASection'
import Footer from '@/app/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  )
}
