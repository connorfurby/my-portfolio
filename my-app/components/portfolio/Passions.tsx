"use client"

import Image from "next/image"
import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

import { passions } from "@/components/portfolio/data"
import { cn } from "@/lib/utils"

export default function Passions() {
  const reduceMotion = useReducedMotion()
  const [activeTitle, setActiveTitle] = useState(passions[0]?.title ?? "")
  const activePassion = passions.find((passion) => passion.title === activeTitle) ?? passions[0]
  const ActiveIcon = activePassion?.icon

  if (!activePassion || !ActiveIcon) {
    return null
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
      <div className="border-b border-border/60 px-5 py-5 sm:px-6 sm:py-6">
        <div className="section-eyebrow">Beyond Coding</div>
        <h3 className="mt-3 font-display text-[1.35rem] font-semibold tracking-[-0.04em] md:text-[1.6rem]">
          The interests that keep the work human
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Outside the IDE: lakes, books, music, people, and the habits that keep building from turning into burnout.
        </p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]">
        <div className="relative min-h-[18rem] border-b border-border/60 lg:min-h-[24rem] lg:border-b-0 lg:border-r">
          <AnimatePresenceMode reduceMotion={!!reduceMotion} activeKey={activePassion.title}>
            <Image
              src={activePassion.imageSrc}
              alt={activePassion.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </AnimatePresenceMode>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5">
            <div className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/90 px-3 py-2">
              <ActiveIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{activePassion.title}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col p-5 sm:p-6">
          <p className="font-accent text-2xl italic leading-tight text-foreground">{activePassion.title}</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{activePassion.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {passions.map((passion) => {
              const isActive = passion.title === activePassion.title

              return (
                <button
                  key={passion.title}
                  type="button"
                  onClick={() => setActiveTitle(passion.title)}
                  className={cn(
                    "group relative aspect-square overflow-hidden rounded-xl border text-left transition-colors",
                    isActive ? "border-primary/50" : "border-border/70 hover:border-foreground/25"
                  )}
                  aria-pressed={isActive}
                >
                  <Image
                    src={passion.imageSrc}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <span className="absolute bottom-2 left-2 right-2 text-[11px] font-medium leading-tight text-foreground">
                    {passion.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function AnimatePresenceMode({
  children,
  activeKey,
  reduceMotion,
}: {
  children: React.ReactNode
  activeKey: string
  reduceMotion: boolean
}) {
  return (
    <motion.div
      key={activeKey}
      className="absolute inset-0"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
