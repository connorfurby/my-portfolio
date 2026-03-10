import { NextResponse } from "next/server"

const GITHUB_API_BASE = "https://api.github.com"
const GITHUB_USERNAME = "connorfurby"
const REVALIDATE_SECONDS = 1800
const RECENT_ACTIVITY_DAYS = 28
const RECENT_COMMITS_LIMIT = 8
const RECENT_REPOSITORY_SAMPLE = 8
const REPOSITORY_HIGHLIGHTS_LIMIT = 4
const ISSUE_AND_PR_ACTIVITY_LIMIT = 5

type GitHubUser = {
  login: string
  name: string | null
  html_url: string
  followers: number
  public_repos: number
  created_at: string
}

type GitHubRepository = {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  pushed_at: string
  archived: boolean
  fork: boolean
}

type GitHubCommitPayload = {
  sha: string
  message: string
}

type GitHubIssuePayload = {
  html_url?: string
  title?: string
  pull_request?: unknown
}

type GitHubPullRequestPayload = {
  html_url?: string
  title?: string
}

type GitHubEvent = {
  id: string
  type: string
  created_at: string
  repo: {
    name: string
  }
  payload?: {
    ref?: string
    action?: string
    commits?: GitHubCommitPayload[]
    issue?: GitHubIssuePayload
    pull_request?: GitHubPullRequestPayload
  }
}

type ActivityPulsePoint = {
  date: string
  label: string
  total: number
}

type RecentCommit = {
  sha: string
  message: string
  repo: string
  repoFullName: string
  url: string
  createdAt: string
  branch: string
}

type IssueOrPullRequestActivity = {
  id: string
  kind: string
  title: string
  action: string
  repo: string
  url: string
  createdAt: string
}

type LanguageBreakdown = {
  name: string
  value: number
  share: number
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
    throw new Error(`GitHub request failed for ${path} with ${response.status}`)
  }

  return (await response.json()) as T
}

function formatActivityLabel(dateKey: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${dateKey}T00:00:00Z`))
}

function isRecent(dateString: string, days: number) {
  const diffMs = Date.now() - new Date(dateString).getTime()
  return diffMs <= days * 24 * 60 * 60 * 1000
}

function buildActivityPulse(events: GitHubEvent[]) {
  const days: ActivityPulsePoint[] = []
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  let recentCommitCount = 0

  for (let index = RECENT_ACTIVITY_DAYS - 1; index >= 0; index -= 1) {
    const date = new Date(today)
    date.setUTCDate(today.getUTCDate() - index)

    const dateKey = date.toISOString().slice(0, 10)

    days.push({
      date: dateKey,
      label: formatActivityLabel(dateKey),
      total: 0,
    })
  }

  const dayMap = new Map(days.map((day) => [day.date, day]))

  events.forEach((event) => {
    const day = dayMap.get(event.created_at.slice(0, 10))

    if (!day) {
      return
    }

    const commitWeight = event.payload?.commits?.length ?? 0
    const weight = event.type === "PushEvent" ? Math.max(commitWeight, 1) : 1

    day.total += weight

    if (event.type === "PushEvent") {
      recentCommitCount += commitWeight
    }
  })

  return {
    activityPulse: days,
    recentCommitCount,
  }
}

function buildRecentCommits(events: GitHubEvent[]) {
  const commits: RecentCommit[] = []
  const seenCommitShas = new Set<string>()

  for (const event of events) {
    if (event.type !== "PushEvent") {
      continue
    }

    for (const commit of event.payload?.commits ?? []) {
      if (seenCommitShas.has(commit.sha)) {
        continue
      }

      seenCommitShas.add(commit.sha)

      commits.push({
        sha: commit.sha,
        message: commit.message.split("\n")[0]?.trim() || "Commit message unavailable",
        repo: event.repo.name.split("/").at(-1) ?? event.repo.name,
        repoFullName: event.repo.name,
        url: `https://github.com/${event.repo.name}/commit/${commit.sha}`,
        createdAt: event.created_at,
        branch: event.payload?.ref?.split("/").at(-1) ?? "main",
      })
    }
  }

  return commits.slice(0, RECENT_COMMITS_LIMIT)
}

