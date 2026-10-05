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
            className="ui-scrim absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="ui-modal relative z-10 flex h-[min(92vh,56rem)] w-[min(96vw,88rem)] flex-col overflow-hidden rounded-[1.5rem]"
          >
            <div className="relative flex items-center justify-between gap-4 border-b border-border/60 px-5 py-3.5">
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Project
                </div>
                <div className="mt-1 truncate text-sm text-foreground">
                  {activeImage?.alt ?? "Project media"}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full border border-border/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {activeIndex + 1} / {totalImages}
                </span>
                <Button variant="outline" size="icon" onClick={onClose} aria-label="Close viewer">
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative min-h-0 flex-1 px-3 py-3 sm:px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeIndex}-${activeImage?.src ?? "empty"}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="ui-stage relative h-full overflow-hidden rounded-2xl"
                >
                  <div className="absolute inset-3 flex items-center justify-center sm:inset-5">
                    {activeImage?.isVideo ? (
                      <video
                        src={activeImage.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="max-h-full max-w-full rounded-xl object-contain"
                      />
                    ) : (
                      <div className="relative h-full w-full">
                        <Image
                          src={activeImage?.src ?? ""}
                          alt={activeImage?.alt ?? "Project media"}
                          fill
                          sizes="90vw"
                          className="object-contain p-4"
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
                    className="absolute left-6 top-1/2 z-20 -translate-y-1/2 bg-card"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setActiveIndex((current) => (current + 1) % totalImages)}
                    className="absolute right-6 top-1/2 z-20 -translate-y-1/2 bg-card"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              ) : null}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeIndex}-${activeImage?.description ?? "caption"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="border-t border-border/60 px-6 py-4"
              >
                <p className="mx-auto max-w-2xl text-center text-sm leading-6 text-muted-foreground">
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