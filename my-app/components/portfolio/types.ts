import type { LucideIcon } from "lucide-react"

export type SectionId = "about" | "experience" | "education" | "skills" | "integrations" | "passions" | "contact"

export type PortfolioMedia = {
  src: string
  alt: string
  description: string
  isVideo?: boolean
}

export type NavItem = {
  name: string
  href: `#${SectionId}`
}

export type Project = {
  title: string
  description: string
  bullets: string[]
  images: PortfolioMedia[]
  stack?: string[]
  spotlight?: string
}

export type ExperienceEntry = {
  title: string
  subtitle: string
  bullets: string[]
}

export type Passion = {
  icon: LucideIcon
  title: string
  description: string
  imageSrc: string
}

export type SpotifyPlaylist = {
  src: string
  description: string
}

export type ProofHighlight = {
  value: string
  label: string
  description: string
}

export type SkillGroup = {
  title: string
  items: string[]
}

export type TechClusterNode = {
  name: string
  tier: "core" | "strong" | "exploring"
}

export type TechCluster = {
  id: string
  title: string
  shortLabel: string
  summary: string
  icon: LucideIcon
  accent: string
  accentSecondary: string
  technologies: TechClusterNode[]
  proofs: string[]
  projects: string[]
  focus: string[]
}

export type SignatureStack = {
  title: string
  description: string
  stack: string[]
}

export type HeroPill = {
  label: string
}
