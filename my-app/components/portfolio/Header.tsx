"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Menu, Moon, Palette, Sun, X } from "lucide-react"
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
    setIsClient(true)
  }, [])

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

              <nav className="mx-auto hidden items-center justify-center gap-0.5 md:flex">
                {navItems.map((item) => {
                  const sectionId = item.href.slice(1) as SectionId
                  const isActive = activeSection === sectionId

                  return (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className={cn(
                        "h-8 rounded-full px-3.5 text-sm font-medium text-muted-foreground",
                        isActive && "bg-foreground text-background hover:bg-foreground hover:text-background"
                      )}
                      onClick={() => onNavigate(sectionId)}
                    >
                      {item.name}
                    </Button>
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
                  className="bg-card"
                  onClick={() => setMobileMenuOpen((current) => !current)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>

              <div className="ml-auto hidden items-center gap-2 md:flex">
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
                className="pointer-events-auto fixed inset-x-0 top-20 bottom-0 ui-scrim md:hidden"
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
                  className="ui-modal relative overflow-hidden rounded-[1.35rem] px-4 py-4"
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
                        className="bg-card"
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
                    className="ui-scrim absolute inset-0"
                    onClick={() => setAppearanceMenuOpen(false)}
                  />

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="appearance-modal-title"
                      aria-describedby="appearance-modal-description"
                      className="pointer-events-auto relative w-full max-w-2xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="ui-modal max-h-[calc(100dvh-2rem)] overflow-hidden rounded-[1.5rem]">
                        <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
                          <div className="border-b border-border/60 px-5 py-5 sm:px-6">
                            <div className="pr-12">
                              <div id="appearance-modal-title" className="font-display text-2xl tracking-[-0.04em] text-foreground">
                                Appearance
                              </div>
                              <div id="appearance-modal-description" className="mt-1.5 max-w-md text-sm leading-6 text-muted-foreground">
                                Light or dark, with one accent across the whole site.
                              </div>
                            </div>

                            <div className="ui-segment mt-5" role="group" aria-label="Color mode">
                              <button
                                type="button"
                                className="ui-segment-item"
                                data-active={resolvedTheme === "light"}
                                onClick={() => setTheme("light")}
                              >
                                <Sun className="h-4 w-4" />
                                Light
                              </button>
                              <button
                                type="button"
                                className="ui-segment-item"
                                data-active={resolvedTheme === "dark"}
                                onClick={() => setTheme("dark")}
                              >
                                <Moon className="h-4 w-4" />
                                Dark
                              </button>
                            </div>
                          </div>

                          <div className="px-5 py-5 sm:px-6">
                            <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                              Accent
                            </div>
                            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                              {accentThemes.map((theme) => {
                                const isSelected = isAccentReady && accentTheme === theme.id

                                return (
                                  <button
                                    key={theme.id}
                                    type="button"
                                    className={cn(
                                      "flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-colors",
                                      isSelected
                                        ? "border-primary/45 bg-primary/10"
                                        : "border-transparent hover:bg-foreground/[0.04]"
                                    )}
                                    onClick={() => setAccentTheme(theme.id)}
                                  >
                                    <span
                                      className={cn(
                                        "size-7 shrink-0 rounded-full",
                                        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-card"
                                      )}
                                      style={{
                                        background: `linear-gradient(135deg, hsl(${theme.swatch.start}), hsl(${theme.swatch.end}))`,
                                      }}
                                    />
                                    <span className="min-w-0 flex-1">
                                      <span className="block truncate text-sm font-medium text-foreground">{theme.label}</span>
                                      <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                                        {isSelected ? "In use" : theme.description}
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
                          className="absolute right-4 top-4"
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
