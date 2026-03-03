"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

const navItems = [
  { name: "About", href: "about" },
  { name: "Experience", href: "experience" },
  { name: "Education", href: "education" },
  { name: "Skills", href: "skills" },
  { name: "Passions", href: "passions" },
  { name: "Contact", href: "contact" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const sections = navItems.map((item) => item.href)
      for (const section of sections.reverse()) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 80
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: "smooth" })
    }
    setIsMobileOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-6xl flex items-center justify-between px-6 h-16">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-mono text-sm tracking-wider text-foreground hover:text-primary transition-colors"
          >
            CF
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className={`relative text-sm transition-colors py-1 ${
                  activeSection === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
                {activeSection === item.href && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-px left-0 right-0 h-px bg-primary"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden text-foreground p-2"
            aria-label="Toggle navigation menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(item.href)}
                  className={`text-2xl font-mono transition-colors ${
                    activeSection === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="text-primary/50 text-sm mr-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
