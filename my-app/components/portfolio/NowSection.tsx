"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import {
  BookOpenText,
  BrainCircuit,
  CalendarClock,
  ExternalLink,
  FolderGit2,
  Music4,
  Sparkles,
} from "lucide-react"
import { motion } from "framer-motion"

import AnimatedSection from "@/components/portfolio/AnimatedSection"
import SectionHeading from "@/components/portfolio/SectionHeading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { NowApiResponse, NowEvent, NowSignal } from "@/lib/now"
import { cn } from "@/lib/utils"

const signalMeta = {
  currentTrack: {
    icon: Music4,
    accent: "from-[hsl(var(--spotlight-secondary)/0.22)] via-[hsl(var(--spotlight)/0.08)] to-transparent",
  },
  currentBook: {
    icon: BookOpenText,
    accent: "from-[hsl(var(--primary)/0.18)] via-[hsl(var(--spotlight)/0.1)] to-transparent",
  },
  latestProject: {
    icon: FolderGit2,
    accent: "from-[hsl(var(--spotlight)/0.24)] via-[hsl(var(--primary)/0.08)] to-transparent",
  },
  currentlyLearning: {
    icon: BrainCircuit,
    accent: "from-[hsl(var(--spotlight-secondary)/0.16)] via-[hsl(var(--primary)/0.08)] to-transparent",
  },
} as const

function formatRelative(dateString: string) {
  const relativeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
  const diffMs = new Date(dateString).getTime() - Date.now()
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))

  if (Math.abs(diffHours) < 24) {
    return relativeFormatter.format(diffHours, "hour")
  }

  const diffDays = Math.round(diffHours / 24)

  if (Math.abs(diffDays) < 30) {
    return relativeFormatter.format(diffDays, "day")
  }

  const diffMonths = Math.round(diffDays / 30)
  return relativeFormatter.format(diffMonths, "month")
}

function formatEventDate(dateString?: string) {
  if (!dateString) {
    return "Upcoming"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString))
}

function getStateBadgeClass(state: NowSignal["state"]) {
  if (state === "active") {
    return "border-primary/16 bg-primary/10 text-foreground"
  }

  if (state === "error") {
    return "border-destructive/20 bg-destructive/8 text-destructive"
  }

  if (state === "unconfigured") {
    return "border-dashed border-foreground/12 bg-background/60 text-muted-foreground"
  }

  return "border-foreground/10 bg-background/60 text-muted-foreground"
}

