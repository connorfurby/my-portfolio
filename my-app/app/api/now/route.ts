import { Buffer } from "buffer"

import { NextResponse } from "next/server"

import type { NowApiResponse, NowEvent, NowEventGroup, NowSignal } from "@/lib/now"

const REVALIDATE_SECONDS = 1800
const GITHUB_USERNAME = "connorfurby"
const GITHUB_API_BASE = "https://api.github.com"

type GitHubRepository = {
  id: number
  name: string
  html_url: string
  description: string | null
  pushed_at: string
  language: string | null
  stargazers_count: number
  archived: boolean
  fork: boolean
}

type SpotifyTokenResponse = {
  access_token: string
}

type SpotifyCurrentTrackResponse = {
  is_playing?: boolean
  item?: {
    name?: string
    external_urls?: {
      spotify?: string
    }
    album?: {
      name?: string
      images?: Array<{ url?: string }>
    }
    artists?: Array<{
      name?: string
    }>
  }
}

type NotionRichText = {
  plain_text?: string
}

type NotionProperty =
  | {
      type: "title"
      title?: NotionRichText[]
    }
  | {
      type: "rich_text"
      rich_text?: NotionRichText[]
    }
  | {
      type: "url"
      url?: string | null
    }
  | {
      type: "date"
      date?: {
        start?: string
      } | null
    }
  | {
      type: "status"
      status?: {
        name?: string
      } | null
    }
  | {
      type: "select"
      select?: {
        name?: string
      } | null
    }
  | {
      type: "checkbox"
      checkbox?: boolean
    }

type NotionPage = {
  id: string
  url: string
  properties: Record<string, NotionProperty>
}

function getGitHubHeaders() {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  }
}

async function fetchGitHubJson<T>(path: string): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: getGitHubHeaders(),
    next: { revalidate: REVALIDATE_SECONDS },
  })

  if (!response.ok) {
    throw new Error(`GitHub request failed with ${response.status}`)
  }

  return (await response.json()) as T
}

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

function normalizeText(value: unknown) {
  if (typeof value !== "string") {
    return ""
  }

  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
}

function getNotionProperty(page: NotionPage, propertyName: string) {
  return page.properties[propertyName]
}

function getNotionText(page: NotionPage, propertyName: string) {
  const property = getNotionProperty(page, propertyName)

  if (!property) {
    return ""
  }

  if (property.type === "title") {
    return property.title?.map((item) => item.plain_text ?? "").join("").trim() ?? ""
  }

  if (property.type === "rich_text") {
    return property.rich_text?.map((item) => item.plain_text ?? "").join("").trim() ?? ""
  }

  if (property.type === "status") {
    return property.status?.name ?? ""
  }

  if (property.type === "select") {
    return property.select?.name ?? ""
  }

  return ""
}

function getNotionUrl(page: NotionPage, propertyName: string) {
  const property = getNotionProperty(page, propertyName)
  return property?.type === "url" ? property.url ?? "" : ""
}

function getNotionDate(page: NotionPage, propertyName: string) {
  const property = getNotionProperty(page, propertyName)
  return property?.type === "date" ? property.date?.start ?? "" : ""
}

function getNotionCheckbox(page: NotionPage, propertyName: string) {
  const property = getNotionProperty(page, propertyName)
  return property?.type === "checkbox" ? property.checkbox : false
}

function defaultSpotifySignal(): NowSignal {
  return {
    source: "Spotify",
    state: "unconfigured",
    label: "Currently playing",
    title: "Spotify not connected yet",
    description: "Add Spotify credentials and a refresh token to show the track currently in rotation.",
  }
}

