import Image from "next/image"
import { ArrowDown, ArrowDownRight, BriefcaseBusiness, GraduationCap } from "lucide-react"
import { motion } from "framer-motion"

import { educationProfile, proofHighlights } from "@/components/portfolio/data"
import { getElementPageTop, PORTFOLIO_SCROLL_OFFSET, scrollToSection } from "@/components/portfolio/utils"
import { Button } from "@/components/ui/button"

function scrollToSnapshot() {
  const element = document.getElementById("snapshot")
  if (!element) return
  window.scrollTo({
    top: Math.max(getElementPageTop(element) - PORTFOLIO_SCROLL_OFFSET, 0),
    behavior: "smooth",
  })
}

const ease = [0.22, 1, 0.36, 1] as const

export default function About() {
  return (
    <section id="about" className="relative w-full overflow-hidden">
      <div className="relative flex min-h-[100dvh] w-full flex-col justify-end pb-20 pt-28 md:justify-center md:pb-24 md:pt-24">
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
            <p className="font-display text-[clamp(2.9rem,8.5vw,5.75rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-foreground [text-shadow:0_2px_28px_hsl(var(--background)/0.45)]">
              Connor Furby
            </p>
          </motion.div>

          <motion.h1
            className="mt-6 max-w-2xl font-display text-[clamp(1.4rem,3.4vw,2.25rem)] font-medium leading-[1.12] tracking-[-0.035em] text-foreground [text-shadow:0_2px_20px_hsl(var(--background)/0.35)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease }}
          >
            I build <span className="text-gradient">polished software</span> with real product sense.
          </motion.h1>

          <motion.p
            className="mt-5 max-w-lg text-[15px] leading-7 text-muted-foreground sm:text-base [text-shadow:0_1px_16px_hsl(var(--background)/0.5)]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.45, ease }}
          >
            Computer science at UW-Madison. Full-stack and AI products through internships, leadership, and independent builds.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.4, ease }}
          >
            <Button size="lg" className="px-6 shadow-[0_10px_30px_hsl(var(--primary)/0.28)]" onClick={() => scrollToSection("experience")}>
              View Work
              <ArrowDownRight />
            </Button>
            <Button variant="outline" size="lg" className="border-foreground/20 bg-background/40 px-6 backdrop-blur-none" onClick={() => scrollToSection("contact")}>
              Get In Touch
            </Button>
          </motion.div>
        </div>

        <motion.button
          type="button"
          aria-label="Scroll to snapshot"
          onClick={scrollToSnapshot}
          className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.45 }}
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Scroll</span>
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-4 w-4" />
          </motion.span>
        </motion.button>
      </div>

      <motion.div
        id="snapshot"
        className="portfolio-container relative z-10 scroll-mt-28 pb-16 md:pb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, ease }}
      >
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
          <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(240px,0.85fr)]">
            <div className="p-5 sm:p-6 md:p-8">
              <div className="section-eyebrow">Snapshot</div>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                What I&apos;m focused on now
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
                Product-minded engineering roles where frontend execution, systems thinking, and iteration speed matter together.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
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
            </div>

            <div className="relative min-h-[16rem] border-t border-border/60 bg-foreground/[0.02] lg:border-l lg:border-t-0">
              <Image
                src="/imgs/pfp2.png"
                alt="Connor Furby"
                fill
                sizes="(max-width: 1024px) 100vw, 360px"
                className="object-cover object-top opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent lg:bg-gradient-to-l" />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-border/60 bg-card/90 px-3.5 py-3 backdrop-blur-none">
                <p className="font-accent text-lg italic leading-none text-foreground">UW–Madison</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">CS · Expected 2029</p>
              </div>
            </div>
          </div>

          <div className="grid border-t border-border/60 sm:grid-cols-3">
            {proofHighlights.slice(0, 3).map((item, index) => (
              <div
                key={item.label}
                className="border-border/60 px-5 py-5 sm:px-6 sm:py-6 [&:not(:last-child)]:border-b sm:[&:not(:last-child)]:border-b-0 sm:[&:not(:last-child)]:border-r"
              >
                <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")} · {item.label}
                </div>
                <div className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">{item.value}</div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
