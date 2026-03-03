"use client"

import { Reveal } from "./animations"
import { Mail, ArrowUpRight } from "lucide-react"

export function Contact() {
  return (
    <section id="contact" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="section-number text-sm font-mono text-primary">05</span>
                <span className="h-px w-8 bg-primary/40" />
                <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
                  Contact
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">
                {"Let's"}{" "}
                <span className="text-gradient">connect</span>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                {"I'm"} always eager to learn and grow. Feel free to reach out if you
                have any questions or would like to know more about my experiences
                and aspirations.
              </p>
            </Reveal>
          </div>

          {/* Right */}
          <Reveal variant="slideRight" delay={0.2}>
            <div className="space-y-4">
              <a
                href="mailto:cafurby27@icloud.com"
                className="group flex items-center justify-between p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-mono">Email</p>
                    <p className="text-foreground font-medium">cafurby27@icloud.com</p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Built by Connor Furby, 2024. Thank you for visiting.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground/60">
            Next.js + Framer Motion + Tailwind
          </span>
        </div>
      </div>
    </footer>
  )
}
