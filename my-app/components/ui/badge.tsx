import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-foreground text-background shadow-[0_8px_18px_hsl(var(--glass-shadow)/0.1)] dark:bg-foreground/88",
        secondary:
          "liquid-chip border-transparent bg-secondary text-secondary-foreground dark:bg-background/10",
        destructive:
          "border border-transparent bg-destructive text-destructive-foreground shadow-[0_8px_18px_hsl(var(--glass-shadow)/0.08)] dark:bg-destructive/84",
        outline: "liquid-chip bg-background/70 text-foreground dark:bg-background/18",
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
