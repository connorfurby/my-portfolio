"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

function useIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(callback, options)
    const node = ref.current

    if (node) {
      observer.observe(node)
    }

    return () => {
      if (node) {
        observer.unobserve(node)
      }
    }
  }, [callback, options])

  return ref
}

type AnimatedSectionProps = {
  children: React.ReactNode
  className?: string
  id?: string
  delay?: number
}

export default function AnimatedSection({ children, className, id, delay = 0 }: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const reduceMotion = useReducedMotion()

  const ref = useIntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
      }
    },
    { threshold: 0.1 }
  )

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
