"use client"

import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { Projects } from "@/components/projects"
import { Experience } from "@/components/experience"
import { Education } from "@/components/education"
import { Skills } from "@/components/skills"
import { Passions } from "@/components/passions"
import { Contact, Footer } from "@/components/contact"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Hero />

      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-border/50" />
      </div>

      <Projects />
      <Experience />

      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-border/50" />
      </div>

      <Education />

      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-border/50" />
      </div>

      <Skills />

      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-border/50" />
      </div>

      <Passions />

      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-border/50" />
      </div>

      <Contact />
      <Footer />
    </main>
  )
}
