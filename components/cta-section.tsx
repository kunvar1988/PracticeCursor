import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
      <div className="rounded-2xl bg-accent/10 border border-accent/20 p-6 sm:p-8 md:p-16 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-balance px-4">Ready to get started?</h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 text-balance leading-relaxed px-4">
          Join thousands of developers who are already using PracticeCursor to gain deeper insights into their favorite
          repositories.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
          <Button size="lg" variant="blue" className="w-full sm:w-auto gap-2 min-w-[200px]">
            <span className="hidden sm:inline">Start Analyzing Repositories</span>
            <span className="sm:hidden">Start Analyzing</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 min-w-[200px]"
          >
            View Documentation
          </Button>
        </div>
      </div>
    </section>
  )
}
