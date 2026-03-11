"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Minimize2 } from "lucide-react"
import { createPortal } from "react-dom"

import { Button } from "@/components/ui/button"

type FullscreenModalProps = {
  isOpen: boolean
  onClose: () => void
  images: { src: string; alt: string; description: string; isVideo?: boolean }[]
  initialIndex: number
}

export function FullscreenModal({ isOpen, onClose, images, initialIndex }: FullscreenModalProps) {
  const [mounted, setMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const totalImages = images.length
  const activeImage = images[activeIndex] ?? images[0]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const safeIndex = Math.min(Math.max(initialIndex, 0), Math.max(totalImages - 1, 0))
    setActiveIndex(safeIndex)
  }, [initialIndex, isOpen, totalImages])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
      }

      if (totalImages <= 1) {
        return
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault()
        setActiveIndex((current) => (current - 1 + totalImages) % totalImages)
      }

      if (event.key === "ArrowRight") {
        event.preventDefault()
        setActiveIndex((current) => (current + 1) % totalImages)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose, totalImages])

  if (!mounted || !images.length) {
    return null
  }

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[140] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Close fullscreen viewer"
            onClick={onClose}
            className="absolute inset-0 bg-[hsl(var(--glass-shadow)/0.62)] backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="liquid-panel liquid-panel-strong relative z-10 flex h-[94vh] w-[min(96vw,92rem)] max-w-[96vw] flex-col overflow-hidden rounded-[2rem]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(88,132,255,0.18),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(68,214,192,0.16),transparent_24%),linear-gradient(180deg,rgba(6,10,22,0.04),rgba(6,10,22,0.18))]" />

            <div className="relative flex items-center justify-between gap-4 border-b border-border/55 px-5 py-4">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Expanded Viewer
                </div>
                <div className="mt-1 text-sm text-foreground">
                  {activeImage?.alt ?? "Project media"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full border border-border/55 bg-background/82 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-xl">
                  {activeIndex + 1}/{totalImages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onClose}
                  className="h-9 w-9 rounded-full border-border/55 bg-background/88 backdrop-blur-xl"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative min-h-0 flex-1 px-4 py-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeIndex}-${activeImage?.src ?? "empty"}`}
                  initial={{ opacity: 0, scale: 0.975, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.985, y: -10 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full overflow-hidden rounded-[1.7rem] border border-border/55 bg-background/42 backdrop-blur-xl dark:bg-background/18"
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${activeImage?.src})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "blur(36px)",
                      opacity: activeImage?.isVideo ? 0.08 : 0.22,
                      transform: "scale(1.08)",
                    }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,22,0.06),rgba(6,10,22,0.24))]" />

                  <div className="absolute inset-5 flex items-center justify-center rounded-[1.5rem] border border-border/55 bg-background/60 dark:bg-background/10">
                    {activeImage?.isVideo ? (
                      <video
                        src={activeImage.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="max-h-full max-w-full rounded-[1.2rem] object-contain shadow-[0_24px_64px_rgba(0,0,0,0.26)]"
                      />
                    ) : (
                      <div className="relative h-full w-full">
                        <Image
                          src={activeImage?.src ?? ""}
                          alt={activeImage?.alt ?? "Project media"}
                          fill
                          sizes="95vw"
                          className="object-contain p-6 drop-shadow-[0_24px_64px_rgba(0,0,0,0.28)]"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {totalImages > 1 ? (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setActiveIndex((current) => (current - 1 + totalImages) % totalImages)}
                    className="absolute left-8 top-1/2 z-20 -translate-y-1/2 rounded-full border-border/55 bg-background/88 backdrop-blur-xl"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setActiveIndex((current) => (current + 1) % totalImages)}
                    className="absolute right-8 top-1/2 z-20 -translate-y-1/2 rounded-full border-border/55 bg-background/88 backdrop-blur-xl"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              ) : null}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeIndex}-${activeImage?.description ?? "caption"}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="relative border-t border-border/55 px-5 py-4"
              >
                <p className="mx-auto max-w-3xl text-center text-sm leading-6 text-muted-foreground">
                  {activeImage?.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  )
}