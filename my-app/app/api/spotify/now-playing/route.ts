import { NextResponse } from "next/server"

import { fetchSpotifyDashboard } from "@/lib/spotify"

export async function GET() {
  const payload = await fetchSpotifyDashboard()
  const status = payload.mode === "error" ? 503 : 200

  return NextResponse.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  })
}
