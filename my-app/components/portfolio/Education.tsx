import { academicStats, coursework, schoolActivities } from "@/components/portfolio/data"
import SectionHeading from "@/components/portfolio/SectionHeading"
import ScrollTabsSection from "@/components/portfolio/ScrollTabsSection"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Education() {
  return (
    <ScrollTabsSection
      id="education"
      heading={
        <SectionHeading
          eyebrow="Education"
          title="Academic foundation, but not just academics"
          description="Coursework, extracurriculars, and measurable progress that support the projects and experience behind this portfolio."
        />
      }
      items={[
        {
          value: "stats",
          label: "Stats",
          content: (
            <Card className="liquid-panel rounded-[2rem]">
              <CardHeader className="border-b border-border/50">
                <CardTitle>Naperville Central High School</CardTitle>
                <CardDescription>2021-2025</CardDescription>
              </CardHeader>
              <CardContent>
              <h3 className="mb-2 text-lg font-semibold">Academic Statistics</h3>
              <ul className="flex list-disc flex-col gap-3 pl-5 text-sm leading-7 text-muted-foreground">
                {academicStats.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              </CardContent>
            </Card>
          ),
        },
        {
          value: "activities",
          label: "Activities",
          content: (
            <Card className="liquid-panel rounded-[2rem]">
              <CardHeader className="border-b border-border/50">
                <CardTitle>Naperville Central High School</CardTitle>
                <CardDescription>2021-2025</CardDescription>
              </CardHeader>
              <CardContent>
              <h3 className="mb-2 text-lg font-semibold">Extracurricular Activities</h3>
              <ul className="grid list-disc gap-3 pl-5 text-sm leading-7 text-muted-foreground md:grid-cols-2">
                {schoolActivities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              </CardContent>
            </Card>
          ),
        },
        {
          value: "coursework",
          label: "Coursework",
          content: (
            <Card className="liquid-panel rounded-[2rem]">
              <CardHeader className="border-b border-border/50">
                <CardTitle>Naperville Central High School</CardTitle>
                <CardDescription>2021-2025</CardDescription>
              </CardHeader>
              <CardContent>
              <h3 className="mb-2 text-lg font-semibold">Relevant Coursework</h3>
              <ul className="grid list-disc gap-3 pl-5 text-sm leading-7 text-muted-foreground md:grid-cols-2">
                {coursework.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              </CardContent>
            </Card>
          ),
        },
      ]}
      listClassName="grid-cols-3"
    />
  )
}
