"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Command, CornerDownLeft, Moon, Palette, Sparkles, Sun, TerminalSquare } from "lucide-react"
import { useTheme } from "next-themes"

import { contactLinks, educationProfile, internshipEntries, projects, techClusters } from "@/components/portfolio/data"
import type { SectionId } from "@/components/portfolio/types"
import { scrollToSection } from "@/components/portfolio/utils"
import { accentThemes, type AccentThemeId, useAccentTheme } from "@/components/theme-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type IntegrationTerminalProps = {
  githubUrl: string
  githubRepoCount?: number
  githubActiveRepoCount?: number
  githubTopLanguage?: string
  latestRepoName?: string
  linkedinProfileUrl?: string
  linkedinPostCount?: number
  onSelectTab?: (tab: "github" | "spotify" | "linkedin" | "ai-chat" | "terminal") => void
  spotifyTrack?: {
    title: string | null
    artist: string | null
    url: string | null
  }
}

type TerminalAction = {
  label: string
  href?: string
  section?: SectionId
  tab?: "github" | "spotify" | "linkedin" | "ai-chat" | "terminal"
  command?: string
}

type TerminalEntry = {
  id: string
  type: "system" | "command" | "response" | "error"
  lines: string[]
  actions?: TerminalAction[]
}

type TerminalCommand = {
  name: string
  aliases: string[]
  description: string
}

const terminalCommands: TerminalCommand[] = [
  { name: "help", aliases: ["?", "ls", "dir"], description: "List the available console commands." },
  { name: "projects", aliases: ["work", "experience"], description: "Show featured builds and jump to the work section." },
  { name: "resume", aliases: ["whoami", "about", "bio"], description: "Return the short current academic and internship snapshot." },
  { name: "contact", aliases: ["reachout", "email"], description: "Show direct ways to get in touch." },
  { name: "github", aliases: ["gh", "code"], description: "Inspect public GitHub signal and open the profile." },
  { name: "linkedin", aliases: ["network"], description: "Show LinkedIn availability and synced feed status." },
  { name: "spotify", aliases: ["music", "playlists"], description: "Check the live listening surface and playlist picks." },
  { name: "theme", aliases: ["appearance", "mode"], description: "Inspect or switch the current site theme." },
  { name: "accent", aliases: ["color", "palette"], description: "Preview or switch the active accent theme." },
  { name: "status", aliases: ["state", "uptime"], description: "Show a compact snapshot of loaded integrations." },
  { name: "skills", aliases: ["stack", "map"], description: "Jump to the live skills map and cluster view." },
  { name: "clear", aliases: ["cls", "reset"], description: "Clear the console output and reprint the boot log." },
]

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

function createBootEntries(): TerminalEntry[] {
  return [
    {
      id: createId(),
      type: "system",
      lines: ["portfolio integration console online"],
    },
    {
      id: createId(),
      type: "system",
      lines: ["adapters ready: github, spotify, linkedin, ai-chat"],
    },
    {
      id: createId(),
      type: "system",
      lines: ['type "help" to inspect commands, use Tab to autocomplete'],
    },
  ]
}

function findCommand(rawCommand: string) {
  const normalized = rawCommand.trim().toLowerCase()
  const firstToken = normalized.split(/\s+/)[0] ?? ""

  return terminalCommands.find(
    (command) => command.name === firstToken || command.aliases.includes(firstToken)
  )
}

