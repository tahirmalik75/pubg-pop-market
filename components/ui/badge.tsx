import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-pubg-yellow text-pubg-dark hover:bg-pubg-orange",
        secondary: "border-transparent bg-pubg-gray text-white hover:bg-pubg-light",
        destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
        outline: "text-white border-pubg-gray",
        pending: "border-transparent bg-yellow-600 text-white",
        processing: "border-transparent bg-blue-600 text-white",
        completed: "border-transparent bg-green-600 text-white",
        cancelled: "border-transparent bg-red-600 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
