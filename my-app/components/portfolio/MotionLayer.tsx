"use client"

import { useEffect, useRef } from "react"

export default function MotionLayer() {
  const auraRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const aura = auraRef.current
    const progress = progressRef.current
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const finePointer = window.matchMedia("(pointer: fine)").matches
    let frame = 0
    let pointerX = window.innerWidth * 0.5
    let pointerY = window.innerHeight * 0.28

    const paint = () => {
      frame = 0

      if (aura && finePointer && !reduceMotion) {
        aura.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`
      }

      if (progress) {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        const amount = scrollable > 0 ? window.scrollY / scrollable : 0
        progress.style.transform = `scaleX(${amount})`
      }
    }

    const schedule = () => {
      if (frame) {
        return
      }

      frame = window.requestAnimationFrame(paint)
    }

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY
      schedule()
    }

    paint()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)

    if (finePointer && !reduceMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true })
    }

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame)
      }

      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("pointermove", onPointerMove)
    }
  }, [])

  return (
    <>
      <div className="page-progress" aria-hidden="true">
        <div ref={progressRef} className="page-progress-bar" />
      </div>
      <div ref={auraRef} className="pointer-aura" aria-hidden="true" />
    </>
  )
}
