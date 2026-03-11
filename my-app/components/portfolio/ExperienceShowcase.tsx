"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"

import type { ExperienceEntry } from "@/components/portfolio/types"
import { clamp as clampProgress, getSectionScrollProgress, scrollToSectionProgress } from "@/components/portfolio/utils"
import { useMediaQuery } from "@/components/portfolio/useMediaQuery"
import { useNearViewport } from "@/components/portfolio/useNearViewport"
import { useScrollFrameSync } from "@/components/portfolio/useScrollFrameSync"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

type ParticleDensityMode = "standard" | "depth"

type RgbColor = {
  r: number
  g: number
  b: number
}

type LogoParticle = {
  baseX: number
  baseY: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  stretch: number
  rotation: number
  alpha: number
  color: RgbColor
  shimmer: number
  seed: number
  driftX: number
  driftY: number
}

const PANELS_PER_ENTRY = 0.9
const PARTICLE_SOURCE_SIZE = 240
const MAX_PARTICLES_STANDARD = 1200
const MAX_PARTICLES_DEPTH = 2200
const CONTENT_TRANSITION = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1],
} as const

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function hslToRgb(h: number, s: number, l: number): RgbColor {
  const hue = ((h % 360) + 360) % 360
  const chroma = (1 - Math.abs(2 * l - 1)) * s
  const segment = hue / 60
  const x = chroma * (1 - Math.abs((segment % 2) - 1))
  let red = 0
  let green = 0
  let blue = 0

  if (segment >= 0 && segment < 1) {
    red = chroma
    green = x
  } else if (segment >= 1 && segment < 2) {
    red = x
    green = chroma
  } else if (segment >= 2 && segment < 3) {
    green = chroma
    blue = x
  } else if (segment >= 3 && segment < 4) {
    green = x
    blue = chroma
  } else if (segment >= 4 && segment < 5) {
    red = x
    blue = chroma
  } else {
    red = chroma
    blue = x
  }

  const match = l - chroma / 2

  return {
    r: Math.round((red + match) * 255),
    g: Math.round((green + match) * 255),
    b: Math.round((blue + match) * 255),
  }
}

function parseAccentColor(source: string | undefined, fallback: string): RgbColor {
  const [h = 0, s = 0, l = 0] = (source ?? fallback)
    .replace(/%/g, "")
    .trim()
    .split(/\s+/)
    .map((value) => Number(value))

  return hslToRgb(h, s / 100, l / 100)
}

function mixRgb(base: RgbColor, overlay: RgbColor, amount: number): RgbColor {
  const mixAmount = clamp(amount, 0, 1)

  return {
    r: Math.round(base.r + (overlay.r - base.r) * mixAmount),
    g: Math.round(base.g + (overlay.g - base.g) * mixAmount),
    b: Math.round(base.b + (overlay.b - base.b) * mixAmount),
  }
}

function rgba(color: RgbColor, alpha: number) {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
}

function drawAmbientGlow(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: RgbColor,
  alpha: number
) {
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius)
  gradient.addColorStop(0, rgba(color, alpha))
  gradient.addColorStop(0.5, rgba(color, alpha * 0.28))
  gradient.addColorStop(1, rgba(color, 0))

  context.fillStyle = gradient
  context.beginPath()
  context.arc(x, y, radius, 0, Math.PI * 2)
  context.fill()
}

function buildFallbackLabel(entry: ExperienceEntry) {
  const initials =
    entry.logoText ??
    entry.title
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 4)
      .toUpperCase()

  return initials || "XP"
}

