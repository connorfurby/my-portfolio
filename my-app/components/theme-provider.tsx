"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export type AccentThemeId =
  | "azure"
  | "violet"
  | "rose"
  | "emerald"
  | "amber"
  | "crimson"
  | "cyan"
  | "lime"
  | "slate"
  | "sunset"

export const accentThemes = [
  {
    id: "azure",
    label: "Azure",
    description: "Electric blue with aqua glow",
    swatch: {
      start: "230 88% 58%",
      end: "171 82% 52%",
    },
  },
  {
    id: "violet",
    label: "Violet",
    description: "Indigo blended into magenta",
    swatch: {
      start: "267 84% 63%",
      end: "316 78% 64%",
    },
  },
  {
    id: "rose",
    label: "Rose",
    description: "Rose pink with coral warmth",
    swatch: {
      start: "344 82% 58%",
      end: "18 92% 60%",
    },
  },
  {
    id: "emerald",
    label: "Emerald",
    description: "Green with cool teal highlights",
    swatch: {
      start: "160 72% 40%",
      end: "190 88% 44%",
    },
  },
  {
    id: "amber",
    label: "Amber",
    description: "Golden orange with sunset depth",
    swatch: {
      start: "35 92% 52%",
      end: "18 94% 63%",
    },
  },
  {
    id: "crimson",
    label: "Crimson",
    description: "Deep red with pink energy",
    swatch: {
      start: "352 84% 52%",
      end: "328 82% 62%",
    },
  },
  {
    id: "cyan",
    label: "Cyan",
    description: "Cool cyan with icy blue glow",
    swatch: {
      start: "190 88% 46%",
      end: "212 94% 62%",
    },
  },
  {
    id: "lime",
    label: "Lime",
    description: "Fresh lime with chartreuse energy",
    swatch: {
      start: "92 74% 48%",
      end: "146 62% 44%",
    },
  },
  {
    id: "slate",
    label: "Slate",
    description: "Steel blue with graphite depth",
    swatch: {
      start: "216 24% 46%",
      end: "236 20% 58%",
    },
  },
  {
    id: "sunset",
    label: "Sunset",
    description: "Tangerine into hot pink",
    swatch: {
      start: "24 96% 58%",
      end: "334 86% 62%",
    },
  },
] as const satisfies ReadonlyArray<{
  id: AccentThemeId
  label: string
  description: string
  swatch: {
    start: string
    end: string
  }
}>

const DEFAULT_ACCENT_THEME: AccentThemeId = "azure"
const ACCENT_STORAGE_KEY = "portfolio-accent-theme"

type AccentThemeContextValue = {
  accentTheme: AccentThemeId
  setAccentTheme: (accentTheme: AccentThemeId) => void
  isAccentReady: boolean
}

const AccentThemeContext = React.createContext<AccentThemeContextValue | null>(null)

function isAccentThemeId(value: string): value is AccentThemeId {
  return accentThemes.some((theme) => theme.id === value)
}

function AccentThemeProvider({ children }: { children: React.ReactNode }) {
  const [accentTheme, setAccentTheme] = React.useState<AccentThemeId>(DEFAULT_ACCENT_THEME)
  const [isAccentReady, setIsAccentReady] = React.useState(false)

  React.useEffect(() => {
    let nextAccentTheme = DEFAULT_ACCENT_THEME

    try {
      const storedAccentTheme = window.localStorage.getItem(ACCENT_STORAGE_KEY)

      if (storedAccentTheme && isAccentThemeId(storedAccentTheme)) {
        nextAccentTheme = storedAccentTheme
      }
    } catch {
      nextAccentTheme = DEFAULT_ACCENT_THEME
    }

    window.document.documentElement.dataset.accent = nextAccentTheme
    setAccentTheme(nextAccentTheme)
    setIsAccentReady(true)
  }, [])

  React.useEffect(() => {
    if (!isAccentReady) {
      return
    }

    window.document.documentElement.dataset.accent = accentTheme

    try {
      window.localStorage.setItem(ACCENT_STORAGE_KEY, accentTheme)
    } catch {
      // Ignore storage failures and keep the in-memory selection active.
    }
  }, [accentTheme, isAccentReady])

  const value = React.useMemo(
    () => ({
      accentTheme,
      setAccentTheme,
      isAccentReady,
    }),
    [accentTheme, isAccentReady]
  )

  return <AccentThemeContext.Provider value={value}>{children}</AccentThemeContext.Provider>
}

export function useAccentTheme() {
  const context = React.useContext(AccentThemeContext)

  if (!context) {
    throw new Error("useAccentTheme must be used within ThemeProvider")
  }

  return context
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      {...props}
    >
      <AccentThemeProvider>{children}</AccentThemeProvider>
    </NextThemesProvider>
  )
}