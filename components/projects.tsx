"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { SectionLabel, Reveal, StaggerContainer, StaggerItem } from "./animations"
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react"

interface ProjectImage {
  src: string
  alt: string
  description: string
  isVideo?: boolean
}

interface Project {
  title: string
  description: string
  bullets: string[]
  images: ProjectImage[]
  tags?: string[]
}

const projects: Project[] = [
  {
    title: "SlideCentral",
    description:
      "A web app that allows teachers and students who manage clubs or activities to create and manage slides for their meetings and events to be displayed throughout the school.",
    bullets: [
      "Developed a comprehensive project using React JS, Express, Node, and the school database, completed over four sprints across seven months alongside three teammates.",
      "Integrated Google authentication and dynamic user views tailored for roles such as admin, teacher, and student.",
      "Implemented interactive image carousels with fullscreen and timer functionalities.",
      "Created custom activity and club dashboards with auto-generated slides.",
      "Applied Agile methodologies including sprints, retrospectives, and daily scrums.",
    ],
    images: [
      { src: "/imgs/slidecentral/slcimg1.png", alt: "Homepage", description: "Home Page (Signed in)" },
      { src: "/imgs/slidecentral/slcimg3.png", alt: "Slideshow view", description: "Main slideshow view" },
      { src: "/imgs/slidecentral/slcimg6.png", alt: "Dashboard", description: "Dashboard view" },
      { src: "/imgs/slidecentral/slcimg7.png", alt: "Activity Dashboard", description: "Activity Dashboard" },
      { src: "/imgs/slidecentral/slcimg10.png", alt: "Generated slides", description: "Generated slides per activity" },
    ],
    tags: ["React", "Express", "Node.js", "Agile"],
  },
  {
    title: "Ice Dodo",
    description:
      "A popular Chrome extension game I contributed to, with over 600,000 users.",
    bullets: [
      "Revamped the entire UI to enhance the game's visual appeal and user experience.",
      "Developed 17 additional levels, expanding the game content for players.",
      "Produced a new game trailer attracting over 63,000 views on YouTube.",
      "Earned a prominent spot in the game's credits.",
      "Actively participated in the game's Discord community.",
    ],
    images: [
      { src: "/imgs/icedodo/icedodo.mp4", alt: "Game Trailer", description: "Trailer with over 63,000 views", isVideo: true },
      { src: "/imgs/icedodo/icedodo1.png", alt: "My levels", description: "My 17 custom levels" },
      { src: "/imgs/icedodo/icedodo2.png", alt: "Credits", description: "Top of the credits" },
      { src: "/imgs/icedodo/icedodo3.png", alt: "Level", description: "One of my favorite levels" },
    ],
    tags: ["Game Dev", "UI Design", "Community"],
  },
  {
    title: "Animated Cityscape",
    description: "An animated cityscape created using Java with dynamic elements.",
    bullets: [
      "Built with Java using JFrame and JComponent to create and animate a cityscape scene.",
      "Randomized building dimensions and window lighting for a day/night effect.",
      "Multi-object management ensuring no buildings overlap.",
      "Utilizes Runnable interface to animate scrolling city effect.",
      "Custom colors and graphics for a visually cohesive cityscape.",
    ],
    images: [
      { src: "/imgs/cityscape/cityscape.mp4", alt: "Animated Cityscape", description: "The cityscape animation", isVideo: true },
      { src: "/imgs/cityscape/cityscape.png", alt: "Java Classes", description: "Classes and flows" },
    ],
    tags: ["Java", "Animation", "OOP"],
  },
  {
    title: "SlasherCrush",
    description:
      "A Candy Crush inspired game with a Halloween theme, made for AP Microeconomics.",
    bullets: [
      "Built with NextJS, Tailwind CSS, and ShadCN components, hosted on Vercel.",
      "Completed in just a few days as part of an economics class project.",
      "Implemented progressive difficulty, move-based gameplay, and level balancing.",
      "Responsive and adaptive gameplay that responds dynamically to player actions.",
    ],
    images: [
      { src: "/imgs/slashercrush/scimg1.png", alt: "Title Screen", description: "Title screen" },
      { src: "/imgs/slashercrush/scimg2.png", alt: "Gameplay", description: "In-game screenshot" },
      { src: "/imgs/slashercrush/scimg3.png", alt: "Level 20", description: "Scaling to level 20" },
      { src: "/imgs/slashercrush/scimg4.png", alt: "Game Over", description: "Game over screen" },
    ],
    tags: ["Next.js", "Tailwind", "Game Dev"],
  },
  {
    title: "This Portfolio",
    description: "The site you are currently viewing, built from scratch.",
    bullets: [
      "Built with NextJS, Tailwind CSS, Framer Motion, and ShadCN components.",
      "Advanced scroll-triggered animations and interactive elements.",
      "Optimized for responsiveness across all screen sizes.",
      "Dark-first design with cinematic editorial aesthetic.",
    ],
    images: [
      { src: "/imgs/personalportfolio/ppimg1.png", alt: "Early Stages", description: "Early stages of development" },
      { src: "/imgs/personalportfolio/ppimg2.png", alt: "Thank you", description: "Thank you for visiting!" },
    ],
    tags: ["Next.js", "Framer Motion", "Tailwind"],
  },
]

