import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 sm:mb-6 tracking-tight px-2">
            <span className="text-blue-600">Unlock GitHub Insights with </span>
            <span className="bg-gradient-to-r from-teal-500 to-green-400 bg-clip-text text-transparent block sm:inline">
              PracticeCursor
            </span>
          </h1>

          <p className="text-balance text-base sm:text-lg md:text-xl text-gray-700 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
            Get powerful insights, summaries, and analytics for open source GitHub repositories. Discover trends, track
            important updates, and stay ahead of the curve.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <Button size="lg" variant="blue" className="w-full sm:w-auto min-w-[140px]">
              Get Started
            </Button>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 min-w-[140px]"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
