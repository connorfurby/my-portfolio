import { Buffer } from "buffer"

import type { NowSignal } from "@/lib/now"

const SPOTIFY_ACCOUNT_BASE = "https://accounts.spotify.com"
const SPOTIFY_API_BASE = "https://api.spotify.com/v1"

export const SPOTIFY_SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-recently-played",
  "user-top-read",
  "user-read-private",
] as const

type SpotifyTokenResponse = {
  access_token: string
  expires_in?: number
  refresh_token?: string
  scope?: string
  token_type?: string
}

type SpotifyImage = {
  url?: string
  height?: number | null
  width?: number | null
}

type SpotifyArtist = {
  id?: string
  name?: string
  external_urls?: {
    spotify?: string
  }
  genres?: string[]
  followers?: {
    total?: number
  }
  images?: SpotifyImage[]
  popularity?: number
}

type SpotifyTrack = {
  id?: string
  name?: string
  type?: string
  external_urls?: {
    spotify?: string
  }
  uri?: string
  album?: {
    name?: string
    release_date?: string
    images?: SpotifyImage[]
    external_urls?: {
      spotify?: string
    }
  }
  artists?: SpotifyArtist[]
  duration_ms?: number
  explicit?: boolean
  popularity?: number
  preview_url?: string | null
  track_number?: number
  images?: SpotifyImage[]
  release_date?: string
  show?: {
    name?: string
    publisher?: string
    images?: SpotifyImage[]
    external_urls?: {
      spotify?: string
    }
  }
}

type SpotifyPlaybackResponse = {
  is_playing?: boolean
  progress_ms?: number | null
  shuffle_state?: boolean
  repeat_state?: string
  currently_playing_type?: string
  device?: {
    name?: string
    type?: string
    is_active?: boolean
    volume_percent?: number | null
  }
  context?: {
    type?: string
    external_urls?: {
      spotify?: string
    }
  } | null
  item?: SpotifyTrack | null
}

type SpotifyRecentlyPlayedResponse = {
  items?: Array<{
    played_at?: string
    track?: SpotifyTrack
    context?: {
      type?: string
      external_urls?: {
        spotify?: string
      }
    } | null
  }>
}

type SpotifyUserProfileResponse = {
  id?: string
  display_name?: string | null
  external_urls?: {
    spotify?: string
  }
  followers?: {
    total?: number
  }
  images?: SpotifyImage[]
  product?: string
  country?: string
}

type SpotifyTopTracksResponse = {
  items?: SpotifyTrack[]
}

type SpotifyTopArtistsResponse = {
  items?: SpotifyArtist[]
}

export type SpotifyProfileSummary = {
  id: string | null
  displayName: string | null
  profileUrl: string | null
  imageUrl: string | null
  product: string | null
  country: string | null
}

export type SpotifyPlaybackSummary = {
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
}

export type SpotifyTopTrackSummary = {
  id: string
  title: string
  artist: string
  album: string | null
  imageUrl: string | null
  url: string | null
  durationMs: number | null
}

export type SpotifyTopArtistSummary = {
  id: string
  name: string
  imageUrl: string | null
  url: string | null
  genres: string[]
}

export type SpotifyPodcastSummary = {
  title: string
  showName: string | null
  imageUrl: string | null
  url: string | null
  playedAt: string | null
}

export type SpotifyDashboardResponse = {
  mode: "configured" | "unconfigured" | "error"
  updatedAt: string
  message: string
  topWindowLabel: string
  profile: SpotifyProfileSummary | null
  playback: SpotifyPlaybackSummary | null
  recentPodcast: SpotifyPodcastSummary | null
  topTracks: SpotifyTopTrackSummary[]
  topArtists: SpotifyTopArtistSummary[]
}

type SpotifyStaticCache = {
  fetchedAt: number
  profile: SpotifyProfileSummary | null
  topTracks: SpotifyTopTrackSummary[]
  topArtists: SpotifyTopArtistSummary[]
}

const SPOTIFY_STATIC_CACHE_TTL_MS = 1000 * 60 * 30
const SPOTIFY_RECENT_TRACK_CACHE_TTL_MS = 1000 * 60
const SPOTIFY_RECENT_EPISODE_CACHE_TTL_MS = 1000 * 60 * 60 * 24