function buildCommandResponse(
  rawCommand: string,
  {
    githubUrl,
    githubRepoCount,
    githubActiveRepoCount,
    githubTopLanguage,
    latestRepoName,
    linkedinProfileUrl,
    linkedinPostCount,
    spotifyTrack,
  }: IntegrationTerminalProps
): TerminalEntry | null {
  const command = findCommand(rawCommand)
  const tokens = rawCommand.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const [, arg] = tokens
  const emailLink = contactLinks.find((link) => link.label === "Email")
  const linkedInLink = linkedinProfileUrl || contactLinks.find((link) => link.label === "LinkedIn")?.href
  const gitHubLink = githubUrl || contactLinks.find((link) => link.label === "GitHub")?.href || "https://github.com/connorfurby"

  if (!command) {
    return {
      id: createId(),
      type: "error",
      lines: [`unknown command: ${rawCommand}`, 'try "help" for the command list'],
    }
  }

  switch (command.name) {
    case "help":
      return {
        id: createId(),
        type: "response",
        lines: [
          "available commands:",
          ...terminalCommands.map((item) => `${item.name.padEnd(8, " ")} ${item.description}`),
        ],
        actions: [
          { label: "Open Work", section: "experience" },
          { label: "Open Contact", section: "contact" },
          { label: "Check Status", command: "status" },
        ],
      }
    case "projects":
      return {
        id: createId(),
        type: "response",
        lines: [
          `featured builds: ${projects.slice(0, 5).map((project) => project.title).join(", ")}`,
          "media walkthroughs and deeper breakdowns live in the experience section.",
        ],
        actions: [
          { label: "View Projects", section: "experience" },
          { label: "Open GitHub", href: gitHubLink },
        ],
      }
    case "resume":
      return {
        id: createId(),
        type: "response",
        lines: [
          `${educationProfile.school} • ${educationProfile.credential}`,
          `${educationProfile.highlights[0]} • ${internshipEntries.length} internship roles highlighted on site`,
          "current focus: full-stack product engineering, AI-enabled workflows, and polished interface work.",
        ],
        actions: [
          { label: "Open Education", section: "education" },
          { label: "Open Experience", section: "experience" },
          ...(emailLink ? [{ label: "Request Resume", href: emailLink.href }] : []),
        ],
      }
    case "contact":
      return {
        id: createId(),
        type: "response",
        lines: [
          `email: ${emailLink?.value ?? "cfurby@wisc.edu"}`,
          `linkedin: ${linkedInLink ?? "profile ready when configured"}`,
          `github: ${gitHubLink}`,
        ],
        actions: [
          { label: "Open Contact Form", section: "contact" },
          ...(emailLink ? [{ label: "Send Email", href: emailLink.href }] : []),
          ...(linkedInLink ? [{ label: "Open LinkedIn", href: linkedInLink }] : []),
        ],
      }
    case "github":
      return {
        id: createId(),
        type: "response",
        lines: [
          `public profile: ${gitHubLink}`,
          githubRepoCount ? `${githubRepoCount} original repositories currently tracked in the live dashboard.` : "live repository counts load from the GitHub API in this section.",
          githubActiveRepoCount ? `${githubActiveRepoCount} repositories show recent activity right now.` : "active repo count loads from the GitHub API.",
          githubTopLanguage ? `current leading language: ${githubTopLanguage}` : "language mix appears once GitHub data finishes loading.",
          latestRepoName ? `latest highlighted repository: ${latestRepoName}` : "latest highlighted repository becomes available when GitHub data finishes loading.",
        ],
        actions: [
          { label: "Open GitHub", href: gitHubLink },
          { label: "Open GitHub Tab", tab: "github" },
        ],
      }
    case "linkedin":
      return {
        id: createId(),
        type: "response",
        lines: [
          linkedInLink ? `profile available: ${linkedInLink}` : "profile URL is ready to plug in when the LinkedIn adapter is configured.",
          typeof linkedinPostCount === "number"
            ? `${linkedinPostCount} synced LinkedIn posts currently available in the feed view.`
            : "LinkedIn feed status is handled by the live adapter in the integrations section.",
        ],
        actions: linkedInLink
          ? [
              { label: "Open LinkedIn", href: linkedInLink },
              { label: "Open LinkedIn Tab", tab: "linkedin" },
            ]
          : [{ label: "Open Contact", section: "contact" }],
      }
    case "spotify":
      return {
        id: createId(),
        type: "response",
        lines: [
          spotifyTrack?.title
            ? `now playing: ${spotifyTrack.title}${spotifyTrack.artist ? ` — ${spotifyTrack.artist}` : ""}`
            : "spotify live state is available in the listening tab when playback data is present.",
          "top tracks, artists, and playlist picks live in the Spotify tab.",
        ],
        actions: [
          { label: "Open Spotify Tab", tab: "spotify" },
          ...(spotifyTrack?.url ? [{ label: "Open Current Track", href: spotifyTrack.url }] : []),
        ],
      }
    case "theme":
      if (arg && !["light", "dark"].includes(arg)) {
        return {
          id: createId(),
          type: "error",
          lines: [`unknown theme mode: ${arg}`, 'use "theme", "theme dark", or "theme light"'],
        }
      }

      return {
        id: createId(),
        type: "response",
        lines: [
          arg ? `switching theme mode to ${arg}` : "theme controls are available directly in this terminal surface.",
          'quick commands: "theme dark", "theme light", "accent violet", "accent rose", "accent emerald"',
        ],
        actions: [
          { label: "Light", command: "theme light" },
          { label: "Dark", command: "theme dark" },
          { label: "Accent Menu", command: "accent" },
        ],
      }
    case "accent":
      if (arg && !accentThemes.some((theme) => theme.id === arg)) {
        return {
          id: createId(),
          type: "error",
          lines: [
            `unknown accent: ${arg}`,
            `available accents: ${accentThemes.map((theme) => theme.id).join(", ")}`,
          ],
        }
      }

      return {
        id: createId(),
        type: "response",
        lines: [
          arg ? `switching accent theme to ${arg}` : `available accents: ${accentThemes.map((theme) => theme.id).join(", ")}`,
          "accent changes update the look and feel across the site.",
        ],
        actions: accentThemes.slice(0, 5).map((theme) => ({
          label: theme.label,
          command: `accent ${theme.id}`,
        })),
      }
    case "status":
      return {
        id: createId(),
        type: "response",
        lines: [
          `github: ${githubRepoCount ? `${githubRepoCount} repos tracked` : "loading"}${githubActiveRepoCount ? ` • ${githubActiveRepoCount} active` : ""}`,
          `linkedin: ${typeof linkedinPostCount === "number" ? `${linkedinPostCount} synced posts` : "adapter status pending"}`,
          spotifyTrack?.title
            ? `spotify: live track detected • ${spotifyTrack.title}${spotifyTrack.artist ? ` — ${spotifyTrack.artist}` : ""}`
            : "spotify: playback state available when live data is present",
        ],
        actions: [
          { label: "GitHub", tab: "github" },
          { label: "Spotify", tab: "spotify" },
          { label: "LinkedIn", tab: "linkedin" },
        ],
      }
    case "skills":
      return {
        id: createId(),
        type: "response",
        lines: [
          `${techClusters.length} skill clusters mapped across frontend, full-stack, AI, foundations, creativity, and delivery.`,
          "the map connects the tools and strengths that show up together most often in my projects.",
        ],
        actions: [{ label: "Open Skills Map", section: "skills" }],
      }
    default:
      return {
        id: createId(),
        type: "error",
        lines: [`command handler missing for: ${command.name}`],
      }
  }
}

