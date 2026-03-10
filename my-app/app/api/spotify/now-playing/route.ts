import { NextResponse } from "next/server"

import { fetchSpotifyDashboard, type SpotifyDashboardResponse } from "@/lib/spotify"

const ROUTE_CACHE_TTL_MS = 5000

let cachedDashboardResponse:
  | {
      fetchedAt: number
      payload: SpotifyDashboardResponse
    }
  | null = null
let inflightDashboardRequest: Promise<SpotifyDashboardResponse> | null = null

export async function GET() {
  if (cachedDashboardResponse && Date.now() - cachedDashboardResponse.fetchedAt < ROUTE_CACHE_TTL_MS) {
    const status = cachedDashboardResponse.payload.mode === "error" ? 503 : 200

    return NextResponse.json(cachedDashboardResponse.payload, {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    })
  }

  if (!inflightDashboardRequest) {
    inflightDashboardRequest = fetchSpotifyDashboard()
  }

  let payload: SpotifyDashboardResponse

  try {
    payload = await inflightDashboardRequest
  } finally {
    inflightDashboardRequest = null
  }

  cachedDashboardResponse = {
    fetchedAt: Date.now(),
    payload,
  }

  const status = payload.mode === "error" ? 503 : 200

  return NextResponse.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  })
}
