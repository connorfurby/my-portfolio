"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SectionId } from "@/components/portfolio/types"

type ScrollTabItem = {
  value: string
  label: string
  content: React.ReactNode
}

type ScrollTabsSectionProps = {
  id?: SectionId
  className?: string
  heading: React.ReactNode
  items: ScrollTabItem[]
  listClassName?: string
  contentClassName?: string
  stickyOffsetClassName?: string
}

const PANELS_PER_TAB = 0.82
const CONTENT_TRANSITION = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1],
} as const

export default function ScrollTabsSection({
  id,
  className,
  heading,
  items,
  listClassName,
  contentClassName,
  stickyOffsetClassName,
}: ScrollTabsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [activeTab, setActiveTab] = useState(items[0]?.value ?? "")
  const [progress, setProgress] = useState(0)
  const reduceMotion = useReducedMotion()

  const sectionHeight = useMemo(() => {
    return `${Math.max(items.length * PANELS_PER_TAB, 1.75) * 100}vh`
  }, [items.length])

  useEffect(() => {
    const section = sectionRef.current

    if (!section || items.length <= 1) {
      return
    }

    const updateActiveTab = () => {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const scrollable = Math.max(section.offsetHeight - viewportHeight, 1)
      const rawProgress = Math.min(Math.max(-rect.top / scrollable, 0), 0.9999)
      setProgress(rawProgress)
      const nextIndex = Math.min(items.length - 1, Math.floor(rawProgress * items.length))
      const nextValue = items[nextIndex]?.value

      if (nextValue && nextValue !== activeTab) {
        setActiveTab(nextValue)
      }
    }

    updateActiveTab()
    window.addEventListener("scroll", updateActiveTab, { passive: true })
    window.addEventListener("resize", updateActiveTab)

    return () => {
      window.removeEventListener("scroll", updateActiveTab)
      window.removeEventListener("resize", updateActiveTab)
    }
  }, [activeTab, items])

  return (
    <section id={id} ref={sectionRef} className={cn("relative mb-16 pt-16", className)} style={{ height: sectionHeight }}>
      <div className="mx-auto w-full max-w-6xl">
        {heading}
      </div>
      <div className={cn("sticky top-24", stickyOffsetClassName)}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto w-full max-w-6xl">
          <div className="mb-5">
            <div className="progress-rail mx-auto mb-4 h-1.5 w-full max-w-5xl overflow-hidden rounded-full bg-muted/80">
              <motion.div
                className="progress-fill h-full rounded-full"
                animate={{ width: `${Math.max(progress * 100, 4)}%` }}
                transition={CONTENT_TRANSITION}
              />
            </div>
            <TabsList
              className={cn(
                "mx-auto grid h-auto w-full max-w-5xl gap-2 rounded-[1.55rem] p-2.5 shadow-none",
                listClassName
              )}
            >
              {items.map((item) => (
                <motion.div
                  key={item.value}
                  className="flex"
                  animate={
                    reduceMotion
                      ? undefined
                      : item.value === activeTab
                        ? { y: -2, scale: 1.01 }
                        : { y: 0, scale: 1 }
                  }
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TabsTrigger value={item.value} className="relative flex-1 overflow-hidden rounded-[1.1rem] px-3 py-2.5 text-center">
                    {item.value === activeTab ? (
                      <motion.span
                        layoutId={`active-tab-pill-${id ?? "section"}`}
                        className="liquid-chip absolute inset-0 rounded-[1.1rem] border border-foreground/10 bg-background/82"
                        transition={{ type: "spring", stiffness: 360, damping: 28 }}
                      />
                    ) : null}
                    <span className="relative z-10">{item.label}</span>
                  </TabsTrigger>
                </motion.div>
              ))}
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            {items.map((item) =>
              item.value === activeTab ? (
                <TabsContent key={item.value} value={item.value} forceMount className={contentClassName}>
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.99 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -12, scale: 0.995 }}
                    transition={CONTENT_TRANSITION}
                  >
                    {item.content}
                  </motion.div>
                </TabsContent>
              ) : null
            )}
          </AnimatePresence>
        </Tabs>
      </div>
    </section>
  )
}