let spotifyStaticCache: SpotifyStaticCache | null = null
let spotifyRecentTrackCache: { fetchedAt: number; playback: SpotifyPlaybackSummary | null } | null = null
let spotifyRecentEpisodeCache: { fetchedAt: number; episode: SpotifyPodcastSummary | null } | null = null

export type SpotifyNowPlayingResponse = {
  mode: "active" | "recent" | "idle" | "unconfigured" | "error"
  isPlaying: boolean
  song: string | null
  artist: string | null
  album: string | null
  albumImage: string | null
  url: string | null
  playedAt: string | null
  progressMs: number | null
  durationMs: number | null
  deviceName: string | null
  deviceType: string | null
  shuffleState: boolean | null
  repeatState: string | null
  releaseDate: string | null
  explicit: boolean | null
  contextType: string | null
  contextUrl: string | null
  message: string
}

function getSpotifyBaseConfig() {
  return {
    clientId: process.env.SPOTIFY_CLIENT_ID?.trim() ?? "",
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET?.trim() ?? "",
    refreshToken: process.env.SPOTIFY_REFRESH_TOKEN?.trim() ?? "",
  }
}

function getSpotifyBasicToken() {
  const { clientId, clientSecret } = getSpotifyBaseConfig()

  if (!clientId || !clientSecret) {
    throw new Error("Spotify client credentials are not configured.")
  }

  return Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
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

function getTrackArtists(track?: SpotifyTrack | null) {
  return track?.artists?.map((artist) => artist.name).filter(Boolean).join(", ") ?? null
}

function getTrackImage(track?: SpotifyTrack | null) {
  return track?.album?.images?.[0]?.url ?? null
}

function getTrackUrl(track?: SpotifyTrack | null) {
  return track?.external_urls?.spotify ?? track?.album?.external_urls?.spotify ?? null
}

function getPlaybackItemArtist(item?: SpotifyTrack | null, itemType?: string) {
  if (itemType === "episode") {
    return item?.show?.name ?? item?.show?.publisher ?? "Podcast episode"
  }

  return getTrackArtists(item)
}

function getPlaybackItemAlbum(item?: SpotifyTrack | null, itemType?: string) {
  if (itemType === "episode") {
    return item?.show?.publisher ?? item?.show?.name ?? null
  }

  return item?.album?.name ?? null
}

function getPlaybackItemImage(item?: SpotifyTrack | null, itemType?: string) {
  if (itemType === "episode") {
    return item?.images?.[0]?.url ?? item?.show?.images?.[0]?.url ?? null
  }

  return getTrackImage(item)
}

function getPlaybackItemUrl(item?: SpotifyTrack | null, itemType?: string) {
  if (itemType === "episode") {
    return item?.external_urls?.spotify ?? item?.show?.external_urls?.spotify ?? null
  }

  return getTrackUrl(item)
}

function getPlaybackItemReleaseDate(item?: SpotifyTrack | null, itemType?: string) {
  if (itemType === "episode") {
    return item?.release_date ?? null
  }

  return item?.album?.release_date ?? null
}

function buildPodcastSummary(item?: SpotifyTrack | null, playedAt?: string | null): SpotifyPodcastSummary | null {
  if (!item) {
    return null
  }

  return {
    title: item.name ?? "Podcast episode",
    showName: item.show?.name ?? null,
    imageUrl: item.images?.[0]?.url ?? item.show?.images?.[0]?.url ?? null,
    url: item.external_urls?.spotify ?? item.show?.external_urls?.spotify ?? null,
    playedAt: playedAt ?? null,
  }
}

function isFresh(timestamp: number, ttlMs: number) {
  return Date.now() - timestamp < ttlMs
}

async function fetchSpotifyResource(path: string, accessToken: string, searchParams?: Record<string, string>) {
  const url = new URL(`${SPOTIFY_API_BASE}${path}`)

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  return fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  })
}

export function getSpotifyRedirectUri(origin: string) {
  const configuredRedirectUri = process.env.SPOTIFY_REDIRECT_URI?.trim()

  if (configuredRedirectUri) {
    return configuredRedirectUri
  }

  return `${origin.replace(/\/$/, "")}/api/spotify/callback`
}

