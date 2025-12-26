import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance font-bold text-5xl sm:text-6xl md:text-7xl mb-6 tracking-tight text-foreground">
            Unlock GitHub Insights with PracticeCursor
          </h1>

          <p className="text-balance text-lg sm:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Get powerful insights, summaries, and analytics for open source GitHub repositories. Discover trends, track
            important updates, and stay ahead of the curve.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
