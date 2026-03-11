import Image from "next/image"
import { useId, useState } from "react"
import { Sparkles } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"

import AnimatedSection from "@/components/portfolio/AnimatedSection"
import { passions } from "@/components/portfolio/data"
import type { Passion } from "@/components/portfolio/types"
import SectionHeading from "@/components/portfolio/SectionHeading"
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

const particleSpecs = [
  { x: 8, y: 20, size: 4, opacity: 0.55, driftX: 12, driftY: -10, duration: 14, delay: 0.2 },
  { x: 14, y: 78, size: 5, opacity: 0.42, driftX: 10, driftY: -14, duration: 16, delay: 0.7 },
  { x: 22, y: 12, size: 3, opacity: 0.6, driftX: -8, driftY: 8, duration: 12, delay: 0.1 },
  { x: 28, y: 54, size: 4, opacity: 0.45, driftX: 14, driftY: -4, duration: 15, delay: 0.9 },
  { x: 36, y: 30, size: 6, opacity: 0.28, driftX: -12, driftY: -8, duration: 17, delay: 0.4 },
  { x: 44, y: 78, size: 3, opacity: 0.58, driftX: 9, driftY: 11, duration: 13, delay: 0.8 },
  { x: 58, y: 16, size: 4, opacity: 0.52, driftX: 8, driftY: -10, duration: 16, delay: 0.35 },
  { x: 62, y: 42, size: 5, opacity: 0.34, driftX: -10, driftY: 9, duration: 18, delay: 0.55 },
  { x: 70, y: 12, size: 3, opacity: 0.5, driftX: -7, driftY: 12, duration: 15, delay: 0.95 },
  { x: 78, y: 58, size: 4, opacity: 0.46, driftX: 12, driftY: -8, duration: 14, delay: 0.25 },
  { x: 86, y: 24, size: 6, opacity: 0.3, driftX: -8, driftY: 6, duration: 17, delay: 0.65 },
  { x: 90, y: 76, size: 4, opacity: 0.5, driftX: -10, driftY: -10, duration: 16, delay: 0.15 },
] as const

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
  const activePassion = nodeLookup[activeTitle] ?? mindmapNodes[0]
  const ActiveIcon = activePassion.icon
  const svgId = useId().replace(/:/g, "")
  const connectionGradientId = `${svgId}-mindmap-connection`
  const linkGlowId = `${svgId}-mindmap-glow`

  return (
    <AnimatedSection id="passions" className="relative z-30 mb-16 pt-16" delay={0.03}>
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-6 h-28 bg-[radial-gradient(circle_at_center,hsl(var(--spotlight)/0.18),transparent_68%)] blur-3xl"
        animate={reduceMotion ? undefined : { opacity: [0.36, 0.76, 0.36], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <SectionHeading
        eyebrow="Beyond Coding"
        title="The interests that shape how I think"
        description="A living mindmap of the interests that keep me curious, balanced, and creatively sharp outside software."
        align="center"
      />

      <div className="relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-[linear-gradient(135deg,hsl(var(--background)/0.92),hsl(var(--background)/0.68))] p-4 shadow-[0_28px_90px_hsl(var(--foreground)/0.12)] backdrop-blur-2xl sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-80 [background-image:radial-gradient(circle_at_18%_16%,hsl(var(--spotlight)/0.18),transparent_24%),radial-gradient(circle_at_82%_18%,hsl(var(--spotlight-secondary)/0.16),transparent_22%),radial-gradient(circle_at_50%_88%,hsl(var(--primary)/0.1),transparent_28%)]" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, hsl(var(--foreground) / 0.05) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground) / 0.05) 1px, transparent 1px)",
              backgroundSize: "34px 34px",
              maskImage: "radial-gradient(circle at center, black 45%, transparent 100%)",
            }}
          />
          <motion.div
            className="absolute -left-8 top-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,hsl(var(--spotlight)/0.28),transparent_72%)] blur-3xl"
            animate={reduceMotion ? undefined : { x: [0, 26, 0], y: [0, 18, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-8 bottom-6 h-44 w-44 rounded-full bg-[radial-gradient(circle,hsl(var(--spotlight-secondary)/0.24),transparent_70%)] blur-3xl"
            animate={reduceMotion ? undefined : { x: [0, -22, 0], y: [0, -14, 0], scale: [1, 1.06, 1] }}
            transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
        </div>

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
          <div className="relative min-h-[32rem] overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-[linear-gradient(155deg,hsl(var(--background)/0.7),hsl(var(--background)/0.24))] p-4 sm:min-h-[36rem] sm:p-6 lg:min-h-[40rem]">
            <div className="absolute left-4 top-4 z-30 flex flex-wrap gap-2 sm:left-6 sm:top-6">
              <Badge
                variant="outline"
                className="rounded-full border-foreground/10 bg-background/65 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Live interest graph
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full border-foreground/10 bg-background/55 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl"
              >
                {mindmapNodes.length} nodes
              </Badge>
            </div>

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/10"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-foreground/10"
                animate={reduceMotion ? undefined : { rotate: -360 }}
                transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0deg,hsl(var(--spotlight)/0.14)_55deg,transparent_120deg,hsl(var(--spotlight-secondary)/0.1)_180deg,transparent_245deg)] blur-3xl"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              />

              {particleSpecs.map((particle, index) => (
                <motion.span
                  key={`passion-particle-${index}`}
                  className="absolute rounded-full bg-foreground/80 shadow-[0_0_16px_hsl(var(--spotlight)/0.38)]"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: particle.size,
                    height: particle.size,
                    opacity: particle.opacity,
                  }}
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          x: [0, particle.driftX, 0],
                          y: [0, particle.driftY, 0],
                          scale: [0.7, 1.25, 0.7],
                          opacity: [particle.opacity * 0.45, particle.opacity, particle.opacity * 0.45],
                        }
                  }
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
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
                        reduceMotion
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
                    width: `${11 + ring * 3.5}rem`,
                    height: `${11 + ring * 3.5}rem`,
                    marginLeft: `${-(11 + ring * 3.5) / 2}rem`,
                    marginTop: `${-(11 + ring * 3.5) / 2}rem`,
                  }}
                  animate={reduceMotion ? undefined : { scale: [0.94, 1.04, 0.94], opacity: [0.12, 0.4, 0.12] }}
                  transition={{
                    duration: 5 + ring * 1.2,
                    delay: ring * 0.45,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}

              <motion.div
                className="relative flex h-32 w-32 flex-col items-center justify-center rounded-full border border-foreground/12 bg-[radial-gradient(circle_at_30%_25%,hsl(var(--spotlight)/0.22),transparent_42%),linear-gradient(145deg,hsl(var(--background)/0.92),hsl(var(--background)/0.68))] px-4 text-center shadow-[0_0_0_1px_hsl(var(--foreground)/0.03),0_24px_60px_hsl(var(--foreground)/0.2)] sm:h-36 sm:w-36 lg:h-44 lg:w-44"
                animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [0, 1.4, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground sm:text-[11px]">
                  Curiosity core
                </div>
                <div className="font-display text-lg font-semibold tracking-[-0.05em] text-foreground sm:text-xl lg:text-2xl">
                  Beyond
                  <br />
                  Coding
                </div>
                <div className="mt-2 text-[10px] leading-4 text-muted-foreground sm:text-[11px]">
                  Hover a node to surface the story behind it.
                </div>
              </motion.div>
            </div>

            {mindmapNodes.map((node) => {
              const isActive = activePassion.title === node.title
              const Icon = node.icon

              return (
                <motion.div
                  key={node.title}
                  className="absolute z-30 -translate-x-1/2 -translate-y-1/2 will-change-transform"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  animate={reduceMotion ? undefined : { x: [0, node.driftX, 0], y: [0, node.driftY, 0] }}
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
                    whileHover={reduceMotion ? undefined : { scale: 1.08, y: -4 }}
                    whileTap={{ scale: 0.96 }}
                    className={`group relative flex h-14 w-14 items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-300 sm:h-16 sm:w-16 lg:h-[4.5rem] lg:w-[4.5rem] ${
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
                      animate={reduceMotion ? undefined : { scale: isActive ? [1, 1.16, 1] : [1, 1.08, 1], opacity: isActive ? [0.2, 0.55, 0.2] : [0.12, 0.28, 0.12] }}
                      transition={{
                        duration: isActive ? 2.6 : 3.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-foreground/6 text-foreground sm:h-10 sm:w-10">
                      <Icon className="h-4 w-4 sm:h-[1.1rem] sm:w-[1.1rem]" />
                    </span>
                    <span
                      className={`pointer-events-none absolute left-1/2 top-full mt-3 w-max max-w-[8rem] -translate-x-1/2 rounded-2xl border border-foreground/10 bg-background/88 px-3 py-1.5 text-center text-[10px] font-medium leading-tight text-foreground shadow-[0_10px_24px_hsl(var(--foreground)/0.16)] backdrop-blur-xl transition-all duration-300 sm:max-w-[9.5rem] sm:text-[11px] ${
                        isActive ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                      }`}
                    >
                      {node.title}
                    </span>
                  </motion.button>
                </motion.div>
              )
            })}

            <div className="pointer-events-none absolute bottom-4 left-4 z-30 rounded-full border border-foreground/10 bg-background/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground backdrop-blur-xl sm:bottom-6 sm:left-6">
              Orbit, hover, explore
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-[linear-gradient(160deg,hsl(var(--background)/0.82),hsl(var(--background)/0.5))] p-4 shadow-[0_24px_70px_hsl(var(--foreground)/0.14)] backdrop-blur-xl sm:p-5 lg:min-h-[40rem] lg:p-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/25 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-full bg-[radial-gradient(circle,hsl(var(--spotlight)/0.16),transparent_72%)] blur-3xl" />

            <div className="relative flex h-full flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                    Selected node
                  </div>
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.05em] text-foreground sm:text-[2rem]">
                    {activePassion.title}
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-foreground/10 bg-background/72 shadow-[0_14px_30px_hsl(var(--foreground)/0.12)]">
                  <ActiveIcon className="h-5 w-5" />
                </div>
              </div>

              <motion.div
                key={activePassion.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full flex-col gap-4"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-background/50">
                  <Image
                    src={activePassion.imageSrc}
                    alt={activePassion.title}
                    fill
                    sizes="(max-width: 1279px) 100vw, 30vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,hsl(var(--background)/0.88),transparent_48%)]" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/70">
                        Beyond coding
                      </div>
                      <div className="text-sm font-medium text-foreground">What keeps the energy high</div>
                    </div>
                    <Badge
                      variant="outline"
                      className="rounded-full border-white/12 bg-background/72 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/85 backdrop-blur-xl"
                    >
                      Active
                    </Badge>
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-foreground/10 bg-background/45 p-4 shadow-[inset_0_1px_0_hsl(var(--foreground)/0.04)]">
                  <p className="text-sm leading-7 text-muted-foreground sm:text-[15px]">
                    {activePassion.description}
                  </p>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                    Jump to another node
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mindmapNodes.map((node) => (
                      <button
                        key={`chip-${node.title}`}
                        type="button"
                        onClick={() => setActiveTitle(node.title)}
                        className={`rounded-full border px-3 py-1.5 text-xs transition-all duration-200 ${
                          node.title === activePassion.title
                            ? "border-foreground/20 bg-foreground/8 text-foreground shadow-[0_10px_24px_hsl(var(--foreground)/0.08)]"
                            : "border-foreground/10 bg-background/50 text-muted-foreground hover:border-foreground/16 hover:bg-background/70 hover:text-foreground"
                        }`}
                      >
                        {node.title}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
