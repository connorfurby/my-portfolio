"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

import type { ExperienceEntry } from "@/components/portfolio/types"
import { clamp as clampProgress, getSectionScrollProgress, scrollToSectionProgress } from "@/components/portfolio/utils"
import { useMediaQuery } from "@/components/portfolio/useMediaQuery"
import { useScrollFrameSync } from "@/components/portfolio/useScrollFrameSync"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ExperienceShowcaseItem = {
  value: string
  label: string
  eyebrow: string
  description: string
  entries: ExperienceEntry[]
}

type ExperienceShowcaseProps = {
  items: ExperienceShowcaseItem[]
}

const PANELS_PER_ENTRY = 0.92
const CONTENT_TRANSITION = { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }

function ExperienceMark({ entry }: { entry: ExperienceEntry }) {
  return (
    <div className="relative flex h-full min-h-[18rem] items-center justify-center overflow-hidden bg-foreground/[0.02] lg:min-h-[24rem]">
      <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
        <div className="relative flex size-28 items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-card sm:size-32">
          {entry.logoImageSrc ? (
            <Image
              src={entry.logoImageSrc}
              alt=""
              fill
              sizes="128px"
              className="object-contain p-4"
            />
          ) : (
            <span className="font-display text-3xl font-semibold tracking-tight text-foreground">
              {entry.logoText ?? entry.title.slice(0, 2)}
            </span>
          )}
        </div>
        <div>
          <p className="font-display text-lg font-semibold tracking-tight">{entry.title}</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">{entry.subtitle}</p>
        </div>
      </div>
    </div>
  )
}

