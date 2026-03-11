"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SectionId } from "@/components/portfolio/types"
import { clamp, getSectionScrollProgress, scrollToSectionProgress } from "@/components/portfolio/utils"
import { useMediaQuery } from "@/components/portfolio/useMediaQuery"
import { useScrollFrameSync } from "@/components/portfolio/useScrollFrameSync"

type ScrollTabItem = {
  value: string
  label: string
  content: React.ReactNode
  scrollWeight?: number
}

type ScrollTabsSectionProps = {
  id?: SectionId
  className?: string
  heading: React.ReactNode
  items: ScrollTabItem[]
  panelsPerTab?: number
  listClassName?: string
  contentClassName?: string
  stickyOffsetClassName?: string
}

const DEFAULT_PANELS_PER_TAB = 0.58
const CONTENT_TRANSITION = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1],
} as const

export default function ScrollTabsSection({
  id,
  className,
  heading,
  items,
  panelsPerTab = DEFAULT_PANELS_PER_TAB,
  listClassName,
  contentClassName,
  stickyOffsetClassName,
}: ScrollTabsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [activeTab, setActiveTab] = useState(items[0]?.value ?? "")
  const [progress, setProgress] = useState(0)
  const reduceMotion = useReducedMotion()
  const isMobile = useMediaQuery("(max-width: 767px)")

  const sectionHeight = useMemo(() => {
    const totalWeight = items.reduce((sum, item) => sum + Math.max(item.scrollWeight ?? 1, 0.01), 0)
    return `${Math.max(totalWeight * panelsPerTab, 1.3) * 100}vh`
  }, [items, panelsPerTab])

  useEffect(() => {
    if (!items.length) {
      return
    }

    if (items.some((item) => item.value === activeTab)) {
      return
    }

    setActiveTab(items[0]?.value ?? "")
  }, [activeTab, items])

  const activeIndex = Math.max(
    items.findIndex((item) => item.value === activeTab),
    0
  )

  const getTabProgress = useCallback(
    (tabIndex: number) => {
      if (items.length <= 1) {
        return 0
      }

      const normalizedWeights = items.map((item) => Math.max(item.scrollWeight ?? 1, 0.01))
      const totalWeight = normalizedWeights.reduce((sum, weight) => sum + weight, 0)

      if (totalWeight <= 0) {
        return 0
      }

      const tabStart = normalizedWeights.slice(0, tabIndex).reduce((sum, weight) => sum + weight, 0) / totalWeight
      const tabSize = normalizedWeights[tabIndex]! / totalWeight

      return clamp(tabStart + Math.min(tabSize * 0.2, 0.06), 0, 0.9999)
    },
    [items]
  )

  const scrollToTab = useCallback(
    (value: string) => {
      const section = sectionRef.current
      const tabIndex = items.findIndex((item) => item.value === value)

      if (!section || tabIndex < 0) {
        return
      }

      if (isMobile) {
        setActiveTab(value)
        return
      }

      scrollToSectionProgress(section, getTabProgress(tabIndex), reduceMotion ? "auto" : "smooth")
    },
    [getTabProgress, isMobile, items, reduceMotion]
  )

  const syncFromScroll = useCallback(() => {
    const section = sectionRef.current

    if (!section || !items.length || isMobile) {
      return
    }

    const rawProgress = getSectionScrollProgress(section)
    const normalizedWeights = items.map((item) => Math.max(item.scrollWeight ?? 1, 0.01))
    const totalWeight = normalizedWeights.reduce((sum, weight) => sum + weight, 0)

    if (totalWeight <= 0) {
      return
    }

    let cumulative = 0
    let nextIndex = 0

    for (let index = 0; index < normalizedWeights.length; index += 1) {
      cumulative += normalizedWeights[index]! / totalWeight

      if (rawProgress < cumulative || index === normalizedWeights.length - 1) {
        nextIndex = index
        break
      }
    }

    const nextValue = items[nextIndex]?.value ?? items[0]?.value ?? ""

    setProgress(rawProgress)
    setActiveTab((current) => (current === nextValue ? current : nextValue))
  }, [isMobile, items])

  useScrollFrameSync(syncFromScroll)

  if (isMobile) {
    const activeItem = items[activeIndex] ?? items[0]

    return (
      <section id={id} ref={sectionRef} className={cn("relative mb-14 pt-12", className)}>
        <div className="portfolio-container w-full">
          {heading}

          <Tabs value={activeItem?.value} onValueChange={scrollToTab} className="w-full">
            <div className="mb-4">
              <TabsList
                className={cn(
                  "grid h-auto w-full max-w-none auto-rows-fr grid-cols-2 justify-center gap-2 rounded-[1.2rem] p-1.5 sm:grid-cols-3",
                  listClassName
                )}
              >
                {items.map((item) => (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className="min-w-0 rounded-[0.95rem] px-3 py-2 text-center text-sm"
                  >
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              {activeItem ? (
                <TabsContent key={activeItem.value} value={activeItem.value} forceMount className={cn("mt-0", contentClassName)}>
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                    transition={CONTENT_TRANSITION}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3 rounded-[1.2rem] border border-border/45 bg-background/35 px-4 py-3">
                      <div className="min-w-0">
                        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Section view</div>
                        <div className="mt-1 text-sm font-medium text-foreground">
                          {activeIndex + 1} of {items.length}: {activeItem.label}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          onClick={() => setActiveTab(items[(activeIndex - 1 + items.length) % items.length]?.value ?? activeItem.value)}
                          aria-label={`Show previous ${id ?? "section"} tab`}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          onClick={() => setActiveTab(items[(activeIndex + 1) % items.length]?.value ?? activeItem.value)}
                          aria-label={`Show next ${id ?? "section"} tab`}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {activeItem.content}
                  </motion.div>
                </TabsContent>
              ) : null}
            </AnimatePresence>
          </Tabs>
        </div>
      </section>
    )
  }

  return (
    <section id={id} ref={sectionRef} className={cn("relative mb-14 pt-12", className)} style={{ height: sectionHeight }}>
      <div className="portfolio-container w-full">
        {heading}
      </div>
      <div className={cn("sticky top-20 pb-6", stickyOffsetClassName)}>
        <Tabs value={activeTab} onValueChange={scrollToTab} className="portfolio-container w-full">
          <div className="mb-3">
            <div className="progress-rail mx-auto mb-2.5 h-0.5 w-full max-w-5xl overflow-hidden rounded-full bg-muted/80">
              <motion.div
                className="progress-fill h-full rounded-full"
                animate={{ width: `${Math.max(progress * 100, 4)}%` }}
                transition={CONTENT_TRANSITION}
              />
            </div>
            <TabsList
              className={cn(
                "mx-auto grid h-auto w-full max-w-6xl gap-1.5 rounded-[1.2rem] p-1.5 shadow-none 2xl:max-w-none",
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
                  <TabsTrigger value={item.value} className="relative flex-1 overflow-hidden rounded-[0.95rem] px-2.5 py-1.5 text-center text-sm">
                    {item.value === activeTab ? (
                      <motion.span
                        layoutId={`active-tab-pill-${id ?? "section"}`}
                        className="liquid-chip absolute inset-0 rounded-[0.95rem] border border-foreground/10 bg-background/82"
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