export function buildSpotifyAuthorizeUrl(origin: string, state: string) {
  const { clientId } = getSpotifyBaseConfig()

  if (!clientId) {
    throw new Error("SPOTIFY_CLIENT_ID is not configured.")
  }

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: getSpotifyRedirectUri(origin),
    scope: SPOTIFY_SCOPES.join(" "),
    state,
  })

  return `${SPOTIFY_ACCOUNT_BASE}/authorize?${params.toString()}`
}

export async function exchangeSpotifyCodeForTokens(code: string, origin: string) {
  const response = await fetch(`${SPOTIFY_ACCOUNT_BASE}/api/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${getSpotifyBasicToken()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: getSpotifyRedirectUri(origin),
    }),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Spotify token exchange failed with ${response.status}`)
  }

  return (await response.json()) as SpotifyTokenResponse
}

export async function getSpotifyAccessToken() {
  const { refreshToken } = getSpotifyBaseConfig()

  if (!refreshToken) {
    return null
  }

  const response = await fetch(`${SPOTIFY_ACCOUNT_BASE}/api/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${getSpotifyBasicToken()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Spotify token refresh failed with ${response.status}`)
  }

  return (await response.json()) as SpotifyTokenResponse
}

async function fetchCurrentPlayback(accessToken: string): Promise<SpotifyPlaybackSummary | null> {
  const response = await fetchSpotifyResource("/me/player", accessToken, {
    additional_types: "track,episode",
  })

  if (response.status === 204) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Spotify playback request failed with ${response.status}`)
  }

  const payload = (await response.json()) as SpotifyPlaybackResponse

  if ((payload.currently_playing_type !== "track" && payload.currently_playing_type !== "episode") || !payload.item) {
    return null
  }

  const deviceName = payload.device?.name ?? null
  const deviceType = payload.device?.type ?? null
  const itemType = payload.currently_playing_type

  if (itemType === "episode") {
    spotifyRecentEpisodeCache = {
      fetchedAt: Date.now(),
      episode: buildPodcastSummary(payload.item, new Date().toISOString()),
    }
  }

  return {
    state: payload.is_playing ? "playing" : "idle",
    label: itemType === "episode" ? (payload.is_playing ? "Listening now" : "Episode paused") : payload.is_playing ? "Listening now" : "Playback paused",
    title: payload.item.name ?? null,
    artist: getPlaybackItemArtist(payload.item, itemType),
    album: getPlaybackItemAlbum(payload.item, itemType),
    imageUrl: getPlaybackItemImage(payload.item, itemType),
    url: getPlaybackItemUrl(payload.item, itemType),
    progressMs: payload.progress_ms ?? null,
    durationMs: payload.item.duration_ms ?? null,
    playedAt: null,
    deviceName,
    deviceType,
    shuffleState: typeof payload.shuffle_state === "boolean" ? payload.shuffle_state : null,
    repeatState: payload.repeat_state ?? null,
    explicit: typeof payload.item.explicit === "boolean" ? payload.item.explicit : null,
    releaseDate: getPlaybackItemReleaseDate(payload.item, itemType),
    contextType: payload.context?.type ?? null,
    contextUrl: payload.context?.external_urls?.spotify ?? null,
    message:
      itemType === "episode"
        ? deviceName
          ? `Podcast playback on ${deviceName}.`
          : "Podcast playback."
        : deviceName
          ? `Listening now on ${deviceName}.`
          : "Listening now.",
  }
}

async function fetchRecentlyPlayed(
  accessToken: string
): Promise<SpotifyPlaybackSummary | null> {
  if (spotifyRecentTrackCache && isFresh(spotifyRecentTrackCache.fetchedAt, SPOTIFY_RECENT_TRACK_CACHE_TTL_MS)) {
    return spotifyRecentTrackCache.playback
  }

  const response = await fetchSpotifyResource("/me/player/recently-played", accessToken, {
    limit: "1",
  })

  if (response.status === 429 && spotifyRecentTrackCache) {
    return spotifyRecentTrackCache.playback
  }

  if (!response.ok) {
    throw new Error(`Spotify recently played request failed with ${response.status}`)
  }

  const payload = (await response.json()) as SpotifyRecentlyPlayedResponse
  const items = payload.items ?? []

  const last = items[0]

  if (!last?.track) {
    spotifyRecentTrackCache = {
      fetchedAt: Date.now(),
      playback: null,
    }
    return null
  }

  const playback = {
    state: "recent",
    label: "Last played",
    title: last.track.name ?? "Recently played track",
    artist: getTrackArtists(last.track),
    album: last.track.album?.name ?? null,
    imageUrl: getTrackImage(last.track),
    url: getTrackUrl(last.track),
    progressMs: null,
    durationMs: last.track.duration_ms ?? null,
    playedAt: last.played_at ?? null,
    deviceName: null,
    deviceType: null,
    shuffleState: null,
    repeatState: null,
    explicit: typeof last.track.explicit === "boolean" ? last.track.explicit : null,
    releaseDate: last.track.album?.release_date ?? null,
    contextType: last.context?.type ?? null,
    contextUrl: last.context?.external_urls?.spotify ?? null,
    message: last.played_at
      ? `Last played ${formatRelative(last.played_at)}.`
      : "Showing your most recently played track.",
  }

  spotifyRecentTrackCache = {
    fetchedAt: Date.now(),
    playback,
  }

  return playback
}

async function fetchCurrentUserProfile(accessToken: string): Promise<SpotifyProfileSummary | null> {
  const response = await fetchSpotifyResource("/me", accessToken)

  if (!response.ok) {
    throw new Error(`Spotify profile request failed with ${response.status}`)
  }

  const payload = (await response.json()) as SpotifyUserProfileResponse

  return {
    id: payload.id ?? null,
    displayName: payload.display_name ?? payload.id ?? null,
    profileUrl: payload.external_urls?.spotify ?? null,
    imageUrl: payload.images?.[0]?.url ?? null,
    product: payload.product ?? null,
    country: payload.country ?? null,
  }
}

async function fetchTopTracks(accessToken: string): Promise<SpotifyTopTrackSummary[]> {
  const response = await fetchSpotifyResource("/me/top/tracks", accessToken, {
    time_range: "short_term",
    limit: "5",
  })

  if (!response.ok) {
    throw new Error(`Spotify top tracks request failed with ${response.status}`)
  }

  const payload = (await response.json()) as SpotifyTopTracksResponse

  return (payload.items ?? []).map((track, index) => ({
    id: track.id ?? `${index}`,
    title: track.name ?? "Top track",
    artist: getTrackArtists(track) ?? "Unknown artist",
    album: track.album?.name ?? null,
    imageUrl: getTrackImage(track),
    url: getTrackUrl(track),
    durationMs: track.duration_ms ?? null,
  }))
}

async function fetchTopArtists(accessToken: string): Promise<SpotifyTopArtistSummary[]> {
  const response = await fetchSpotifyResource("/me/top/artists", accessToken, {
    time_range: "short_term",
    limit: "5",
  })

  if (!response.ok) {
    throw new Error(`Spotify top artists request failed with ${response.status}`)
  }

  const payload = (await response.json()) as SpotifyTopArtistsResponse

  return (payload.items ?? []).map((artist, index) => ({
    id: artist.id ?? `${index}`,
    name: artist.name ?? "Top artist",
    imageUrl: artist.images?.[0]?.url ?? null,
    url: artist.external_urls?.spotify ?? null,
    genres: artist.genres?.slice(0, 2) ?? [],
  }))
}

async function fetchCachedSpotifyStaticData(accessToken: string) {
  if (spotifyStaticCache && isFresh(spotifyStaticCache.fetchedAt, SPOTIFY_STATIC_CACHE_TTL_MS)) {
    return spotifyStaticCache
  }

  const [profileResult, topTracksResult, topArtistsResult] = await Promise.allSettled([
    fetchCurrentUserProfile(accessToken),
    fetchTopTracks(accessToken),
    fetchTopArtists(accessToken),
  ])

  const allRateLimited = [profileResult, topTracksResult, topArtistsResult]
    .filter((result) => result.status === "rejected")
    .length === 3

  if (allRateLimited && spotifyStaticCache) {
    return spotifyStaticCache
  }

  const nextCache = {
    fetchedAt: Date.now(),
    profile: profileResult.status === "fulfilled" ? profileResult.value : spotifyStaticCache?.profile ?? null,
    topTracks: topTracksResult.status === "fulfilled" ? topTracksResult.value : spotifyStaticCache?.topTracks ?? [],
    topArtists: topArtistsResult.status === "fulfilled" ? topArtistsResult.value : spotifyStaticCache?.topArtists ?? [],
  }

  spotifyStaticCache = nextCache
  return nextCache
}

export async function fetchSpotifyDashboard(): Promise<SpotifyDashboardResponse> {
  const { clientId, clientSecret, refreshToken } = getSpotifyBaseConfig()

  if (!clientId || !clientSecret) {
    return {
      mode: "unconfigured",
      updatedAt: new Date().toISOString(),
      message: "Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to start Spotify setup.",
      topWindowLabel: "past 28 days",
      profile: null,
      playback: null,
      recentPodcast: null,
      topTracks: [],
      topArtists: [],
    }
  }

  if (!refreshToken) {
    return {
      mode: "unconfigured",
      updatedAt: new Date().toISOString(),
      message: "Visit /api/spotify/login once to connect your Spotify account and generate SPOTIFY_REFRESH_TOKEN.",
      topWindowLabel: "past 28 days",
      profile: null,
      playback: null,
      recentPodcast: null,
      topTracks: [],
      topArtists: [],
    }
  }

  try {
    const tokenPayload = await getSpotifyAccessToken()

    if (!tokenPayload?.access_token) {
      throw new Error("Spotify access token was missing from the refresh response.")
    }

    const [playbackResult, recentResult, staticResult] = await Promise.allSettled([
      fetchCurrentPlayback(tokenPayload.access_token),
      fetchRecentlyPlayed(tokenPayload.access_token),
      fetchCachedSpotifyStaticData(tokenPayload.access_token),
    ])

    const livePlayback = playbackResult.status === "fulfilled" ? playbackResult.value : null
    const recentBundle =
      recentResult.status === "fulfilled"
        ? recentResult.value
        : null
    const staticData =
      staticResult.status === "fulfilled"
        ? staticResult.value
        : spotifyStaticCache ?? {
            fetchedAt: Date.now(),
            profile: null,
            topTracks: [] as SpotifyTopTrackSummary[],
            topArtists: [] as SpotifyTopArtistSummary[],
          }
    const profile = staticData.profile
    const topTracks = staticData.topTracks
    const topArtists = staticData.topArtists
    const playback = livePlayback ?? recentBundle
    const recentPodcast =
      spotifyRecentEpisodeCache && isFresh(spotifyRecentEpisodeCache.fetchedAt, SPOTIFY_RECENT_EPISODE_CACHE_TTL_MS)
        ? spotifyRecentEpisodeCache.episode
        : null

    const hadFailure = [playbackResult, recentResult, staticResult].some((result) => result.status === "rejected")
    const hasData = Boolean(profile || playback || topTracks.length || topArtists.length)

    return {
      mode: "configured",
      updatedAt: new Date().toISOString(),
      message:
        playback?.state === "playing"
          ? "Listening now."
          : playback?.state === "recent"
            ? "Showing your last played track."
            : recentPodcast
              ? "Spotify connected. Showing the last podcast episode seen in playback."
              : !hasData && hadFailure
                ? "Spotify connected, but some data is temporarily rate-limited."
            : hadFailure
              ? "Spotify connected with partial data."
              : "Spotify account connected.",
      topWindowLabel: "past 28 days",
      profile,
      playback,
      recentPodcast,
      topTracks,
      topArtists,
    }
  } catch {
    return {
      mode: "error",
      updatedAt: new Date().toISOString(),
      message: "Spotify is temporarily unavailable.",
      topWindowLabel: "past 28 days",
      profile: null,
      playback: null,
      recentPodcast: null,
      topTracks: [],
      topArtists: [],
    }
  }
}

export async function fetchSpotifyNowPlaying(): Promise<SpotifyNowPlayingResponse> {
  const dashboard = await fetchSpotifyDashboard()

  if (dashboard.mode === "unconfigured") {
    return {
      mode: "unconfigured",
      isPlaying: false,
      song: null,
      artist: null,
      album: null,
      albumImage: null,
      url: null,
      playedAt: null,
      progressMs: null,
      durationMs: null,
      deviceName: null,
      deviceType: null,
      shuffleState: null,
      repeatState: null,
      releaseDate: null,
      explicit: null,
      contextType: null,
      contextUrl: null,
      message: dashboard.message,
    }
  }

  if (dashboard.mode === "error") {
    return {
      mode: "error",
      isPlaying: false,
      song: null,
      artist: null,
      album: null,
      albumImage: null,
      url: null,
      playedAt: null,
      progressMs: null,
      durationMs: null,
      deviceName: null,
      deviceType: null,
      shuffleState: null,
      repeatState: null,
      releaseDate: null,
      explicit: null,
      contextType: null,
      contextUrl: null,
      message: dashboard.message,
    }
  }

  const playback = dashboard.playback

  if (!playback) {
    return {
      mode: "idle",
      isPlaying: false,
      song: null,
      artist: null,
      album: null,
      albumImage: null,
      url: null,
      playedAt: null,
      progressMs: null,
      durationMs: null,
      deviceName: null,
      deviceType: null,
      shuffleState: null,
      repeatState: null,
      releaseDate: null,
      explicit: null,
      contextType: null,
      contextUrl: null,
      message: "Nothing is playing right now.",
    }
  }

  return {
    mode: playback.state === "playing" ? "active" : playback.state === "recent" ? "recent" : "idle",
    isPlaying: playback.state === "playing",
    song: playback.title,
    artist: playback.artist,
    album: playback.album,
    albumImage: playback.imageUrl,
    url: playback.url,
    playedAt: playback.playedAt,
    progressMs: playback.progressMs,
    durationMs: playback.durationMs,
    deviceName: playback.deviceName,
    deviceType: playback.deviceType,
    shuffleState: playback.shuffleState,
    repeatState: playback.repeatState,
    releaseDate: playback.releaseDate,
    explicit: playback.explicit,
    contextType: playback.contextType,
    contextUrl: playback.contextUrl,
    message: playback.message,
  }
}

export async function fetchSpotifyNowSignal(): Promise<NowSignal> {
  const dashboard = await fetchSpotifyDashboard()

  if (dashboard.mode === "unconfigured") {
    return {
      source: "Spotify",
      state: "unconfigured",
      label: "Currently playing",
      title: "Spotify not connected yet",
      description: dashboard.message,
    }
  }

  if (dashboard.mode === "error") {
    return {
      source: "Spotify",
      state: "error",
      label: "Currently playing",
      title: "Spotify is temporarily unavailable",
      description: "The track card will recover automatically when Spotify responds again.",
    }
  }

  const playback = dashboard.playback

  if (playback?.state === "playing") {
    return {
      source: "Spotify",
      state: "active",
      label: "Currently playing",
      title: playback.title ?? "Unknown track",
      subtitle: playback.artist ?? undefined,
      description: [
        playback.album ? `From ${playback.album}` : null,
        playback.deviceName ? `playing on ${playback.deviceName}` : null,
      ]
        .filter(Boolean)
        .join(" • ") || "Live from Spotify.",
      url: playback.url ?? undefined,
      imageUrl: playback.imageUrl ?? undefined,
    }
  }

  if (playback?.state === "recent") {
    return {
      source: "Spotify",
      state: "idle",
      label: "Last played",
      title: playback.title ?? "Recently played track",
      subtitle: playback.artist ?? undefined,
      description: [
        playback.playedAt ? `Last played ${formatRelative(playback.playedAt)}` : "Showing your last played song.",
        playback.album ? `from ${playback.album}` : null,
      ]
        .filter(Boolean)
        .join(" • "),
      url: playback.url ?? undefined,
      imageUrl: playback.imageUrl ?? undefined,
    }
  }

  return {
    source: "Spotify",
    state: "idle",
    label: "Currently playing",
    title: "Nothing is playing right now",
    description: "Spotify is connected. This card updates automatically when a new track starts.",
  }
}