function LogoParticleField({
  entry,
  isActive,
  densityMode,
}: {
  entry: ExperienceEntry
  isActive: boolean
  densityMode: ParticleDensityMode
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const particlesRef = useRef<LogoParticle[]>([])
  const frameRef = useRef<number>()
  const sizeRef = useRef({ width: 0, height: 0 })
  const mouseRef = useRef({
    x: 0,
    y: 0,
    active: false,
    pressed: false,
  })
  const reduceMotion = useReducedMotion()
  const { ref: nearViewportRef, isNearViewport } = useNearViewport<HTMLDivElement>({ rootMargin: "240px 0px" })
  const shouldAnimate = !reduceMotion && isNearViewport && isActive

  const accentColor = useMemo(() => parseAccentColor(entry.accent, "228 88% 64%"), [entry.accent])
  const accentSecondaryColor = useMemo(
    () => parseAccentColor(entry.accentSecondary, "193 92% 63%"),
    [entry.accentSecondary]
  )
  const accentTertiaryColor = useMemo(
    () => parseAccentColor(entry.accentTertiary, entry.accentSecondary ?? "193 92% 63%"),
    [entry.accentSecondary, entry.accentTertiary]
  )

  const buildParticles = useCallback(
    (image: HTMLImageElement | null) => {
      const { width, height } = sizeRef.current

      if (width <= 0 || height <= 0 || typeof document === "undefined") {
        particlesRef.current = []
        return
      }

      const sourceCanvas = document.createElement("canvas")
      sourceCanvas.width = PARTICLE_SOURCE_SIZE
      sourceCanvas.height = PARTICLE_SOURCE_SIZE
      const sourceContext = sourceCanvas.getContext("2d")

      if (!sourceContext) {
        particlesRef.current = []
        return
      }

      sourceContext.clearRect(0, 0, PARTICLE_SOURCE_SIZE, PARTICLE_SOURCE_SIZE)

      if (image && image.naturalWidth > 0 && image.naturalHeight > 0) {
        const maxDrawWidth = PARTICLE_SOURCE_SIZE * 0.82
        const maxDrawHeight = PARTICLE_SOURCE_SIZE * 0.82
        const scale = Math.min(maxDrawWidth / image.naturalWidth, maxDrawHeight / image.naturalHeight)
        const drawWidth = image.naturalWidth * scale
        const drawHeight = image.naturalHeight * scale

        sourceContext.drawImage(
          image,
          (PARTICLE_SOURCE_SIZE - drawWidth) / 2,
          (PARTICLE_SOURCE_SIZE - drawHeight) / 2,
          drawWidth,
          drawHeight
        )
      } else {
        const fallbackLabel = buildFallbackLabel(entry)
        sourceContext.fillStyle = "#ffffff"
        sourceContext.textAlign = "center"
        sourceContext.textBaseline = "middle"
        sourceContext.font = `700 ${fallbackLabel.length > 3 ? 36 : 54}px system-ui`
        sourceContext.fillText(fallbackLabel, PARTICLE_SOURCE_SIZE / 2, PARTICLE_SOURCE_SIZE / 2)
      }

      const imageData = sourceContext.getImageData(0, 0, PARTICLE_SOURCE_SIZE, PARTICLE_SOURCE_SIZE).data
      const rawPoints: Array<{
        x: number
        y: number
        alpha: number
        color: RgbColor
      }> = []
      let minX = PARTICLE_SOURCE_SIZE
      let minY = PARTICLE_SOURCE_SIZE
      let maxX = 0
      let maxY = 0
      const samplingStep = image ? 1 : 2

      for (let y = 0; y < PARTICLE_SOURCE_SIZE; y += samplingStep) {
        for (let x = 0; x < PARTICLE_SOURCE_SIZE; x += samplingStep) {
          const pixelIndex = (y * PARTICLE_SOURCE_SIZE + x) * 4
          const alpha = imageData[pixelIndex + 3]

          if (alpha < 18) {
            continue
          }

          rawPoints.push({
            x,
            y,
            alpha: alpha / 255,
            color: {
              r: imageData[pixelIndex],
              g: imageData[pixelIndex + 1],
              b: imageData[pixelIndex + 2],
            },
          })
          minX = Math.min(minX, x)
          minY = Math.min(minY, y)
          maxX = Math.max(maxX, x)
          maxY = Math.max(maxY, y)
        }
      }

      if (!rawPoints.length) {
        particlesRef.current = []
        return
      }

      const maxParticles = densityMode === "depth" ? MAX_PARTICLES_DEPTH : MAX_PARTICLES_STANDARD
      const particleLimit = reduceMotion ? Math.min(maxParticles / 2, rawPoints.length) : Math.min(maxParticles, rawPoints.length)
      const takeEvery = Math.max(1, Math.ceil(rawPoints.length / particleLimit))
      const logoWidth = Math.max(maxX - minX + 1, 1)
      const logoHeight = Math.max(maxY - minY + 1, 1)
      const scale = Math.min((width * 0.84) / logoWidth, (height * 0.82) / logoHeight)
      const centerSourceX = minX + logoWidth / 2
      const centerSourceY = minY + logoHeight / 2
      const accentBlend = mixRgb(accentColor, accentSecondaryColor, 0.45)

      particlesRef.current = rawPoints.filter((_, index) => index % takeEvery === 0).map((point, index) => {
        const pointLuminance = point.color.r + point.color.g + point.color.b
        const blendedColor = mixRgb(point.color, accentBlend, pointLuminance < 36 ? 0.74 : 0.2)
        const baseX = width / 2 + (point.x - centerSourceX) * scale
        const baseY = height / 2 + (point.y - centerSourceY) * scale

        return {
          baseX,
          baseY,
          x: baseX + (Math.random() - 0.5) * 8,
          y: baseY + (Math.random() - 0.5) * 8,
          vx: 0,
          vy: 0,
          radius: clamp(0.72 + point.alpha * 1.08, 0.68, 1.85),
          stretch: 1.05 + Math.random() * 1.85,
          rotation: Math.random() * Math.PI,
          alpha: clamp(0.22 + point.alpha * 0.58, 0.22, 0.86),
          color: blendedColor,
          shimmer: 0.6 + Math.random() * 1.1,
          seed: index * 0.17 + point.x * 0.03 + point.y * 0.02,
          driftX: 1.6 + Math.random() * 4.2,
          driftY: 1.6 + Math.random() * 3.8,
        }
      })
    },
    [accentColor, accentSecondaryColor, densityMode, entry, reduceMotion]
  )

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current

    if (!container || !canvas) {
      return
    }

    const context = canvas.getContext("2d")

    if (!context) {
      return
    }

    let disposed = false

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect()
      const devicePixelRatio = window.devicePixelRatio || 1

      sizeRef.current = {
        width: rect.width,
        height: rect.height,
      }

      canvas.width = Math.max(1, Math.floor(rect.width * devicePixelRatio))
      canvas.height = Math.max(1, Math.floor(rect.height * devicePixelRatio))
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
      buildParticles(imageRef.current)
    }

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
    })
    resizeObserver.observe(container)

    if (entry.logoImageSrc) {
      const nextImage = new window.Image()
      nextImage.decoding = "async"
      nextImage.src = entry.logoImageSrc
      nextImage.onload = () => {
        if (disposed) {
          return
        }

        imageRef.current = nextImage
        resizeCanvas()
      }
      nextImage.onerror = () => {
        if (disposed) {
          return
        }

        imageRef.current = null
        resizeCanvas()
      }
    } else {
      imageRef.current = null
    }

    resizeCanvas()

    const renderFrame = (timestamp: number) => {
      if (disposed) {
        return
      }

      const { width, height } = sizeRef.current
      context.clearRect(0, 0, width, height)

      const time = shouldAnimate ? timestamp * 0.001 : 0
      const mouse = mouseRef.current
      const pointerBlendColor = mixRgb(accentSecondaryColor, accentTertiaryColor, 0.45)
      const foregroundGlassColor = mixRgb(
        mixRgb(mixRgb(accentColor, accentSecondaryColor, 0.52), accentTertiaryColor, 0.18),
        { r: 255, g: 255, b: 255 },
        0.46
      )

      drawAmbientGlow(
        context,
        width * 0.22 + (mouse.active ? (mouse.x - width / 2) * 0.015 : 0),
        height * 0.22,
        Math.min(width, height) * 0.32,
        accentColor,
        isActive ? 0.12 : 0.08
      )
      drawAmbientGlow(
        context,
        width * 0.79 + (mouse.active ? (mouse.x - width / 2) * 0.012 : 0),
        height * 0.76,
        Math.min(width, height) * 0.28,
        accentSecondaryColor,
        isActive ? 0.1 : 0.07
      )
      drawAmbientGlow(context, width * 0.58, height * 0.18, Math.min(width, height) * 0.18, accentTertiaryColor, isActive ? 0.05 : 0.03)

      if (shouldAnimate && mouse.active) {
        drawAmbientGlow(context, mouse.x, mouse.y, 86, pointerBlendColor, mouse.pressed ? 0.14 : 0.09)
      }

      const particles = particlesRef.current
      const interactionRadius = mouse.pressed ? 132 : 104
      const springStrength = isActive ? 0.044 : 0.036

      for (const particle of particles) {
        const driftX = shouldAnimate ? Math.sin(time * particle.shimmer + particle.seed) * particle.driftX * (isActive ? 1 : 0.55) : 0
        const driftY =
          shouldAnimate ? Math.cos(time * (particle.shimmer + 0.4) + particle.seed) * particle.driftY * (isActive ? 1 : 0.55) : 0
        const targetX = particle.baseX + driftX
        const targetY = particle.baseY + driftY

        if (!shouldAnimate) {
          particle.x = targetX
          particle.y = targetY
          particle.vx = 0
          particle.vy = 0
        }

        let forceX = 0
        let forceY = 0

        if (shouldAnimate && mouse.active) {
          const deltaX = particle.x - mouse.x
          const deltaY = particle.y - mouse.y
          const distance = Math.hypot(deltaX, deltaY) || 0.001

          if (distance < interactionRadius) {
            const falloff = (interactionRadius - distance) / interactionRadius
            const direction = mouse.pressed ? -1 : 1
            forceX += (deltaX / distance) * falloff * 1.12 * direction
            forceY += (deltaY / distance) * falloff * 1.12 * direction
          }
        }

        particle.vx += (targetX - particle.x) * springStrength + forceX
        particle.vy += (targetY - particle.y) * springStrength + forceY
        particle.vx *= shouldAnimate && mouse.active ? 0.82 : 0.86
        particle.vy *= shouldAnimate && mouse.active ? 0.82 : 0.86
        particle.x += particle.vx
        particle.y += particle.vy

        const pulse = shouldAnimate ? Math.sin(time * 2.1 + particle.seed) * 0.06 : 0
        const radius = Math.max(0.58, particle.radius + pulse)
        const shardWidth = radius * particle.stretch
        const shardHeight = Math.max(0.52, radius * 0.86)
        const rotation = particle.rotation + (shouldAnimate ? Math.sin(time * 0.75 + particle.seed) * 0.12 : 0)
        const glowRadius = Math.max(1.2, shardWidth * 1.45)
        const drawAlpha = Math.min(1, particle.alpha * 1.1)
        const highlightAlpha = Math.min(0.56, particle.alpha * 0.46)

        drawAmbientGlow(context, particle.x, particle.y, glowRadius, foregroundGlassColor, drawAlpha * 0.12)
        context.save()
        context.translate(particle.x, particle.y)
        context.rotate(rotation)
        context.fillStyle = rgba(foregroundGlassColor, drawAlpha)
        context.fillRect(-shardWidth / 2, -shardHeight / 2, shardWidth, shardHeight)
        context.fillStyle = `rgba(255,255,255,${highlightAlpha})`
        context.fillRect(-shardWidth / 2, -shardHeight / 2, shardWidth * 0.84, Math.max(0.32, shardHeight * 0.34))
        context.restore()
      }
    }

    const render = (timestamp: number) => {
      renderFrame(timestamp)

      if (shouldAnimate) {
        frameRef.current = window.requestAnimationFrame(render)
      }
    }

    renderFrame(0)

    if (shouldAnimate) {
      frameRef.current = window.requestAnimationFrame(render)
    }

    return () => {
      disposed = true
      resizeObserver.disconnect()
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [accentColor, accentSecondaryColor, accentTertiaryColor, buildParticles, entry.logoImageSrc, isActive, shouldAnimate])

  const updatePointerPosition = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()

    mouseRef.current.x = event.clientX - bounds.left
    mouseRef.current.y = event.clientY - bounds.top
    mouseRef.current.active = true
  }

  return (
    <div
      ref={(node) => {
        containerRef.current = node
        nearViewportRef.current = node
      }}
      onPointerEnter={updatePointerPosition}
      onPointerMove={updatePointerPosition}
      onPointerDown={(event) => {
        updatePointerPosition(event)
        mouseRef.current.pressed = true
      }}
      onPointerUp={() => {
        mouseRef.current.pressed = false
      }}
      onPointerLeave={() => {
        mouseRef.current.active = false
        mouseRef.current.pressed = false
      }}
      className="group relative flex h-full min-h-[22rem] items-center justify-center overflow-hidden lg:min-h-[28rem]"
    >
      <div
        className="absolute inset-0 opacity-100"
        style={{
          background: `linear-gradient(145deg, hsl(var(--background) / 0.04), hsl(var(--background) / 0.18) 46%, hsl(var(--background) / 0.08)), linear-gradient(120deg, hsl(${entry.accent ?? "228 88% 64%"} / 0.12), transparent 34%), linear-gradient(210deg, transparent 58%, hsl(${entry.accentSecondary ?? "193 92% 63%"} / 0.12) 100%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(180deg, transparent 0%, black 20%, black 80%, transparent 100%)",
        }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 z-20 h-full w-full touch-none" />
    </div>
  )
}

function ExperienceEntryCard({ entry, isActive }: { entry: ExperienceEntry; isActive: boolean }) {
  const [densityMode, setDensityMode] = useState<ParticleDensityMode>("standard")

  return (
    <Card className="interactive-tilt interactive-spot liquid-panel liquid-panel-strong h-full overflow-hidden rounded-[2rem]">
      <CardContent className="grid h-full gap-4 p-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)]">
        <div className="relative min-h-[22rem] overflow-hidden rounded-t-[2rem] rounded-b-[1.3rem] px-5 py-5 lg:min-h-[28rem] lg:rounded-l-[2rem] lg:rounded-r-none lg:px-6 lg:py-6">
          <LogoParticleField entry={entry} isActive={isActive} densityMode={densityMode} />
        </div>

        <div className="flex h-full flex-col justify-between gap-4 p-4 lg:p-5 lg:pl-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {(entry.stats ?? []).slice(0, 3).map((stat) => (
                <Badge key={stat} variant="secondary" className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.16em]">
                  {stat}
                </Badge>
              ))}
              <button
                type="button"
                onClick={() => setDensityMode((current) => (current === "depth" ? "standard" : "depth"))}
                className={cn(
                  "rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] transition-all duration-300",
                  densityMode === "depth"
                    ? "liquid-chip border-transparent text-foreground"
                    : "border-border/45 bg-background/20 text-muted-foreground hover:bg-background/35"
                )}
                aria-pressed={densityMode === "depth"}
              >
                Depth mode {densityMode === "depth" ? "on" : "off"}
              </button>
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
                className="rounded-[1.1rem] border border-border/55 bg-background/62 px-3.5 py-3 text-sm leading-6 text-muted-foreground backdrop-blur-xl dark:border-white/10 dark:bg-background/18"
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
  const [progress, setProgress] = useState(0)
  const reduceMotion = useReducedMotion()
  const isMobile = useMediaQuery("(max-width: 767px)")

  const ranges = useMemo(() => items.map((item) => Math.max(item.entries.length, 1)), [items])

  const totalSteps = useMemo(() => {
    return ranges.reduce((count, value) => count + value, 0)
  }, [ranges])

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

  const sectionHeight = useMemo(() => {
    return `${Math.max(totalSteps * PANELS_PER_ENTRY, 2.2) * 100}vh`
  }, [totalSteps])

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

    setProgress(rawProgress)

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
          <div className="mb-5 max-w-3xl">
            <Badge variant="outline" className="rounded-full px-4 py-1 font-mono text-[11px] uppercase tracking-[0.22em]">
              Real-world Experience
            </Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              Internships, work, and volunteering in motion
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              A mobile-friendly experience deck. Switch lanes and move role by role without any pinned content hiding below the fold.
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
              <TabsList className="grid h-auto w-full max-w-none auto-rows-fr grid-cols-1 justify-center gap-2 rounded-[1.2rem] p-1.5 sm:grid-cols-3">
                {items.map((item) => (
                  <TabsTrigger key={item.value} value={item.value} className="min-w-0 rounded-[0.95rem] px-3 py-2 text-center text-sm">
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
                    <Card className="liquid-panel liquid-panel-strong overflow-hidden rounded-[2rem]">
                      <CardContent className="p-4">
                        <div className="mb-4 flex flex-col gap-3 border-b border-border/40 pb-4">
                          <div>
                            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                              <Sparkles className="h-4 w-4" />
                              {activeItem.eyebrow}
                            </div>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">{activeItem.description}</p>
                          </div>

                          <div className="flex items-center justify-between gap-3 rounded-[1.1rem] border border-border/45 bg-background/35 px-3 py-3">
                            <div className="min-w-0">
                              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Entry deck</div>
                              <div className="mt-1 text-sm font-medium text-foreground">
                                {clampedEntryIndex + 1} of {activeEntries.length}: {entry?.title}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="rounded-full"
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
                                className="rounded-full"
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
                        </div>

                        <div className="overflow-hidden">
                          <motion.div
                            key={`${activeTab}-${clampedEntryIndex}`}
                            initial={{ opacity: 0, x: 28, scale: 0.99 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          >
                            {entry ? <ExperienceEntryCard entry={entry} isActive /> : null}
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
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
        <div className="mb-5 max-w-3xl">
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
      </div>

      <div className="sticky top-20 pb-6">
        <Tabs value={activeTab} onValueChange={scrollToTab} className="portfolio-container w-full">
          <div className="mb-3">
            <div className="progress-rail mx-auto mb-2.5 h-0.5 w-full max-w-5xl overflow-hidden rounded-full bg-muted/80">
              <motion.div
                className="progress-fill h-full rounded-full"
                animate={{ width: `${Math.max(progress * 100, 4)}%` }}
                transition={CONTENT_TRANSITION}
              />
            </div>

            <TabsList className="mx-auto grid h-auto w-full max-w-5xl grid-cols-3 gap-1.5 rounded-[1.2rem] p-1.5 shadow-none">
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
                        layoutId="experience-active-tab-pill"
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
            {items.map((item) => {
              if (item.value !== activeTab) {
                return null
              }

              const entry = item.entries[activeEntryIndex] ?? item.entries[0]

              return (
                <TabsContent key={item.value} value={item.value} forceMount className="mt-0">
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.99 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -12, scale: 0.995 }}
                    transition={CONTENT_TRANSITION}
                  >
                    <Card className="liquid-panel liquid-panel-strong overflow-hidden rounded-[2.2rem]">
                      <CardContent className="p-4 lg:p-5">
                        <div className="mb-4 flex flex-col gap-3 border-b border-border/40 pb-4 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                              <Sparkles className="h-4 w-4" />
                              {item.eyebrow}
                            </div>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{item.description}</p>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                            <span>
                              {activeEntryIndex + 1}/{item.entries.length}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5" />
                            <span>{entry?.title}</span>
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
                            {entry ? <ExperienceEntryCard entry={entry} isActive /> : null}
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
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
