import { courseworkGroups, educationProfile } from "@/components/portfolio/data"
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
          title="Academic context that matches the current version of my work"
          description="The university, coursework, and leadership context behind the projects and product work shown throughout the rest of the site."
        />
      }
      items={[
        {
          value: "overview",
          label: "Overview",
          content: (
            <Card className="liquid-panel rounded-[2rem]">
              <CardHeader className="border-b border-border/50">
                <CardTitle>{educationProfile.school}</CardTitle>
                <CardDescription>
                  {educationProfile.location} • {educationProfile.timeline}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">{educationProfile.credential}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{educationProfile.summary}</p>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold">Current Highlights</h3>
                  <ul className="grid gap-3 pl-5 text-sm leading-7 text-muted-foreground md:grid-cols-2">
                    {educationProfile.highlights.map((item) => (
                      <li key={item} className="list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ),
        },
        {
          value: "involvement",
          label: "Involvement",
          content: (
            <Card className="liquid-panel rounded-[2rem]">
              <CardHeader className="border-b border-border/50">
                <CardTitle>{educationProfile.school}</CardTitle>
                <CardDescription>Organizations, leadership, and recognition</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Involvement</h3>
                  <ul className="grid gap-3 pl-5 text-sm leading-7 text-muted-foreground">
                    {educationProfile.involvement.map((item) => (
                      <li key={item} className="list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Awards and Honors</h3>
                  <ul className="grid gap-3 pl-5 text-sm leading-7 text-muted-foreground">
                    {educationProfile.honors.map((item) => (
                      <li key={item} className="list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
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
                <CardTitle>{educationProfile.school}</CardTitle>
                <CardDescription>Representative coursework and foundations</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 xl:grid-cols-3">
                {courseworkGroups.map((group) => (
                  <div key={group.title} className="rounded-[1.4rem] border border-border/45 bg-background/35 p-4">
                    <h3 className="text-lg font-semibold">{group.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{group.caption}</p>
                    <ul className="mt-4 grid gap-3 pl-5 text-sm leading-7 text-muted-foreground">
                      {group.items.map((item) => (
                        <li key={item} className="list-disc">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          ),
        },
      ]}
      listClassName="grid-cols-3"
    />
  )
}
