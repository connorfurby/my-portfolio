import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import SectionHeading from "@/components/portfolio/SectionHeading"
import ExperienceCard from "@/components/portfolio/ExperienceCard"
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

function ExperienceList({ entries }: { entries: { title: string; subtitle: string; bullets: string[] }[] }) {
  return (
    <div className="grid gap-4 xl:max-h-[calc(100vh-12rem)] xl:overflow-y-auto">
      {entries.map((entry) => (
        <Card key={entry.title} className="surface-card rounded-[1.5rem] border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_hsl(var(--foreground)/0.08)]">
          <CardHeader>
            <CardTitle>{entry.title}</CardTitle>
            <CardDescription>{entry.subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex list-disc flex-col gap-3 pl-5 text-sm leading-7 text-muted-foreground">
              {entry.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  )
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
            description="A mix of internships, shipped products, and hands-on work with stronger pacing. Scroll through the pinned sections to rotate each project."
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

      <ScrollTabsSection
        className="pt-4"
        heading={
          <SectionHeading
            eyebrow="Real-world Experience"
            title="Internships, work, and volunteering"
            description="The practical environments where I built discipline, collaboration skills, communication, and hands-on momentum."
          />
        }
        items={[
          {
            value: "internships",
            label: "Internships",
            content: <ExperienceList entries={internshipEntries} />,
          },
          {
            value: "work",
            label: "Work",
            content: <ExperienceList entries={workEntries} />,
          },
          {
            value: "volunteering",
            label: "Volunteering",
            content: <ExperienceList entries={volunteerEntries} />,
          },
        ]}
        listClassName="grid-cols-3"
      />
    </>
  )
}
