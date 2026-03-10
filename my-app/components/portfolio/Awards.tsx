import SectionHeading from "@/components/portfolio/SectionHeading"
import ScrollTabsSection from "@/components/portfolio/ScrollTabsSection"
import { achievements, skillGroups } from "@/components/portfolio/data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Awards() {
  return (
    <ScrollTabsSection
      id="skills"
      heading={
        <SectionHeading
          eyebrow="Strengths"
          title="Technical range, grouped in a cleaner way"
          description="A curated view of the tools, engineering habits, and achievements that reinforce the work shown above."
        />
      }
      items={[
        {
          value: "skills",
          label: "Skills",
          content: (
            <Card className="surface-card rounded-[2rem] border-border bg-card">
              <CardHeader>
                <CardTitle>Core Skill Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {skillGroups.map((group) => (
                    <div key={group.title} className="rounded-[1.5rem] border border-border bg-muted/35 p-5">
                      <h3 className="mb-4 text-base font-semibold">{group.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <Badge key={item} variant="secondary" className="rounded-full border border-border bg-background px-3 py-1">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ),
        },
        {
          value: "achievements",
          label: "Achievements",
          content: (
            <Card className="surface-card rounded-[2rem] border-border bg-card">
              <CardHeader>
                <CardTitle>Notable Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid list-disc gap-3 pl-5 text-sm leading-7 text-muted-foreground md:grid-cols-2">
                  {achievements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ),
        },
      ]}
      listClassName="grid-cols-2"
    />
  )
}
