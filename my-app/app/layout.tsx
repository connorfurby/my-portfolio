import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Connor Furby',
  description: 'A showcase of my skills and achievements',
  icons: {
    icon: '/favicon.ico', // Ensure this path is correct
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var mode = localStorage.getItem('theme');
                if (!mode) document.documentElement.classList.add('dark');
              } catch (e) {}
            })();
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
