import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "Connor Furby | Software Engineer",
  description:
    "Portfolio of Connor Furby - Aspiring Software Engineer, Passionate Learner, and Future Innovator.",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-[#0a0a0a] text-white`}>
        <div className="noise-bg">{children}</div>
      </body>
    </html>
  )
}
