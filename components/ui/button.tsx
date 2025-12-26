import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-yellow-400/50",
        blue: "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-blue-400/50",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-red-400/50",
        outline:
          "border-2 border-gray-300 bg-white text-gray-900 shadow-sm hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700",
        secondary:
          "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 dark:from-gray-700 dark:to-gray-600 dark:text-gray-100",
        ghost:
          "hover:bg-gray-100 hover:text-gray-900 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300",
        link: "text-yellow-600 underline-offset-4 hover:underline hover:text-yellow-700",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-3.5 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded-lg px-8 has-[>svg]:px-6 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
