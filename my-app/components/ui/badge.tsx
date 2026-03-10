import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "liquid-chip border-transparent bg-foreground/88 text-background shadow-[0_8px_18px_hsl(var(--glass-shadow)/0.08)]",
        secondary:
          "liquid-chip border-transparent bg-background/10 text-secondary-foreground",
        destructive:
          "liquid-chip border-transparent bg-destructive/84 text-destructive-foreground shadow-[0_8px_18px_hsl(var(--glass-shadow)/0.08)]",
        outline: "liquid-chip bg-background/18 text-foreground",
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
