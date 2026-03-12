"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Menu, Moon, Palette, Sparkles, Sun, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "next-themes"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { accentThemes, useAccentTheme } from "@/components/theme-provider"
import type { NavItem, SectionId } from "@/components/portfolio/types"

type HeaderProps = {
  navItems: NavItem[]
  activeSection: SectionId
  onNavigate: (sectionId: SectionId) => void
}

export default function Header({ navItems, activeSection, onNavigate }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const { accentTheme, setAccentTheme, isAccentReady } = useAccentTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [themeReady, setThemeReady] = useState(false)
  const [appearanceMenuOpen, setAppearanceMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    const originalOverflow = document.body.style.overflow

    if (mobileMenuOpen || appearanceMenuOpen) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [appearanceMenuOpen, mobileMenuOpen])

  useEffect(() => {
    setThemeReady(true)
    setIsClient(true)
  }, [])

  const themeLabel = !themeReady ? "Theme" : resolvedTheme === "dark" ? "Dark" : "Light"

  return (
    <>
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
                  aria-label="Open appearance settings"
                  aria-expanded={appearanceMenuOpen}
                  onClick={() => setAppearanceMenuOpen(true)}
                  className="rounded-full gap-2.5"
                >
                  <Palette className="h-4 w-4" />
                  Appearance
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
                        aria-label="Close menu"
                        className="rounded-full border-border/55 bg-background/88 backdrop-blur-xl"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-4 liquid-soft rounded-[1.35rem] border border-border/55 p-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Palette className="h-4 w-4 text-primary" />
                      Appearance
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Open the appearance modal for theme mode and accent controls.
                    </div>

                    <Button
                      variant="outline"
                      className="mt-3 w-full justify-start rounded-2xl px-4"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        window.setTimeout(() => setAppearanceMenuOpen(true), 30)
                      }}
                    >
                      <Palette className="h-4 w-4" />
                      Open Appearance
                    </Button>
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

      {isClient
        ? createPortal(
            <AnimatePresence>
              {appearanceMenuOpen ? (
                <motion.div
                  key="appearance-modal-shell"
                  className="fixed inset-0 z-[80]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <button
                    type="button"
                    aria-label="Close appearance settings"
                    className="absolute inset-0 bg-[hsl(var(--glass-shadow)/0.36)] backdrop-blur-md"
                    onClick={() => setAppearanceMenuOpen(false)}
                  />

                  <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                    <motion.div
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="appearance-modal-title"
                      aria-describedby="appearance-modal-description"
                      className="pointer-events-auto relative w-full max-w-3xl"
                      initial={{ opacity: 0, scale: 0.96, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 12 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="liquid-panel liquid-panel-strong max-h-[calc(100dvh-2rem)] overflow-hidden rounded-[1.8rem] border border-border/70 bg-[linear-gradient(180deg,hsl(var(--glass-surface-strong)/0.96),hsl(var(--glass-surface)/0.86))] shadow-[0_32px_90px_hsl(var(--glass-shadow)/0.34)]">
                        <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
                          <div className="border-b border-border/45 px-5 py-4 sm:px-6">
                            <div className="flex items-start justify-between gap-3 pr-12">
                              <div>
                                <div id="appearance-modal-title" className="font-display text-xl tracking-[-0.03em] text-foreground sm:text-2xl">
                                  Appearance
                                </div>
                                <div id="appearance-modal-description" className="mt-1 text-sm text-muted-foreground">
                                  Use light or dark mode with any accent across the entire site.
                                </div>
                              </div>
                              <span className="rounded-full border border-border/55 bg-background/70 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-xl">
                                {themeLabel}
                              </span>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                              <Button
                                variant={resolvedTheme === "light" ? "default" : "outline"}
                                className="justify-start rounded-2xl px-4"
                                onClick={() => setTheme("light")}
                              >
                                <Sun className="h-4 w-4" />
                                Light
                              </Button>
                              <Button
                                variant={resolvedTheme === "dark" ? "default" : "outline"}
                                className="justify-start rounded-2xl px-4"
                                onClick={() => setTheme("dark")}
                              >
                                <Moon className="h-4 w-4" />
                                Dark
                              </Button>
                            </div>
                          </div>

                          <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                            <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                              Accent color
                            </div>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                              {accentThemes.map((theme) => {
                                const isSelected = isAccentReady && accentTheme === theme.id

                                return (
                                  <button
                                    key={theme.id}
                                    type="button"
                                    className={cn(
                                      "liquid-chip flex items-center gap-3 rounded-[1.1rem] px-3 py-3 text-left transition-all duration-200 hover:-translate-y-0.5",
                                      isSelected && "border-primary/30 shadow-[0_16px_34px_hsl(var(--glass-shadow)/0.14)]"
                                    )}
                                    onClick={() => setAccentTheme(theme.id)}
                                  >
                                    <span
                                      className="h-8 w-8 shrink-0 rounded-full border border-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                                      style={{
                                        background: `linear-gradient(135deg, hsl(${theme.swatch.start}), hsl(${theme.swatch.end}))`,
                                      }}
                                    />
                                    <span className="min-w-0 flex-1">
                                      <span className="block truncate text-sm font-medium text-foreground">{theme.label}</span>
                                      <span className="block truncate text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                        {isSelected ? "Active" : theme.description}
                                      </span>
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Close appearance settings"
                        className="absolute right-4 top-4 z-20 rounded-full border-border/55 bg-background/88 backdrop-blur-xl"
                          onClick={() => setAppearanceMenuOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  )
}
