"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

import type { ExperienceEntry } from "@/components/portfolio/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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

const PANELS_PER_ENTRY = 0.9

function createParticleLayout(words: string[]) {
  return words.map((word, index) => {
    const total = Math.max(words.length, 1)
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2
    const radius = index % 2 === 0 ? 34 : 27

    return {
      word,
      left: 50 + Math.cos(angle) * radius,
      top: 50 + Math.sin(angle) * (radius - 6),
      delay: index * 0.08,
      duration: 4.4 + (index % 3) * 0.8,
    }
  })
}

function LogoParticleField({ entry, isActive }: { entry: ExperienceEntry; isActive: boolean }) {
  const reduceMotion = useReducedMotion()
  const particles = useMemo(
    () => createParticleLayout(entry.particleWords ?? entry.bullets.slice(0, 4).map((bullet) => bullet.split(" ")[0] ?? "Build")),
    [entry]
  )

  return (
    <div
      className="relative flex h-full min-h-[18rem] items-center justify-center overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,hsl(var(--glass-surface-strong)/0.42),hsl(var(--glass-surface)/0.14))]"
      style={{
        boxShadow: `inset 0 1px 0 hsl(var(--glass-inner) / 0.16), 0 22px 48px hsl(var(--glass-shadow) / 0.14)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-95"
        style={{
          background: `radial-gradient(circle at 25% 20%, hsl(${entry.accent ?? "228 88% 64%"} / 0.22), transparent 34%), radial-gradient(circle at 75% 75%, hsl(${entry.accentSecondary ?? "193 92% 63%"} / 0.18), transparent 28%), linear-gradient(180deg, hsl(var(--background) / 0.12), hsl(var(--background) / 0.45))`,
        }}
      />

      <motion.div
        className="absolute inset-[14%] rounded-full border border-white/10"
        animate={reduceMotion ? undefined : { scale: [1, 1.035, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-[23%] rounded-full border border-white/10"
        animate={reduceMotion ? undefined : { scale: [1, 1.055, 1], opacity: [0.18, 0.42, 0.18] }}
        transition={{ duration: 5.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      {particles.map((particle) => (
        <motion.div
          key={`${entry.title}-${particle.word}`}
          className="absolute z-10 rounded-full border border-white/10 bg-background/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-xl"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            transform: "translate(-50%, -50%)",
          }}
          animate={
            reduceMotion
              ? undefined
              : isActive
                ? { y: [0, -8, 0], scale: [1, 1.04, 1], opacity: [0.72, 1, 0.72] }
                : { opacity: 0.45 }
          }
          transition={{
            duration: particle.duration,
            repeat: reduceMotion ? 0 : Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        >
          {particle.word}
        </motion.div>
      ))}

      <motion.div
        className="relative z-20 flex h-32 w-32 items-center justify-center rounded-[2rem] border border-white/12 text-center shadow-[0_24px_64px_rgba(0,0,0,0.24)] backdrop-blur-2xl"
        style={{
          background: `linear-gradient(145deg, hsl(${entry.accent ?? "228 88% 64%"} / 0.32), hsl(${entry.accentSecondary ?? "193 92% 63%"} / 0.18))`,
        }}
        animate={reduceMotion ? undefined : isActive ? { rotate: [0, 4, -4, 0], scale: [1, 1.04, 1] } : undefined}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.24),transparent_48%)]" />
        <span className="relative font-display text-3xl font-semibold tracking-[0.16em] text-white/95">
          {entry.logoText ?? entry.title.slice(0, 2).toUpperCase()}
        </span>
      </motion.div>
    </div>
  )
}

function ExperienceEntryCard({ entry, isActive }: { entry: ExperienceEntry; isActive: boolean }) {
  return (
    <Card className="interactive-tilt interactive-spot liquid-panel liquid-panel-strong h-full overflow-hidden rounded-[2rem]">
      <CardContent className="grid h-full gap-4 p-4 lg:grid-cols-[minmax(0,0.86fr)_minmax(22rem,1.14fr)] lg:p-5">
        <LogoParticleField entry={entry} isActive={isActive} />

        <div className="flex h-full flex-col justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {(entry.stats ?? []).slice(0, 3).map((stat) => (
                <Badge key={stat} variant="secondary" className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.16em]">
                  {stat}
                </Badge>
              ))}
            </div>

            <div className="mt-3">
              <h3 className="text-[1.45rem] font-semibold tracking-tight md:text-[1.7rem]">{entry.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{entry.subtitle}</p>
              {entry.summary ? <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{entry.summary}</p> : null}
            </div>
          </div>

          <div className="grid gap-2.5">
            {entry.bullets.map((bullet) => (
              <motion.div
                key={bullet}
                className="rounded-[1.1rem] border border-white/10 bg-background/18 px-3.5 py-3 text-sm leading-6 text-muted-foreground backdrop-blur-xl"
                initial={{ opacity: 0, x: 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.35 }}
              >
                {bullet}
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ExperienceShowcase({ items }: ExperienceShowcaseProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [activeTab, setActiveTab] = useState(items[0]?.value ?? "")
  const [activeEntryIndex, setActiveEntryIndex] = useState(0)

  const activeTabIndex = Math.max(
    items.findIndex((item) => item.value === activeTab),
    0
  )
  const activeItem = items[activeTabIndex] ?? items[0]

  const totalSteps = useMemo(() => {
    return items.reduce((count, item) => count + Math.max(item.entries.length, 1), 0)
  }, [items])

  const sectionHeight = useMemo(() => {
    return `${Math.max(totalSteps * PANELS_PER_ENTRY, 2.2) * 100}vh`
  }, [totalSteps])

  useEffect(() => {
    const section = sectionRef.current

    if (!section || !items.length) {
      return
    }

    const ranges = items.map((item) => Math.max(item.entries.length, 1))
    const total = ranges.reduce((sum, value) => sum + value, 0)

    const updateFromScroll = () => {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const scrollable = Math.max(section.offsetHeight - viewportHeight, 1)
      const rawProgress = Math.min(Math.max(-rect.top / scrollable, 0), 0.9999)
      const globalStep = Math.min(total - 1, Math.floor(rawProgress * total))

      let cumulative = 0

      for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
        const size = ranges[itemIndex] ?? 1
        if (globalStep < cumulative + size) {
          setActiveTab(items[itemIndex]?.value ?? items[0]?.value ?? "")
          setActiveEntryIndex(globalStep - cumulative)
          break
        }
        cumulative += size
      }
    }

    updateFromScroll()
    window.addEventListener("scroll", updateFromScroll, { passive: true })
    window.addEventListener("resize", updateFromScroll)

    return () => {
      window.removeEventListener("scroll", updateFromScroll)
      window.removeEventListener("resize", updateFromScroll)
    }
  }, [items])

  const currentEntry = activeItem?.entries[activeEntryIndex] ?? activeItem?.entries[0]

  return (
    <section ref={sectionRef} className="relative mb-16 pt-6" style={{ height: sectionHeight }}>
      <div className="portfolio-container w-full">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Badge variant="outline" className="rounded-full px-4 py-1 font-mono text-[11px] uppercase tracking-[0.22em]">
              Real-world Experience
            </Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              Internships, work, and volunteering in motion
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              Scroll through one role at a time. Each lane reveals left to right so the section feels more like a product narrative than a list of resumes.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setActiveTab(item.value)
                  setActiveEntryIndex(0)
                }}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition-all duration-300",
                  item.value === activeTab ? "liquid-chip text-foreground" : "border border-border/40 bg-background/20 text-muted-foreground"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky top-20 pb-6">
        <div className="portfolio-container w-full">
          <Card className="liquid-panel liquid-panel-strong overflow-hidden rounded-[2.2rem]">
            <CardContent className="p-4 lg:p-5">
              <div className="mb-4 flex flex-col gap-3 border-b border-border/40 pb-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    <Sparkles className="h-4 w-4" />
                    {activeItem?.eyebrow}
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{activeItem?.description}</p>
                </div>

                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  <span>
                    {activeEntryIndex + 1}/{activeItem?.entries.length ?? 1}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>{currentEntry?.title}</span>
                </div>
              </div>

              <div className="overflow-hidden">
                <motion.div
                  key={`${activeTab}-${activeEntryIndex}`}
                  initial={{ opacity: 0, x: 60, scale: 0.985 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {currentEntry ? <ExperienceEntryCard entry={currentEntry} isActive /> : null}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
