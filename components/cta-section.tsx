import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="rounded-2xl bg-accent/10 border border-accent/20 p-8 md:p-16 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">Ready to get started?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-balance leading-relaxed">
          Join thousands of developers who are already using PracticeCursor to gain deeper insights into their favorite
          repositories.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto gap-2">
            Start Analyzing Repositories
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto">
            View Documentation
          </Button>
        </div>
      </div>
    </section>
  )
}
