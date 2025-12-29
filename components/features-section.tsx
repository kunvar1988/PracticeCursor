import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitBranch, Star, Tag } from "lucide-react"

const features = [
  {
    icon: Star,
    title: "Repository Insights",
    description: "Get comprehensive summaries and analytics for any GitHub repository.",
  },
  {
    icon: GitBranch,
    title: "Important PRs",
    description: "Track and analyze the most impactful pull requests in real-time.",
  },
  {
    icon: Tag,
    title: "Version Updates",
    description: "Stay informed about the latest version releases and changelogs.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 px-4">Key Features</h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-4 sm:p-6 md:p-8">
                <div className="mb-3 sm:mb-4 inline-flex">
                  <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 text-black" strokeWidth={1.5} />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-black">{feature.title}</CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
