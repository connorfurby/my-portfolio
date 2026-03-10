"use client"

import Image from "next/image"
import { Menu, Moon, Sparkles, Sun } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { NavItem, SectionId } from "@/components/portfolio/types"

type HeaderProps = {
  navItems: NavItem[]
  activeSection: SectionId
  onNavigate: (sectionId: SectionId) => void
}

export default function Header({ navItems, activeSection, onNavigate }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <motion.header
      className="pointer-events-none fixed inset-x-0 top-0 z-50"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto w-[min(1320px,calc(100%-1rem))] py-2">
        <div className="header-glass pointer-events-auto relative flex h-16 items-center gap-3 overflow-hidden rounded-[1.6rem] border border-white/15 px-4 md:px-6">
          <div className="header-warp pointer-events-none absolute inset-0 overflow-hidden">
            <div className="header-warp-orb header-warp-orb-one" />
            <div className="header-warp-orb header-warp-orb-two" />
            <div className="header-warp-sheen" />
          </div>

          <div className="relative flex h-full w-full items-center gap-3">
            <motion.div className="mr-2 flex items-center gap-3" whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
              <div className="flex size-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:rotate-6 hover:scale-105">
                <Image src="/imgs/logo.png" alt="Logo" width={22} height={22} className="size-[22px]" />
              </div>
              <div className="hidden flex-col sm:flex">
                <span className="font-display text-base font-semibold tracking-[-0.03em]">Connor Furby</span>
                <span className="font-accent text-sm italic leading-none text-muted-foreground">
                  Portfolio 2026
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
                        "rounded-full border border-transparent px-4 text-sm font-medium text-muted-foreground transition-all duration-200 hover:border-white/10 hover:bg-white/10 hover:text-foreground",
                        activeSection === sectionId &&
                          "border-white/15 bg-foreground/90 text-background shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:bg-foreground hover:text-background"
                      )}
                      onClick={() => onNavigate(sectionId)}
                    >
                      {item.name}
                    </Button>
                  </motion.div>
                )
              })}
            </nav>

            <div className="flex-1 md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Menu" className="rounded-full border-white/15 bg-white/10">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="border-border bg-background/95">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>Navigate through the portfolio sections</SheetDescription>
                  </SheetHeader>
                  <nav className="mt-6 flex flex-col gap-3">
                    {navItems.map((item) => {
                      const sectionId = item.href.slice(1) as SectionId

                      return (
                        <Button
                          key={item.name}
                          variant={activeSection === sectionId ? "default" : "ghost"}
                          className="justify-start rounded-xl"
                          onClick={() => {
                            onNavigate(sectionId)
                            document.body.classList.remove("overflow-hidden")
                          }}
                        >
                          {item.name}
                        </Button>
                      )
                    })}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            <div className="ml-auto hidden items-center gap-2 sm:flex">
              <motion.div
                className="hidden rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-muted-foreground xl:flex xl:items-center xl:gap-2"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Open to software opportunities
              </motion.div>
              <Button
                variant="outline"
                size="sm"
                aria-label="Toggle Theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full border-white/15 bg-white/10"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                Theme
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
