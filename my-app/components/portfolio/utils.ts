import type { SectionId } from "@/components/portfolio/types"

export const sectionIds: SectionId[] = ["about", "experience", "education", "skills", "integrations", "now", "passions", "contact"]

export function scrollToSection(sectionId: SectionId) {
  const element = document.getElementById(sectionId)

  if (!element) {
    return
  }

  const navbarHeight = 80
  const elementPosition = element.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 16

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  })
}