export default function IntegrationTerminal(props: IntegrationTerminalProps) {
  const outputRef = useRef<HTMLDivElement | null>(null)
  const [entries, setEntries] = useState<TerminalEntry[]>(() => createBootEntries())
  const [inputValue, setInputValue] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [, setHistoryIndex] = useState(-1)
  const [isRunning, setIsRunning] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const { accentTheme, setAccentTheme, isAccentReady } = useAccentTheme()
  const currentAccentLabel = accentThemes.find((theme) => theme.id === accentTheme)?.label ?? "Accent"

  useEffect(() => {
    const container = outputRef.current

    if (!container) {
      return
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    })
  }, [entries, isRunning])

  const suggestions = useMemo(() => {
    const normalized = inputValue.trim().toLowerCase()

    if (!normalized) {
      return terminalCommands.slice(0, 6)
    }

    return terminalCommands.filter((command) => {
      return command.name.startsWith(normalized) || command.aliases.some((alias) => alias.startsWith(normalized))
    }).slice(0, 6)
  }, [inputValue])

  const runCommand = (rawCommand: string) => {
    const trimmed = rawCommand.trim()

    if (!trimmed || isRunning) {
      return
    }

    const nextCommand = trimmed.toLowerCase()
    const resolvedCommand = findCommand(nextCommand)

    setEntries((current) => [
      ...current,
      {
        id: createId(),
        type: "command",
        lines: [trimmed],
      },
    ])

    setCommandHistory((current) => [...current, trimmed])
    setHistoryIndex(-1)
    setInputValue("")

    if (resolvedCommand?.name === "clear") {
      setEntries(createBootEntries())
      return
    }

    setIsRunning(true)

    window.setTimeout(() => {
      const normalized = trimmed.toLowerCase()
      const tokens = normalized.split(/\s+/).filter(Boolean)
      const [commandName, commandArg] = tokens
      const resolvedCommand = findCommand(commandName ?? "")
      const response = buildCommandResponse(trimmed, props)

      if (resolvedCommand?.name === "theme" && commandArg && ["light", "dark"].includes(commandArg)) {
        setTheme(commandArg)
      }

      if (resolvedCommand?.name === "accent" && commandArg && accentThemes.some((theme) => theme.id === commandArg)) {
        setAccentTheme(commandArg as AccentThemeId)
      }

      if (response) {
        setEntries((current) => [...current, response])
      }

      setIsRunning(false)
    }, 180)
  }

  return (
    <Card className="surface-card overflow-hidden rounded-[2rem] border-white/10 bg-[linear-gradient(180deg,rgba(5,12,24,0.96),rgba(9,18,34,0.94))] text-slate-100">
      <CardContent className="p-0">
        <div className="border-b border-white/10 px-4 py-4 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400/80" />
                <span className="h-3 w-3 rounded-full bg-amber-300/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-400">
                  Terminal Interface
                </p>
                <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-white">
                  <TerminalSquare className="h-4 w-4 text-cyan-300" />
                  Developer Console
                </div>
              </div>
            </div>
            <Badge className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-100">
              Interactive
            </Badge>
          </div>
        </div>

        <div className="border-b border-white/10 px-4 py-4 sm:px-5">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            Run commands for projects, resume, contact, GitHub, LinkedIn, Spotify, and site appearance.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {terminalCommands.slice(0, 10).map((command) => (
              <button
                key={command.name}
                type="button"
                onClick={() => setInputValue(command.name)}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-300 transition-colors hover:bg-white/[0.08]"
              >
                {command.name}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
              {resolvedTheme === "light" ? "Light" : "Dark"} mode
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
              {isAccentReady ? `${currentAccentLabel} accent` : "Loading accent"}
            </span>
            {props.githubRepoCount ? (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
                {props.githubRepoCount} repos
              </span>
            ) : null}
            {props.spotifyTrack?.title ? (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
                Now playing: {props.spotifyTrack.title}
              </span>
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant={resolvedTheme === "light" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                className="h-8 rounded-full border-white/10 bg-white/[0.04] px-3 text-xs text-slate-100 hover:bg-white/[0.08]"
              >
                <Sun className="mr-1.5 h-3.5 w-3.5" />
                Light
              </Button>
              <Button
                type="button"
                variant={resolvedTheme === "dark" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="h-8 rounded-full border-white/10 bg-white/[0.04] px-3 text-xs text-slate-100 hover:bg-white/[0.08]"
              >
                <Moon className="mr-1.5 h-3.5 w-3.5" />
                Dark
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                <Palette className="h-3 w-3 text-cyan-300" />
                Accent
              </span>
              {accentThemes.slice(0, 6).map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setAccentTheme(theme.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] text-slate-100 transition-colors",
                    accentTheme === theme.id ? "border-cyan-300/40 bg-white/[0.12]" : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"
                  )}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, hsl(${theme.swatch.start}), hsl(${theme.swatch.end}))`,
                    }}
                  />
                  {theme.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div ref={outputRef} aria-live="polite" className="h-[22rem] overflow-y-auto px-4 py-4 font-mono text-sm sm:px-5">
          <AnimatePresence initial={false}>
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="mb-4"
              >
                {entry.type === "command" ? (
                  <div className="flex items-start gap-3 text-emerald-300">
                    <span className="shrink-0">connor@portfolio:~$</span>
                    <span className="text-slate-100">{entry.lines[0]}</span>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "space-y-1.5",
                      entry.type === "error"
                        ? "text-rose-300"
                        : entry.type === "system"
                          ? "text-slate-400"
                          : "text-slate-100"
                    )}
                  >
                    {entry.lines.map((line) => (
                      <div key={`${entry.id}-${line}`}>{line}</div>
                    ))}
                  </div>
                )}

                {entry.actions?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.actions.map((action) => {
                      if (action.href) {
                        return (
                          <Button
                            key={`${entry.id}-${action.label}`}
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-full border-white/10 bg-white/[0.04] px-3 text-xs text-slate-100 hover:bg-white/[0.08]"
                          >
                            <a href={action.href} target="_blank" rel="noreferrer">
                              {action.label}
                            </a>
                          </Button>
                        )
                      }

                      if (action.tab || action.section) {
                        return (
                          <Button
                            key={`${entry.id}-${action.label}`}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (action.tab) {
                                props.onSelectTab?.(action.tab)
                              }

                              if (action.section) {
                                scrollToSection(action.section)
                              }
                            }}
                            className="h-8 rounded-full border-white/10 bg-white/[0.04] px-3 text-xs text-slate-100 hover:bg-white/[0.08]"
                          >
                            {action.label}
                          </Button>
                        )
                      }

                      if (action.command) {
                        return (
                          <Button
                            key={`${entry.id}-${action.label}`}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => runCommand(action.command ?? "")}
                            className="h-8 rounded-full border-white/10 bg-white/[0.04] px-3 text-xs text-slate-100 hover:bg-white/[0.08]"
                          >
                            {action.label}
                          </Button>
                        )
                      }

                      return null
                    })}
                  </div>
                ) : null}
              </motion.div>
            ))}
          </AnimatePresence>

          {isRunning ? (
            <div className="flex items-center gap-3 font-mono text-sm text-cyan-200">
              <Command className="h-4 w-4" />
              executing...
            </div>
          ) : null}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            runCommand(inputValue)
          }}
          className="border-t border-white/10 px-4 py-4 sm:px-5"
        >
          <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-3 py-3 shadow-[0_16px_32px_rgba(0,0,0,0.22)]">
            <div className="flex items-center gap-3">
              <span className="shrink-0 font-mono text-sm text-emerald-300">connor@portfolio:~$</span>
              <input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Tab" && suggestions[0]) {
                    event.preventDefault()
                    setInputValue(suggestions[0].name)
                  }

                  if (event.key === "ArrowUp" && commandHistory.length) {
                    event.preventDefault()
                    setHistoryIndex((current) => {
                      const nextIndex = Math.min(current + 1, commandHistory.length - 1)
                      const nextValue = commandHistory[commandHistory.length - 1 - nextIndex] ?? ""
                      setInputValue(nextValue)
                      return nextIndex
                    })
                  }

                  if (event.key === "ArrowDown" && commandHistory.length) {
                    event.preventDefault()
                    setHistoryIndex((current) => {
                      const nextIndex = current - 1

                      if (nextIndex < 0) {
                        setInputValue("")
                        return -1
                      }

                      const nextValue = commandHistory[commandHistory.length - 1 - nextIndex] ?? ""
                      setInputValue(nextValue)
                      return nextIndex
                    })
                  }
                }}
                placeholder="help"
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                spellCheck={false}
                autoComplete="off"
              />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="h-9 rounded-full border-white/10 bg-white/[0.06] px-4 text-slate-100 hover:bg-white/[0.1]"
              >
                Run
                <CornerDownLeft className="ml-2 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>Tab autocompletes.</span>
            <span>Arrow keys cycle command history.</span>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
