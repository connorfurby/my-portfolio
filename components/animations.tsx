"use client"

import { motion, useInView, type Variants } from "framer-motion"
import { useRef, type ReactNode } from "react"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
}

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
}

const slideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
}

type AnimationVariant = "fadeUp" | "fadeIn" | "scaleIn" | "slideLeft" | "slideRight"

const variantMap: Record<AnimationVariant, Variants> = {
  fadeUp,
  fadeIn,
  scaleIn,
  slideLeft,
  slideRight,
}

interface RevealProps {
  children: ReactNode
  variant?: AnimationVariant
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

export function Reveal({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.6,
  className,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      variants={variantMap[variant]}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function TextReveal({
  children,
  className,
  delay = 0,
}: {
  children: string
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <div ref={ref} className={`overflow-hidden ${className || ""}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}

interface SectionLabelProps {
  number: string
  label: string
}

export function SectionLabel({ number, label }: SectionLabelProps) {
  return (
    <Reveal variant="fadeIn" className="flex items-center gap-4 mb-12">
      <span className="section-number text-sm font-mono text-primary">{number}</span>
      <span className="h-px flex-1 max-w-[60px] bg-primary/40" />
      <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </Reveal>
  )
}
