import { NextResponse } from "next/server"

import { exchangeSpotifyCodeForTokens } from "@/lib/spotify"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const storedState = request.headers.get("cookie")
    ?.split(";")
    .map((value) => value.trim())
    .find((entry) => entry.startsWith("spotify_oauth_state="))
    ?.split("=")[1]

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.json(
      {
        error: "Spotify authorization could not be verified. Try visiting /api/spotify/login again.",
      },
      { status: 400 }
    )
  }

  try {
    const tokenPayload = await exchangeSpotifyCodeForTokens(code, url.origin)
    const refreshToken = tokenPayload.refresh_token ?? ""

    const response = NextResponse.json({
      success: true,
      message: refreshToken
        ? "Copy the refresh token below into SPOTIFY_REFRESH_TOKEN in .env.local, then restart the dev server."
        : "Spotify connected, but no refresh token was returned. Remove access in your Spotify account and authorize again.",
      refreshToken,
      scopes: tokenPayload.scope ?? "",
    })

    response.cookies.set("spotify_oauth_state", "", {
      httpOnly: true,
      sameSite: "lax",
      secure: url.protocol === "https:",
      path: "/",
      maxAge: 0,
    })

    return response
  } catch {
    return NextResponse.json(
      {
        error: "Spotify token exchange failed. Double-check your client ID, secret, and redirect URI settings.",
      },
      { status: 500 }
    )
  }
}
