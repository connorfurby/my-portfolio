"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionLabel, Reveal, StaggerContainer, StaggerItem } from "./animations"
import { Briefcase, GraduationCap, Heart } from "lucide-react"

type Tab = "internships" | "work" | "volunteering"

interface ExperienceItem {
  title: string
  company: string
  date: string
  bullets: string[]
}

const internships: ExperienceItem[] = [
  {
    title: "AI Development Intern",
    company: "Campbell Holzhauer Concierge Law",
    date: "06/2024 - Present",
    bullets: [
      "Applied software knowledge and AI research into a real-world business application.",
      "Met with industry leaders to compare products and learn about top tech.",
      "Learned the intersection of tech and AI with the legal industry.",
      "Integrated multiple APIs and software into one cohesive application.",
      "Went through rigorous testing and tweaking of all work.",
    ],
  },
  {
    title: "QA Technical Support Intern",
    company: "DistrictZero",
    date: "09/2024 - Present",
    bullets: [
      "Assisted in restructuring the app's front-end, improving UI/UX and interface consistency.",
      "Identified, reported, and resolved app bugs for the mental health mentorship platform.",
      "Worked with various frameworks, libraries, and applications.",
      "Collaborated with the technical team to align solutions with project goals.",
    ],
  },
]

const workExperience: ExperienceItem[] = [
  {
    title: "In Shop Worker",
    company: "Jimmy John's Franchise",
    date: "11/2023 - Present",
    bullets: [
      "Learned to work fast and efficiently in groups, balancing multiple tasks.",
      "Memorized 25+ sandwich types with all nuances and ingredients.",
      "Practiced food safety techniques and learned to open/close the shop.",
    ],
  },
  {
    title: "Grill Attendant",
    company: "Centennial Beach Grill",
    date: "05/2023 - 08/2023",
    bullets: [
      "Worked with diverse groups including summer camps and special needs individuals.",
      "Efficiently managed grill operations, boosting customer satisfaction.",
      "Maintained high standards of food safety across 6-8.5 hour shifts.",
    ],
  },
  {
    title: "Youth Soccer Referee",
    company: "Naperville Park District",
    date: "05/2021 - 08/2021",
    bullets: [
      "Managed youth soccer games ensuring proper behavior and fun.",
      "Worked around 6 games per weekend, developing a strong work schedule.",
    ],
  },
]

const volunteering: ExperienceItem[] = [
  {
    title: "Volunteer Leader",
    company: "CodeBytes Camp",
    date: "25+ Hours",
    bullets: [
      "Co-led a camp with 80+ participants focused on Python fundamentals.",
      "Developed lesson plans, projects, and activities for coding concepts.",
      "Assisted in developing a Middle School 6-hour Hackathon.",
    ],
  },
  {
    title: "SAT Tutor",
    company: "Schoolhouse",
    date: "25+ Hours",
    bullets: [
      "Provided SAT tutoring to 20 students in two bootcamps of 10 each.",
      "Developed personalized study plans and practice materials.",
      "Helped students improve test-taking strategies and confidence.",
    ],
  },
  {
    title: "Volunteer Leader",
    company: "Special Needs STEM Summer Camp",
    date: "15 Hours",
    bullets: [
      "Assisted in hands-on STEM activities for special needs high school students.",
      "Learned patience and safety skills while making learning fun.",
    ],
  },
]

const tabs: { id: Tab; label: string; icon: typeof Briefcase }[] = [
  { id: "internships", label: "Internships", icon: Briefcase },
  { id: "work", label: "Work", icon: GraduationCap },
  { id: "volunteering", label: "Volunteering", icon: Heart },
]

const dataMap: Record<Tab, ExperienceItem[]> = {
  internships,
  work: workExperience,
  volunteering,
}

function TimelineItem({ item, index }: { item: ExperienceItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative pl-8 pb-10 last:pb-0 group"
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border group-last:bg-transparent">
        <div className="absolute top-2 -left-[3px] w-[7px] h-[7px] rounded-full bg-primary border-2 border-background" />
      </div>

      <div className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/20 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
          <h4 className="font-semibold text-foreground">{item.title}</h4>
          <span className="text-xs font-mono text-primary/70">{item.date}</span>
        </div>
        <p className="text-sm text-primary/80 mb-3">{item.company}</p>
        <ul className="space-y-1.5">
          {item.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40 mt-2 shrink-0" />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export function Experience() {
  const [activeTab, setActiveTab] = useState<Tab>("internships")

  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h3 className="text-3xl sm:text-4xl font-bold mb-4">
            Professional{" "}
            <span className="text-gradient">Experience</span>
          </h3>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-muted-foreground mb-10 max-w-xl">
            Internships, work experience, and volunteer contributions that have shaped my growth.
          </p>
        </Reveal>

        {/* Tab buttons */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-primary-foreground bg-primary"
                    : "text-muted-foreground bg-card/50 border border-border/50 hover:text-foreground hover:border-primary/30"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {dataMap[activeTab].map((item, index) => (
              <TimelineItem key={`${activeTab}-${index}`} item={item} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
