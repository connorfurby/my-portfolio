"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { SectionLabel, Reveal, StaggerContainer, StaggerItem } from "./animations"
import { Award } from "lucide-react"

const skillCategories = [
  {
    title: "Languages",
    skills: ["Python", "Java", "JavaScript", "TypeScript", "HTML", "CSS", "SQL"],
  },
  {
    title: "Frameworks",
    skills: ["React", "Next.js", "Express", "Node.js", "Tailwind CSS"],
  },
  {
    title: "Concepts",
    skills: ["Data Structures", "Algorithms", "Agile/Scrum", "REST APIs", "OOP"],
  },
  {
    title: "Soft Skills",
    skills: ["Leadership", "Team Collaboration", "Problem Solving", "Creativity", "Communication"],
  },
]

const achievements = [
  "National Honors Society Award",
  "4.0 Award every semester",
  "Software Engineering May 2024 Student of the Month",
  "Top 4 Project in HSHacks Hackathon 2024",
  "IT Career Path Endorsement from the State of Illinois",
  "Illinois Global Scholar Award (on pace)",
  "Top credits in Ice Dodo (600,000+ users)",
]

function SkillBar({ skill, delay }: { skill: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -10 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      className="px-4 py-2 rounded-lg border border-border/50 bg-card/30 text-sm text-foreground font-mono hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 cursor-default"
    >
      {skill}
    </motion.div>
  )
}

export function Skills() {
  return (
    <section id="skills" className="relative py-32">
      {/* Background accent */}
      <div className="absolute inset-0 bg-card/30" />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionLabel number="03" label="Skills & Achievements" />

        <Reveal>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
            Technical{" "}
            <span className="text-gradient">toolkit</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-muted-foreground text-lg mb-16 max-w-2xl">
            A versatile set of programming languages, frameworks, and methodologies
            backed by recognized achievements.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Skills - takes 3 cols */}
          <div className="lg:col-span-3 space-y-8">
            {skillCategories.map((category, catIndex) => (
              <Reveal key={category.title} delay={catIndex * 0.1}>
                <div>
                  <h3 className="text-sm font-mono text-primary/70 uppercase tracking-wider mb-4">
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, i) => (
                      <SkillBar
                        key={skill}
                        skill={skill}
                        delay={i * 0.05 + catIndex * 0.1}
                      />
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Achievements - takes 2 cols */}
          <Reveal variant="slideRight" className="lg:col-span-2">
            <div className="rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Achievements</h3>
              </div>
              <ul className="space-y-4">
                {achievements.map((achievement, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <span className="section-number text-xs font-mono text-primary/50 mt-0.5 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {achievement}
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