function ProjectCard({
  project,
  index,
  onOpenGallery,
}: {
  project: Project
  index: number
  onOpenGallery: (project: Project) => void
}) {
  const [currentImage, setCurrentImage] = useState(0)
  const isEven = index % 2 === 0

  const nextImage = () =>
    setCurrentImage((prev) => (prev + 1) % project.images.length)
  const prevImage = () =>
    setCurrentImage(
      (prev) => (prev - 1 + project.images.length) % project.images.length
    )

  return (
    <Reveal variant={isEven ? "slideLeft" : "slideRight"} delay={0.1}>
      <div className="group relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5">
        <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
          {/* Image carousel */}
          <div className="relative lg:w-1/2 aspect-video lg:aspect-auto lg:min-h-[400px] bg-secondary/30 overflow-hidden">
            <AnimatePresence mode="wait">
              {project.images[currentImage]?.isVideo ? (
                <motion.video
                  key={`video-${currentImage}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={project.images[currentImage].src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <motion.div
                  key={`image-${currentImage}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={project.images[currentImage]?.src || ""}
                    alt={project.images[currentImage]?.alt || ""}
                    fill
                    className="object-contain bg-secondary/20"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Image controls */}
            {project.images.length > 1 && (
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <button
                  onClick={prevImage}
                  className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50">
                  {project.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        i === currentImage
                          ? "bg-primary w-4"
                          : "bg-muted-foreground/30"
                      }`}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextImage}
                  className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Caption */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-xs text-muted-foreground">
              {project.images[currentImage]?.description}
            </div>

            {/* Expand button */}
            <button
              onClick={() => onOpenGallery(project)}
              className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Open gallery"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <span className="section-number text-xs font-mono text-primary/60">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-6 bg-primary/30" />
            </div>

            <h3 className="text-2xl font-bold mb-3 text-foreground">
              {project.title}
            </h3>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {project.description}
            </p>

            <ul className="space-y-2 mb-6">
              {project.bullets.slice(0, 3).map((bullet, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground/80">
                  <span className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                  {bullet}
                </li>
              ))}
            </ul>

            {project.tags && (
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-primary/10 text-primary border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  )
}

function GalleryModal({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!project) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 rounded-full bg-card border border-border text-foreground hover:bg-secondary transition-colors z-10"
        aria-label="Close gallery"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="max-w-5xl w-full mx-6" onClick={(e) => e.stopPropagation()}>
        <div className="relative aspect-video rounded-xl overflow-hidden bg-card border border-border">
          <AnimatePresence mode="wait">
            {project.images[currentIndex]?.isVideo ? (
              <motion.video
                key={`modal-video-${currentIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={project.images[currentIndex].src}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="absolute inset-0 w-full h-full object-contain"
              />
            ) : (
              <motion.div
                key={`modal-image-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="absolute inset-0"
              >
                <Image
                  src={project.images[currentIndex]?.src || ""}
                  alt={project.images[currentIndex]?.alt || ""}
                  fill
                  className="object-contain"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            {project.images[currentIndex]?.description}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentIndex(
                  (prev) => (prev - 1 + project.images.length) % project.images.length
                )
              }
              className="p-2 rounded-lg bg-card border border-border text-foreground hover:bg-secondary transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-muted-foreground px-2">
              {currentIndex + 1} / {project.images.length}
            </span>
            <button
              onClick={() =>
                setCurrentIndex(
                  (prev) => (prev + 1) % project.images.length
                )
              }
              className="p-2 rounded-lg bg-card border border-border text-foreground hover:bg-secondary transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function Projects() {
  const [galleryProject, setGalleryProject] = useState<Project | null>(null)

  return (
    <section id="experience" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel number="01" label="Experience" />

        <Reveal>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
            Things I have{" "}
            <span className="text-gradient">built</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-muted-foreground text-lg mb-16 max-w-2xl">
            A collection of projects that showcase my skills in software development,
            game design, and creative problem solving.
          </p>
        </Reveal>

        {/* Projects grid */}
        <div className="space-y-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              onOpenGallery={setGalleryProject}
            />
          ))}
        </div>

        {/* Additional projects callout */}
        <Reveal delay={0.2}>
          <div className="mt-12 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-8 text-center">
            <h3 className="text-lg font-semibold mb-3 text-foreground">And More</h3>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Maze Solver in Java using Stacks and Queues, a Text-to-Speech Calculator
              with Raspberry Pi, various Text-based RPG Python games, a Universal Paperclips
              inspired game in React, a Mental Health AI Chatbot, Minecraft Mods,
              and small 3D experiments in Unity and Blender.
            </p>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {galleryProject && (
          <GalleryModal
            project={galleryProject}
            onClose={() => setGalleryProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
