import Image from "next/image"
import { useId, useState } from "react"
import { Sparkles } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"

import { passions } from "@/components/portfolio/data"
import { useNearViewport } from "@/components/portfolio/useNearViewport"
import type { Passion } from "@/components/portfolio/types"
import { Badge } from "@/components/ui/badge"

type MindmapLayout = {
  x: number
  y: number
  driftX: number
  driftY: number
  duration: number
  delay: number
}

type MindmapNode = Passion & MindmapLayout

const passionLayout: Record<string, MindmapLayout> = {
  Reading: { x: 18, y: 18, driftX: -6, driftY: -10, duration: 12, delay: 0.2 },
  "Water Sports": { x: 46, y: 10, driftX: 7, driftY: -8, duration: 15, delay: 0.4 },
  "Snow Skiing": { x: 76, y: 18, driftX: 6, driftY: -9, duration: 14, delay: 0.8 },
  "Software Development": { x: 86, y: 42, driftX: 8, driftY: 5, duration: 16, delay: 0.6 },
  Volunteering: { x: 78, y: 72, driftX: 6, driftY: 9, duration: 13, delay: 0.1 },
  "The Legend of Zelda": { x: 53, y: 88, driftX: -4, driftY: 8, duration: 15, delay: 0.5 },
  Music: { x: 26, y: 82, driftX: -7, driftY: 6, duration: 14, delay: 0.9 },
  "Family & Friends": { x: 12, y: 64, driftX: -5, driftY: 7, duration: 13, delay: 0.3 },
  Running: { x: 14, y: 40, driftX: -8, driftY: 4, duration: 15, delay: 0.7 },
  "Graphic Design": { x: 30, y: 22, driftX: -6, driftY: -7, duration: 11, delay: 0.45 },
  Movies: { x: 88, y: 26, driftX: 5, driftY: -6, duration: 12, delay: 0.95 },
  Food: { x: 68, y: 82, driftX: 5, driftY: 7, duration: 14, delay: 0.25 },
}

const crossLinks = [
  ["Reading", "Music"],
  ["Running", "Water Sports"],
  ["Graphic Design", "Software Development"],
  ["Family & Friends", "Volunteering"],
  ["Movies", "The Legend of Zelda"],
  ["Food", "Family & Friends"],
] as const

const defaultLayout: MindmapLayout = {
  x: 50,
  y: 50,
  driftX: 0,
  driftY: 0,
  duration: 12,
  delay: 0,
}

const mindmapNodes: MindmapNode[] = passions.map((passion) => ({
  ...passion,
  ...(passionLayout[passion.title] ?? defaultLayout),
}))

const nodeLookup = Object.fromEntries(mindmapNodes.map((node) => [node.title, node])) as Record<string, MindmapNode>

