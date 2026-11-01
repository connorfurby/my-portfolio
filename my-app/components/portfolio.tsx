"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useState } from "react"

import About from "@/components/portfolio/About"
import Experience from "@/components/portfolio/Experience"
import Header from "@/components/portfolio/Header"
import { navItems, projects } from "@/components/portfolio/data"
import type { Project, SectionId } from "@/components/portfolio/types"
import MotionLayer from "@/components/portfolio/MotionLayer"
import { PORTFOLIO_SCROLL_OFFSET, getElementPageTop, scrollToSection, sectionIds } from "@/components/portfolio/utils"
import { useScrollFrameSync } from "@/components/portfolio/useScrollFrameSync"
import { FullscreenModal } from "@/components/ui/fullscreen-modal"
import type { CarouselApi } from "@/components/ui/carousel"

const Education = dynamic(() => import("@/components/portfolio/Education"))
const Awards = dynamic(() => import("@/components/portfolio/Awards"))
const GitHubDashboard = dynamic(() => import("@/components/portfolio/GitHubDashboard"))
const Contact = dynamic(() => import("@/components/portfolio/Contact"))
const Footer = dynamic(() => import("@/components/portfolio/Footer"))

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState<SectionId>("about")
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)
  const [currentProjectImages, setCurrentProjectImages] = useState<Project["images"]>(projects[0]?.images ?? [])
  const [fullscreenIndex, setFullscreenIndex] = useState(0)
  const [carouselApis, setCarouselApis] = useState<Record<string, CarouselApi>>({})

  const scrollNext = useCallback(
    (projectTitle: string) => {
      carouselApis[projectTitle]?.scrollNext()
    },
    [carouselApis]
  )

  const registerCarouselApi = useCallback((title: string, api: CarouselApi) => {
    setCarouselApis((prev) => {
      if (prev[title] === api) {
        return prev
      }

      return { ...prev, [title]: api }
    })
  }, [])

  const openProjectFullscreen = useCallback(
    (project: Project) => {
      const currentIndex = carouselApis[project.title]?.selectedScrollSnap() ?? 0
      setCurrentProjectImages(project.images)
      setFullscreenIndex(currentIndex)
      setIsFullscreenOpen(true)
    },
    [carouselApis]
  )

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = []
    const cleanupCallbacks: Array<() => void> = []

    Object.entries(carouselApis).forEach(([projectTitle, api]) => {
      if (!api) {
        return
      }

      const startInterval = () =>
        setInterval(() => {
          scrollNext(projectTitle)
        }, 10000)

      let interval = startInterval()
      intervals.push(interval)

      const onSelect = () => {
        clearInterval(interval)
        interval = startInterval()
      }

      api.on("select", onSelect)
      cleanupCallbacks.push(() => api.off("select", onSelect))
    })

    return () => {
      intervals.forEach(clearInterval)
      cleanupCallbacks.forEach((cleanup) => cleanup())
    }
  }, [carouselApis, scrollNext])

  useScrollFrameSync(() => {
    let nextSection: SectionId = "about"

    for (const sectionId of sectionIds) {
      const element = document.getElementById(sectionId)

      if (!element) {
        continue
      }

      if (getElementPageTop(element) <= window.scrollY + PORTFOLIO_SCROLL_OFFSET + 8) {
        nextSection = sectionId
      }
    }

    setActiveSection((current) => (current === nextSection ? current : nextSection))
  })

  return (
    <div id="portfolio-root" className="portfolio-shell min-h-screen bg-background text-foreground">
      <MotionLayer />
      <div className="ambient-stage" aria-hidden="true">
        <div className="ambient-orb ambient-orb-one ambient-float-slow" />
        <div className="ambient-orb ambient-orb-two ambient-float-medium" />
        <div className="ambient-noise" />
      </div>

      <Header navItems={navItems} activeSection={activeSection} onNavigate={scrollToSection} />

      <main className="w-full">
        <About />

        <div className="portfolio-container-wide bg-background py-8">
          <Experience onApiReady={registerCarouselApi} onOpenFullscreen={openProjectFullscreen} />
          <div className="cv-auto">
            <Education />
          </div>
          <div className="cv-auto">
            <Awards />
          </div>
          <div className="cv-auto">
            <GitHubDashboard />
          </div>
          <div className="cv-auto">
            <Contact />
          </div>
        </div>
      </main>

      <Footer />

      <FullscreenModal
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        images={currentProjectImages}
        initialIndex={fullscreenIndex}
      />
    </div>
  )
}