function ExperienceEntryCard({ entry }: { entry: ExperienceEntry }) {
  return (
    <Card className="h-full overflow-hidden rounded-2xl">
      <CardContent className="grid h-full gap-0 p-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="border-b border-border/60 lg:border-b-0 lg:border-r">
          <ExperienceMark entry={entry} />
        </div>

        <div className="flex h-full flex-col justify-between gap-5 p-4 sm:p-5 lg:p-6">
          <div>
            <div className="flex flex-wrap gap-1.5">
              {(entry.stats ?? []).slice(0, 3).map((stat) => (
                <Badge key={stat} variant="secondary">
                  {stat}
                </Badge>
              ))}
            </div>
            <h3 className="mt-3 font-display text-[1.4rem] font-semibold tracking-tight md:text-[1.65rem]">{entry.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{entry.subtitle}</p>
            {entry.summary ? <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{entry.summary}</p> : null}
          </div>

          <ul className="space-y-0">
            {entry.bullets.map((bullet, index) => (
              <li
                key={bullet}
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 border-t border-border/50 py-3 text-sm leading-6 text-muted-foreground first:border-t-0 first:pt-0"
              >
                <span className="pt-0.5 font-mono text-[10px] tracking-wider text-primary/80">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ExperienceShowcase({ items }: ExperienceShowcaseProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [activeTab, setActiveTab] = useState(items[0]?.value ?? "")
  const [activeEntryIndex, setActiveEntryIndex] = useState(0)
  const progressRef = useRef<HTMLDivElement | null>(null)
  const reduceMotion = useReducedMotion()
  const isMobile = useMediaQuery("(max-width: 767px)")

  const ranges = useMemo(() => items.map((item) => Math.max(item.entries.length, 1)), [items])

  const totalSteps = useMemo(() => ranges.reduce((count, value) => count + value, 0), [ranges])

  const tabOffsets = useMemo(() => {
    let cumulative = 0

    return items.map((item, index) => {
      const start = cumulative
      cumulative += ranges[index] ?? 1

      return {
        value: item.value,
        start,
      }
    })
  }, [items, ranges])

  const sectionHeight = useMemo(() => `${Math.max(totalSteps * PANELS_PER_ENTRY, 2.2) * 100}vh`, [totalSteps])

  useEffect(() => {
    if (!items.length) {
      return
    }

    if (items.some((item) => item.value === activeTab)) {
      return
    }

    setActiveTab(items[0]?.value ?? "")
    setActiveEntryIndex(0)
  }, [activeTab, items])

  const scrollToTab = useCallback(
    (nextTab: string) => {
      const section = sectionRef.current
      const nextTabIndex = items.findIndex((item) => item.value === nextTab)

      if (!section || nextTabIndex < 0 || totalSteps <= 0) {
        return
      }

      if (isMobile) {
        setActiveTab(nextTab)
        setActiveEntryIndex(0)
        return
      }

      const start = tabOffsets.find((offset) => offset.value === nextTab)?.start ?? 0
      const tabSpan = (ranges[nextTabIndex] ?? 1) / totalSteps
      const normalizedProgress = clampProgress(start / totalSteps + Math.min(tabSpan * 0.18, 0.04), 0, 0.999)

      scrollToSectionProgress(section, normalizedProgress, reduceMotion ? "auto" : "smooth")
    },
    [isMobile, items, ranges, reduceMotion, tabOffsets, totalSteps]
  )

  const syncFromScroll = useCallback(() => {
    const section = sectionRef.current

    if (!section || !items.length || totalSteps <= 0 || isMobile) {
      return
    }

    const rawProgress = getSectionScrollProgress(section)
    const globalStep = Math.min(totalSteps - 1, Math.floor(rawProgress * totalSteps))

    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${Math.max(rawProgress, 0.04)})`
    }

    let cumulative = 0

    for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
      const size = ranges[itemIndex] ?? 1

      if (globalStep < cumulative + size) {
        const nextTab = items[itemIndex]?.value ?? items[0]?.value ?? ""
        const nextEntryIndex = globalStep - cumulative

        setActiveTab((current) => (current === nextTab ? current : nextTab))
        setActiveEntryIndex((current) => (current === nextEntryIndex ? current : nextEntryIndex))
        break
      }

      cumulative += size
    }
  }, [isMobile, items, ranges, totalSteps])

  useScrollFrameSync(syncFromScroll)

  if (isMobile) {
    const activeItemIndex = Math.max(
      items.findIndex((item) => item.value === activeTab),
      0
    )
    const activeItem = items[activeItemIndex] ?? items[0]
    const activeEntries = activeItem?.entries ?? []
    const clampedEntryIndex = Math.min(activeEntryIndex, Math.max(activeEntries.length - 1, 0))
    const entry = activeEntries[clampedEntryIndex] ?? activeEntries[0]

    return (
      <section ref={sectionRef} className="relative mb-16 pt-6">
        <div className="portfolio-container w-full">
          <div className="mb-6 max-w-3xl">
            <div className="section-eyebrow">Real-world Experience</div>
            <h2 className="section-title mt-3">Roles that shaped how I build</h2>
            <p className="section-subtitle mt-3">
              Internships, work, and volunteering — one role at a time, with the details that actually matter.
            </p>
          </div>

          <Tabs
            value={activeItem?.value}
            onValueChange={(value) => {
              setActiveTab(value)
              setActiveEntryIndex(0)
            }}
            className="w-full"
          >
            <div className="mb-4">
              <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-xl p-1">
                {items.map((item) => (
                  <TabsTrigger key={item.value} value={item.value} className="px-2 py-2 text-sm">
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              {activeItem ? (
                <TabsContent key={activeItem.value} value={activeItem.value} forceMount className="mt-0">
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                    transition={CONTENT_TRANSITION}
                  >
                    <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card px-3 py-3">
                      <div className="min-w-0">
                        <div className="text-[11px] text-muted-foreground">
                          {clampedEntryIndex + 1} of {activeEntries.length}
                        </div>
                        <div className="mt-1 truncate text-sm font-medium">{entry?.title}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setActiveEntryIndex((current) =>
                              activeEntries.length ? (current - 1 + activeEntries.length) % activeEntries.length : 0
                            )
                          }
                          aria-label="Show previous experience entry"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setActiveEntryIndex((current) =>
                              activeEntries.length ? (current + 1) % activeEntries.length : 0
                            )
                          }
                          aria-label="Show next experience entry"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {entry ? <ExperienceEntryCard entry={entry} /> : null}
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
    <section ref={sectionRef} className="relative mb-16 pt-6" style={{ height: sectionHeight }}>
      <div className="portfolio-container w-full">
        <div className="mb-6 max-w-3xl">
          <div className="section-eyebrow">Real-world Experience</div>
          <h2 className="section-title mt-3">Roles that shaped how I build</h2>
          <p className="section-subtitle mt-3">
            Scroll through one role at a time. Internships, work, and volunteering told as a product narrative — not a resume dump.
          </p>
          <div className="section-rule mt-4 max-w-sm" />
        </div>
      </div>

      <div className="sticky top-20 pb-6">
        <Tabs value={activeTab} onValueChange={scrollToTab} className="portfolio-container w-full">
          <div className="mb-3">
            <div className="progress-rail mx-auto mb-3 w-full max-w-5xl">
              <div ref={progressRef} className="progress-fill" style={{ transform: "scaleX(0.04)" }} />
            </div>

            <TabsList className="mx-auto flex h-auto w-fit max-w-full flex-wrap justify-center gap-1 rounded-xl p-1 shadow-none">
              {items.map((item) => (
                <TabsTrigger key={item.value} value={item.value} className="h-8 px-3.5">
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            {items.map((item) => {
              if (item.value !== activeTab) {
                return null
              }

              const currentEntryIndex = Math.min(activeEntryIndex, Math.max(item.entries.length - 1, 0))
              const entry = item.entries[currentEntryIndex] ?? item.entries[0]

              return (
                <TabsContent key={item.value} value={item.value} forceMount className="mt-0">
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                    transition={CONTENT_TRANSITION}
                  >
                    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="section-eyebrow">{item.eyebrow}</div>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                        <span>
                          {activeEntryIndex + 1}/{item.entries.length}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5" />
                        <span className="font-medium text-foreground">{entry?.title}</span>
                      </div>
                    </div>

                    <motion.div
                      key={`${activeTab}-${activeEntryIndex}`}
                      initial={reduceMotion ? false : { opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {entry ? <ExperienceEntryCard entry={entry} /> : null}
                    </motion.div>
                  </motion.div>
                </TabsContent>
              )
            })}
          </AnimatePresence>
        </Tabs>
      </div>
    </section>
  )
}
