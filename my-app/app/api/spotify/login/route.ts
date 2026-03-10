import crypto from "crypto"

import { NextResponse } from "next/server"

import { buildSpotifyAuthorizeUrl } from "@/lib/spotify"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const state = crypto.randomBytes(16).toString("hex")
  const redirectUrl = buildSpotifyAuthorizeUrl(url.origin, state)

  const response = NextResponse.redirect(redirectUrl)
  response.cookies.set("spotify_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: url.protocol === "https:",
    path: "/",
    maxAge: 60 * 10,
  })

  return response
}
