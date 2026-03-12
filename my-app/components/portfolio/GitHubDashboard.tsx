"use client"

import Image from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import {
  Bot,
  CalendarClock,
  Command,
  ExternalLink,
  FolderGit2,
  GitBranch,
  GitCommitHorizontal,
  GitPullRequest,
  Linkedin,
  Music4,
  RefreshCcw,
  Rss,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react"
import { motion } from "framer-motion"

import AnimatedSection from "@/components/portfolio/AnimatedSection"
import IntegrationTerminal from "@/components/portfolio/IntegrationTerminal"
import PortfolioChat from "@/components/portfolio/PortfolioChat"
import SectionHeading from "@/components/portfolio/SectionHeading"
import { useNearViewport } from "@/components/portfolio/useNearViewport"
import { spotifyPlaylists } from "@/components/portfolio/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type GitHubDashboardResponse = {
  profile: {
    login: string
    name: string | null
    htmlUrl: string
    followers: number
    publicRepos: number
    createdAt: string
  }
  stats: {
    originalRepos: number
    activeRepos: number
    totalStars: number
    totalForks: number
    recentCommitCount: number
    languageCount: number
  }
  repositories: {
    id: number
    name: string
    description: string | null
    language: string | null
    stars: number
    forks: number
    pushedAt: string
  }[]
  recentCommits: {
    sha: string
    message: string
    repo: string
    createdAt: string
    branch: string
  }[]
  issueAndPullRequestActivity: {
    id: string
    kind: string
    title: string
    action: string
    repo: string
    createdAt: string
  }[]
  activityPulse: {
    date: string
    label: string
    total: number
  }[]
  languages: {
    name: string
    value: number
    share: number
  }[]
  updatedAt: string
}

type LinkedInActivityResponse = {
  mode: "configured" | "unconfigured" | "error"
  profileUrl: string
  posts: {
    id: string
    title: string
    summary: string
    url: string
    publishedAt: string
  }[]
  message: string
}

type SpotifyTimeRange = "short_term" | "medium_term" | "long_term"

type SpotifyDashboardResponse = {
  mode: "configured" | "unconfigured" | "error"
  updatedAt: string
  message: string
  accountDataState: "ready" | "partial" | "rate_limited" | "needs_reauth" | "stale" | null
  accountDataMessage: string | null
  topTimeRange: SpotifyTimeRange
  topWindowLabel: string
  topLimit: number
  profile: {
    displayName: string | null
    profileUrl: string | null
    imageUrl: string | null
    followers: number | null
    product: string | null
    country: string | null
  } | null
  playback: {
    state: "playing" | "recent" | "idle"
    label: string
    title: string | null
    artist: string | null
    album: string | null
    imageUrl: string | null
    url: string | null
    progressMs: number | null
    durationMs: number | null
    playedAt: string | null
    deviceName: string | null
    deviceType: string | null
    shuffleState: boolean | null
    repeatState: string | null
    explicit: boolean | null
    releaseDate: string | null
    contextType: string | null
    contextUrl: string | null
    message: string
  } | null
  topTracks: Array<{
    id: string
    title: string
    artist: string
    album: string | null
    imageUrl: string | null
    url: string | null
    durationMs: number | null
    popularity: number | null
  }>
  topArtists: Array<{
    id: string
    name: string
    imageUrl: string | null
    url: string | null
    genres: string[]
    followers: number | null
    popularity: number | null
  }>
  recentPodcast: {
    title: string
    showName: string | null
    imageUrl: string | null
    url: string | null
    playedAt: string | null
  } | null
}

const statCards = [
  {
    key: "originalRepos",
    label: "Original repos",
    icon: FolderGit2,
    accent:
      "from-[hsl(var(--spotlight)/0.24)] via-[hsl(var(--spotlight)/0.12)] to-transparent",
  },
  {
    key: "followers",
    label: "Followers",
    icon: Users,
    accent:
      "from-[hsl(var(--spotlight-secondary)/0.22)] via-[hsl(var(--spotlight-secondary)/0.1)] to-transparent",
  },
  {
    key: "totalStars",
    label: "Total stars",
    icon: Star,
    accent:
      "from-[hsl(var(--primary)/0.18)] via-[hsl(var(--primary)/0.08)] to-transparent",
  },
  {
    key: "totalForks",
    label: "Total forks",
    icon: GitBranch,
    accent:
      "from-[hsl(var(--spotlight-secondary)/0.16)] via-[hsl(var(--primary)/0.08)] to-transparent",
  },
] as const

const spotifyTimeRangeOptions: Array<{
  value: SpotifyTimeRange
  label: string
  description: string
}> = [
  {
    value: "short_term",
    label: "28 days",
    description: "Current rotation",
  },
  {
    value: "medium_term",
    label: "6 months",
    description: "Bigger listening arc",
  },
  {
    value: "long_term",
    label: "All time",
    description: "Long-run favorites",
  },
]

const spotifyTopLimitOptions = [10, 25, 50] as const
const defaultSpotifyDetailLimit = 25

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

function getHeatColor(intensity: number) {
  if (intensity <= 0) {
    return "bg-foreground/6"
  }

  if (intensity === 1) {
    return "bg-[hsl(var(--spotlight)/0.25)]"
  }

  if (intensity <= 3) {
    return "bg-[hsl(var(--spotlight)/0.45)]"
  }

  if (intensity <= 5) {
    return "bg-[hsl(var(--spotlight-secondary)/0.55)]"
  }

  return "bg-[hsl(var(--spotlight-secondary)/0.8)]"
}

function formatMonthYear(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(dateString))
}

