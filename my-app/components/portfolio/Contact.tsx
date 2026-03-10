import { motion } from "framer-motion"
import { Mail, Music4 } from "lucide-react"

import { contactLinks, spotifyPlaylists } from "@/components/portfolio/data"
import AnimatedSection from "@/components/portfolio/AnimatedSection"
import SectionHeading from "@/components/portfolio/SectionHeading"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Contact() {
  return (
    <AnimatedSection id="contact" className="mb-12 pt-16" delay={0.05}>
      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}>
          <Card className="liquid-panel liquid-panel-strong relative overflow-hidden rounded-[2.2rem] transition-all duration-300 hover:-translate-y-1">
            <motion.div
              className="absolute -left-10 top-10 size-28 rounded-full bg-primary/12 blur-3xl"
              animate={{ x: [0, 20, 0], y: [0, -12, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <CardContent className="relative flex flex-col gap-6 p-8">
              <SectionHeading
                eyebrow="Contact"
                title="If something here feels promising, let&apos;s talk"
                description="I&apos;m looking for opportunities where I can keep growing fast, contribute thoughtfully, and build software that feels genuinely well-crafted."
              />

              <div className="flex flex-col gap-4">
                {contactLinks.map((link) => (
                  <motion.div
                    key={link.href}
                    className="liquid-panel liquid-soft rounded-[1.6rem] p-4"
                    whileHover={{ x: 4, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <Mail className="h-4 w-4 text-primary" />
                      {link.label}
                    </div>
                    <p className="mb-4 text-sm leading-7 text-muted-foreground">{link.value}</p>
                    <Button asChild className="rounded-full px-5">
                      <a href={link.href}>Reach Out</a>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <SectionHeading
            eyebrow="Soundtrack"
            title="A little extra personality, without the clutter"
            description="A few playlists I come back to for coding, running, lake days, or late-night focus sessions."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {spotifyPlaylists.map((playlist) => (
              <motion.div
                key={playlist.src}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.22 }}
              >
                <Card className="liquid-panel rounded-[1.7rem] transition-shadow duration-300 hover:shadow-[0_22px_48px_hsl(var(--glass-shadow)/0.16)]">
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                      <Music4 className="h-4 w-4 text-primary" />
                      Playlist Pick
                    </div>
                    <iframe
                      style={{ borderRadius: "12px" }}
                      src={playlist.src}
                      width="100%"
                      height="352"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{playlist.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  )
}
