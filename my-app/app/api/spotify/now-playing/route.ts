import { NextResponse } from "next/server"

import {
  fetchSpotifyDashboard,
  type SpotifyDashboardResponse,
  type SpotifyTimeRange,
} from "@/lib/spotify"

const ROUTE_CACHE_TTL_MS = 5000

let cachedDashboardResponse:
  | Map<
      string,
      {
        fetchedAt: number
        payload: SpotifyDashboardResponse
      }
    >
  | null = null
let inflightDashboardRequest: Map<string, Promise<SpotifyDashboardResponse>> | null = null

function normalizeSpotifyTimeRange(value: string | null): SpotifyTimeRange {
  if (value === "medium_term" || value === "long_term") {
    return value
  }

  return "short_term"
}

function normalizeTopLimit(value: string | null) {
  if (value === null) {
    return 5
  }

  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return 5
  }

  return Math.min(50, Math.max(1, Math.floor(parsed)))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const topTimeRange = normalizeSpotifyTimeRange(searchParams.get("timeRange"))
  const topLimit = normalizeTopLimit(searchParams.get("limit"))
  const cacheKey = `${topTimeRange}:${topLimit}`

  if (!cachedDashboardResponse) {
    cachedDashboardResponse = new Map()
  }

  if (!inflightDashboardRequest) {
    inflightDashboardRequest = new Map()
  }

  const cached = cachedDashboardResponse.get(cacheKey)

  if (cached && Date.now() - cached.fetchedAt < ROUTE_CACHE_TTL_MS) {
    const status = cached.payload.mode === "error" ? 503 : 200

    return NextResponse.json(cached.payload, {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    })
  }

  if (!inflightDashboardRequest.has(cacheKey)) {
    inflightDashboardRequest.set(
      cacheKey,
      fetchSpotifyDashboard({
        topTimeRange,
        topLimit,
      })
    )
  }

  let payload: SpotifyDashboardResponse

  try {
    payload = await inflightDashboardRequest.get(cacheKey)!
  } finally {
    inflightDashboardRequest.delete(cacheKey)
  }

  cachedDashboardResponse.set(cacheKey, {
    fetchedAt: Date.now(),
    payload,
  })

  const status = payload.mode === "error" ? 503 : 200

  return NextResponse.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  })
}