function buildIssueAndPullRequestActivity(events: GitHubEvent[]) {
  const activity: IssueOrPullRequestActivity[] = []

  for (const event of events) {
    if (event.type === "PullRequestEvent" && event.payload?.pull_request?.html_url && event.payload.pull_request.title) {
      activity.push({
        id: event.id,
        kind: "Pull request",
        title: event.payload.pull_request.title,
        action: event.payload.action ?? "updated",
        repo: event.repo.name.split("/").at(-1) ?? event.repo.name,
        url: event.payload.pull_request.html_url,
        createdAt: event.created_at,
      })
      continue
    }

    if (event.type === "IssuesEvent" && event.payload?.issue?.html_url && event.payload.issue.title) {
      activity.push({
        id: event.id,
        kind: "Issue",
        title: event.payload.issue.title,
        action: event.payload.action ?? "updated",
        repo: event.repo.name.split("/").at(-1) ?? event.repo.name,
        url: event.payload.issue.html_url,
        createdAt: event.created_at,
      })
      continue
    }

    if (event.type === "IssueCommentEvent" && event.payload?.issue?.html_url && event.payload.issue.title) {
      activity.push({
        id: event.id,
        kind: event.payload.issue.pull_request ? "PR discussion" : "Issue discussion",
        title: event.payload.issue.title,
        action: event.payload.action ?? "commented",
        repo: event.repo.name.split("/").at(-1) ?? event.repo.name,
        url: event.payload.issue.html_url,
        createdAt: event.created_at,
      })
    }
  }

  return activity.slice(0, ISSUE_AND_PR_ACTIVITY_LIMIT)
}

async function buildLanguageBreakdown(repositories: GitHubRepository[]) {
  const aggregate = new Map<string, number>()

  const languageResponses = await Promise.allSettled(
    repositories.slice(0, RECENT_REPOSITORY_SAMPLE).map((repository) =>
      fetchGitHubJson<Record<string, number>>(`/repos/${repository.full_name}/languages`)
    )
  )

  languageResponses.forEach((result) => {
    if (result.status !== "fulfilled") {
      return
    }

    Object.entries(result.value).forEach(([language, value]) => {
      aggregate.set(language, (aggregate.get(language) ?? 0) + value)
    })
  })

  if (!aggregate.size) {
    repositories.forEach((repository) => {
      if (!repository.language) {
        return
      }

      aggregate.set(repository.language, (aggregate.get(repository.language) ?? 0) + 1)
    })
  }

  const total = Array.from(aggregate.values()).reduce((sum, value) => sum + value, 0)

  if (!total) {
    return [] as LanguageBreakdown[]
  }

  return Array.from(aggregate.entries())
    .map(([name, value]) => ({
      name,
      value,
      share: Number(((value / total) * 100).toFixed(1)),
    }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 6)
}

export async function GET() {
  try {
    const [profile, allRepositories, events] = await Promise.all([
      fetchGitHubJson<GitHubUser>(`/users/${GITHUB_USERNAME}`),
      fetchGitHubJson<GitHubRepository[]>(`/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`),
      fetchGitHubJson<GitHubEvent[]>(`/users/${GITHUB_USERNAME}/events/public?per_page=100`),
    ])

    const repositories = allRepositories
      .filter((repository) => !repository.fork && !repository.archived)
      .sort((left, right) => new Date(right.pushed_at).getTime() - new Date(left.pushed_at).getTime())

    const { activityPulse, recentCommitCount } = buildActivityPulse(
      events.filter((event) => isRecent(event.created_at, RECENT_ACTIVITY_DAYS))
    )

    const recentCommits = buildRecentCommits(events)
    const issueAndPullRequestActivity = buildIssueAndPullRequestActivity(events)
    const languages = await buildLanguageBreakdown(repositories)

    const totalStars = repositories.reduce((sum, repository) => sum + repository.stargazers_count, 0)
    const activeRepoCount = repositories.filter((repository) => isRecent(repository.pushed_at, 90)).length

    return NextResponse.json(
      {
        profile: {
          login: profile.login,
          name: profile.name,
          htmlUrl: profile.html_url,
          followers: profile.followers,
          publicRepos: profile.public_repos,
          createdAt: profile.created_at,
        },
        stats: {
          originalRepos: repositories.length,
          activeRepos: activeRepoCount,
          totalStars,
          totalForks: repositories.reduce((sum, repository) => sum + repository.forks_count, 0),
          recentCommitCount,
          languageCount: languages.length,
        },
        repositories: repositories.slice(0, REPOSITORY_HIGHLIGHTS_LIMIT).map((repository) => ({
          id: repository.id,
          name: repository.name,
          htmlUrl: repository.html_url,
          description: repository.description,
          language: repository.language,
          stars: repository.stargazers_count,
          forks: repository.forks_count,
          pushedAt: repository.pushed_at,
        })),
        recentCommits,
        issueAndPullRequestActivity,
        activityPulse,
        languages,
        updatedAt: new Date().toISOString(),
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
        message: "GitHub activity is temporarily unavailable. The dashboard should recover automatically on the next refresh.",
      },
      { status: 503 }
    )
  }
}
