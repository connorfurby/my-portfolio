"use client"

import { useEffect, useRef, useState } from "react"

type UseNearViewportOptions = {
  rootMargin?: string
  threshold?: number
  freezeOnceVisible?: boolean
}

export function useNearViewport<T extends HTMLElement>({
  rootMargin = "200px 0px",
  threshold = 0,
  freezeOnceVisible = false,
}: UseNearViewportOptions = {}) {
  const ref = useRef<T | null>(null)
  const [isNearViewport, setIsNearViewport] = useState(false)

  useEffect(() => {
    const node = ref.current

    if (!node || typeof window === "undefined") {
      return
    }

    let frozen = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextValue = entry.isIntersecting

        if (freezeOnceVisible && nextValue) {
          frozen = true
          setIsNearViewport(true)
          observer.disconnect()
          return
        }

        if (!frozen) {
          setIsNearViewport(nextValue)
        }
      },
      {
        rootMargin,
        threshold,
      }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [freezeOnceVisible, rootMargin, threshold])

  return { ref, isNearViewport }
}
