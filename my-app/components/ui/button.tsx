import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-primary text-primary-foreground shadow-[0_10px_24px_hsl(var(--glass-shadow)/0.14)] hover:-translate-y-0.5 hover:bg-primary/92",
        destructive:
          "border border-transparent bg-destructive text-destructive-foreground shadow-[0_10px_24px_hsl(var(--glass-shadow)/0.1)] hover:-translate-y-0.5 hover:bg-destructive/92",
        outline:
          "liquid-chip border-foreground/12 bg-background/72 text-foreground shadow-[0_8px_20px_hsl(var(--glass-shadow)/0.08)] hover:-translate-y-0.5 hover:bg-background/82 dark:bg-background/26 dark:hover:bg-background/34",
        secondary:
          "liquid-chip border-transparent bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:bg-secondary/86 dark:bg-background/2 dark:hover:bg-background/12",
        ghost: "border border-transparent bg-transparent text-muted-foreground hover:bg-background/55 hover:text-foreground dark:hover:bg-background/18",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
