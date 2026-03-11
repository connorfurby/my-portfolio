"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Pause, Play, Sparkles } from "lucide-react"

import { techClusters } from "@/components/portfolio/data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const AUTO_ROTATE_MS = 4800

const tierMeta = {
  core: {
    label: "Core",
    description: "Go-to tools that shape the majority of my work.",
    chipClassName: "border-[hsl(var(--spotlight)/0.18)] bg-[hsl(var(--spotlight)/0.12)] text-foreground",
    glow: "hsl(var(--spotlight) / 0.82)",
  },
  strong: {
    label: "Strong",
    description: "Reliable supporting strengths used across multiple builds.",
    chipClassName: "border-[hsl(var(--spotlight-secondary)/0.18)] bg-[hsl(var(--spotlight-secondary)/0.12)] text-foreground",
    glow: "hsl(var(--spotlight-secondary) / 0.8)",
  },
  exploring: {
    label: "Exploring",
    description: "Newer territory I am actively expanding through projects and internships.",
    chipClassName: "border-[hsl(var(--chart-5)/0.2)] bg-[hsl(var(--chart-5)/0.12)] text-foreground",
    glow: "hsl(var(--chart-5) / 0.78)",
  },
} as const

export default function Awards() {
  const reduceMotion = useReducedMotion()
  const [activeClusterId, setActiveClusterId] = useState(techClusters[0]?.id ?? "")
  const [spotlightTechName, setSpotlightTechName] = useState<string | null>(techClusters[0]?.technologies[0]?.name ?? null)
  const [autoRotate, setAutoRotate] = useState(true)

  const activeClusterIndex = Math.max(
    techClusters.findIndex((cluster) => cluster.id === activeClusterId),
    0
  )
  const activeCluster = techClusters[activeClusterIndex] ?? techClusters[0]

  const totalNodeCount = useMemo(
    () => techClusters.reduce((total, cluster) => total + cluster.technologies.length, 0),
    []
  )

  const tierCounts = useMemo(() => {
    return activeCluster.technologies.reduce(
      (counts, tech) => {
        counts[tech.tier] += 1
        return counts
      },
      { core: 0, strong: 0, exploring: 0 }
    )
  }, [activeCluster])

  const orbitNodes = useMemo(() => {
    return activeCluster.technologies.map((tech, index) => {
      const total = activeCluster.technologies.length
      const ring = index % 3
      const angle = (index / total) * Math.PI * 2 - Math.PI / 2 + ring * 0.28
      const radiusX = [24, 33, 41][ring]
      const radiusY = [20, 28, 36][ring]

      return {
        ...tech,
        x: 50 + Math.cos(angle) * radiusX,
        y: 50 + Math.sin(angle) * radiusY,
        delay: index * 0.05,
        duration: 7 + ring * 1.4 + (index % 4),
      }
    })
  }, [activeCluster])

  const spotlightTech =
    activeCluster.technologies.find((tech) => tech.name === spotlightTechName) ?? activeCluster.technologies[0]

  useEffect(() => {
    setSpotlightTechName((current) => {
      if (current && activeCluster.technologies.some((tech) => tech.name === current)) {
        return current
      }

      return activeCluster.technologies[0]?.name ?? null
    })
  }, [activeCluster])

  useEffect(() => {
    if (reduceMotion || !autoRotate || techClusters.length <= 1) {
      return
    }

    const interval = window.setInterval(() => {
      setActiveClusterId((currentId) => {
        const currentIndex = techClusters.findIndex((cluster) => cluster.id === currentId)
        const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % techClusters.length : 0
        return techClusters[nextIndex]?.id ?? currentId
      })
    }, AUTO_ROTATE_MS)

    return () => window.clearInterval(interval)
  }, [autoRotate, reduceMotion])

  return (
    <section id="skills" className="relative mb-14 pt-12">
      <div className="portfolio-container w-full">
        <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <Badge variant="outline" className="rounded-full px-4 py-1 font-mono text-[11px] uppercase tracking-[0.22em]">
              Tech Constellation
            </Badge>
            <h2 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.04em] md:text-[2.3rem]">
              The stack map, in a tighter view
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-5 text-muted-foreground">
              Minimal chrome, smaller surrounding UI, and more room for the live map itself.
            </p>
          </div>

          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            {techClusters.length} live clusters
          </div>
        </div>

        <Card className="liquid-panel liquid-panel-strong overflow-hidden rounded-[2.05rem]">
          <CardContent className="p-0">
            <div className="grid xl:h-[calc(100vh-15rem)] xl:grid-cols-[minmax(205px,0.5fr)_minmax(0,1.5fr)]">
              <div className="border-b border-border/40 p-3.5 xl:border-b-0 xl:border-r">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                      Cluster Navigator
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Pick a cluster or let the map rotate.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoRotate((current) => !current)}
                    className="liquid-chip inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium"
                    aria-pressed={autoRotate}
                  >
                    {autoRotate && !reduceMotion ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    {autoRotate && !reduceMotion ? "Pause" : "Play"}
                  </button>
                </div>

                <div className="mt-2.5 grid gap-1.5">
                  {techClusters.map((cluster, index) => {
                    const Icon = cluster.icon
                    const isActive = cluster.id === activeCluster.id

                    return (
                      <motion.button
                        key={cluster.id}
                        type="button"
                        onClick={() => setActiveClusterId(cluster.id)}
                        className={cn(
                          "group relative w-full overflow-hidden rounded-[1.1rem] border px-2.5 py-2 text-left transition-all duration-300",
                          isActive
                            ? "border-transparent bg-background/65 shadow-[0_20px_44px_hsl(var(--glass-shadow)/0.14)]"
                            : "border-border/45 bg-background/25 hover:-translate-y-0.5 hover:bg-background/40"
                        )}
                        style={
                          isActive
                            ? {
                                background: `linear-gradient(135deg, hsl(${cluster.accent} / 0.18), hsl(${cluster.accentSecondary} / 0.1))`,
                              }
                            : undefined
                        }
                        whileHover={reduceMotion ? undefined : { y: -2 }}
                        whileTap={reduceMotion ? undefined : { scale: 0.995 }}
                        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.35, delay: index * 0.04 }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.8rem] border border-white/10 shadow-[0_10px_24px_hsl(var(--glass-shadow)/0.12)]"
                            style={{
                              background: `linear-gradient(135deg, hsl(${cluster.accent} / 0.34), hsl(${cluster.accentSecondary} / 0.16))`,
                            }}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="text-[13px] font-semibold tracking-tight">{cluster.shortLabel}</h3>
                              <Badge variant={isActive ? "default" : "outline"} className="shrink-0 text-[10px] uppercase tracking-[0.18em]">
                                {cluster.technologies.length} nodes
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-col p-3.5 lg:p-4">
                <div className="flex flex-col gap-2.5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]">
                        Live Cluster View
                      </Badge>
                      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        {totalNodeCount}+ total nodes
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight md:text-[1.45rem]">{activeCluster.title}</h3>
                    <p className="mt-1 max-w-2xl text-sm leading-5 text-muted-foreground">
                      {activeCluster.summary}
                    </p>
                  </div>

                  <div className="flex w-full max-w-sm flex-wrap gap-1.5 rounded-[1rem] border border-border/45 bg-background/20 px-2.5 py-2">
                    {activeCluster.focus.slice(0, 3).map((item) => (
                      <Badge key={item} variant="secondary" className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="relative mt-3 min-h-[17rem] flex-1 overflow-hidden rounded-[1.4rem] border border-border/45 bg-background/20 p-2.5 sm:p-3 lg:min-h-[18.75rem]">
                  <div
                    className="absolute inset-0 opacity-70"
                    style={{
                      background: `radial-gradient(circle at 28% 28%, hsl(${activeCluster.accent} / 0.18), transparent 28%), radial-gradient(circle at 76% 24%, hsl(${activeCluster.accentSecondary} / 0.14), transparent 22%), linear-gradient(180deg, hsl(var(--background) / 0.14), hsl(var(--background) / 0.48))`,
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-[0.16]"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, hsl(var(--foreground) / 0.22) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground) / 0.22) 1px, transparent 1px)",
                      backgroundSize: "52px 52px",
                      maskImage: "radial-gradient(circle at center, black 36%, transparent 94%)",
                    }}
                  />

                  {!reduceMotion ? (
                    <motion.div
                      className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[44%] origin-left"
                      style={{
                        background: `linear-gradient(90deg, hsl(${activeCluster.accent} / 0.75), transparent)`,
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                  ) : null}

                  {[
                    "h-[7.75rem] w-[7.75rem] sm:h-[9.5rem] sm:w-[9.5rem]",
                    "h-[11.5rem] w-[11.5rem] sm:h-[13.5rem] sm:w-[13.5rem]",
                    "h-[15rem] w-[15rem] sm:h-[17rem] sm:w-[17rem]",
                  ].map((sizeClassName, index) => (
                    <motion.div
                      key={sizeClassName}
                      className={cn(
                        "pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-white/10 -translate-x-1/2 -translate-y-1/2",
                        sizeClassName
                      )}
                      animate={
                        reduceMotion
                          ? undefined
                          : {
                              scale: [1, 1.025, 1],
                              opacity: [0.18, 0.38, 0.18],
                            }
                      }
                      transition={{
                        duration: 5.2 + index * 1.4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: index * 0.25,
                      }}
                    />
                  ))}

                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    {orbitNodes.map((tech) => (
                      <motion.line
                        key={`${activeCluster.id}-${tech.name}-line`}
                        x1="50"
                        y1="50"
                        x2={tech.x}
                        y2={tech.y}
                        stroke={tierMeta[tech.tier].glow}
                        strokeWidth="0.25"
                        strokeOpacity="0.32"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.4 }}
                        transition={{ duration: 0.65, delay: tech.delay }}
                      />
                    ))}
                    <circle
                      cx="50"
                      cy="50"
                      r="1.8"
                      fill={`hsl(${activeCluster.accent})`}
                      opacity="0.9"
                    />
                  </svg>

                  {!reduceMotion ? (
                    <motion.div
                      className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{ backgroundColor: `hsl(${activeCluster.accent})` }}
                      animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.22, 1] }}
                      transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    />
                  ) : null}

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCluster.id}
                      className="absolute inset-0"
                      initial={reduceMotion ? false : { opacity: 0 }}
                      animate={reduceMotion ? undefined : { opacity: 1 }}
                      exit={reduceMotion ? undefined : { opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      {orbitNodes.map((tech) => (
                        <motion.button
                          key={`${activeCluster.id}-${tech.name}`}
                          type="button"
                          onMouseEnter={() => setSpotlightTechName(tech.name)}
                          onFocus={() => setSpotlightTechName(tech.name)}
                          onClick={() => setSpotlightTechName(tech.name)}
                          className={cn(
                            "absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border px-2 py-1 text-[10px] font-medium shadow-[0_14px_30px_hsl(var(--glass-shadow)/0.12)] backdrop-blur-xl transition-all duration-300",
                            spotlightTech?.name === tech.name
                              ? "scale-[1.04] border-transparent text-foreground shadow-[0_18px_34px_hsl(var(--glass-shadow)/0.18)]"
                              : "border-white/10 text-foreground/90"
                          )}
                          style={{
                            left: `${tech.x}%`,
                            top: `${tech.y}%`,
                            background:
                              spotlightTech?.name === tech.name
                                ? `linear-gradient(135deg, hsl(${activeCluster.accent} / 0.24), hsl(${activeCluster.accentSecondary} / 0.14))`
                                : "linear-gradient(180deg, hsl(var(--glass-surface-strong) / 0.54), hsl(var(--glass-surface) / 0.22))",
                          }}
                          initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
                          animate={
                            reduceMotion
                              ? undefined
                              : {
                                  opacity: 1,
                                  scale: spotlightTech?.name === tech.name ? 1.05 : 1,
                                  y: [0, -4, 0],
                                }
                          }
                          transition={{
                            opacity: { duration: 0.28, delay: tech.delay },
                            scale: { duration: 0.24 },
                            y: { duration: tech.duration, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: tech.delay },
                          }}
                        >
                          <span
                            className="absolute -inset-[1px] rounded-full opacity-0 blur-md transition-opacity duration-300"
                            style={{
                              background: `radial-gradient(circle, ${tierMeta[tech.tier].glow} 0%, transparent 72%)`,
                              opacity: spotlightTech?.name === tech.name ? 0.7 : 0,
                            }}
                          />
                          <span className="relative z-10 flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: tierMeta[tech.tier].glow }}
                            />
                            {tech.name}
                          </span>
                        </motion.button>
                      ))}
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute left-2.5 top-2.5 z-20 flex flex-wrap gap-1.5">
                    {(["core", "strong", "exploring"] as const).map((tier) => (
                      <Badge
                        key={tier}
                        variant="outline"
                        className={cn(
                          "rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em]",
                          tierMeta[tier].chipClassName
                        )}
                      >
                        {tierMeta[tier].label} {tierCounts[tier]}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-2.5 rounded-[1.05rem] border border-border/45 bg-background/20 px-3 py-2.5">
                  <div className="grid gap-2.5 lg:grid-cols-[0.82fr_1.18fr]">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        <Sparkles className="h-4 w-4" />
                        Spotlight
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="text-sm font-semibold tracking-tight">{spotlightTech.name}</div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em]",
                            tierMeta[spotlightTech.tier].chipClassName
                          )}
                        >
                          {tierMeta[spotlightTech.tier].label}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {activeCluster.projects.slice(0, 2).map((project) => (
                          <Badge key={project} variant="secondary" className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]">
                            {project}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      {(["core", "strong", "exploring"] as const).map((tier) => {
                        const percentage = (tierCounts[tier] / activeCluster.technologies.length) * 100

                        return (
                          <div key={tier}>
                            <div className="mb-1.5 flex items-center justify-between gap-3">
                              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                {tierMeta[tier].label}
                              </p>
                              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                {tierCounts[tier]}
                              </span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-background/65">
                              <motion.div
                                className="h-full rounded-full"
                                style={{
                                  background:
                                    tier === "core"
                                      ? "linear-gradient(90deg, hsl(var(--spotlight)), hsl(var(--primary)))"
                                      : tier === "strong"
                                        ? "linear-gradient(90deg, hsl(var(--spotlight-secondary)), hsl(var(--chart-2)))"
                                        : "linear-gradient(90deg, hsl(var(--chart-5)), hsl(var(--chart-4)))",
                                }}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${Math.max(percentage, 8)}%` }}
                                viewport={{ once: true, amount: 0.6 }}
                                transition={{ duration: 0.45, delay: 0.05 }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </section>
  )
}
