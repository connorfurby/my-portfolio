"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { SectionLabel, Reveal, StaggerContainer, StaggerItem } from "./animations"
import {
  Book,
  Heart,
  Music,
  Waves,
  Snowflake,
  Code,
  Gamepad2,
  Users,
  Medal,
  Palette,
  Film,
  Utensils,
  X,
} from "lucide-react"

interface Passion {
  icon: typeof Book
  title: string
  description: string
  imageSrc: string
}

const passions: Passion[] = [
  {
    icon: Book,
    title: "Reading",
    description:
      "I have always loved reading a good book, especially sci-fi and dystopian novels.",
    imageSrc: "/imgs/passions/reading.JPG",
  },
  {
    icon: Waves,
    title: "Water Sports",
    description:
      "Jet skiing, wakeboarding, and water skiing are my favorite summer activities. On mornings at the lake, I always wake up at the crack of dawn to glide on the smooth glass water.",
    imageSrc: "/imgs/passions/watersports.jpg",
  },
  {
    icon: Snowflake,
    title: "Snow Skiing",
    description:
      "Skiing has been a big part of my family for generations, so I fell in love with the winter sport too.",
    imageSrc: "/imgs/passions/skiing.jpg",
  },
  {
    icon: Code,
    title: "Software Dev",
    description:
      "Creating innovative solutions through code and learning new technologies is one of my favorite things to do.",
    imageSrc: "/imgs/passions/softwaredevelopment.png",
  },
  {
    icon: Heart,
    title: "Volunteering",
    description:
      "Giving back to the community brings joy and fulfillment, especially when I can share my passions with others.",
    imageSrc: "/imgs/passions/volunteering.JPG",
  },
  {
    icon: Gamepad2,
    title: "Legend of Zelda",
    description:
      "Since I was young, Zelda is what made me fall in love with games. I have beat all 20 games over time.",
    imageSrc: "/imgs/passions/zelda.jpg",
  },
  {
    icon: Music,
    title: "Music",
    description:
      "Music and making playlists is something I have been doing for a long time. I love to create playlists for different activities and moods.",
    imageSrc: "/imgs/passions/music.jpg",
  },
  {
    icon: Users,
    title: "Family & Friends",
    description:
      "Hanging out with friends and family is something I value a lot. I love to make memories with the people I care about.",
    imageSrc: "/imgs/passions/family.jpg",
  },
  {
    icon: Medal,
    title: "Running",
    description:
      "I began running in middle school, and it has become a big part of my life. Pushing my limits and staying fit through running is a rewarding challenge.",
    imageSrc: "/imgs/passions/running.png",
  },
  {
    icon: Palette,
    title: "Graphic Design",
    description:
      "Expressing creativity through visual design is a fulfilling hobby.",
    imageSrc: "/imgs/passions/graphicdesign.PNG",
  },
  {
    icon: Film,
    title: "Movies",
    description:
      "A picture of me with Stan Lee, the creator of the Marvel Universe. Marvel and Disney movies are my favorite.",
    imageSrc: "/imgs/passions/movies.jpg",
  },
  {
    icon: Utensils,
    title: "Food",
    description:
      "Exploring diverse cuisines and flavors is always a blast. I love trying new foods from different cultures.",
    imageSrc: "/imgs/passions/food.png",
  },
]

function PassionCard({
  passion,
  index,
  onSelect,
}: {
  passion: Passion
  index: number
  onSelect: (passion: Passion) => void
}) {
  const Icon = passion.icon

  return (
    <StaggerItem>
      <motion.button
        onClick={() => onSelect(passion)}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="w-full text-left group rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={passion.imageSrc}
            alt={passion.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-xs font-mono text-foreground tracking-wider uppercase">
              View
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <Icon className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-sm text-foreground">{passion.title}</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {passion.description}
          </p>
        </div>
      </motion.button>
    </StaggerItem>
  )
}

function PassionModal({
  passion,
  onClose,
}: {
  passion: Passion | null
  onClose: () => void
}) {
  if (!passion) return null
  const Icon = passion.icon

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg w-full rounded-2xl border border-border bg-card overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video">
          <Image
            src={passion.imageSrc}
            alt={passion.title}
            fill
            className="object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border text-foreground hover:bg-background transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">{passion.title}</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">{passion.description}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Passions() {
  const [selectedPassion, setSelectedPassion] = useState<Passion | null>(null)

  return (
    <section id="passions" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel number="04" label="Passions" />

        <Reveal>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
            Beyond{" "}
            <span className="text-gradient">the code</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-muted-foreground text-lg mb-16 max-w-2xl">
            The interests and hobbies that fuel my creativity and drive my passion for building.
          </p>
        </Reveal>

        <StaggerContainer
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          staggerDelay={0.06}
        >
          {passions.map((passion, index) => (
            <PassionCard
              key={passion.title}
              passion={passion}
              index={index}
              onSelect={setSelectedPassion}
            />
          ))}
        </StaggerContainer>

        {/* Spotify section */}
        <Reveal delay={0.2}>
          <div className="mt-20">
            <h3 className="text-2xl font-bold mb-2 text-foreground">My Favorite Playlists</h3>
            <p className="text-muted-foreground text-sm mb-8">
              Music for every mood and activity.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl overflow-hidden border border-border/50 bg-card/30 p-4">
                <iframe
                  style={{ borderRadius: "12px" }}
                  src="https://open.spotify.com/embed/playlist/4moPgBwt9bJWz3UgFhJTd3?utm_source=generator&theme=0"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Summer vibes playlist"
                />
                <p className="mt-3 text-xs text-muted-foreground">
                  Jet Ski rides and summer vibes
                </p>
              </div>
              <div className="rounded-xl overflow-hidden border border-border/50 bg-card/30 p-4">
                <iframe
                  style={{ borderRadius: "12px" }}
                  src="https://open.spotify.com/embed/playlist/48LiOY4hhigjbcIFvzOsPd?utm_source=generator&theme=0"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Night and rain playlist"
                />
                <p className="mt-3 text-xs text-muted-foreground">
                  Late nights, rain, and studying
                </p>
              </div>
              <div className="rounded-xl overflow-hidden border border-border/50 bg-card/30 p-4">
                <iframe
                  style={{ borderRadius: "12px" }}
                  src="https://open.spotify.com/embed/playlist/1mVVns1bUDQBd14TnNOu1I?utm_source=generator&theme=0"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Upbeat running playlist"
                />
                <p className="mt-3 text-xs text-muted-foreground">
                  Running and upbeat energy
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {selectedPassion && (
          <PassionModal
            passion={selectedPassion}
            onClose={() => setSelectedPassion(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
