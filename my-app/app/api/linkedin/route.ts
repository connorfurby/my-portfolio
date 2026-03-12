import { NextResponse } from "next/server"

const REVALIDATE_SECONDS = 1800

type LinkedInFeedItem = {
  id: string
  title: string
  summary: string
  url: string
  publishedAt: string
}

function normalizeText(value: unknown) {
  if (typeof value !== "string") {
    return ""
  }

  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

function parseSimpleRssItems(xml: string) {
  const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/gi))

  return items.slice(0, 6).map((match, index) => {
    const block = match[1] ?? ""
    const title = block.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "LinkedIn post"
    const link = block.match(/<link>([\s\S]*?)<\/link>/i)?.[1] ?? ""
    const description = block.match(/<description>([\s\S]*?)<\/description>/i)?.[1] ?? ""
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] ?? new Date().toISOString()
    const guid = block.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i)?.[1] ?? `${index}`

    return {
      id: normalizeText(guid) || `${index}`,
      title: normalizeText(title) || "LinkedIn post",
      summary: normalizeText(description) || "LinkedIn activity synced through an external feed.",
      url: normalizeText(link),
      publishedAt: new Date(pubDate).toISOString(),
    }
  })
}

function parseJsonFeedItems(payload: unknown) {
  if (!payload || typeof payload !== "object" || !("items" in payload) || !Array.isArray(payload.items)) {
    return [] as LinkedInFeedItem[]
  }

  return payload.items.slice(0, 6).map((item, index) => {
    const record = item as Record<string, unknown>

    return {
      id: String(record.id ?? record.url ?? index),
      title: normalizeText(record.title) || "LinkedIn post",
      summary: normalizeText(record.summary ?? record.content_text ?? record.content_html) || "LinkedIn activity synced through an external feed.",
      url: typeof record.url === "string" ? record.url : "",
      publishedAt:
        typeof record.date_published === "string"
          ? new Date(record.date_published).toISOString()
          : new Date().toISOString(),
    }
  })
}

async function fetchConfiguredFeed(feedUrl: string) {
  const response = await fetch(feedUrl, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: {
      Accept: "application/json, application/rss+xml, application/xml, text/xml;q=0.9",
    },
  })

  if (!response.ok) {
    throw new Error(`Feed request failed with ${response.status}`)
  }

  const contentType = response.headers.get("content-type") ?? ""
  const raw = await response.text()

  if (contentType.includes("application/json") || raw.trim().startsWith("{")) {
    return parseJsonFeedItems(JSON.parse(raw))
  }

  return parseSimpleRssItems(raw)
}

export async function GET() {
  const configuredFeedUrl = process.env.LINKEDIN_FEED_URL
  const configuredProfileUrl = process.env.NEXT_PUBLIC_LINKEDIN_PROFILE_URL ?? ""

  if (!configuredFeedUrl) {
    return NextResponse.json(
      {
        mode: "unconfigured",
        profileUrl: configuredProfileUrl,
        posts: [],
        message:
          "Add LINKEDIN_FEED_URL to connect a LinkedIn-synced RSS or JSON feed. This avoids brittle scraping while keeping the tab ready for real activity.",
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
        },
      }
    )
  }

  try {
    const posts = await fetchConfiguredFeed(configuredFeedUrl)

    return NextResponse.json(
      {
        mode: "configured",
        profileUrl: configuredProfileUrl,
        posts,
        message: posts.length
          ? "LinkedIn activity synced successfully."
          : "The LinkedIn feed is connected, but there are no recent items to display yet.",
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
        },
      }
    )
  } catch {
    return NextResponse.json(
      {
        mode: "error",
        profileUrl: configuredProfileUrl,
        posts: [],
        message:
          "The LinkedIn feed could not be loaded right now. The tab will recover automatically when the feed becomes available again.",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
        },
      }
    )
  }
}
