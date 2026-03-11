import type { SectionId } from "@/components/portfolio/types"

export const sectionIds: SectionId[] = ["about", "experience", "education", "skills", "integrations", "contact"]
export const PORTFOLIO_HEADER_HEIGHT = 80
export const PORTFOLIO_SCROLL_OFFSET = PORTFOLIO_HEADER_HEIGHT + 16

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function getElementPageTop(element: Element) {
  return window.scrollY + element.getBoundingClientRect().top
}

export function getSectionScrollProgress(section: HTMLElement) {
  const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1)
  const rawProgress = (PORTFOLIO_SCROLL_OFFSET - section.getBoundingClientRect().top) / scrollable

  return clamp(rawProgress, 0, 0.9999)
}

export function scrollToSectionProgress(
  section: HTMLElement,
  progress: number,
  behavior: ScrollBehavior = "smooth"
) {
  const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1)
  const absoluteTop = getElementPageTop(section)
  const targetTop = absoluteTop + scrollable * clamp(progress, 0, 0.9999) - PORTFOLIO_SCROLL_OFFSET

  window.scrollTo({
    top: Math.max(targetTop, 0),
    behavior,
  })
}

export function scrollToSection(sectionId: SectionId) {
  const element = document.getElementById(sectionId)

  if (!element) {
    return
  }

  window.scrollTo({
    top: Math.max(getElementPageTop(element) - PORTFOLIO_SCROLL_OFFSET, 0),
    behavior: "smooth",
  })
}
