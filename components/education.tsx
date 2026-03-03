"use client"

import { SectionLabel, Reveal, StaggerContainer, StaggerItem } from "./animations"
import { BookOpen, Trophy, Users } from "lucide-react"

const stats = [
  { label: "GPA", value: "4.262" },
  { label: "SAT Score", value: "1510" },
  { label: "SAT Math", value: "760" },
  { label: "SAT Reading", value: "750" },
]

const activities = [
  "3 Year Cross Country Runner",
  "3 Year Lacrosse Goalie",
  "2 Year Winter Track Distance Runner",
  "Senior Class Council Member",
  "Computer Science Club Member",
  "National Honors Society Member",
  "German Club Attendee",
]

const coursework = [
  { name: "AP Computer Science A", note: "Received 5 on Exam" },
  { name: "Software Engineering 1 & 2", note: null },
  { name: "Computer Programming 1 & 2", note: null },
  { name: "AP Calculus BC", note: null },
  { name: "AP Physics 1", note: "Received 4 on Exam" },
  { name: "Honors Chemistry", note: null },
  { name: "AP Micro & Macroeconomics", note: null },
]

export function Education() {
  return (
    <section id="education" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel number="02" label="Education" />

        <Reveal>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
            Academic{" "}
            <span className="text-gradient">foundation</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-muted-foreground text-lg mb-16 max-w-2xl">
            Naperville Central High School, 2021-2025. A strong academic record
            combined with diverse extracurricular involvement.
          </p>
        </Reveal>

        {/* Stats grid */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 text-center hover:border-primary/30 transition-all duration-300 group">
                <div className="text-3xl sm:text-4xl font-bold text-foreground group-hover:text-gradient transition-all">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-2 font-mono">
                  {stat.label}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Activities */}
          <Reveal variant="slideLeft">
            <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Activities
                </h3>
              </div>
              <ul className="space-y-3">
                {activities.map((activity) => (
                  <li
                    key={activity}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Coursework */}
          <Reveal variant="slideRight">
            <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Relevant Coursework
                </h3>
              </div>
              <ul className="space-y-3">
                {coursework.map((course) => (
                  <li
                    key={course.name}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="flex items-center gap-3 text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                      {course.name}
                    </span>
                    {course.note && (
                      <span className="text-xs font-mono text-primary/70 whitespace-nowrap">
                        {course.note}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
