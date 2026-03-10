import Image from "next/image"
import { ArrowDownRight, BriefcaseBusiness, GraduationCap, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

import { heroPills, proofHighlights } from "@/components/portfolio/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function About() {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="section-wash relative flex min-h-dvh w-full flex-col justify-center overflow-hidden px-0 pb-6 pt-24 md:pb-8 md:pt-24"
    >
      <div className="hero-rings absolute inset-0 z-0">
        <div className="hero-ring hero-ring-one" />
        <div className="hero-ring hero-ring-two" />
        <div className="hero-grid" />
      </div>

      <div className="absolute inset-0 z-0">
        <Image
          src="/imgs/banner1.jpg"
          alt="Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25 saturate-110"
        />
        <div className="banner-gradient absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="container relative z-10 grid items-center gap-8 px-4 lg:grid-cols-[1.08fr_0.92fr]">
        <motion.div
          className="flex flex-col gap-5 text-left"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.45 }}>
            <Badge variant="outline" className="w-fit rounded-full border-foreground/10 bg-background/80 px-4 py-1">
              <Sparkles data-icon="inline-start" />
              Bright ideas. Clean execution. Real projects.
            </Badge>
          </motion.div>

          <div className="flex flex-col gap-3">
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Student software engineer
            </div>
            <motion.h1
              className="max-w-4xl font-display text-4xl font-semibold tracking-[-0.05em] sm:text-5xl md:text-6xl xl:text-[4.35rem]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            >
              I build{" "}
              <span className="text-gradient">fast, polished, memorable</span>{" "}
              software experiences.
            </motion.h1>
            <motion.p
              className="max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-base"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.55 }}
            >
              I&apos;m Connor Furby, a software engineer who cares about product feel just as much as technical depth.
              I like turning ambitious ideas into interfaces that feel sharp, smooth, and alive.
            </motion.p>
            <motion.div
              className="flex items-center gap-3 pt-1"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.45 }}
            >
              <span className="font-accent text-xl italic text-foreground/80 sm:text-2xl">
                crafted with energy
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-foreground/20 to-transparent" />
            </motion.div>
          </div>

          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
          >
            <Button
              size="lg"
              className="rounded-full px-5 text-sm transition-transform duration-300 hover:-translate-y-0.5 sm:text-base"
              onClick={() => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Projects
              <ArrowDownRight data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-foreground/15 bg-background/80 px-5 text-sm transition-transform duration-300 hover:-translate-y-0.5 sm:text-base"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Contact Me
            </Button>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.34, duration: 0.5 }}
          >
            {heroPills.slice(0, 6).map((pill) => (
              <motion.div
                key={pill.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, duration: 0.35 }}
              >
                <Badge
                  variant="secondary"
                  className="rounded-full border border-border/70 bg-card/80 px-3 py-1 text-xs font-medium transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {pill.label}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {proofHighlights.slice(0, 4).map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.45 }}
              >
                <Card className="surface-card rounded-[1.5rem] border-border bg-card/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_hsl(var(--foreground)/0.09)]">
                  <CardContent className="flex flex-col gap-1.5 p-4">
                    <span className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">Proof</span>
                    <span className="text-2xl font-bold tracking-tight sm:text-3xl">{item.value}</span>
                    <span className="text-sm font-semibold">{item.label}</span>
                    <span className="text-xs leading-5 text-muted-foreground sm:text-sm">{item.description}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="editorial-frame relative hidden lg:block"
          initial={{ opacity: 0, y: 22, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute -right-6 top-10 size-20 rounded-full bg-primary/10 blur-2xl"
            animate={{ y: [0, -10, 0], x: [0, 4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -left-6 bottom-10 size-24 rounded-full bg-secondary/70 blur-2xl"
            animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <Card className="surface-card relative overflow-hidden rounded-[2rem] border-border bg-card/95 transition-transform duration-500 hover:-translate-y-1">
            <motion.div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
              animate={{ opacity: [0.35, 0.8, 0.35], x: ["-10%", "10%", "-10%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <CardHeader className="gap-4 border-b border-border pb-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl tracking-tight">Portfolio Snapshot</CardTitle>
                  <CardDescription>
                    A brighter, project-first overview of how I think and what I&apos;m building toward.
                  </CardDescription>
                </div>
                <Image
                  src="/imgs/pfp2.png"
                  alt="Connor Furby"
                  width={88}
                  height={88}
                  priority
                  className="rounded-2xl border border-border object-cover shadow-sm"
                />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <motion.div
                  className="rounded-2xl border border-border bg-muted/40 p-4"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <BriefcaseBusiness className="h-4 w-4 text-primary" />
                    Current Focus
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Full-stack apps, UI systems, internship work, and projects where product feel actually matters.
                  </p>
                </motion.div>
                <motion.div
                  className="rounded-2xl border border-border bg-muted/40 p-4"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    Right Now
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Finishing high school while leveling up through internships, hackathons, and increasingly polished builds.
                  </p>
                </motion.div>
              </div>

              <Separator />

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">What sets my work apart</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    Design + engineering
                  </span>
                </div>
                <div className="grid gap-3">
                  {[
                    "I care about making interfaces feel modern, energetic, and genuinely good to interact with.",
                    "I like balancing technical depth with creativity, storytelling, and strong visual taste.",
                    "I enjoy building products that feel intentional from layout and motion to details and polish.",
                  ].map((item) => (
                    <motion.div
                      key={item}
                      className="rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-7 text-muted-foreground"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  )
}
