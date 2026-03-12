import SectionHeading from "@/components/portfolio/SectionHeading"
import ExperienceCard from "@/components/portfolio/ExperienceCard"
import ExperienceShowcase from "@/components/portfolio/ExperienceShowcase"
import ScrollTabsSection from "@/components/portfolio/ScrollTabsSection"
import {
  internshipEntries,
  projects,
  volunteerEntries,
  workEntries,
} from "@/components/portfolio/data"
import type { Project } from "@/components/portfolio/types"
import type { CarouselApi } from "@/components/ui/carousel"

type ExperienceProps = {
  onApiReady: (title: string, api: CarouselApi) => void
  onOpenFullscreen: (project: Project) => void
}

export default function Experience({ onApiReady, onOpenFullscreen }: ExperienceProps) {
  return (
    <>
      <ScrollTabsSection
        id="experience"
        heading={
          <SectionHeading
            eyebrow="Selected Work"
            title="Projects and experience that show how I actually build"
            description="A mix of shipped projects, internship work, and hands-on product building. On desktop, the section stays pinned just long enough to compare projects without crowding the viewport."
          />
        }
        items={projects.map((project) => ({
          value: project.title,
          label: project.title,
          content: (
            <ExperienceCard
              project={project}
              onApiReady={onApiReady}
              onOpenFullscreen={onOpenFullscreen}
            />
          ),
        }))}
        listClassName="grid-cols-2 md:grid-cols-3 xl:grid-cols-6"
      />

      <ExperienceShowcase
        items={[
          {
            value: "internships",
            label: "Internships",
            eyebrow: "Internships",
            description: "Product-building roles where I worked inside real teams, real constraints, and live delivery cycles.",
            entries: internshipEntries,
          },
          {
            value: "work",
            label: "Work",
            eyebrow: "Work",
            description: "Operational and leadership experience that shaped reliability, communication, and execution under pressure.",
            entries: workEntries,
          },
          {
            value: "volunteering",
            label: "Volunteering",
            eyebrow: "Volunteering",
            description: "Mentorship and service roles that sharpened teaching, empathy, and adapting technical communication to people.",
            entries: volunteerEntries,
          },
        ]}
      />
    </>
  )
}
