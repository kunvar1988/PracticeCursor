/**
 * HOME PAGE - Route: / (root)
 * 
 * This is the landing page that users see when they visit the website.
 * It displays the hero section, features, pricing, and call-to-action.
 * 
 * URL: http://localhost:3000/ or https://yourdomain.com/
 */
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { PricingSection } from "@/components/pricing-section"
import { TryItOutSection } from "@/components/try-it-out-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <TryItOutSection />
          <PricingSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
