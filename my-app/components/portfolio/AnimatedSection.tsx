"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useNearViewport } from "@/components/portfolio/useNearViewport"

type AnimatedSectionProps = {
  children: React.ReactNode
  className?: string
  id?: string
  delay?: number
}

export default function AnimatedSection({ children, className, id, delay = 0 }: AnimatedSectionProps) {
  const reduceMotion = useReducedMotion()
  const { ref, isNearViewport: isVisible } = useNearViewport<HTMLElement>({
    rootMargin: "180px 0px",
    threshold: 0.08,
    freezeOnceVisible: true,
  })

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={
        reduceMotion
          ? undefined
          : isVisible
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 24 }
      }
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  )
}
