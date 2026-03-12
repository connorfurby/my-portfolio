export type NowSignalState = "active" | "idle" | "unconfigured" | "error"

export type NowSignal = {
  source: "Spotify" | "Goodreads" | "GitHub" | "Notion"
  state: NowSignalState
  label: string
  title: string
  subtitle?: string
  description: string
  url?: string
  imageUrl?: string
}

export type NowEvent = {
  id: string
  title: string
  date?: string
  description?: string
  url?: string
}

export type NowEventGroup = {
  source: "Notion"
  state: NowSignalState
  label: string
  message: string
  items: NowEvent[]
}

export type NowApiResponse = {
  updatedAt: string
  currentTrack: NowSignal
  currentBook: NowSignal
  latestProject: NowSignal
  currentlyLearning: NowSignal
  upcomingEvents: NowEventGroup
}
