import { courseworkGroups, educationProfile } from "@/components/portfolio/data"
import SectionHeading from "@/components/portfolio/SectionHeading"
import ScrollTabsSection from "@/components/portfolio/ScrollTabsSection"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const overviewMetrics = [
  { value: "4.0", label: "GPA", detail: "Current college GPA" },
  { value: "24", label: "Credits", detail: "Advanced-standing applied" },
  { value: "2029", label: "Expected", detail: "Graduation timeline" },
] as const

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
            <Card className="overflow-hidden rounded-2xl">
              <CardHeader className="border-b border-border/60 pb-6">
                <p className="font-accent text-xl italic text-muted-foreground md:text-2xl">
                  {educationProfile.location} · {educationProfile.timeline}
                </p>
                <CardTitle className="mt-2 font-display text-3xl tracking-[-0.04em] md:text-4xl">
                  {educationProfile.school}
                </CardTitle>
                <CardDescription className="mt-3 max-w-2xl text-sm leading-7">
                  {educationProfile.credential}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-0 p-0">
                <div className="grid border-b border-border/60 sm:grid-cols-3">
                  {overviewMetrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="px-5 py-5 sm:px-6 sm:[&:not(:last-child)]:border-r sm:[&:not(:last-child)]:border-border/60"
                    >
                      <div className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{metric.value}</div>
                      <div className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        {metric.label}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{metric.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[1.2fr_0.8fr] md:p-7">
                  <div>
                    <h3 className="mb-3 text-sm font-medium text-foreground">The through-line</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{educationProfile.summary}</p>
                  </div>
                  <div>
                    <h3 className="mb-3 text-sm font-medium text-foreground">Also true right now</h3>
                    <ul className="space-y-0">
                      {educationProfile.highlights.map((item) => (
                        <li
                          key={item}
                          className="border-t border-border/50 py-2.5 text-sm leading-6 text-muted-foreground first:border-t-0 first:pt-0"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ),
        },
        {
          value: "involvement",
          label: "Involvement",
          content: (
            <Card className="rounded-2xl">
              <CardHeader className="border-b border-border/60 pb-5">
                <CardTitle className="font-display text-2xl tracking-tight">Campus and recognition</CardTitle>
                <CardDescription>Organizations, leadership, and honors that sit alongside the degree work.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-8 pt-6 lg:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Involvement
                  </h3>
                  <ul className="space-y-0">
                    {educationProfile.involvement.map((item, index) => (
                      <li
                        key={item}
                        className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 border-t border-border/50 py-3 text-sm leading-6 text-muted-foreground first:border-t-0 first:pt-0"
                      >
                        <span className="font-mono text-[10px] tracking-wider text-primary/80">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Awards and Honors
                  </h3>
                  <ul className="space-y-0">
                    {educationProfile.honors.map((item, index) => (
                      <li
                        key={item}
                        className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 border-t border-border/50 py-3 text-sm leading-6 text-muted-foreground first:border-t-0 first:pt-0"
                      >
                        <span className="font-mono text-[10px] tracking-wider text-primary/80">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{item}</span>
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
            <Card className="rounded-2xl">
              <CardHeader className="border-b border-border/60 pb-5">
                <CardTitle className="font-display text-2xl tracking-tight">Foundations in progress</CardTitle>
                <CardDescription>Representative coursework across CS, math, and interdisciplinary study.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-0 pt-0 xl:grid-cols-3">
                {courseworkGroups.map((group, index) => (
                  <div
                    key={group.title}
                    className="border-border/60 p-5 sm:p-6 xl:border-r xl:last:border-r-0 [&:not(:last-child)]:border-b xl:[&:not(:last-child)]:border-b-0"
                  >
                    <div className="mb-3 font-mono text-[10px] tracking-wider text-primary/80">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <h3 className="font-display text-lg font-semibold tracking-tight">{group.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{group.caption}</p>
                    <ul className="mt-5 space-y-0">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="border-t border-border/50 py-2.5 text-sm leading-6 text-muted-foreground first:border-t-0 first:pt-0"
                        >
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
