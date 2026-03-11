"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Pause, Play, Sparkles } from "lucide-react"

import Passions from "@/components/portfolio/Passions"
import ScrollTabsSection from "@/components/portfolio/ScrollTabsSection"
import SectionHeading from "@/components/portfolio/SectionHeading"
import { useMediaQuery } from "@/components/portfolio/useMediaQuery"
import { useNearViewport } from "@/components/portfolio/useNearViewport"
import { techClusters } from "@/components/portfolio/data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const AUTO_ROTATE_MS = 4800

const nodeMeta = {
  core: {
    glow: "hsl(var(--spotlight) / 0.82)",
    lineOpacity: 0.42,
    dotClassName: "h-2.5 w-2.5",
  },
  strong: {
    glow: "hsl(var(--spotlight-secondary) / 0.8)",
    lineOpacity: 0.34,
    dotClassName: "h-2.25 w-2.25",
  },
  exploring: {
    glow: "hsl(var(--chart-5) / 0.78)",
    lineOpacity: 0.28,
    dotClassName: "h-2 w-2",
  },
} as const

const ambientSignals = [
  { top: "12%", left: "16%", size: 4, delay: 0.15 },
  { top: "19%", left: "76%", size: 5, delay: 0.85 },
  { top: "28%", left: "61%", size: 3, delay: 1.35 },
  { top: "46%", left: "20%", size: 5, delay: 0.5 },
  { top: "56%", left: "84%", size: 4, delay: 1.75 },
  { top: "72%", left: "66%", size: 3, delay: 1.1 },
  { top: "78%", left: "29%", size: 5, delay: 0.25 },
  { top: "36%", left: "90%", size: 3, delay: 1.55 },
] as const

const nodePlacementClassName = {
  top: "-translate-x-1/2 -translate-y-[calc(100%+0.8rem)]",
  right: "translate-x-[0.8rem] -translate-y-1/2",
  bottom: "-translate-x-1/2 translate-y-[0.8rem]",
  left: "-translate-x-[calc(100%+0.8rem)] -translate-y-1/2",
} as const

const compactNodePlacementClassName = {
  top: "-translate-x-1/2 -translate-y-[calc(100%+0.55rem)]",
  right: "translate-x-[0.55rem] -translate-y-1/2",
  bottom: "-translate-x-1/2 translate-y-[0.55rem]",
  left: "-translate-x-[calc(100%+0.55rem)] -translate-y-1/2",
} as const

