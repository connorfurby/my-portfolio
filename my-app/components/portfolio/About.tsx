import Image from "next/image"
import { ArrowDownRight, BriefcaseBusiness, GraduationCap } from "lucide-react"
import { motion } from "framer-motion"

import { educationProfile, proofHighlights } from "@/components/portfolio/data"
import { scrollToSection } from "@/components/portfolio/utils"
import { Button } from "@/components/ui/button"

const ease = [0.22, 1, 0.36, 1] as const

export default function About() {
  return (
    <section id="about" className="relative w-full overflow-hidden">
      <div className="relative flex min-h-[100dvh] w-full flex-col justify-end pb-16 pt-28 md:justify-center md:pb-20 md:pt-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="/imgs/banner1.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%] saturate-[1.05]"
          />
          <div className="banner-gradient absolute inset-0" />
        </div>

        <div className="portfolio-container relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <p className="font-display text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-foreground">
              Connor Furby
            </p>
          </motion.div>

          <motion.h1
            className="mt-5 max-w-2xl font-display text-[clamp(1.35rem,3.2vw,2.15rem)] font-medium leading-[1.15] tracking-[-0.03em] text-foreground/92"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease }}
          >
            I build <span className="text-gradient">polished software</span> with real product sense.
          </motion.h1>

          <motion.p
            className="mt-4 max-w-xl text-[15px] leading-7 text-muted-foreground sm:text-base"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.45, ease }}
          >
            Computer science at UW-Madison. Full-stack and AI products through internships, leadership, and independent builds.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.4, ease }}
          >
            <Button size="lg" className="px-5" onClick={() => scrollToSection("experience")}>
              View Work
              <ArrowDownRight />
            </Button>
            <Button variant="outline" size="lg" className="px-5" onClick={() => scrollToSection("contact")}>
              Get In Touch
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="portfolio-container relative z-10 -mt-2 pb-16 md:pb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, ease }}
      >
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 md:p-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xl">
              <div className="section-eyebrow">Snapshot</div>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                What I&apos;m focused on now
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Product-minded engineering roles where frontend execution, systems thinking, and iteration speed matter together.
              </p>
            </div>
            <Image
              src="/imgs/pfp2.png"
              alt="Connor Furby"
              width={72}
              height={72}
              className="hidden size-[72px] rounded-2xl border border-border/70 object-cover sm:block"
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-foreground/[0.03] p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <BriefcaseBusiness className="h-4 w-4 text-primary" />
                Current Focus
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Product engineering, AI-enabled workflows, responsive UI systems, and software that feels good to use.
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-foreground/[0.03] p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <GraduationCap className="h-4 w-4 text-primary" />
                Right Now
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Studying at {educationProfile.school} with a {educationProfile.highlights[0]} while building through internships and leadership.
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
            {proofHighlights.slice(0, 3).map((item) => (
              <div key={item.label} className="rounded-xl border border-border/70 bg-foreground/[0.03] p-4">
                <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{item.label}</div>
                <div className="mt-2 font-display text-2xl font-semibold tracking-tight">{item.value}</div>
                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
