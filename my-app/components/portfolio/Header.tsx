"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Menu, Moon, Sparkles, Sun, SunMoon, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { NavItem, SectionId } from "@/components/portfolio/types"

type HeaderProps = {
  navItems: NavItem[]
  activeSection: SectionId
  onNavigate: (sectionId: SectionId) => void
}

export default function Header({ navItems, activeSection, onNavigate }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [themeReady, setThemeReady] = useState(false)

  useEffect(() => {
    const originalOverflow = document.body.style.overflow

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    setThemeReady(true)
  }, [])

  return (
    <motion.header
      className="pointer-events-none fixed inset-x-0 top-0 z-50"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="portfolio-container-wide py-2">
        <div className="header-glass pointer-events-auto relative flex h-16 items-center gap-3 overflow-hidden rounded-[1.85rem] border border-border/55 px-4 md:px-6">
          <div className="header-warp pointer-events-none absolute inset-0 overflow-hidden">
            <div className="header-warp-orb header-warp-orb-one" />
            <div className="header-warp-orb header-warp-orb-two" />
            <div className="header-warp-sheen" />
          </div>

          <div className="relative flex h-full w-full items-center gap-3">
            <motion.div className="mr-2 flex items-center gap-3" whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
              <div className="liquid-chip flex size-10 items-center justify-center rounded-[1.15rem] transition-transform duration-300 hover:scale-[1.03]">
                <Image src="/imgs/logo.png" alt="Logo" width={22} height={22} className="size-[22px]" />
              </div>
              <div className="hidden flex-col sm:flex">
                <span className="font-display text-base font-semibold tracking-[-0.03em]">Connor Furby</span>
                <span className="font-accent text-sm italic leading-none text-muted-foreground">
                  Portfolio
                </span>
              </div>
            </motion.div>

            <nav className="mx-auto hidden items-center justify-center gap-1 md:flex">
              {navItems.map((item) => {
                const sectionId = item.href.slice(1) as SectionId

                return (
                  <motion.div key={item.name} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "rounded-full border border-transparent px-4 text-sm font-medium text-muted-foreground transition-all duration-200",
                        activeSection === sectionId &&
                          "liquid-chip border-foreground/8 bg-background/24 text-foreground shadow-[0_8px_20px_hsl(var(--glass-shadow)/0.08)] hover:bg-background/24"
                      )}
                      onClick={() => onNavigate(sectionId)}
                    >
                      {item.name}
                    </Button>
                  </motion.div>
                )
              })}
            </nav>

            <div className="ml-auto md:hidden">
              <Button
                variant="outline"
                size="icon"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-portfolio-menu"
                className="rounded-full border-border/55 bg-background/88 backdrop-blur-xl"
                onClick={() => setMobileMenuOpen((current) => !current)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            <div className="ml-auto hidden items-center gap-2 sm:flex">
              <motion.div
                className="liquid-chip hidden rounded-full px-3 py-1 text-xs text-muted-foreground xl:flex xl:items-center xl:gap-2"
                animate={{ y: [0, -1, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Open to software opportunities
              </motion.div>
              <Button
                variant="outline"
                size="sm"
                aria-label="Toggle theme"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {!themeReady ? (
                  <SunMoon className="h-4 w-4" />
                ) : resolvedTheme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                Theme
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close mobile navigation"
              className="pointer-events-auto fixed inset-x-0 top-20 bottom-0 bg-[hsl(var(--glass-shadow)/0.58)] backdrop-blur-md md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              className="pointer-events-auto portfolio-container-wide mt-2 md:hidden"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                id="mobile-portfolio-menu"
                className="liquid-panel liquid-panel-strong relative overflow-hidden rounded-[1.85rem] border border-border/55 px-4 py-4 shadow-[0_18px_50px_hsl(var(--glass-shadow)/0.28)]"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">Menu</div>
                    <div className="mt-1 text-sm text-muted-foreground">Navigate through the portfolio sections</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Toggle theme"
                      className="rounded-full border-border/55 bg-background/88 backdrop-blur-xl"
                      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                    >
                      {!themeReady ? (
                        <SunMoon className="h-4 w-4" />
                      ) : resolvedTheme === "dark" ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Close menu"
                      className="rounded-full border-border/55 bg-background/88 backdrop-blur-xl"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <nav className="grid gap-2">
                  {navItems.map((item) => {
                    const sectionId = item.href.slice(1) as SectionId

                    return (
                      <Button
                        key={item.name}
                        variant={activeSection === sectionId ? "default" : "ghost"}
                        className="justify-start rounded-2xl px-4 py-6 text-base"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          window.setTimeout(() => onNavigate(sectionId), 30)
                        }}
                      >
                        {item.name}
                      </Button>
                    )
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
