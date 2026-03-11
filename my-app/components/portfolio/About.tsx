import Image from "next/image"
import { ArrowDownRight, BriefcaseBusiness, GraduationCap, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

import { educationProfile, heroPills, proofHighlights } from "@/components/portfolio/data"
import { scrollToSection } from "@/components/portfolio/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function About() {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="section-wash relative flex min-h-[calc(100dvh-1.5rem)] w-full flex-col justify-center overflow-hidden px-0 pb-8 pt-24 md:justify-center md:pb-6 md:pt-24"
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

      <div className="portfolio-container portfolio-grid-gap relative z-10 grid items-center lg:items-center lg:grid-cols-[minmax(0,0.96fr)_minmax(320px,0.78fr)] 2xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
        <motion.div
          className="flex flex-col gap-5 text-left md:gap-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.45 }}>
            <Badge variant="outline" className="flex w-fit items-center gap-2 rounded-full px-4 py-1">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              Product-minded engineering with strong UI instincts.
            </Badge>
          </motion.div>

          <div className="flex flex-col gap-4">
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Software engineer and UW-Madison student
            </div>
            <motion.h1
              className="max-w-4xl font-display text-[2.65rem] font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl md:text-6xl xl:text-[4rem] 2xl:text-[4.45rem]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            >
              I build <span className="text-gradient">polished software</span> with real product sense.
            </motion.h1>
            <motion.p
              className="max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-base xl:text-[1.02rem] xl:leading-8"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.55 }}
            >
              I&apos;m Connor Furby, a computer science student at UW-Madison building full-stack and AI-powered products
              through internships, leadership roles, and independent projects. I care most about software that feels
              sharp, useful, and considered.
            </motion.p>
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
              onClick={() => scrollToSection("experience")}
            >
              View Work
              <ArrowDownRight data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-foreground/15 bg-background/80 px-5 text-sm transition-transform duration-300 hover:-translate-y-0.5 sm:text-base"
              onClick={() => scrollToSection("contact")}
            >
              Get In Touch
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
                  className="rounded-full px-3 py-1 text-xs font-medium transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {pill.label}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="grid gap-3 lg:hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.45 }}
          >
            <Card className="liquid-panel liquid-panel-strong overflow-hidden rounded-[1.65rem]">
              <CardContent className="grid gap-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Quick Snapshot</div>
                    <div className="mt-1 text-sm text-muted-foreground">A compact view of what I&apos;m focused on right now.</div>
                  </div>
                  <Image
                    src="/imgs/pfp2.png"
                    alt="Connor Furby"
                    width={56}
                    height={56}
                    priority
                    className="rounded-[1rem] border border-white/20 object-cover shadow-[0_12px_28px_hsl(var(--glass-shadow)/0.18)]"
                  />
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="liquid-panel liquid-soft rounded-[1.2rem] p-3">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <BriefcaseBusiness className="h-4 w-4 text-primary" />
                      Current Focus
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Product engineering, AI-enabled workflows, responsive UI systems, and software that feels good to use.
                    </p>
                  </div>
                  <div className="liquid-panel liquid-soft rounded-[1.2rem] p-3">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      Right Now
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Studying at {educationProfile.school} with a {educationProfile.highlights[0]} while continuing to build through internships and leadership roles.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {proofHighlights.slice(0, 4).map((item) => (
                    <div key={item.label} className="liquid-panel liquid-soft rounded-[1.1rem] p-3">
                      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{item.label}</div>
                      <div className="mt-1.5 text-xl font-semibold tracking-tight">{item.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          className="editorial-frame relative hidden lg:block lg:justify-self-end"
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
          <Card className="liquid-panel liquid-panel-strong relative max-w-[34rem] overflow-hidden rounded-[2rem] transition-transform duration-500 hover:-translate-y-1">
            <motion.div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
              animate={{ opacity: [0.35, 0.8, 0.35], x: ["-10%", "10%", "-10%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <CardHeader className="gap-4 border-b border-border/50 pb-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl tracking-tight">Quick Snapshot</CardTitle>
                  <CardDescription>
                    The shortest useful version of what I&apos;m focused on now.
                  </CardDescription>
                </div>
                <Image
                  src="/imgs/pfp2.png"
                  alt="Connor Furby"
                  width={88}
                  height={88}
                  priority
                  className="rounded-[1.4rem] border border-white/20 object-cover shadow-[0_16px_40px_hsl(var(--glass-shadow)/0.18)]"
                />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <motion.div
                  className="liquid-panel liquid-soft rounded-[1.5rem] p-4"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <BriefcaseBusiness className="h-4 w-4 text-primary" />
                    Current Focus
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Product engineering, AI-enabled workflows, responsive UI systems, and software that has to feel good to use.
                  </p>
                </motion.div>
                <motion.div
                  className="liquid-panel liquid-soft rounded-[1.5rem] p-4"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    Right Now
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Studying at {educationProfile.school} with a {educationProfile.highlights[0]} while continuing to build through internships and leadership roles.
                  </p>
                </motion.div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {proofHighlights.slice(0, 3).map((item) => (
                  <motion.div
                    key={item.label}
                    className="liquid-panel liquid-soft rounded-[1.35rem] p-4"
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      {item.label}
                    </div>
                    <div className="mt-2 text-2xl font-semibold tracking-tight">{item.value}</div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className="rounded-[1.4rem] border border-white/10 bg-background/30 px-4 py-3 text-sm leading-7 text-muted-foreground">
                I&apos;m especially interested in product-minded engineering roles where strong frontend execution,
                real systems thinking, and iteration speed all matter together.
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  )
}
