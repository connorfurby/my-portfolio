"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

import Passions from "@/components/portfolio/Passions"
import ScrollTabsSection from "@/components/portfolio/ScrollTabsSection"
import SectionHeading from "@/components/portfolio/SectionHeading"
import { techClusters } from "@/components/portfolio/data"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const TOTAL_NODE_COUNT = techClusters.reduce((total, cluster) => total + cluster.technologies.length, 0)

export default function Awards() {
  const reduceMotion = useReducedMotion()
  const [activeClusterId, setActiveClusterId] = useState(techClusters[0]?.id ?? "")
  const activeCluster = techClusters.find((cluster) => cluster.id === activeClusterId) ?? techClusters[0]

  const skillsContent = (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
      <div className="grid border-b border-border/60 lg:grid-cols-[minmax(220px,0.42fr)_minmax(0,1.58fr)]">
        <div className="border-b border-border/60 p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <p className="section-eyebrow">Skill Clusters</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {TOTAL_NODE_COUNT} skills grouped the way they show up together in real projects.
          </p>

          <div className="mt-4 grid gap-1.5">
            {techClusters.map((cluster) => {
              const Icon = cluster.icon
              const isActive = cluster.id === activeCluster.id

              return (
                <button
                  key={cluster.id}
                  type="button"
                  onClick={() => setActiveClusterId(cluster.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                    isActive
                      ? "border-border/80 bg-foreground/[0.04]"
                      : "border-transparent hover:bg-foreground/[0.03]"
                  )}
                  aria-pressed={isActive}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-foreground/[0.03]">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{cluster.shortLabel}</span>
                      <span className="text-[11px] text-muted-foreground">{cluster.technologies.length}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-4 sm:p-5 lg:p-6">
          <motion.div
            key={activeCluster.id}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{activeCluster.shortLabel}</Badge>
              <span className="text-xs text-muted-foreground">{activeCluster.technologies.length} skills</span>
            </div>
            <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">{activeCluster.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">{activeCluster.summary}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {activeCluster.technologies.map((tech) => (
                <span
                  key={tech.name}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm",
                    tech.tier === "core"
                      ? "border-primary/30 bg-primary/10 text-foreground"
                      : tech.tier === "strong"
                        ? "border-border/70 bg-foreground/[0.03] text-foreground"
                        : "border-border/50 text-muted-foreground"
                  )}
                >
                  {tech.name}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-6 border-t border-border/60 pt-6 sm:grid-cols-2">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Where it shows up
                </div>
                <ul className="mt-3 space-y-0">
                  {activeCluster.projects.slice(0, 4).map((project) => (
                    <li
                      key={project}
                      className="border-t border-border/50 py-2.5 text-sm leading-6 text-muted-foreground first:border-t-0 first:pt-0"
                    >
                      {project}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Focus notes
                </div>
                <ul className="mt-3 space-y-0">
                  {activeCluster.focus.slice(0, 4).map((item) => (
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
          </motion.div>
        </div>
      </div>
    </div>
  )

  return (
    <ScrollTabsSection
      id="skills"
      heading={
        <SectionHeading
          eyebrow="Skills & Passions"
          title="The stack I ship with — and what keeps me curious"
          description="Skills grouped the way they show up in real projects. Passions for the rest of the picture outside the terminal."
        />
      }
      items={[
        {
          value: "skills",
          label: "Skills",
          content: skillsContent,
        },
        {
          value: "passions",
          label: "Passions",
          content: <Passions />,
        },
      ]}
      listClassName="grid-cols-2"
    />
  )
}
