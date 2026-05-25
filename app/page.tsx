import Navbar from '@/components/marketing/landing-navbar'
import HeroSection from '@/components/marketing/hero-banner'
import FeaturesSection from '@/components/marketing/feature-panel'
import HowItWorksSection from '@/components/marketing/how-it-works'
import CTASection from '@/components/marketing/cta-section'
import Footer from '@/components/layout/site-footer'

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