export default function Passions() {
  const reduceMotion = useReducedMotion()
  const [activeTitle, setActiveTitle] = useState("Software Development")
  const { ref: sectionRef, isNearViewport } = useNearViewport<HTMLDivElement>({ rootMargin: "280px 0px" })
  const shouldAnimate = !reduceMotion && isNearViewport
  const activePassion = nodeLookup[activeTitle] ?? mindmapNodes[0]
  const ActiveIcon = activePassion.icon
  const svgId = useId().replace(/:/g, "")
  const connectionGradientId = `${svgId}-mindmap-connection`
  const linkGlowId = `${svgId}-mindmap-glow`

  return (
    <div ref={sectionRef} className="relative z-30">
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-4 sm:p-5 lg:p-6">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_18%_16%,hsl(var(--spotlight)/0.12),transparent_28%),radial-gradient(circle_at_82%_18%,hsl(var(--spotlight-secondary)/0.1),transparent_26%)]" />

        <div className="relative mb-4 max-w-3xl">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="section-eyebrow">Beyond Coding</div>
            <span className="text-[11px] text-muted-foreground">{mindmapNodes.length} interest nodes</span>
          </div>
          <h3 className="text-[1.3rem] font-semibold tracking-[-0.04em] md:text-[1.55rem]">
            The interests that shape how I think
          </h3>
          <p className="mt-1.5 max-w-2xl text-sm leading-5 text-muted-foreground">
            A live map of the interests that keep the work creative, balanced, and personal outside software.
          </p>
        </div>

        <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.8fr)] xl:gap-5">
          <div className="relative min-h-[23rem] overflow-hidden rounded-2xl border border-border/80 bg-card p-4 sm:min-h-[25rem] sm:p-5 lg:min-h-[27rem]">
            <div className="absolute left-4 top-4 z-30 flex flex-wrap gap-2 sm:left-6 sm:top-6">
              <Badge
                variant="outline"
                className="border-border/70 text-muted-foreground"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Live interest graph
              </Badge>
              <Badge
                variant="outline"
                className="border-border/70 text-muted-foreground"
              >
                {mindmapNodes.length} nodes
              </Badge>
            </div>

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/60" />
              <div className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border/50" />
            </div>

            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id={connectionGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--spotlight) / 0.1)" />
                  <stop offset="45%" stopColor="hsl(var(--spotlight) / 0.55)" />
                  <stop offset="100%" stopColor="hsl(var(--spotlight-secondary) / 0.16)" />
                </linearGradient>
                <radialGradient id={linkGlowId}>
                  <stop offset="0%" stopColor="hsl(var(--spotlight) / 0.5)" />
                  <stop offset="100%" stopColor="hsl(var(--spotlight) / 0)" />
                </radialGradient>
              </defs>

              {crossLinks.map(([fromTitle, toTitle]) => {
                const fromNode = nodeLookup[fromTitle]
                const toNode = nodeLookup[toTitle]

                return (
                  <motion.line
                    key={`${fromTitle}-${toTitle}`}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="hsl(var(--foreground) / 0.12)"
                    strokeWidth="0.7"
                    strokeDasharray="2 6"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.45 }}
                    transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  />
                )
              })}

              {mindmapNodes.map((node) => {
                const isActive = activePassion.title === node.title

                return (
                  <g key={node.title}>
                    <motion.line
                      x1="50"
                      y1="50"
                      x2={node.x}
                      y2={node.y}
                      stroke={`url(#${connectionGradientId})`}
                      strokeWidth={isActive ? 1.45 : 1.05}
                      strokeLinecap="round"
                      strokeDasharray={isActive ? "0 0" : "3 6"}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={
                        !shouldAnimate
                          ? { pathLength: 1, opacity: isActive ? 0.92 : 0.34 }
                          : {
                              pathLength: 1,
                              opacity: isActive ? [0.35, 0.95, 0.35] : [0.14, 0.42, 0.14],
                            }
                      }
                      transition={{
                        pathLength: {
                          duration: 0.85,
                          delay: node.delay * 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        },
                        opacity: reduceMotion
                          ? { duration: 0 }
                          : !shouldAnimate
                          ? { duration: 0 }
                          : {
                              duration: isActive ? 2.8 : 4.6,
                              delay: node.delay,
                              repeat: Infinity,
                              ease: "easeInOut",
                            },
                      }}
                    />
                    <circle cx={node.x} cy={node.y} r={isActive ? 3.4 : 2.1} fill={`url(#${linkGlowId})`} opacity={isActive ? 0.9 : 0.35} />
                  </g>
                )
              })}
            </svg>

            <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
              {[0, 1, 2].map((ring) => (
                <motion.span
                  key={`mindmap-ring-${ring}`}
                  className="absolute left-1/2 top-1/2 rounded-full border border-foreground/10"
                  style={{
                    width: `${7.5 + ring * 2.8}rem`,
                    height: `${7.5 + ring * 2.8}rem`,
                    marginLeft: `${-(7.5 + ring * 2.8) / 2}rem`,
                    marginTop: `${-(7.5 + ring * 2.8) / 2}rem`,
                  }}
                  animate={shouldAnimate ? { scale: [0.94, 1.04, 0.94], opacity: [0.12, 0.4, 0.12] } : undefined}
                  transition={{
                    duration: 5 + ring * 1.2,
                    delay: ring * 0.45,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}

              <motion.div
                className="relative flex h-[4.5rem] w-[4.5rem] flex-col items-center justify-center rounded-full border border-foreground/12 bg-[radial-gradient(circle_at_30%_25%,hsl(var(--spotlight)/0.22),transparent_42%),linear-gradient(145deg,hsl(var(--background)/0.92),hsl(var(--background)/0.68))] px-2 text-center shadow-[0_0_0_1px_hsl(var(--foreground)/0.03),0_20px_46px_hsl(var(--foreground)/0.18)] sm:h-[5.1rem] sm:w-[5.1rem] lg:h-[5.7rem] lg:w-[5.7rem]"
                animate={shouldAnimate ? { y: [0, -6, 0], rotate: [0, 1.2, 0] } : undefined}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="mb-1 font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[9px]">
                  Curiosity core
                </div>
                <div className="font-display text-[13px] font-semibold leading-4 tracking-[-0.05em] text-foreground sm:text-[15px] lg:text-[17px]">
                  Beyond
                  <br />
                  Coding
                </div>
                <div className="mt-1 text-[8px] leading-3 text-muted-foreground sm:text-[9px]">
                  Hover
                </div>
              </motion.div>
            </div>

            {mindmapNodes.map((node) => {
              const isActive = activePassion.title === node.title
              const Icon = node.icon

              return (
                <motion.div
                  key={node.title}
                  className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  animate={shouldAnimate ? { x: [0, node.driftX, 0], y: [0, node.driftY, 0] } : undefined}
                  transition={{
                    duration: node.duration,
                    delay: node.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <motion.button
                    type="button"
                    aria-label={node.title}
                    aria-pressed={isActive}
                    onMouseEnter={() => setActiveTitle(node.title)}
                    onFocus={() => setActiveTitle(node.title)}
                    onClick={() => setActiveTitle(node.title)}
                    whileHover={reduceMotion ? undefined : { scale: 1.06, y: -3 }}
                    whileTap={{ scale: 0.96 }}
                    className={`group relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 sm:h-11 sm:w-11 lg:h-[3rem] lg:w-[3rem] ${
                      isActive
                        ? "border-foreground/25 bg-background/88 shadow-[0_0_0_1px_hsl(var(--foreground)/0.06),0_16px_42px_hsl(var(--foreground)/0.24)]"
                        : "border-foreground/10 bg-background/62 shadow-[0_0_0_1px_hsl(var(--foreground)/0.03),0_12px_30px_hsl(var(--foreground)/0.12)] hover:border-foreground/20 hover:bg-background/75"
                    }`}
                  >
                    <span
                      className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                        isActive ? "opacity-100" : "opacity-70"
                      } bg-[radial-gradient(circle_at_30%_30%,hsl(var(--spotlight)/0.32),transparent_40%),linear-gradient(145deg,hsl(var(--background)/0.86),hsl(var(--background)/0.54))]`}
                    />
                    <motion.span
                      className="absolute inset-0 rounded-full border border-foreground/10"
                      animate={shouldAnimate ? { scale: isActive ? [1, 1.16, 1] : [1, 1.08, 1], opacity: isActive ? [0.2, 0.55, 0.2] : [0.12, 0.28, 0.12] } : undefined}
                      transition={{
                        duration: isActive ? 2.6 : 3.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/6 text-foreground sm:h-7 sm:w-7">
                      <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </span>
                    <span
                      className={`pointer-events-none absolute left-1/2 top-full mt-2 w-max max-w-[6.25rem] -translate-x-1/2 rounded-2xl border border-foreground/10 bg-background/88 px-2 py-1 text-center text-[8px] font-medium leading-tight text-foreground shadow-[0_10px_24px_hsl(var(--foreground)/0.16)] transition-all duration-300 sm:max-w-[7rem] sm:text-[9px] ${
                        isActive ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                      }`}
                    >
                      {node.title}
                    </span>
                  </motion.button>
                </motion.div>
              )
            })}

            <div className="pointer-events-none absolute bottom-4 left-4 z-30 rounded-lg border border-border/70 bg-card px-3 py-1.5 text-[11px] text-muted-foreground sm:bottom-6 sm:left-6">
              Orbit, hover, explore
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-4 sm:p-5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/25 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-full bg-[radial-gradient(circle,hsl(var(--spotlight)/0.16),transparent_72%)]" />

            <div className="relative flex h-full flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                    Selected node
                  </div>
                  <h3 className="font-display text-[1.6rem] font-semibold tracking-[-0.05em] text-foreground sm:text-[1.8rem]">
                    {activePassion.title}
                  </h3>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-foreground/10 bg-background/72 shadow-[0_14px_30px_hsl(var(--foreground)/0.12)]">
                  <ActiveIcon className="h-4.5 w-4.5" />
                </div>
              </div>

              <motion.div
                key={activePassion.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full flex-col gap-3"
              >
                <div className="relative aspect-[1.5/1] overflow-hidden rounded-[1.35rem] border border-foreground/10 bg-background/50">
                  <Image
                    src={activePassion.imageSrc}
                    alt={activePassion.title}
                    fill
                    sizes="(max-width: 1279px) 100vw, 30vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,hsl(var(--background)/0.88),transparent_48%)]" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-3">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/70">
                        Beyond coding
                      </div>
                      <div className="text-sm font-medium text-foreground">What keeps the energy high</div>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>

                <div className="rounded-[1.25rem] border border-foreground/10 bg-background/45 p-3.5 shadow-[inset_0_1px_0_hsl(var(--foreground)/0.04)]">
                  <p className="text-sm leading-6 text-muted-foreground">
                    {activePassion.description}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
