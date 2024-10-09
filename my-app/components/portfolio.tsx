"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, GraduationCap, Book, Trophy, Briefcase, Heart, Music, Menu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Portfolio() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [activeSection, setActiveSection] = useState("about")

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      const sections = ["about", "education", "skills", "projects", "hobbies"]
      const scrollPosition = window.scrollY

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { top, bottom } = element.getBoundingClientRect()
          if (top <= 100 && bottom > 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) return null

  const navItems = [
    { name: "About", href: "#about" },
    { name: "Education", href: "#education" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Hobbies", href: "#hobbies" },
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <GraduationCap className="h-6 w-6" />
            <span className="ml-2 font-bold hidden sm:inline">Your Name</span>
          </div>
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant={activeSection === item.href.slice(1) ? "default" : "ghost"}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeSection === item.href.slice(1) ? "bg-primary text-primary-foreground" : ""
                }`}
                onClick={() => scrollToSection(item.href.slice(1))}
              >
                {item.name}
              </Button>
            ))}
          </nav>
          <div className="md:hidden flex-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>Navigate through the portfolio sections</SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-4">
                  {navItems.map((item) => (
                    <Button
                      key={item.name}
                      variant={activeSection === item.href.slice(1) ? "default" : "ghost"}
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        activeSection === item.href.slice(1) ? "bg-primary text-primary-foreground" : ""
                      }`}
                      onClick={() => {
                        scrollToSection(item.href.slice(1))
                        document.body.classList.remove("overflow-hidden")
                      }}
                    >
                      {item.name}
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Theme"
              className="mr-6"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle Theme</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Welcome to My Portfolio</h1>
          <p className="text-xl mb-8">Aspiring Computer Science Student | Passionate Learner | Future Innovator</p>
          <Image
            src="/placeholder.svg"
            alt="Your Name"
            width={200}
            height={200}
            className="rounded-full mx-auto mb-4"
          />
          <p className="max-w-2xl mx-auto">
            Hello! I'm John Doe, a dedicated student with a passion for technology and problem-solving. I'm excited to share my
            journey, achievements, and aspirations with you through this portfolio.
          </p>
        </motion.section>

        <motion.section
          id="education"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Education</h2>
          <Card>
            <CardHeader>
              <CardTitle>High School Diploma</CardTitle>
              <CardDescription>Graduation Year: 2023</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                <strong>School:</strong> Evergreen High School
              </p>
              <p>
                <strong>GPA:</strong> 3.9
              </p>
              <p>
                <strong>Relevant Coursework:</strong> AP Computer Science, AP Calculus, AP Physics
              </p>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section
          id="skills"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Skills & Achievements</h2>
          <Tabs defaultValue="skills" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle>Key Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Programming (Python, Java, JavaScript)</li>
                    <li>Web Development (HTML, CSS, React)</li>
                    <li>Data Structures and Algorithms</li>
                    <li>Problem Solving</li>
                    <li>Team Collaboration</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle>Notable Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>1st Place in Regional Coding Competition</li>
                    <li>Published mobile app with 10,000+ downloads</li>
                    <li>President of High School Computer Science Club</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.section>

        <motion.section
          id="projects"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>EcoTrack Mobile App</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Developed a mobile app to help users track and reduce their carbon footprint through daily activities.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>AI-powered Chess Tutor</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Created a web-based chess tutor that uses machine learning to analyze games and provide personalized feedback.</p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        <motion.section
          id="hobbies"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Extracurricular Activities & Hobbies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="flex flex-col items-center p-4">
              <Book className="h-12 w-12 mb-2" />
              <CardTitle className="text-lg">Reading</CardTitle>
            </Card>
            <Card className="flex flex-col items-center p-4">
              <Trophy className="h-12 w-12 mb-2" />
              <CardTitle className="text-lg">Chess</CardTitle>
            </Card>
            <Card className="flex flex-col items-center p-4">
              <Briefcase className="h-12 w-12 mb-2" />
              <CardTitle className="text-lg">Internships</CardTitle>
            </Card>
            <Card className="flex flex-col items-center p-4">
              <Heart className="h-12 w-12 mb-2" />
              <CardTitle className="text-lg">Volunteering</CardTitle>
            </Card>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Let's Connect!</h2>
          <p className="mb-4">
            I'm always eager to learn and grow. Feel free to reach out if you have any questions or would like to know
            more about my experiences and aspirations.
          </p>
          <Button className="mr-4">
            <Music className="mr-2 h-4 w-4" /> My Spotify Playlist
          </Button>
          <Button variant="outline">Contact Me</Button>
        </motion.section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with ❤️ by John Doe. © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}