async function fetchSpotifyCurrentTrack() {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    return defaultSpotifySignal()
  }

  try {
    const basicToken = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      next: { revalidate: REVALIDATE_SECONDS },
    })

    if (!tokenResponse.ok) {
      throw new Error(`Spotify token refresh failed with ${tokenResponse.status}`)
    }

    const tokenPayload = (await tokenResponse.json()) as SpotifyTokenResponse
    const currentTrackResponse = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${tokenPayload.access_token}`,
      },
      next: { revalidate: 60 },
    })

    if (currentTrackResponse.status === 204) {
      return {
        source: "Spotify",
        state: "idle",
        label: "Currently playing",
        title: "Nothing is playing right now",
        description: "Spotify is connected. This card updates automatically when a new track starts.",
      } satisfies NowSignal
    }

    if (!currentTrackResponse.ok) {
      throw new Error(`Spotify current track failed with ${currentTrackResponse.status}`)
    }

    const payload = (await currentTrackResponse.json()) as SpotifyCurrentTrackResponse
    const artists = payload.item?.artists?.map((artist) => artist.name).filter(Boolean).join(", ") ?? "Unknown artist"

    return {
      source: "Spotify",
      state: payload.is_playing ? "active" : "idle",
      label: "Currently playing",
      title: payload.item?.name ?? "Unknown track",
      subtitle: artists,
      description: payload.item?.album?.name ? `From ${payload.item.album.name}` : "Live from Spotify.",
      url: payload.item?.external_urls?.spotify,
      imageUrl: payload.item?.album?.images?.[0]?.url,
    } satisfies NowSignal
  } catch {
    return {
      source: "Spotify",
      state: "error",
      label: "Currently playing",
      title: "Spotify is temporarily unavailable",
      description: "The track card will recover automatically when Spotify responds again.",
    } satisfies NowSignal
  }
}

function parseGoodreadsFeed(xml: string) {
  const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/gi))

  if (!items.length) {
    return null
  }

  const first = items[0]?.[1] ?? ""
  const title = normalizeText(first.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "")
  const link = normalizeText(first.match(/<link>([\s\S]*?)<\/link>/i)?.[1] ?? "")
  const description = normalizeText(first.match(/<description>([\s\S]*?)<\/description>/i)?.[1] ?? "")

  if (!title) {
    return null
  }

  return {
    title,
    link,
    description,
  }
}

async function fetchCurrentBook() {
  const feedUrl = process.env.GOODREADS_FEED_URL

  if (!feedUrl) {
    return {
      source: "Goodreads",
      state: "unconfigured",
      label: "Current book",
      title: "Goodreads feed not connected yet",
      description: "Add a Goodreads currently-reading RSS feed to show the book on deck right now.",
    } satisfies NowSignal
  }

  try {
    const response = await fetch(feedUrl, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml;q=0.9",
      },
    })

    if (!response.ok) {
      throw new Error(`Goodreads feed failed with ${response.status}`)
    }

    const raw = await response.text()
    const item = parseGoodreadsFeed(raw)

    if (!item) {
      return {
        source: "Goodreads",
        state: "idle",
        label: "Current book",
        title: "No current book found",
        description: "The Goodreads feed is connected, but there was no currently reading item to display.",
      } satisfies NowSignal
    }

    return {
      source: "Goodreads",
      state: "active",
      label: "Current book",
      title: item.title,
      description: item.description || "Synced from Goodreads.",
      url: item.link || undefined,
    } satisfies NowSignal
  } catch {
    return {
      source: "Goodreads",
      state: "error",
      label: "Current book",
      title: "Goodreads is temporarily unavailable",
      description: "The reading card will recover automatically when the feed responds again.",
    } satisfies NowSignal
  }
}

async function fetchLatestProject() {
  try {
    const repositories = await fetchGitHubJson<GitHubRepository[]>(
      `/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`
    )

    const repository = repositories
      .filter((item) => !item.archived && !item.fork)
      .sort((left, right) => new Date(right.pushed_at).getTime() - new Date(left.pushed_at).getTime())[0]

    if (!repository) {
      return {
        source: "GitHub",
        state: "idle",
        label: "Latest project",
        title: "No recent GitHub project found",
        description: "GitHub is connected, but there was nothing recent enough to feature here.",
      } satisfies NowSignal
    }

    return {
      source: "GitHub",
      state: "active",
      label: "Latest project",
      title: repository.name,
      subtitle: repository.language ?? "Mixed stack",
      description: repository.description
        ? `${repository.description} Updated ${formatRelative(repository.pushed_at)}.`
        : `Updated ${formatRelative(repository.pushed_at)} with ${repository.stargazers_count} stars on GitHub.`,
      url: repository.html_url,
    } satisfies NowSignal
  } catch {
    return {
      source: "GitHub",
      state: "error",
      label: "Latest project",
      title: "GitHub is temporarily unavailable",
      description: "The latest project card will recover automatically when the GitHub API responds again.",
    } satisfies NowSignal
  }
}

function buildDefaultNotionSignals() {
  return {
    currentlyLearning: {
      source: "Notion",
      state: "unconfigured",
      label: "Currently learning",
      title: "Notion not connected yet",
      description: "Add a Notion data source to keep learning notes and priorities synced automatically.",
    } satisfies NowSignal,
    upcomingEvents: {
      source: "Notion",
      state: "unconfigured",
      label: "Upcoming events",
      message: "Add a Notion data source to sync upcoming events, launches, or deadlines.",
      items: [],
    } satisfies NowEventGroup,
  }
}

async function fetchNotionNowContent() {
  const notionToken = process.env.NOTION_API_KEY
  const dataSourceId = process.env.NOTION_NOW_DATA_SOURCE_ID

  if (!notionToken || !dataSourceId) {
    return buildDefaultNotionSignals()
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/data_sources/${dataSourceId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Content-Type": "application/json",
        "Notion-Version": "2025-09-03",
      },
      body: JSON.stringify({
        page_size: 20,
        sorts: [
          {
            property: "Priority",
            direction: "ascending",
          },
        ],
      }),
      next: { revalidate: REVALIDATE_SECONDS },
    })

    if (!response.ok) {
      throw new Error(`Notion query failed with ${response.status}`)
    }

    const payload = (await response.json()) as { results?: NotionPage[] }
    const pages = payload.results ?? []

    const learningEntry = pages.find((page) => {
      const category = getNotionText(page, "Category").toLowerCase()
      return category === "learning" || getNotionCheckbox(page, "Featured")
    })

    const upcomingItems = pages
      .filter((page) => getNotionText(page, "Category").toLowerCase() === "event")
      .map(
        (page) =>
          ({
            id: page.id,
            title: getNotionText(page, "Name") || "Upcoming event",
            date: getNotionDate(page, "Date") || undefined,
            description: getNotionText(page, "Summary") || undefined,
            url: getNotionUrl(page, "URL") || page.url,
          }) satisfies NowEvent
      )
      .sort((left, right) => new Date(left.date ?? "").getTime() - new Date(right.date ?? "").getTime())
      .slice(0, 4)

    return {
      currentlyLearning: learningEntry
        ? ({
            source: "Notion",
            state: "active",
            label: "Currently learning",
            title: getNotionText(learningEntry, "Name") || "Learning focus",
            subtitle: getNotionText(learningEntry, "Status") || undefined,
            description:
              getNotionText(learningEntry, "Summary") || "Synced from a Notion now-tracking data source.",
            url: getNotionUrl(learningEntry, "URL") || learningEntry.url,
          } satisfies NowSignal)
        : ({
            source: "Notion",
            state: "idle",
            label: "Currently learning",
            title: "No learning focus set",
            description: "The Notion data source is connected, but there is no active learning entry right now.",
          } satisfies NowSignal),
      upcomingEvents: {
        source: "Notion",
        state: upcomingItems.length ? "active" : "idle",
        label: "Upcoming events",
        message: upcomingItems.length
          ? "Synced from Notion."
          : "The Notion data source is connected, but there are no upcoming events right now.",
        items: upcomingItems,
      } satisfies NowEventGroup,
    }
  } catch {
    return {
      currentlyLearning: {
        source: "Notion",
        state: "error",
        label: "Currently learning",
        title: "Notion is temporarily unavailable",
        description: "The learning card will recover automatically when the Notion API responds again.",
      } satisfies NowSignal,
      upcomingEvents: {
        source: "Notion",
        state: "error",
        label: "Upcoming events",
        message: "The Notion event feed is temporarily unavailable.",
        items: [],
      } satisfies NowEventGroup,
    }
  }
}

export async function GET() {
  const [currentTrack, currentBook, latestProject, notionContent] = await Promise.all([
    fetchSpotifyCurrentTrack(),
    fetchCurrentBook(),
    fetchLatestProject(),
    fetchNotionNowContent(),
  ])

  const payload: NowApiResponse = {
    updatedAt: new Date().toISOString(),
    currentTrack,
    currentBook,
    latestProject,
    currentlyLearning: notionContent.currentlyLearning,
    upcomingEvents: notionContent.upcomingEvents,
  }

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
    },
  })
}
