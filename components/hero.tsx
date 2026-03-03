"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowDown, Mail } from "lucide-react"

export function Hero() {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 justify-center lg:justify-start mb-6"
            >
              <span className="h-px w-8 bg-primary" />
              <span className="text-sm font-mono text-primary tracking-wider uppercase">
                Portfolio
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-6 text-balance"
            >
              Connor{" "}
              <span className="text-gradient">Furby</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl sm:text-2xl text-muted-foreground font-light mb-8 text-pretty"
            >
              Aspiring Software Engineer. Passionate Learner. Future Innovator.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-base text-muted-foreground/80 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10"
            >
              An ambitious and driven student with career aspirations in Computer Science,
              actively engaged in a variety of extracurricular and career exploration activities.
              A dedicated club member, athlete, and volunteer who consistently excels academically
              and is committed to continuous learning and personal growth.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-4 justify-center lg:justify-start"
            >
              <a
                href="mailto:cafurby27@icloud.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <Mail className="w-4 h-4" />
                Get in Touch
              </a>
              <a
                href="#experience"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-secondary transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                View Work
                <ArrowDown className="w-4 h-4" />
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              <div className="absolute -inset-1 rounded-full bg-primary/20 blur-xl animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-primary/30 animate-border-glow" />
              <div className="absolute inset-3 rounded-full overflow-hidden bg-card">
                <Image
                  src="/imgs/pfp2.png"
                  alt="Connor Furby"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 border-t border-r border-primary/40" />
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b border-l border-primary/40" />
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute bottom-8 -right-4 lg:-right-8 bg-card border border-border rounded-lg px-4 py-2 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-muted-foreground">
                  Open to opportunities
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-mono text-muted-foreground tracking-wider">SCROLL</span>
          <ArrowDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  )
}