export default function Awards() {
  const reduceMotion = useReducedMotion()
  const isCompactSkillMap = useMediaQuery("(max-width: 640px)")
  const { ref: stackMapRef, isNearViewport } = useNearViewport<HTMLDivElement>({ rootMargin: "260px 0px" })
  const shouldAnimate = !reduceMotion && isNearViewport
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

  const orbitNodes = useMemo(() => {
    const orbitRadiusX = isCompactSkillMap ? [21, 30, 36] : [19, 27, 33]
    const orbitRadiusY = isCompactSkillMap ? [19, 27, 33] : [17, 24, 30]

    return activeCluster.technologies.map((tech, index) => {
      const total = Math.max(activeCluster.technologies.length, 1)
      const ring = index % 3
      const angle = (index / total) * Math.PI * 2 - Math.PI / 2 + ring * 0.28
      const radiusX = orbitRadiusX[ring] ?? orbitRadiusX[0]
      const radiusY = orbitRadiusY[ring] ?? orbitRadiusY[0]
      const x = 50 + Math.cos(angle) * radiusX
      const y = 50 + Math.sin(angle) * radiusY
      const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2)

      let labelPlacement: keyof typeof nodePlacementClassName

      if (isCompactSkillMap) {
        const deltaX = x - 50
        const deltaY = y - 50

        if (Math.abs(deltaX) >= Math.abs(deltaY)) {
          labelPlacement = deltaX >= 0 ? "right" : "left"
        } else {
          labelPlacement = deltaY >= 0 ? "bottom" : "top"
        }
      } else if (y < 24) {
        labelPlacement = "bottom"
      } else if (y > 76) {
        labelPlacement = "top"
      } else if (x < 18) {
        labelPlacement = "right"
      } else if (x > 82) {
        labelPlacement = "left"
      } else if (normalizedAngle < Math.PI / 4 || normalizedAngle >= (Math.PI * 7) / 4) {
        labelPlacement = "right"
      } else if (normalizedAngle < (Math.PI * 3) / 4) {
        labelPlacement = "bottom"
      } else if (normalizedAngle < (Math.PI * 5) / 4) {
        labelPlacement = "left"
      } else {
        labelPlacement = "top"
      }

      return {
        ...tech,
        x,
        y,
        labelPlacement,
        delay: index * 0.05,
        duration: 7 + ring * 1.4 + (index % 4),
      }
    })
  }, [activeCluster, isCompactSkillMap])

  const spotlightTech =
    activeCluster.technologies.find((tech) => tech.name === spotlightTechName) ?? activeCluster.technologies[0]

  const featuredProjects = activeCluster.projects.slice(0, 3)

  useEffect(() => {
    setSpotlightTechName((current) => {
      if (current && activeCluster.technologies.some((tech) => tech.name === current)) {
        return current
      }

      return activeCluster.technologies[0]?.name ?? null
    })
  }, [activeCluster])

  useEffect(() => {
    if (!shouldAnimate || !autoRotate || techClusters.length <= 1) {
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
  }, [autoRotate, shouldAnimate])

  const stackMapContent = (
    <Card className="liquid-panel liquid-panel-strong overflow-hidden rounded-[2.05rem]">
      <CardContent className="p-0">
        <div className="grid xl:h-[calc(100vh-15rem)] xl:grid-cols-[minmax(205px,0.5fr)_minmax(0,1.5fr)]">
          <div className="border-b border-border/40 p-3.5 xl:border-b-0 xl:border-r">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                  Skill Clusters
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Jump between the parts of my stack that show up together most often.
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
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.8rem] border border-border/55 shadow-[0_10px_24px_hsl(var(--glass-shadow)/0.12)] dark:border-white/10"
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

          <div className="flex min-h-0 flex-col p-3.5 lg:p-4">
            <div className="flex flex-col gap-2.5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]">
                    Interactive Skill Map
                  </Badge>
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    {activeCluster.technologies.length} connected skills
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    {totalNodeCount}+ mapped total
                  </span>
                </div>
                <h3 className="text-lg font-semibold tracking-tight md:text-[1.45rem]">{activeCluster.title}</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
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

            <div ref={stackMapRef} className="relative mt-3 min-h-[17.5rem] flex-1 overflow-hidden rounded-[1.55rem] border border-border/45 bg-background/20 p-2.5 sm:p-3 xl:min-h-0 lg:min-h-[19.5rem]">
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  background: `radial-gradient(circle at 28% 28%, hsl(${activeCluster.accent} / 0.18), transparent 28%), radial-gradient(circle at 76% 24%, hsl(${activeCluster.accentSecondary} / 0.16), transparent 22%), radial-gradient(circle at 52% 56%, hsl(${activeCluster.accent} / 0.12), transparent 34%), linear-gradient(180deg, hsl(var(--background) / 0.1), hsl(var(--background) / 0.52)), linear-gradient(135deg, hsl(${activeCluster.accent} / 0.08), transparent 48%, hsl(${activeCluster.accentSecondary} / 0.08))`,
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.18]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, hsl(var(--foreground) / 0.18) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground) / 0.18) 1px, transparent 1px)",
                  backgroundSize: "52px 52px",
                  maskImage: "radial-gradient(circle at center, black 36%, transparent 94%)",
                }}
              />

              {shouldAnimate ? (
                <motion.div
                  className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl sm:w-[72%] sm:opacity-70"
                  style={{
                    background: `conic-gradient(from 90deg, transparent 0deg, hsl(${activeCluster.accent} / 0.22) 58deg, transparent 128deg, hsl(${activeCluster.accentSecondary} / 0.16) 196deg, transparent 320deg)`,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              ) : null}

              {shouldAnimate ? (
                <motion.div
                  className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[28%] origin-left sm:w-[44%]"
                  style={{
                    background: `linear-gradient(90deg, hsl(${activeCluster.accent} / 0.75), transparent)`,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              ) : null}

              {ambientSignals.map((signal, index) => (
                <motion.span
                  key={`${activeCluster.id}-signal-${index}`}
                  className="pointer-events-none absolute rounded-full"
                  style={{
                    top: signal.top,
                    left: signal.left,
                    width: signal.size,
                    height: signal.size,
                    backgroundColor: index % 2 === 0 ? `hsl(${activeCluster.accent})` : `hsl(${activeCluster.accentSecondary})`,
                    boxShadow:
                      index % 2 === 0
                        ? `0 0 16px hsl(${activeCluster.accent} / 0.42)`
                        : `0 0 16px hsl(${activeCluster.accentSecondary} / 0.38)`,
                  }}
                  animate={shouldAnimate ? { opacity: [0.25, 0.82, 0.25], scale: [1, 1.35, 1] } : undefined}
                  transition={{
                    duration: 3.2 + index * 0.45,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: signal.delay,
                  }}
                />
              ))}

              {[
                "h-[5.35rem] w-[5.35rem] sm:h-[9.5rem] sm:w-[9.5rem]",
                "h-[7.95rem] w-[7.95rem] sm:h-[13.5rem] sm:w-[13.5rem]",
                "h-[10.75rem] w-[10.75rem] sm:h-[17rem] sm:w-[17rem]",
              ].map((sizeClassName, index) => (
                <motion.div
                  key={sizeClassName}
                  className={cn(
                    "pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-border/55 -translate-x-1/2 -translate-y-1/2 dark:border-white/10",
                    sizeClassName
                  )}
                  animate={
                    !shouldAnimate
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
                    stroke={nodeMeta[tech.tier].glow}
                    strokeWidth={spotlightTech?.name === tech.name ? "0.34" : "0.24"}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: spotlightTech?.name === tech.name ? 0.72 : nodeMeta[tech.tier].lineOpacity,
                    }}
                    transition={{ duration: 0.65, delay: tech.delay }}
                  />
                ))}
              </svg>

              <div className="absolute left-2.5 top-2.5 z-20">
                <Badge
                  variant="outline"
                  className="rounded-full border-border/55 bg-background/68 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] dark:border-white/10 dark:bg-background/30"
                >
                  Hover or tap nodes
                </Badge>
              </div>

              <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                {shouldAnimate ? (
                  <motion.div
                    className="absolute left-1/2 top-1/2 aspect-square w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/45 sm:w-28 dark:border-white/8"
                    style={{
                      boxShadow: isCompactSkillMap
                        ? `0 0 16px hsl(${activeCluster.accent} / 0.14)`
                        : `0 0 42px hsl(${activeCluster.accent} / 0.18)`,
                    }}
                    animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.75, 0.35] }}
                    transition={{ duration: 3.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  />
                ) : null}

                <motion.div
                  className="relative flex aspect-square w-[2.35rem] items-center justify-center rounded-full border border-border/55 sm:w-[5.1rem] lg:w-[5.7rem] dark:border-white/12"
                  style={{
                    background: `radial-gradient(circle at 34% 30%, hsl(${activeCluster.accentSecondary} / 0.4), hsl(${activeCluster.accent} / 0.26) 30%, hsl(var(--background) / 0.92) 72%)`,
                    boxShadow: isCompactSkillMap
                      ? `0 0 0 1px hsl(var(--foreground) / 0.04), 0 0 14px hsl(${activeCluster.accent} / 0.18)`
                      : `0 0 0 1px hsl(var(--foreground) / 0.04), 0 0 44px hsl(${activeCluster.accent} / 0.24)`,
                  }}
                  animate={shouldAnimate ? { scale: [1, 1.04, 1] } : undefined}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <div className="absolute inset-[18%] rounded-full border border-border/45 bg-[radial-gradient(circle_at_35%_32%,hsl(var(--foreground)/0.14),transparent_60%)] sm:inset-[16%] dark:border-white/10" />
                  {isCompactSkillMap ? (
                    <>
                      <div className="relative h-2.5 w-2.5 rounded-full bg-foreground/80 shadow-[0_0_12px_hsl(var(--foreground)/0.32)]" />
                      <span className="sr-only">Skill hub</span>
                    </>
                  ) : (
                    <div className="relative flex flex-col items-center justify-center px-1.5 text-center sm:px-2">
                      <span className="font-mono text-[8px] uppercase tracking-[0.26em] text-foreground/55 dark:text-white/60">
                        Skill Hub
                      </span>
                      <span className="mt-1 text-[11px] font-semibold leading-4 tracking-tight text-foreground">
                        {activeCluster.shortLabel}
                      </span>
                    </div>
                  )}
                </motion.div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCluster.id}
                  className="absolute inset-0"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={shouldAnimate ? { opacity: 1 } : { opacity: 1 }}
                  exit={shouldAnimate ? { opacity: 0 } : { opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {orbitNodes.map((tech) => (
                    <div
                      key={`${activeCluster.id}-${tech.name}`}
                      className="absolute inset-0"
                    >
                      <motion.span
                        className={cn(
                          "pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full",
                          nodeMeta[tech.tier].dotClassName
                        )}
                        style={{
                          left: `${tech.x}%`,
                          top: `${tech.y}%`,
                          backgroundColor: nodeMeta[tech.tier].glow,
                          boxShadow: `0 0 16px ${nodeMeta[tech.tier].glow}`,
                        }}
                        initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
                        animate={
                          !shouldAnimate
                            ? undefined
                            : {
                                opacity: spotlightTech?.name === tech.name ? 1 : 0.88,
                                scale: spotlightTech?.name === tech.name ? 1.28 : 1,
                              }
                        }
                        transition={{ duration: 0.28, delay: tech.delay }}
                      />

                      <motion.button
                        type="button"
                        aria-label={`Focus ${tech.name}`}
                        onMouseEnter={() => setSpotlightTechName(tech.name)}
                        onFocus={() => setSpotlightTechName(tech.name)}
                        onClick={() => setSpotlightTechName(tech.name)}
                        className={cn(
                          "absolute z-20 rounded-full border px-2 py-0.5 text-[9px] font-medium shadow-[0_14px_30px_hsl(var(--glass-shadow)/0.12)] backdrop-blur-xl transition-all duration-300 sm:px-2.5 sm:py-1 sm:text-[10px]",
                          isCompactSkillMap ? compactNodePlacementClassName[tech.labelPlacement] : nodePlacementClassName[tech.labelPlacement],
                          spotlightTech?.name === tech.name
                            ? "border-transparent text-foreground shadow-[0_18px_34px_hsl(var(--glass-shadow)/0.18)]"
                            : "border-border/55 text-foreground/90 hover:border-foreground/25 dark:border-white/10 dark:hover:border-white/18"
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
                          !shouldAnimate
                            ? undefined
                            : {
                                opacity: 1,
                                scale: spotlightTech?.name === tech.name ? 1.05 : 1,
                                y: [0, -4, 0],
                              }
                        }
                        whileHover={reduceMotion ? undefined : { scale: spotlightTech?.name === tech.name ? 1.05 : 1.02, y: -2 }}
                        transition={{
                          opacity: { duration: 0.28, delay: tech.delay },
                          scale: { duration: 0.24 },
                          y: { duration: tech.duration, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: tech.delay },
                        }}
                      >
                        <span
                          className="absolute -inset-[1px] rounded-full opacity-0 blur-md transition-opacity duration-300"
                          style={{
                            background: `radial-gradient(circle, ${nodeMeta[tech.tier].glow} 0%, transparent 72%)`,
                            opacity: spotlightTech?.name === tech.name ? 0.7 : 0,
                          }}
                        />
                        <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap sm:gap-2">
                          <span
                            className={cn("rounded-full", nodeMeta[tech.tier].dotClassName)}
                            style={{ backgroundColor: nodeMeta[tech.tier].glow }}
                          />
                          {tech.name}
                        </span>
                      </motion.button>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-2.5 rounded-[1.05rem] border border-border/45 bg-background/20 px-3 py-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    <Sparkles className="h-4 w-4" />
                    Selected Skill
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <div className="text-sm font-semibold tracking-tight">{spotlightTech.name}</div>
                    <Badge
                      variant="outline"
                      className="rounded-full border-border/55 bg-background/68 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] dark:border-white/10 dark:bg-background/30"
                    >
                      {activeCluster.shortLabel}
                    </Badge>
                  </div>
                </div>

                <div className="min-w-0 lg:max-w-[60%]">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Linked projects
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {featuredProjects.map((project) => (
                      <Badge
                        key={project}
                        variant="secondary"
                        className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]"
                      >
                        {project}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <ScrollTabsSection
      id="skills"
      className="pt-20"
      heading={
        <SectionHeading
          eyebrow="Skills"
          title="How my skills connect and what keeps me curious"
          description="The skills tab maps how my stack comes together in real projects. The passions tab shows the interests outside software that keep the work creative, balanced, and human."
        />
      }
      items={[
        {
          value: "skills",
          label: "Skills",
          content: stackMapContent,
          scrollWeight: 1.45,
        },
        {
          value: "passions",
          label: "Passions",
          content: <Passions />,
          scrollWeight: 0.8,
        },
      ]}
      panelsPerTab={0.9}
      listClassName="max-w-md grid-cols-2"
      contentClassName="mt-0"
    />
  )
}
