import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    subtitle: "For individual developers",
    price: "$0",
    features: ["Basic repository insights", "5 repositories", "Daily updates"],
    cta: "Get Started",
  },
  {
    name: "Pro",
    subtitle: "For professional developers",
    price: "$19",
    features: ["Advanced repository insights", "Unlimited repositories", "Real-time updates"],
    cta: "Subscribe",
  },
  {
    name: "Enterprise",
    subtitle: "For large teams and organizations",
    price: "Custom",
    priceSubtext: "contact for pricing",
    features: ["Custom integrations", "Dedicated support", "Advanced analytics"],
    cta: "Contact Sales",
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="bg-gray-50 py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 px-4">Pricing Plans</h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {plans.map((plan) => (
            <Card key={plan.name} className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-2xl sm:text-3xl font-bold text-black">{plan.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{plan.subtitle}</p>
                </div>
                <div className="mt-4 sm:mt-6">
                  <span className="text-4xl sm:text-5xl font-bold text-black">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-gray-600 text-sm sm:text-base ml-1">per month</span>}
                  {plan.priceSubtext && <div className="text-sm sm:text-base text-gray-600 mt-1">{plan.priceSubtext}</div>}
                </div>
              </CardHeader>
              <CardContent className="pb-4 sm:pb-6 px-4 sm:px-6">
                <ul className="space-y-3 sm:space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base text-black">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="px-4 sm:px-6 pb-4 sm:pb-6">
                <Button size="lg" className="w-full bg-black text-white hover:bg-gray-800">
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