function SignalCard({
  signal,
  signalKey,
  large = false,
}: {
  signal: NowSignal
  signalKey: keyof typeof signalMeta
  large?: boolean
}) {
  const meta = signalMeta[signalKey]
  const Icon = meta.icon

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.22 }}>
      <Card className={cn("surface-card relative overflow-hidden border-border bg-card", large ? "rounded-[2rem]" : "rounded-[1.8rem]")}>
        <div className={cn("absolute inset-0 bg-gradient-to-br", meta.accent)} />
        <CardContent className={cn("relative", large ? "p-7" : "p-6")}>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em]",
                    getStateBadgeClass(signal.state)
                  )}
                >
                  {signal.label}
                </Badge>
                <Badge variant="outline" className="rounded-full border-foreground/10 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                  {signal.source}
                </Badge>
              </div>
              <div>
                <div className={cn("font-display font-semibold tracking-[-0.04em] text-foreground", large ? "text-3xl sm:text-[2rem]" : "text-2xl")}>
                  {signal.title}
                </div>
                {signal.subtitle ? (
                  <div className="mt-1 text-sm uppercase tracking-[0.18em] text-muted-foreground">
                    {signal.subtitle}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-foreground/10 bg-background/75">
              <Icon className="h-4.5 w-4.5 text-foreground" />
            </div>
          </div>

          <div className={cn("mt-5", signal.imageUrl ? "grid gap-5 md:grid-cols-[0.95fr_1.05fr]" : "")}>
            {signal.imageUrl ? (
              <div className="overflow-hidden rounded-[1.4rem] border border-foreground/10 bg-background/60">
                <div className="relative min-h-[12rem] w-full">
                  <Image src={signal.imageUrl} alt={signal.title} fill className="object-cover" unoptimized />
                </div>
              </div>
            ) : null}
            <div className="flex flex-col gap-4">
              <p className="text-sm leading-7 text-muted-foreground">{signal.description}</p>
              {signal.url ? (
                <div>
                  <Button asChild variant="outline" className="rounded-full px-4">
                    <a href={signal.url} target="_blank" rel="noreferrer">
                      {signal.source === "Spotify" ? "Open in Spotify" : "Open source"}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function EventCard({ event }: { event: NowEvent }) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="rounded-[1.35rem] border border-foreground/10 bg-background/45 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-sm font-medium text-foreground">{event.title}</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{formatEventDate(event.date)}</div>
      </div>
      {event.description ? <p className="text-sm leading-7 text-muted-foreground">{event.description}</p> : null}
      {event.url ? (
        <a
          href={event.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
        >
          Learn more
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : null}
    </motion.div>
  )
}

export default function NowSection() {
  const [data, setData] = useState<NowApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function loadNowData() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/now")
        const payload = (await response.json()) as NowApiResponse | { message: string }

        if (!response.ok) {
          throw new Error("message" in payload ? payload.message : "Unable to load the Now section.")
        }

        if (!isCancelled) {
          setData(payload as NowApiResponse)
        }
      } catch (fetchError) {
        if (!isCancelled) {
          setError(fetchError instanceof Error ? fetchError.message : "Unable to load the Now section.")
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadNowData()

    return () => {
      isCancelled = true
    }
  }, [])

  const sourceSummary = useMemo(() => {
    if (!data) {
      return [] as string[]
    }

    return [data.currentTrack, data.currentBook, data.latestProject, data.currentlyLearning]
      .map((signal) => `${signal.source} ${signal.state}`)
      .slice(0, 4)
  }, [data])

  return (
    <AnimatedSection id="now" className="mb-16 pt-16" delay={0.045}>
      <SectionHeading
        eyebrow="Now"
        title="A live snapshot of what I'm into right now"
        description="A dynamic layer that can surface what is playing, what is being built, what is being learned, and what is coming up next without turning the site into a cluttered dashboard."
      />

      {isLoading ? (
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="h-[22rem] animate-pulse rounded-[2rem] bg-foreground/6" />
            <div className="h-[16rem] animate-pulse rounded-[2rem] bg-foreground/6" />
          </div>
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="h-[16rem] animate-pulse rounded-[1.8rem] bg-foreground/6" />
              <div className="h-[16rem] animate-pulse rounded-[1.8rem] bg-foreground/6" />
            </div>
            <div className="h-[16rem] animate-pulse rounded-[2rem] bg-foreground/6" />
          </div>
        </div>
      ) : error || !data ? (
        <Card className="surface-card rounded-[2rem] border-border bg-card">
          <CardContent className="p-8">
            <div className="rounded-[1.5rem] border border-dashed border-foreground/12 bg-background/50 p-5 text-sm leading-7 text-muted-foreground">
              {error ?? "The Now section is temporarily unavailable."}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col gap-6">
            <Card className="surface-card liquid-glow relative overflow-hidden rounded-[2rem] border-border bg-card">
              <motion.div
                className="absolute -left-12 top-10 h-36 w-36 rounded-full bg-[radial-gradient(circle,hsl(var(--spotlight)/0.2),transparent_70%)] blur-3xl"
                animate={{ x: [0, 18, 0], y: [0, -14, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <CardContent className="relative flex flex-col gap-6 p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="rounded-full border-foreground/10 bg-background/75 px-4 py-1 font-mono text-[11px] uppercase tracking-[0.24em]">
                    <Sparkles className="mr-2 h-3.5 w-3.5" />
                    Auto-updating
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-foreground/10 bg-background/75 px-4 py-1 font-mono text-[11px] uppercase tracking-[0.24em]">
                    Refreshed {formatRelative(data.updatedAt)}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Live personal state
                  </div>
                  <h3 className="font-display text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                    What Connor is listening to, learning from, building, and planning around
                  </h3>
                  <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                    Instead of a static paragraph that gets stale, this section can quietly evolve from real sources and keep the portfolio feeling current.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {sourceSummary.map((entry) => (
                    <Badge key={entry} variant="outline" className="rounded-full border-foreground/10 bg-background/65 px-3 py-1 text-[10px] uppercase tracking-[0.18em]">
                      {entry}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <SignalCard signal={data.currentTrack} signalKey="currentTrack" large />
            <SignalCard signal={data.latestProject} signalKey="latestProject" />
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <SignalCard signal={data.currentBook} signalKey="currentBook" />
              <SignalCard signal={data.currentlyLearning} signalKey="currentlyLearning" />
            </div>

            <Card className="surface-card rounded-[2rem] border-border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CalendarClock className="h-5 w-5 text-primary" />
                  Upcoming events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[1.4rem] border border-foreground/10 bg-background/45 p-4 text-sm leading-7 text-muted-foreground">
                  {data.upcomingEvents.message}
                </div>

                {data.upcomingEvents.items.length ? (
                  <div className="grid gap-3">
                    {data.upcomingEvents.items.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[1.4rem] border border-dashed border-foreground/12 bg-background/45 p-5 text-sm leading-7 text-muted-foreground">
                    No upcoming items are showing yet, but the events layer is wired and ready to fill in automatically.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AnimatedSection>
  )
}
