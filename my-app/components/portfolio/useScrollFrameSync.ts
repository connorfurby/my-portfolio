"use client"

import { useEffect, useRef } from "react"

export function useScrollFrameSync(callback: () => void) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    let frame = 0

    const run = () => {
      frame = 0
      callbackRef.current()
    }

    const schedule = () => {
      if (frame) {
        return
      }

      frame = window.requestAnimationFrame(run)
    }

    schedule()
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
}
