"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Pause, Play, Sparkles, Zap } from "lucide-react"

import SectionHeading from "@/components/portfolio/SectionHeading"
import { achievements, signatureStacks, techClusters } from "@/components/portfolio/data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
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
  const ActiveClusterIcon = activeCluster.icon

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
    <section id="skills" className="relative mb-16 pt-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Tech Constellation"
          title="A live map of my stack, strengths, and creative range"
          description="Instead of a static skills list, this section visualizes the systems I actually use. It clusters the tools, workflows, and technical habits that show up across my projects, internships, and experiments."
        />

        <Card className="liquid-panel liquid-panel-strong overflow-hidden rounded-[2.4rem]">
          <CardContent className="p-0">
            <div className="grid xl:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b border-border/40 p-6 xl:border-b-0 xl:border-r">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      label: "Clusters",
                      value: techClusters.length.toString(),
                      description: "Distinct skill systems powering different kinds of work.",
                    },
                    {
                      label: "Tech Nodes",
                      value: `${totalNodeCount}+`,
                      description: "Languages, frameworks, patterns, and strengths in the map.",
                    },
                    {
                      label: "Active Focus",
                      value: activeCluster.shortLabel,
                      description: "Currently highlighted cluster in the live chart.",
                    },
                    {
                      label: "Auto Scan",
                      value: autoRotate && !reduceMotion ? "On" : "Paused",
                      description: "Cycles through clusters automatically for a live dashboard feel.",
                    },
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      className="liquid-panel liquid-soft rounded-[1.4rem] p-4"
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{ duration: 0.4 }}
                    >
                      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{stat.value}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{stat.description}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                      Cluster Navigator
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Select a cluster to drive the visualization, or let it auto-rotate.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoRotate((current) => !current)}
                    className="liquid-chip inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium"
                    aria-pressed={autoRotate}
                  >
                    {autoRotate && !reduceMotion ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {autoRotate && !reduceMotion ? "Pause" : "Play"}
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {techClusters.map((cluster, index) => {
                    const Icon = cluster.icon
                    const isActive = cluster.id === activeCluster.id

                    return (
                      <motion.button
                        key={cluster.id}
                        type="button"
                        onClick={() => setActiveClusterId(cluster.id)}
                        className={cn(
                          "group relative w-full overflow-hidden rounded-[1.65rem] border px-4 py-4 text-left transition-all duration-300",
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
                        <div className="flex items-start gap-4">
                          <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.15rem] border border-white/10 shadow-[0_10px_24px_hsl(var(--glass-shadow)/0.12)]"
                            style={{
                              background: `linear-gradient(135deg, hsl(${cluster.accent} / 0.34), hsl(${cluster.accentSecondary} / 0.16))`,
                            }}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="text-base font-semibold tracking-tight">{cluster.title}</h3>
                              <Badge variant={isActive ? "default" : "outline"} className="shrink-0 text-[10px] uppercase tracking-[0.18em]">
                                {cluster.technologies.length} nodes
                              </Badge>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">{cluster.summary}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {cluster.focus.slice(0, 3).map((item) => (
                                <span
                                  key={item}
                                  className="rounded-full border border-border/45 bg-background/45 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              <div className="p-6 lg:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="rounded-full px-4 py-1 font-mono text-[11px] uppercase tracking-[0.2em]">
                        Live Cluster View
                      </Badge>
                      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        {activeCluster.projects.length} linked projects
                      </span>
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{activeCluster.title}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                      {activeCluster.summary}
                    </p>
                  </div>

                  <div className="liquid-panel liquid-soft w-full max-w-xs rounded-[1.45rem] p-4">
                    <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      <span>Signal Strength</span>
                      <span>{autoRotate && !reduceMotion ? "Scanning" : "Manual"}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-background/65">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, hsl(${activeCluster.accent}), hsl(${activeCluster.accentSecondary}))`,
                        }}
                        animate={
                          reduceMotion
                            ? { width: "72%" }
                            : autoRotate
                              ? { width: ["18%", "96%", "48%"] }
                              : { width: "44%" }
                        }
                        transition={
                          reduceMotion
                            ? undefined
                            : autoRotate
                              ? { duration: 4.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
                              : { duration: 0.4 }
                        }
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      Hover a node to spotlight it, or click any cluster on the left to redraw the map instantly.
                    </p>
                  </div>
                </div>

                <div className="relative mt-6 min-h-[30rem] overflow-hidden rounded-[2rem] border border-border/45 bg-background/20 p-4 sm:p-6">
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
                    "h-[12rem] w-[12rem] sm:h-[14rem] sm:w-[14rem]",
                    "h-[18rem] w-[18rem] sm:h-[20rem] sm:w-[20rem]",
                    "h-[24rem] w-[24rem] sm:h-[26rem] sm:w-[26rem]",
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
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="1.8"
                      fill={`hsl(${activeCluster.accent})`}
                      animate={reduceMotion ? undefined : { r: [1.8, 2.2, 1.8], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    />
                  </svg>

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
                            "absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-2 text-xs font-medium shadow-[0_14px_30px_hsl(var(--glass-shadow)/0.12)] backdrop-blur-xl transition-all duration-300",
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

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCluster.id}
                      className="absolute left-1/2 top-1/2 z-10 w-[min(78%,22rem)] -translate-x-1/2 -translate-y-1/2"
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 10 }}
                      animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96, y: -6 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div
                        className="liquid-panel liquid-panel-strong relative rounded-[1.9rem] border border-white/10 p-5 text-center shadow-[0_28px_56px_hsl(var(--glass-shadow)/0.16)]"
                        style={{
                          background: `linear-gradient(180deg, hsl(var(--glass-surface-strong) / 0.72), hsl(var(--glass-surface) / 0.28)), linear-gradient(135deg, hsl(${activeCluster.accent} / 0.16), hsl(${activeCluster.accentSecondary} / 0.08))`,
                        }}
                      >
                        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
                        <div
                          className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.35rem] border border-white/10 shadow-[0_18px_34px_hsl(var(--glass-shadow)/0.15)]"
                          style={{
                            background: `linear-gradient(135deg, hsl(${activeCluster.accent} / 0.34), hsl(${activeCluster.accentSecondary} / 0.18))`,
                          }}
                        >
                          <ActiveClusterIcon className="h-7 w-7" />
                        </div>
                        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                          Active cluster
                        </p>
                        <h4 className="mt-3 text-2xl font-semibold tracking-tight">{activeCluster.title}</h4>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">{activeCluster.summary}</p>
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                          {activeCluster.focus.map((item) => (
                            <Badge key={item} variant="secondary" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.16em]">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
                    {(["core", "strong", "exploring"] as const).map((tier) => (
                      <Badge
                        key={tier}
                        variant="outline"
                        className={cn(
                          "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]",
                          tierMeta[tier].chipClassName
                        )}
                      >
                        {tierMeta[tier].label} {tierCounts[tier]}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <Card className="liquid-panel liquid-soft rounded-[1.8rem]">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        <Sparkles className="h-4 w-4" />
                        Node Spotlight
                      </div>
                      <div className="mt-4 flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-xl">{spotlightTech.name}</CardTitle>
                          <CardDescription className="mt-2 leading-6">
                            {tierMeta[spotlightTech.tier].description}
                          </CardDescription>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]",
                            tierMeta[spotlightTech.tier].chipClassName
                          )}
                        >
                          {tierMeta[spotlightTech.tier].label}
                        </Badge>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {activeCluster.projects.map((project) => (
                          <Badge key={project} variant="secondary" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
                            {project}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="liquid-panel liquid-soft rounded-[1.8rem]">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        <Zap className="h-4 w-4" />
                        Cluster Breakdown
                      </div>
                      <div className="mt-4 space-y-4">
                        {(["core", "strong", "exploring"] as const).map((tier) => {
                          const percentage = (tierCounts[tier] / activeCluster.technologies.length) * 100

                          return (
                            <div key={tier}>
                              <div className="mb-2 flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-sm font-medium">{tierMeta[tier].label}</p>
                                  <p className="text-xs text-muted-foreground">{tierMeta[tier].description}</p>
                                </div>
                                <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                                  {tierCounts[tier]}
                                </span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-background/65">
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
                                  transition={{ duration: 0.5, delay: 0.08 }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="liquid-panel rounded-[2rem]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                <ArrowUpRight className="h-4 w-4" />
                Why This Cluster Matters
              </div>
              <CardTitle className="mt-4 text-2xl">{activeCluster.title}</CardTitle>
              <CardDescription className="mt-2 max-w-2xl leading-7">
                These proof points connect the active cluster back to real work, not just keywords.
              </CardDescription>
              <ul className="mt-5 grid gap-3">
                {activeCluster.proofs.map((proof, index) => (
                  <motion.li
                    key={proof}
                    className="liquid-panel liquid-soft rounded-[1.45rem] px-4 py-4 text-sm leading-7 text-muted-foreground"
                    initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                  >
                    {proof}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="liquid-panel rounded-[2rem]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                Signature Stacks
              </div>
              <div className="mt-5 grid gap-4">
                {signatureStacks.map((stack, index) => (
                  <motion.div
                    key={stack.title}
                    className="liquid-panel liquid-soft rounded-[1.55rem] p-4"
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                  >
                    <h3 className="text-lg font-semibold tracking-tight">{stack.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{stack.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {stack.stack.map((item) => (
                        <Badge key={item} variant="secondary" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="liquid-panel mt-6 rounded-[2rem]">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Achievement Overlay
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">Proof layered over the tech</h3>
              </div>
              <Badge variant="outline" className="rounded-full px-4 py-1 font-mono text-[11px] uppercase tracking-[0.2em]">
                {achievements.length} highlights
              </Badge>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {achievements.map((item, index) => (
                <motion.div
                  key={item}
                  className="liquid-chip rounded-full px-4 py-2 text-sm leading-6 text-foreground/90"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
                  transition={{
                    opacity: { duration: 0.25, delay: index * 0.03 },
                    y: { duration: 4.2 + (index % 3), repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: index * 0.08 },
                  }}
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