function formatDuration(durationMs?: number | null) {
  if (!durationMs) {
    return "--:--"
  }

  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

function formatSpotifyValue(value?: string | null) {
  if (!value) {
    return null
  }

  return value.replace(/_/g, " ")
}

function formatCompactNumber(value?: number | null) {
  if (typeof value !== "number") {
    return "N/A"
  }

  return new Intl.NumberFormat("en-US", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value)
}

function getSpotifyTimeRangeLabel(value: SpotifyTimeRange) {
  return spotifyTimeRangeOptions.find((option) => option.value === value)?.label ?? "28 days"
}

export default function GitHubDashboard() {
  const { ref: sectionRef, isNearViewport: isIntegrationsVisible } = useNearViewport<HTMLElement>({
    rootMargin: "260px 0px",
    threshold: 0.18,
  })
  const [activeTab, setActiveTab] = useState("ai-chat")
  const [githubData, setGitHubData] = useState<GitHubDashboardResponse | null>(null)
  const [githubError, setGitHubError] = useState<string | null>(null)
  const [githubLoading, setGitHubLoading] = useState(true)
  const [spotifyData, setSpotifyData] = useState<SpotifyDashboardResponse | null>(null)
  const [spotifyError, setSpotifyError] = useState<string | null>(null)
  const [spotifyLoading, setSpotifyLoading] = useState(true)
  const [isSpotifyDetailsOpen, setIsSpotifyDetailsOpen] = useState(false)
  const [spotifyDetailsRange, setSpotifyDetailsRange] = useState<SpotifyTimeRange>("short_term")
  const [spotifyDetailsLimit, setSpotifyDetailsLimit] = useState<number>(defaultSpotifyDetailLimit)
  const [spotifyDetailsData, setSpotifyDetailsData] = useState<SpotifyDashboardResponse | null>(null)
  const [spotifyDetailsError, setSpotifyDetailsError] = useState<string | null>(null)
  const [spotifyDetailsLoading, setSpotifyDetailsLoading] = useState(false)
  const [linkedinData, setLinkedinData] = useState<LinkedInActivityResponse | null>(null)
  const [linkedinError, setLinkedinError] = useState<string | null>(null)
  const [linkedinLoading, setLinkedinLoading] = useState(true)
  const shouldLoadGitHub = !githubData && !githubError
  const shouldLoadLinkedIn = !linkedinData && !linkedinError
  const shouldLoadSpotify = !spotifyData && !spotifyError

  const requestSpotifyDashboard = useCallback(
    async (options: { timeRange?: SpotifyTimeRange; limit?: number } = {}) => {
      const searchParams = new URLSearchParams()

      if (options.timeRange) {
        searchParams.set("timeRange", options.timeRange)
      }

      if (typeof options.limit === "number") {
        searchParams.set("limit", String(options.limit))
      }

      const requestPath = searchParams.size
        ? `/api/spotify/now-playing?${searchParams.toString()}`
        : "/api/spotify/now-playing"

      const response = await fetch(requestPath, {
        cache: "no-store",
      })
      const payload = (await response.json()) as SpotifyDashboardResponse | { message?: string }

      if (!response.ok && !("mode" in payload)) {
        throw new Error("message" in payload ? payload.message : "Unable to load Spotify activity")
      }

      return payload as SpotifyDashboardResponse
    },
    []
  )

  useEffect(() => {
    if (!isIntegrationsVisible || (!shouldLoadGitHub && !shouldLoadLinkedIn && !shouldLoadSpotify)) {
      return
    }
    let isCancelled = false

    async function loadGitHubDashboard() {
      try {
        setGitHubLoading(true)
        setGitHubError(null)

        const response = await fetch("/api/github")
        const payload = (await response.json()) as GitHubDashboardResponse | { message: string }

        if (!response.ok) {
          throw new Error("message" in payload ? payload.message : "Unable to load GitHub activity")
        }

        if (!isCancelled) {
          setGitHubData(payload as GitHubDashboardResponse)
        }
      } catch (fetchError) {
        if (!isCancelled) {
          setGitHubError(fetchError instanceof Error ? fetchError.message : "Unable to load GitHub activity")
        }
      } finally {
        if (!isCancelled) {
          setGitHubLoading(false)
        }
      }
    }

    async function loadLinkedInActivity() {
      try {
        setLinkedinLoading(true)
        setLinkedinError(null)

        const response = await fetch("/api/linkedin")
        const payload = (await response.json()) as LinkedInActivityResponse | { message: string }

        if (!response.ok && !("mode" in payload)) {
          throw new Error("message" in payload ? payload.message : "Unable to load LinkedIn activity")
        }

        if (!isCancelled) {
          setLinkedinData(payload as LinkedInActivityResponse)
        }
      } catch (fetchError) {
        if (!isCancelled) {
          setLinkedinError(fetchError instanceof Error ? fetchError.message : "Unable to load LinkedIn activity")
        }
      } finally {
        if (!isCancelled) {
          setLinkedinLoading(false)
        }
      }
    }

    async function loadSpotifyActivity() {
      try {
        setSpotifyLoading(true)
        setSpotifyError(null)

        const payload = await requestSpotifyDashboard()

        if (!isCancelled) {
          setSpotifyData(payload)
        }
      } catch (fetchError) {
        if (!isCancelled) {
          setSpotifyError(fetchError instanceof Error ? fetchError.message : "Unable to load Spotify activity")
        }
      } finally {
        if (!isCancelled) {
          setSpotifyLoading(false)
        }
      }
    }

    if (shouldLoadGitHub) {
      void loadGitHubDashboard()
    }

    if (shouldLoadSpotify) {
      void loadSpotifyActivity()
    }

    if (shouldLoadLinkedIn) {
      void loadLinkedInActivity()
    }

    return () => {
      isCancelled = true
    }
  }, [isIntegrationsVisible, requestSpotifyDashboard, shouldLoadGitHub, shouldLoadLinkedIn, shouldLoadSpotify])

  useEffect(() => {
    if (!isIntegrationsVisible || activeTab !== "spotify") {
      return
    }

    const spotifyInterval = window.setInterval(() => {
      void (async () => {
        try {
          const payload = await requestSpotifyDashboard()
          setSpotifyData(payload)
          setSpotifyError(null)
        } catch (fetchError) {
          setSpotifyError(fetchError instanceof Error ? fetchError.message : "Unable to load Spotify activity")
        }
      })()
    }, 5000)

    return () => window.clearInterval(spotifyInterval)
  }, [activeTab, isIntegrationsVisible, requestSpotifyDashboard])

  useEffect(() => {
    if (!isSpotifyDetailsOpen) {
      return
    }

    if (spotifyData?.topTimeRange === spotifyDetailsRange && spotifyData?.topLimit === spotifyDetailsLimit) {
      setSpotifyDetailsData(spotifyData)
      setSpotifyDetailsError(null)
      setSpotifyDetailsLoading(false)
      return
    }

    let isCancelled = false

    void (async () => {
      try {
        setSpotifyDetailsLoading(true)
        setSpotifyDetailsError(null)

        const payload = await requestSpotifyDashboard({
          timeRange: spotifyDetailsRange,
          limit: spotifyDetailsLimit,
        })

        if (!isCancelled) {
          setSpotifyDetailsData(payload)
        }
      } catch (fetchError) {
        if (!isCancelled) {
          setSpotifyDetailsError(fetchError instanceof Error ? fetchError.message : "Unable to load Spotify details")
        }
      } finally {
        if (!isCancelled) {
          setSpotifyDetailsLoading(false)
        }
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [
    isSpotifyDetailsOpen,
    requestSpotifyDashboard,
    spotifyData?.topLimit,
    spotifyData?.topTimeRange,
    spotifyDetailsLimit,
    spotifyDetailsRange,
  ])

  useEffect(() => {
    if (!isSpotifyDetailsOpen) {
      return
    }

    const previousBodyOverflow = document.body.style.overflow

    document.body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSpotifyDetailsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousBodyOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isSpotifyDetailsOpen])

  const maxPulse = useMemo(
    () => Math.max(...(githubData?.activityPulse.map((point) => point.total) ?? [0]), 1),
    [githubData?.activityPulse]
  )
  const spotifyPlaybackProgress = useMemo(() => {
    const playback = spotifyData?.playback

    if (!playback?.progressMs || !playback.durationMs) {
      return 0
    }

    return Math.min(100, Math.max(0, (playback.progressMs / playback.durationMs) * 100))
  }, [spotifyData?.playback])
  const spotifyPreviewTracks = useMemo(
    () => spotifyData?.topTracks.slice(0, 5) ?? [],
    [spotifyData?.topTracks]
  )
  const spotifyPreviewArtists = useMemo(
    () => spotifyData?.topArtists.slice(0, 5) ?? [],
    [spotifyData?.topArtists]
  )
  const spotifySelectedDetails = useMemo(() => {
    if (
      spotifyDetailsData?.topTimeRange === spotifyDetailsRange &&
      spotifyDetailsData?.topLimit === spotifyDetailsLimit
    ) {
      return spotifyDetailsData
    }

    if (
      spotifyData?.topTimeRange === spotifyDetailsRange &&
      spotifyData?.topLimit === spotifyDetailsLimit
    ) {
      return spotifyData
    }

    return null
  }, [spotifyData, spotifyDetailsData, spotifyDetailsLimit, spotifyDetailsRange])

  return (
    <AnimatedSection id="integrations" className="mb-16 pt-6" delay={0.04}>
      <section ref={sectionRef}>
      <div className="mb-3">
        <SectionHeading
          eyebrow="Integrations"
          title="A live hub around the work"
          description="AI chat, LinkedIn, a terminal-style interface, GitHub signal, and Spotify listening data arranged like a live product surface."
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-3 grid h-auto w-full max-w-5xl grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <TabsTrigger value="ai-chat" className="gap-2">
            <Bot className="h-4 w-4" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="linkedin" className="gap-2">
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </TabsTrigger>
          <TabsTrigger value="terminal" className="gap-2">
            <Command className="h-4 w-4" />
            Terminal
          </TabsTrigger>
          <TabsTrigger value="github" className="gap-2">
            <FolderGit2 className="h-4 w-4" />
            GitHub
          </TabsTrigger>
          <TabsTrigger value="spotify" className="gap-2">
            <Music4 className="h-4 w-4" />
            Spotify
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terminal" className="mt-0">
          <IntegrationTerminal
            githubUrl={githubData?.profile.htmlUrl ?? "https://github.com/connorfurby"}
            githubRepoCount={githubData?.stats.originalRepos}
            latestRepoName={githubData?.repositories[0]?.name}
            linkedinProfileUrl={linkedinData?.profileUrl}
            linkedinPostCount={linkedinData?.posts.length}
            onSelectTab={setActiveTab}
            spotifyTrack={
              spotifyData?.playback
                ? {
                    title: spotifyData.playback.title,
                    artist: spotifyData.playback.artist,
                    url: spotifyData.playback.url,
                  }
                : undefined
            }
          />
        </TabsContent>

        <TabsContent value="github" className="mt-0">
          <div className="grid gap-8 xl:grid-cols-[minmax(320px,0.88fr)_minmax(0,1.12fr)]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              className="flex flex-col gap-6"
            >
              <Card className="surface-card relative overflow-hidden rounded-[2rem] border-border bg-card">
                <motion.div
                  className="absolute -left-10 top-8 h-28 w-28 rounded-full bg-[radial-gradient(circle,hsl(var(--spotlight)/0.22),transparent_70%)] blur-3xl"
                  animate={isIntegrationsVisible ? { x: [0, 16, 0], y: [0, -10, 0] } : undefined}
                  transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <CardContent className="relative flex flex-col gap-6 p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className="rounded-full border-foreground/10 bg-background/75 px-4 py-1 font-mono text-[11px] uppercase tracking-[0.24em]">
                      <Sparkles className="mr-2 h-3.5 w-3.5" />
                      Public API powered
                    </Badge>
                    {githubData ? (
                      <Badge variant="outline" className="rounded-full border-foreground/10 bg-background/75 px-4 py-1 font-mono text-[11px] uppercase tracking-[0.24em]">
                        Updated {formatRelative(githubData.updatedAt)}
                      </Badge>
                    ) : null}
                  </div>

                  <div className="space-y-3">
                    <div className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
                      GitHub presence
                    </div>
                    <div className="font-display text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                      {githubData?.profile.name ?? "Connor Furby"}
                    </div>
                    <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                      This tab turns my GitHub profile into a cleaner long-view summary of account activity, language mix, repo footprint, and recent engineering output.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((card) => {
                      const Icon = card.icon
                      const value = card.key === "followers" ? githubData?.profile.followers ?? 0 : githubData?.stats[card.key] ?? 0

                      return (
                        <motion.div
                          key={card.key}
                          whileHover={{ y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="relative overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-background/55 p-4"
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${card.accent}`} />
                          <div className="relative flex items-start justify-between gap-3">
                            <div>
                              <div className="mb-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                                {card.label}
                              </div>
                              <div className="font-display text-3xl font-semibold tracking-[-0.05em]">
                                {value}
                              </div>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-foreground/10 bg-background/75">
                              <Icon className="h-4 w-4" />
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button asChild className="rounded-full px-5">
                      <a href={githubData?.profile.htmlUrl ?? "https://github.com/connorfurby"} target="_blank" rel="noreferrer">
                        Visit GitHub
                      </a>
                    </Button>
                    <div className="rounded-full border border-foreground/10 bg-background/60 px-4 py-2 text-sm text-muted-foreground">
                      {githubLoading
                        ? "Loading all-time stats..."
                        : githubError
                          ? "Showing fallback state"
                          : `On GitHub since ${formatMonthYear(githubData?.profile.createdAt ?? new Date().toISOString())} • ${githubData?.stats.languageCount ?? 0} languages tracked`}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="surface-card rounded-[2rem] border-border bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <CalendarClock className="h-5 w-5 text-primary" />
                    All-time snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {githubLoading ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={`snapshot-skeleton-${index}`} className="h-24 rounded-[1.4rem] bg-foreground/6 animate-pulse" />
                      ))}
                    </div>
                  ) : githubError || !githubData ? (
                    <div className="rounded-[1.5rem] border border-dashed border-foreground/12 bg-background/50 p-5 text-sm leading-7 text-muted-foreground">
                      {githubError ?? "GitHub activity is temporarily unavailable."}
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1.4rem] border border-foreground/10 bg-background/45 p-4">
                          <div className="mb-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">Active repos</div>
                          <div className="font-display text-3xl font-semibold tracking-[-0.05em]">{githubData.stats.activeRepos}</div>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">
                            Repositories with activity in roughly the last 90 days.
                          </p>
                        </div>
                        <div className="rounded-[1.4rem] border border-foreground/10 bg-background/45 p-4">
                          <div className="mb-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">Recent 28-day pulse</div>
                          <div className="mb-3 font-display text-3xl font-semibold tracking-[-0.05em]">
                            {githubData.activityPulse.reduce((sum, point) => sum + point.total, 0)}
                          </div>
                          <div className="flex gap-1.5">
                            {githubData.activityPulse.slice(-12).map((point) => {
                              const normalized = point.total === 0 ? 0 : Math.max(1, Math.round((point.total / maxPulse) * 6))

                              return (
                                <div
                                  key={point.date}
                                  className={`h-9 flex-1 rounded-md border border-foreground/8 ${getHeatColor(normalized)}`}
                                  title={`${point.label}: ${point.total}`}
                                />
                              )
                            })}
                          </div>
                        </div>
                        <div className="rounded-[1.4rem] border border-foreground/10 bg-background/45 p-4">
                          <div className="mb-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">Top language</div>
                          <div className="font-display text-3xl font-semibold tracking-[-0.05em]">
                            {githubData.languages[0]?.name ?? "N/A"}
                          </div>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">
                            {githubData.languages[0] ? `${githubData.languages[0].share}% of sampled code footprint.` : "Language data unavailable."}
                          </p>
                        </div>
                        <div className="rounded-[1.4rem] border border-foreground/10 bg-background/45 p-4">
                          <div className="mb-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">Latest refresh</div>
                          <div className="font-display text-3xl font-semibold tracking-[-0.05em]">
                            {formatRelative(githubData.updatedAt)}
                          </div>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">
                            Cached from the GitHub API for fast loads and fresh-enough stats.
                          </p>
                        </div>
                      </div>
                      <p className="text-sm leading-7 text-muted-foreground">
                        The GitHub tab emphasizes account-wide stats while still keeping recent technical signal visible.
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              className="flex flex-col gap-6"
            >
              <Card className="surface-card rounded-[2rem] border-border bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <GitCommitHorizontal className="h-5 w-5 text-primary" />
                    Recent commits
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {githubLoading
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <div key={`commit-loading-${index}`} className="rounded-[1.4rem] border border-foreground/8 bg-background/45 p-4 animate-pulse">
                          <div className="mb-2 h-4 w-2/3 rounded bg-foreground/8" />
                          <div className="h-3 w-1/3 rounded bg-foreground/8" />
                        </div>
                      ))
                    : githubData?.recentCommits.length
                      ? githubData.recentCommits.map((commit) => (
                          <motion.div
                            key={commit.sha}
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-[1.4rem] border border-foreground/10 bg-background/45 p-4"
                          >
                            <div className="mb-2 flex items-center justify-between gap-3">
                              <div className="text-sm font-semibold text-foreground">{commit.repo}</div>
                              <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{commit.branch}</div>
                            </div>
                            <p className="text-sm leading-7 text-muted-foreground">{commit.message}</p>
                            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                              <span>{commit.sha.slice(0, 7)}</span>
                              <span>{formatRelative(commit.createdAt)}</span>
                            </div>
                          </motion.div>
                        ))
                      : (
                        <div className="rounded-[1.4rem] border border-dashed border-foreground/12 bg-background/45 p-5 text-sm leading-7 text-muted-foreground">
                          No recent public push events showed up in the current GitHub activity window, but the live repo and language data are still updating from the API.
                        </div>
                      )}
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <Card className="surface-card rounded-[2rem] border-border bg-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <RefreshCcw className="h-5 w-5 text-primary" />
                      Language mix
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {githubLoading
                      ? Array.from({ length: 5 }).map((_, index) => (
                          <div key={`language-loading-${index}`} className="space-y-2">
                            <div className="h-3 w-24 rounded bg-foreground/8 animate-pulse" />
                            <div className="h-2 rounded-full bg-foreground/8 animate-pulse" />
                          </div>
                        ))
                      : githubData?.languages.map((language) => (
                          <div key={language.name} className="space-y-2">
                            <div className="flex items-center justify-between gap-3 text-sm">
                              <span className="font-medium text-foreground">{language.name}</span>
                              <span className="text-muted-foreground">{language.share}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-foreground/8">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${Math.max(language.share, 6)}%` }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="h-full rounded-full bg-gradient-to-r from-primary via-[hsl(var(--spotlight))] to-[hsl(var(--spotlight-secondary))]"
                              />
                            </div>
                          </div>
                        ))}
                  </CardContent>
                </Card>

                <Card className="surface-card rounded-[2rem] border-border bg-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <GitPullRequest className="h-5 w-5 text-primary" />
                      PRs and issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {githubLoading
                      ? Array.from({ length: 4 }).map((_, index) => (
                          <div key={`activity-loading-${index}`} className="rounded-[1.3rem] border border-foreground/8 bg-background/45 p-4 animate-pulse">
                            <div className="mb-2 h-4 w-2/3 rounded bg-foreground/8" />
                            <div className="h-3 w-1/2 rounded bg-foreground/8" />
                          </div>
                        ))
                      : githubData?.issueAndPullRequestActivity.length
                        ? githubData.issueAndPullRequestActivity.map((item) => (
                            <div
                              key={item.id}
                              className="rounded-[1.3rem] border border-foreground/10 bg-background/45 p-4"
                            >
                              <div className="mb-2 flex items-center justify-between gap-3">
                                <Badge variant="outline" className="rounded-full border-foreground/10 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                                  {item.kind}
                                </Badge>
                                <div className="text-xs text-muted-foreground">{formatRelative(item.createdAt)}</div>
                              </div>
                              <div className="text-sm font-medium text-foreground">{item.title}</div>
                              <div className="mt-2 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                <span>{item.repo}</span>
                                <span>{item.action}</span>
                              </div>
                            </div>
                          ))
                        : (
                          <div className="rounded-[1.3rem] border border-dashed border-foreground/12 bg-background/45 p-5 text-sm leading-7 text-muted-foreground">
                            No recent public PR or issue activity is showing right now, so this panel will fill in automatically the next time that collaboration activity appears on GitHub.
                          </div>
                        )}
                  </CardContent>
                </Card>
              </div>

              <Card className="surface-card rounded-[2rem] border-border bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <GitBranch className="h-5 w-5 text-primary" />
                    Active repositories
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  {githubLoading
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <div key={`repo-loading-${index}`} className="rounded-[1.4rem] border border-foreground/8 bg-background/45 p-5 animate-pulse">
                          <div className="mb-3 h-4 w-1/2 rounded bg-foreground/8" />
                          <div className="mb-2 h-3 w-full rounded bg-foreground/8" />
                          <div className="h-3 w-2/3 rounded bg-foreground/8" />
                        </div>
                      ))
                    : githubData?.repositories.map((repository) => (
                        <motion.div
                          key={repository.id}
                          whileHover={{ y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="rounded-[1.4rem] border border-foreground/10 bg-background/45 p-5"
                        >
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                              <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">
                                {repository.name}
                              </div>
                              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                {repository.language ?? "Mixed stack"}
                              </div>
                            </div>
                            <div className="rounded-full border border-foreground/10 bg-background/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                              Snapshot
                            </div>
                          </div>
                          <p className="min-h-[4.5rem] text-sm leading-7 text-muted-foreground">
                            {repository.description ?? "A repository currently showing recent public activity."}
                          </p>
                          <div className="mt-4 flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            <span>{repository.stars} stars</span>
                            <span>{repository.forks} forks</span>
                            <span>{formatRelative(repository.pushedAt)}</span>
                          </div>
                        </motion.div>
                      ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="spotify" className="!mt-0">
          {spotifyLoading ? (
            <div className="grid gap-3 xl:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.95fr)]">
              <div className="h-[22rem] rounded-[1.3rem] bg-foreground/6 animate-pulse" />
              <div className="h-[22rem] rounded-[1.3rem] bg-foreground/6 animate-pulse" />
              <div className="h-[18rem] rounded-[1.3rem] bg-foreground/6 animate-pulse xl:col-span-2" />
            </div>
          ) : spotifyError || !spotifyData ? (
            <Card className="surface-card rounded-[1.3rem] border-border bg-card">
              <div className="p-4 text-sm leading-7 text-muted-foreground">
                {spotifyError ?? "Spotify activity is temporarily unavailable."}
              </div>
            </Card>
          ) : spotifyData.mode !== "configured" ? (
            <Card className="surface-card rounded-[1.3rem] border-border bg-card">
              <div className="p-4 text-sm leading-7 text-muted-foreground">{spotifyData.message}</div>
            </Card>
          ) : (
            <div className="grid gap-3 xl:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.95fr)]">
              <Card className="surface-card relative flex h-full items-center overflow-hidden rounded-[1.3rem] border-border bg-card">
                <motion.div
                  className="absolute -left-10 top-8 h-28 w-28 rounded-full bg-[radial-gradient(circle,hsl(var(--spotlight-secondary)/0.22),transparent_70%)] blur-3xl"
                  animate={isIntegrationsVisible ? { x: [0, 16, 0], y: [0, -10, 0] } : undefined}
                  transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative grid w-full gap-0 md:grid-cols-[minmax(13rem,14rem)_1fr]">
                  <div className="relative aspect-square w-full bg-background/60">
                    {spotifyData.playback?.imageUrl ? (
                      <Image
                        src={spotifyData.playback.imageUrl}
                        alt={spotifyData.playback.title ?? "Spotify artwork"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[radial-gradient(circle,hsl(var(--spotlight-secondary)/0.18),transparent_70%)]">
                        <Music4 className="h-12 w-12 text-foreground/70" />
                      </div>
                    )}
                  </div>

                  <div className="flex h-full flex-col justify-center gap-3 p-3.5 sm:p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="rounded-full border-foreground/10 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                          Personal Spotify
                        </Badge>
                        {isIntegrationsVisible ? (
                          <Badge variant="outline" className="rounded-full border-foreground/10 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                            Live refresh
                          </Badge>
                        ) : null}
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Updated {formatRelative(spotifyData.updatedAt)}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="rounded-full border-foreground/10 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                        {spotifyData.playback?.label ?? "Spotify"}
                      </Badge>
                      {spotifyData.playback?.explicit ? (
                        <Badge variant="outline" className="rounded-full border-foreground/10 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                          Explicit
                        </Badge>
                      ) : null}
                      {spotifyData.profile?.product ? (
                        <Badge variant="outline" className="rounded-full border-foreground/10 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                          {spotifyData.profile.product}
                        </Badge>
                      ) : null}
                    </div>

                    <div className="space-y-1.5">
                      <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                        {spotifyData.profile?.displayName ?? "Spotify account"}
                      </div>
                      <div className="font-display text-2xl font-semibold tracking-[-0.05em] text-foreground sm:text-[2rem]">
                        {spotifyData.playback?.title ?? "Nothing is playing"}
                      </div>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {spotifyData.playback?.artist ?? "Unknown artist"}
                      </div>
                      {spotifyData.playback?.album ? (
                        <p className="text-sm leading-6 text-muted-foreground">
                          {spotifyData.playback.state === "recent" ? "Last played from" : "From"} {spotifyData.playback.album}
                        </p>
                      ) : null}
                    </div>

                    {spotifyData.accountDataMessage ? (
                      <div className="rounded-[1rem] border border-foreground/10 bg-background/45 px-3 py-2 text-sm leading-6 text-muted-foreground">
                        {spotifyData.accountDataMessage}
                      </div>
                    ) : null}

                    <div className="space-y-1.5">
                      <div className="h-1.5 rounded-full bg-foreground/8">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary via-[hsl(var(--spotlight))] to-[hsl(var(--spotlight-secondary))]"
                          style={{ width: `${spotifyPlaybackProgress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDuration(spotifyData.playback?.progressMs)}</span>
                        <span>{formatDuration(spotifyData.playback?.durationMs)}</span>
                      </div>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <div className="rounded-[1rem] border border-foreground/10 bg-background/45 p-2.5">
                        <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Device</div>
                        <div className="text-sm text-foreground">
                          {spotifyData.playback?.deviceName ?? "Recent history"}
                        </div>
                      </div>
                      <div className="rounded-[1rem] border border-foreground/10 bg-background/45 p-2.5">
                        <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Context</div>
                        <div className="text-sm text-foreground">
                          {formatSpotifyValue(spotifyData.playback?.contextType) ?? "Direct play"}
                        </div>
                      </div>
                    </div>

                    {spotifyData.recentPodcast &&
                    spotifyData.recentPodcast.title !== spotifyData.playback?.title ? (
                      <div className="rounded-[1rem] border border-foreground/10 bg-background/45 p-2.5">
                        <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Recent podcast</div>
                        <div className="text-sm font-medium text-foreground">{spotifyData.recentPodcast.title}</div>
                        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {spotifyData.recentPodcast.showName ?? "Podcast"}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {spotifyData.recentPodcast.playedAt
                            ? `Seen ${formatRelative(spotifyData.recentPodcast.playedAt)}`
                            : "Saved from recent playback"}
                        </div>
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-2.5">
                      {spotifyData.playback?.url ? (
                        <Button asChild className="rounded-full px-4">
                          <a href={spotifyData.playback.url} target="_blank" rel="noreferrer">
                            Open in Spotify
                          </a>
                        </Button>
                      ) : null}
                      {spotifyData.profile?.profileUrl ? (
                        <Button asChild variant="outline" className="rounded-full px-4">
                          <a href={spotifyData.profile.profileUrl} target="_blank" rel="noreferrer">
                            Open Profile
                          </a>
                        </Button>
                      ) : null}
                      <div className="rounded-full border border-foreground/10 bg-background/60 px-3 py-1.5 text-sm text-muted-foreground">
                        {spotifyData.playback?.playedAt
                          ? `Played ${formatRelative(spotifyData.playback.playedAt)}`
                          : spotifyData.playback?.message ?? spotifyData.message}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="surface-card rounded-[1.3rem] border-border bg-card">
                <div className="flex h-full flex-col p-3.5 sm:p-4">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xl font-display font-semibold tracking-tight">
                        <Users className="h-5 w-5 text-primary" />
                        Top listening
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        {spotifyData.topWindowLabel}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full px-3"
                      onClick={() => setIsSpotifyDetailsOpen(true)}
                    >
                      More data
                    </Button>
                  </div>

                  <div className="grid flex-1 gap-3 lg:grid-cols-2">
                    <div className="flex flex-col">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        Top tracks
                      </div>
                      <div className="mt-2 grid flex-1 gap-2">
                        {spotifyPreviewTracks.length ? (
                          spotifyPreviewTracks.map((track, index) => (
                            <div key={track.id} className="flex min-h-[4.15rem] items-center gap-3 rounded-[1rem] border border-foreground/10 bg-background/45 p-2.5">
                              <div className="relative h-11 w-11 overflow-hidden rounded-lg border border-foreground/10 bg-background/60">
                                {track.imageUrl ? (
                                  <Image src={track.imageUrl} alt={track.title} fill className="object-cover" unoptimized />
                                ) : (
                                  <div className="flex h-full items-center justify-center">
                                    <Music4 className="h-4.5 w-4.5 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-semibold text-foreground">
                                  #{index + 1} {track.title}
                                </div>
                                <div className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                  {track.artist}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-[1rem] border border-dashed border-foreground/12 bg-background/45 p-4 text-sm leading-6 text-muted-foreground">
                            {spotifyData.accountDataState === "needs_reauth"
                              ? "Top tracks need a fresh Spotify reconnect with the updated scopes."
                              : spotifyData.accountDataState === "rate_limited"
                                ? "Top tracks are temporarily rate-limited by Spotify."
                                : spotifyData.accountDataMessage ?? "Top tracks will appear after Spotify returns affinity data."}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        Top artists
                      </div>
                      <div className="mt-2 grid flex-1 gap-2">
                        {spotifyPreviewArtists.length ? (
                          spotifyPreviewArtists.map((artist, index) => (
                            <div key={artist.id} className="flex min-h-[4.15rem] items-center gap-3 rounded-[1rem] border border-foreground/10 bg-background/45 p-2.5">
                              <div className="relative h-11 w-11 overflow-hidden rounded-lg border border-foreground/10 bg-background/60">
                                {artist.imageUrl ? (
                                  <Image src={artist.imageUrl} alt={artist.name} fill className="object-cover" unoptimized />
                                ) : (
                                  <div className="flex h-full items-center justify-center">
                                    <Users className="h-4.5 w-4.5 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-semibold text-foreground">
                                  #{index + 1} {artist.name}
                                </div>
                                <div className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                  {artist.genres.join(" • ") || "Top artist"}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-[1rem] border border-dashed border-foreground/12 bg-background/45 p-4 text-sm leading-6 text-muted-foreground">
                            {spotifyData.accountDataState === "needs_reauth"
                              ? "Top artists need a fresh Spotify reconnect with the updated scopes."
                              : spotifyData.accountDataState === "rate_limited"
                                ? "Top artists are temporarily rate-limited by Spotify."
                                : spotifyData.accountDataMessage ?? "Top artists will appear after Spotify returns affinity data."}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="surface-card rounded-[1.3rem] border-border bg-card xl:col-span-2">
                <CardContent className="p-4 sm:p-5">
                  <div className="mb-4 flex items-center gap-2 text-xl font-display font-semibold tracking-tight">
                    <Music4 className="h-5 w-5 text-primary" />
                    Playlist picks
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {spotifyPlaylists.map((playlist) => (
                      <div key={playlist.src} className="flex h-full flex-col rounded-[1.2rem] border border-foreground/10 bg-background/45 p-3.5">
                        <div className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                          {playlist.label}
                        </div>
                        <div className="overflow-hidden rounded-[1rem] border border-foreground/10 bg-background/60">
                          <iframe
                            style={{ borderRadius: "12px" }}
                            src={playlist.src}
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            title={playlist.description}
                          />
                        </div>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">{playlist.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {typeof document !== "undefined" && isSpotifyDetailsOpen
                ? createPortal(
                    <div className="fixed inset-0 z-[220]" role="dialog" aria-modal="true" aria-labelledby="spotify-details-title">
                      <button
                        type="button"
                        aria-label="Close Spotify details"
                        className="absolute inset-0 bg-[hsl(var(--glass-shadow)/0.8)]"
                        onClick={() => setIsSpotifyDetailsOpen(false)}
                      />

                      <div className="pointer-events-none absolute inset-x-4 bottom-4 top-4 mx-auto max-w-6xl sm:inset-x-6 sm:bottom-6 sm:top-6">
                        <div className="pointer-events-auto relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-background shadow-[0_24px_80px_hsl(var(--glass-shadow)/0.42)]">
                          <button
                            type="button"
                            aria-label="Close Spotify details"
                            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-background text-muted-foreground transition-colors hover:text-foreground"
                            onClick={() => setIsSpotifyDetailsOpen(false)}
                          >
                            <X className="h-4 w-4" />
                          </button>

                          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
                            <div className="mb-4 flex flex-col gap-3 pr-10 text-left">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className="rounded-full border-foreground/10 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                                  Spotify details
                                </Badge>
                              </div>
                              <h3 id="spotify-details-title" className="font-display text-2xl tracking-[-0.04em] sm:text-3xl">
                                Top listening data
                              </h3>
                              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                                Switch between Spotify time windows and pull a deeper top-tracks and top-artists view without crowding the main integration card.
                              </p>
                            </div>

                            <div className="mb-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
                              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                <div className="rounded-[1.1rem] border border-foreground/10 bg-background/45 p-3">
                                  <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Window</div>
                                  <div className="text-sm font-medium text-foreground">
                                    {spotifySelectedDetails?.topWindowLabel ?? getSpotifyTimeRangeLabel(spotifyDetailsRange)}
                                  </div>
                                </div>
                                <div className="rounded-[1.1rem] border border-foreground/10 bg-background/45 p-3">
                                  <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Dataset</div>
                                  <div className="text-sm font-medium text-foreground">Top {spotifyDetailsLimit}</div>
                                </div>
                                <div className="rounded-[1.1rem] border border-foreground/10 bg-background/45 p-3">
                                  <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Followers</div>
                                  <div className="text-sm font-medium text-foreground">
                                    {formatCompactNumber(spotifySelectedDetails?.profile?.followers ?? spotifyData.profile?.followers)}
                                  </div>
                                </div>
                                <div className="rounded-[1.1rem] border border-foreground/10 bg-background/45 p-3">
                                  <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Account</div>
                                  <div className="text-sm font-medium text-foreground">
                                    {spotifySelectedDetails?.profile?.product ?? spotifyData.profile?.product ?? "Spotify"}
                                    {(spotifySelectedDetails?.profile?.country ?? spotifyData.profile?.country)
                                      ? ` • ${spotifySelectedDetails?.profile?.country ?? spotifyData.profile?.country}`
                                      : ""}
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col gap-3 xl:min-w-[18rem]">
                                <div>
                                  <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Time range</div>
                                  <div className="flex flex-wrap gap-2">
                                    {spotifyTimeRangeOptions.map((option) => (
                                      <Button
                                        key={option.value}
                                        type="button"
                                        size="sm"
                                        variant={spotifyDetailsRange === option.value ? "default" : "outline"}
                                        className="rounded-full px-3"
                                        onClick={() => setSpotifyDetailsRange(option.value)}
                                      >
                                        {option.label}
                                      </Button>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Top limit</div>
                                  <div className="flex flex-wrap gap-2">
                                    {spotifyTopLimitOptions.map((limit) => (
                                      <Button
                                        key={limit}
                                        type="button"
                                        size="sm"
                                        variant={spotifyDetailsLimit === limit ? "default" : "outline"}
                                        className="rounded-full px-3"
                                        onClick={() => setSpotifyDetailsLimit(limit)}
                                      >
                                        Top {limit}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {spotifySelectedDetails?.accountDataMessage ? (
                              <div className="mb-4 rounded-[1.15rem] border border-foreground/10 bg-background/45 px-4 py-3 text-sm leading-6 text-muted-foreground">
                                {spotifySelectedDetails.accountDataMessage}
                              </div>
                            ) : null}

                            {spotifyDetailsLoading && !spotifySelectedDetails ? (
                              <div className="grid min-w-0 gap-4 xl:grid-cols-2">
                                <div className="min-w-0 rounded-[1.25rem] border border-foreground/10 bg-background/45 p-4">
                                  <div className="mb-3 h-5 w-40 rounded bg-foreground/8 animate-pulse" />
                                  <div className="grid gap-2">
                                    {Array.from({ length: 6 }).map((_, index) => (
                                      <div key={`spotify-details-track-${index}`} className="h-16 rounded-[1rem] bg-foreground/8 animate-pulse" />
                                    ))}
                                  </div>
                                </div>
                                <div className="rounded-[1.25rem] border border-foreground/10 bg-background/45 p-4">
                                  <div className="mb-3 h-5 w-40 rounded bg-foreground/8 animate-pulse" />
                                  <div className="grid gap-2">
                                    {Array.from({ length: 6 }).map((_, index) => (
                                      <div key={`spotify-details-artist-${index}`} className="h-16 rounded-[1rem] bg-foreground/8 animate-pulse" />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : spotifyDetailsError && !spotifySelectedDetails ? (
                              <div className="rounded-[1.15rem] border border-dashed border-foreground/12 bg-background/45 p-5 text-sm leading-7 text-muted-foreground">
                                {spotifyDetailsError}
                              </div>
                            ) : !spotifySelectedDetails ? (
                              <div className="rounded-[1.15rem] border border-dashed border-foreground/12 bg-background/45 p-5 text-sm leading-7 text-muted-foreground">
                                Spotify detail data will appear here once the deeper listening query finishes.
                              </div>
                            ) : spotifySelectedDetails.mode !== "configured" ? (
                              <div className="rounded-[1.15rem] border border-dashed border-foreground/12 bg-background/45 p-5 text-sm leading-7 text-muted-foreground">
                                {spotifySelectedDetails.message}
                              </div>
                            ) : (
                              <div className="grid gap-4 xl:grid-cols-2">
                                <div className="rounded-[1.25rem] border border-foreground/10 bg-background/45 p-4">
                                  <div className="mb-3 flex items-center justify-between gap-3">
                                    <div>
                                      <div className="text-xl font-display font-semibold tracking-tight text-foreground">
                                        Top tracks
                                      </div>
                                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                        {spotifySelectedDetails.topWindowLabel} • top {spotifySelectedDetails.topLimit}
                                      </div>
                                    </div>
                                    <div className="rounded-full border border-foreground/10 bg-background/60 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                      {spotifySelectedDetails.topTracks.length} tracks
                                    </div>
                                  </div>
                                  <div className="grid min-w-0 gap-2">
                                    {spotifySelectedDetails.topTracks.length ? (
                                      spotifySelectedDetails.topTracks.map((track, index) => (
                                        <div key={track.id} className="w-full min-w-0 overflow-hidden rounded-[1rem] border border-foreground/10 bg-background/55 p-3">
                                          <div className="flex min-w-0 items-start gap-3">
                                            <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-foreground/10 bg-background/60">
                                              {track.imageUrl ? (
                                                <Image src={track.imageUrl} alt={track.title} fill className="object-cover" unoptimized />
                                              ) : (
                                                <div className="flex h-full items-center justify-center">
                                                  <Music4 className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                              )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                  <div className="truncate text-sm font-semibold text-foreground">
                                                    #{index + 1} {track.title}
                                                  </div>
                                                  <div className="truncate text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                                                    {track.artist}
                                                  </div>
                                                </div>
                                                {track.url ? (
                                                  <a
                                                    href={track.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
                                                  >
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                  </a>
                                                ) : null}
                                              </div>
                                              <div className="mt-2 flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                <span>{track.album ?? "Top track"}</span>
                                                <span>{formatDuration(track.durationMs)}</span>
                                                {typeof track.popularity === "number" ? (
                                                  <span>{track.popularity}/100 popularity</span>
                                                ) : null}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="rounded-[1rem] border border-dashed border-foreground/12 bg-background/50 p-5 text-sm leading-7 text-muted-foreground">
                                        No top tracks are available for this range right now.
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="min-w-0 rounded-[1.25rem] border border-foreground/10 bg-background/45 p-4">
                                  <div className="mb-3 flex items-center justify-between gap-3">
                                    <div>
                                      <div className="text-xl font-display font-semibold tracking-tight text-foreground">
                                        Top artists
                                      </div>
                                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                        {spotifySelectedDetails.topWindowLabel} • top {spotifySelectedDetails.topLimit}
                                      </div>
                                    </div>
                                    <div className="rounded-full border border-foreground/10 bg-background/60 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                      {spotifySelectedDetails.topArtists.length} artists
                                    </div>
                                  </div>
                                  <div className="grid min-w-0 gap-2">
                                    {spotifySelectedDetails.topArtists.length ? (
                                      spotifySelectedDetails.topArtists.map((artist, index) => (
                                        <div key={artist.id} className="w-full min-w-0 overflow-hidden rounded-[1rem] border border-foreground/10 bg-background/55 p-3">
                                          <div className="flex min-w-0 items-start gap-3">
                                            <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-foreground/10 bg-background/60">
                                              {artist.imageUrl ? (
                                                <Image src={artist.imageUrl} alt={artist.name} fill className="object-cover" unoptimized />
                                              ) : (
                                                <div className="flex h-full items-center justify-center">
                                                  <Users className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                              )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                  <div className="truncate text-sm font-semibold text-foreground">
                                                    #{index + 1} {artist.name}
                                                  </div>
                                                  <div className="truncate text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                                                    {artist.genres.join(" • ") || "Top artist"}
                                                  </div>
                                                </div>
                                                {artist.url ? (
                                                  <a
                                                    href={artist.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
                                                  >
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                  </a>
                                                ) : null}
                                              </div>
                                              <div className="mt-2 flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                {typeof artist.followers === "number" ? (
                                                  <span>{formatCompactNumber(artist.followers)} followers</span>
                                                ) : null}
                                                {typeof artist.popularity === "number" ? (
                                                  <span>{artist.popularity}/100 popularity</span>
                                                ) : null}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="rounded-[1rem] border border-dashed border-foreground/12 bg-background/50 p-5 text-sm leading-7 text-muted-foreground">
                                        No top artists are available for this range right now.
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>,
                    document.body
                  )
                : null}
            </div>
          )}
        </TabsContent>

        <TabsContent value="linkedin" className="mt-0">
          <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.18fr)]">
            <Card className="surface-card rounded-[2rem] border-border bg-card">
              <CardContent className="flex h-full flex-col gap-6 p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="rounded-full border-foreground/10 bg-background/75 px-4 py-1 font-mono text-[11px] uppercase tracking-[0.24em]">
                    <Linkedin className="mr-2 h-3.5 w-3.5" />
                    LinkedIn sync
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-foreground/10 bg-background/75 px-4 py-1 font-mono text-[11px] uppercase tracking-[0.24em]">
                    Feed adapter ready
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    LinkedIn activity
                  </div>
                  <h3 className="font-display text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                    Professional updates, shaped into a cleaner on-site format
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                    LinkedIn does not offer the same clean public surface as GitHub, so this tab uses a durable feed adapter. Once connected, it can surface writing and updates in a format that feels native to the portfolio.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] border border-foreground/10 bg-background/45 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Rss className="h-4 w-4 text-primary" />
                      Supported source
                    </div>
                    <p className="text-sm leading-7 text-muted-foreground">
                      Any LinkedIn-synced RSS or JSON feed can be connected through `LINKEDIN_FEED_URL`.
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] border border-foreground/10 bg-background/45 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                      <ExternalLink className="h-4 w-4 text-primary" />
                      Portfolio behavior
                    </div>
                    <p className="text-sm leading-7 text-muted-foreground">
                      Posts are normalized into short article-style cards so the content feels native to the site instead of embedded.
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-foreground/10 bg-background/45 p-5 text-sm leading-7 text-muted-foreground">
                  {linkedinLoading
                    ? "Loading LinkedIn activity adapter..."
                    : linkedinError
                      ? linkedinError
                      : linkedinData?.message ?? "LinkedIn activity is not configured yet."}
                </div>

                <div className="flex flex-wrap gap-3">
                  {linkedinData?.profileUrl ? (
                    <Button asChild className="rounded-full px-5">
                      <a href={linkedinData.profileUrl} target="_blank" rel="noreferrer">
                        Open LinkedIn
                      </a>
                    </Button>
                  ) : null}
                  <div className="rounded-full border border-foreground/10 bg-background/60 px-4 py-2 text-sm text-muted-foreground">
                    {linkedinData?.mode === "configured"
                      ? `${linkedinData.posts.length} synced posts ready`
                      : "Waiting for a configured LinkedIn feed"}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="surface-card rounded-[2rem] border-border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Linkedin className="h-5 w-5 text-primary" />
                  LinkedIn posts
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {linkedinLoading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <div key={`linkedin-loading-${index}`} className="rounded-[1.5rem] border border-foreground/8 bg-background/45 p-5 animate-pulse">
                        <div className="mb-3 h-4 w-2/3 rounded bg-foreground/8" />
                        <div className="mb-2 h-3 w-full rounded bg-foreground/8" />
                        <div className="h-3 w-4/5 rounded bg-foreground/8" />
                      </div>
                    ))
                  : linkedinData?.posts.length
                    ? linkedinData.posts.map((post) => (
                        <motion.div
                          key={post.id}
                          whileHover={{ y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="rounded-[1.5rem] border border-foreground/10 bg-background/45 p-5"
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <Badge variant="outline" className="rounded-full border-foreground/10 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                              LinkedIn Post
                            </Badge>
                            <div className="text-xs text-muted-foreground">{formatRelative(post.publishedAt)}</div>
                          </div>
                          <div className="mb-2 text-lg font-semibold text-foreground">{post.title}</div>
                          <p className="text-sm leading-7 text-muted-foreground">{post.summary}</p>
                        </motion.div>
                      ))
                    : (
                      <div className="rounded-[1.5rem] border border-dashed border-foreground/12 bg-background/45 p-6 text-sm leading-7 text-muted-foreground">
                        The LinkedIn tab is live, but no feed has been configured yet. When you add `LINKEDIN_FEED_URL`, this area will automatically turn your synced LinkedIn activity into blog-style entries.
                      </div>
                    )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-chat" className="mt-0">
          <PortfolioChat />
        </TabsContent>
      </Tabs>
      </section>
    </AnimatedSection>
  )
}
