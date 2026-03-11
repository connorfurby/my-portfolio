"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useState } from "react"
import {
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Palette,
  Rocket,
  Users,
} from "lucide-react"

import About from "@/components/portfolio/About"
import Experience from "@/components/portfolio/Experience"
import Header from "@/components/portfolio/Header"
import { navItems, projects } from "@/components/portfolio/data"
import type { Project, SectionId } from "@/components/portfolio/types"
import { scrollToSection, sectionIds } from "@/components/portfolio/utils"
import { FullscreenModal } from "@/components/ui/fullscreen-modal"
import type { CarouselApi } from "@/components/ui/carousel"

const Education = dynamic(() => import("@/components/portfolio/Education"))
const Awards = dynamic(() => import("@/components/portfolio/Awards"))
const GitHubDashboard = dynamic(() => import("@/components/portfolio/GitHubDashboard"))
const Passions = dynamic(() => import("@/components/portfolio/Passions"))
const Contact = dynamic(() => import("@/components/portfolio/Contact"))
const Footer = dynamic(() => import("@/components/portfolio/Footer"))

const careerParticles = [
  {
    label: "Projects",
    icon: Rocket,
    className: "left-[6%] top-[18%]",
    duration: 16,
    delay: 0.2,
  },
  {
    label: "Code",
    icon: Code2,
    className: "right-[8%] top-[24%]",
    duration: 20,
    delay: 0.5,
  },
  {
    label: "Design",
    icon: Palette,
    className: "left-[9%] bottom-[22%]",
    duration: 18,
    delay: 0.9,
  },
  {
    label: "Internships",
    icon: BriefcaseBusiness,
    className: "right-[10%] bottom-[26%]",
    duration: 19,
    delay: 0.3,
  },
  {
    label: "Leadership",
    icon: Users,
    className: "left-[42%] bottom-[10%]",
    duration: 17,
    delay: 0.6,
  },
  {
    label: "Growth",
    icon: GraduationCap,
    className: "right-[34%] top-[10%]",
    duration: 21,
    delay: 0.8,
  },
] as const

const ambientDots = [
  { className: "left-[14%] top-[30%]", duration: 10, delay: 0.2 },
  { className: "left-[28%] top-[16%]", duration: 13, delay: 0.9 },
  { className: "right-[18%] top-[36%]", duration: 12, delay: 0.4 },
  { className: "right-[30%] top-[18%]", duration: 14, delay: 1.1 },
  { className: "left-[18%] bottom-[18%]", duration: 11, delay: 0.7 },
  { className: "left-[48%] bottom-[12%]", duration: 12, delay: 0.1 },
  { className: "right-[12%] bottom-[20%]", duration: 15, delay: 0.6 },
  { className: "right-[24%] bottom-[12%]", duration: 10, delay: 1.2 },
] as const

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

  useEffect(() => {
    const sections = sectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter((element): element is HTMLElement => Boolean(element))

    if (!sections.length) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0]

        if (activeEntry?.target.id) {
          setActiveSection(activeEntry.target.id as SectionId)
        }
      },
      {
        rootMargin: "-96px 0px -50% 0px",
        threshold: [0.15, 0.35, 0.6],
      }
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="portfolio-shell min-h-screen bg-background text-foreground">
      <div className="ambient-stage" aria-hidden="true">
        <div className="ambient-orb ambient-orb-one ambient-float-slow" />
        <div className="ambient-orb ambient-orb-two ambient-float-medium" />
        <div className="ambient-orb ambient-orb-three ambient-float-fast" />
        <div className="ambient-noise" />
        {ambientDots.map((dot, index) => (
          <span
            key={`ambient-dot-${index}`}
            className={`ambient-dot ambient-dot-float ${dot.className}`}
            style={{
              animationDuration: `${dot.duration}s`,
              animationDelay: `${dot.delay}s`,
            }}
          />
        ))}
        {careerParticles.map((particle) => {
          const Icon = particle.icon

          return (
            <div
              key={particle.label}
              className={`career-particle particle-float hidden lg:flex ${particle.className}`}
              style={{
                animationDuration: `${particle.duration}s`,
                animationDelay: `${particle.delay}s`,
              }}
            >
              <span className="career-particle-ring" />
              <span className="career-particle-icon">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="career-particle-label">{particle.label}</span>
            </div>
          )
        })}
      </div>

      <Header navItems={navItems} activeSection={activeSection} onNavigate={scrollToSection} />

      <main className="w-full">
        <About />

        <div className="portfolio-container-wide bg-background/20 py-8">
          <Experience onApiReady={registerCarouselApi} onOpenFullscreen={openProjectFullscreen} />
          <Education />
          <Awards />
          <GitHubDashboard />
          <Passions />
          <Contact />
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