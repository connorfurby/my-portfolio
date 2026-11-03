"use client"

import { useEffect, useRef } from "react"

export default function MotionLayer() {
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const progress = progressRef.current
    let frame = 0

    const paint = () => {
      frame = 0

      if (!progress) {
        return
      }

      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const amount = scrollable > 0 ? window.scrollY / scrollable : 0
      progress.style.transform = `scaleX(${amount})`
    }

    const schedule = () => {
      if (frame) {
        return
      }

      frame = window.requestAnimationFrame(paint)
    }

    paint()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame)
      }

      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])

  return (
    <div className="page-progress" aria-hidden="true">
      <div ref={progressRef} className="page-progress-bar" />
    </div>
  )
}
