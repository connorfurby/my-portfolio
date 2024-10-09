"use client"

import { useState, useEffect, useRef } from "react"
import { Moon, Sun, GraduationCap, Book, Trophy, Briefcase, Heart, Music, Menu, Waves, Snowflake, Code, Gamepad2, Users, Medal, Palette, Film, Utensils } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"

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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

function useIntersectionObserver(callback: IntersectionObserverCallback, options: IntersectionObserverInit = {}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(callback, options)
    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [callback, options])

  return ref
}

const AnimatedSection = ({ children, className, id }: { children: React.ReactNode, className?: string, id?: string }) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useIntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
      }
    },
    { threshold: 0.1 }
  )

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

interface PassionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  imageSrc: string;
}

const PassionCard: React.FC<PassionCardProps> = ({ icon: Icon, title, description, imageSrc }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const isInOriginalBounds = 
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      
      setIsHovered(isInOriginalBounds);
    }
  };

  return (
    <div 
      className="relative" 
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <Card 
        className={`transition-all duration-300 ease-in-out ${
          isHovered ? 'absolute w-full shadow-lg' : ''
        }`}
        style={{
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          zIndex: isHovered ? 9999 : 'auto', // Significantly increased z-index when hovered
        }}
      >
        <div className="p-4">
          <div className={`transition-opacity duration-300 ${isHovered ? 'hidden' : 'block'}`}>
            <Icon className="h-12 w-12 mb-2 mx-auto" />
            <CardTitle className="text-lg text-center">{title}</CardTitle>
          </div>
          {isHovered && (
            <div className="flex flex-col items-center justify-start">
              <div className="w-full h-48 relative mb-4 overflow-hidden rounded-lg"> {/* Added overflow-hidden and rounded-lg */}
                <Image
                  src={imageSrc}
                  alt={title}
                  layout="fill"
                  objectFit="cover" // Changed from "contain" to "cover"
                  className="rounded-lg" // This ensures the image itself has rounded corners
                />
              </div>
              <CardTitle className="text-lg mb-2">{title}</CardTitle>
              <p className="text-sm text-center overflow-y-auto max-h-[100px]">{description}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default function Portfolio() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [activeSection, setActiveSection] = useState("about")

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      const sections = ["about", "education", "experience", "skills", "passions"]
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
    { name: "Experience", href: "#experience" },
    { name: "Education", href: "#education" },
    { name: "Skills", href: "#skills" },
    { name: "Passions", href: "#passions" },
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const navbarHeight = 56 // Adjust this value to match your navbar height
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 20 // Added extra 20px for visual padding

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  const projects = [
    {
      title: "SlideCentral",
      description: "A web app that allows teachers and students who manage clubs or activities to create and manage slides for their meetings and events to be displayed throughout the school.",
      bullets: [
        "Implemented depth-first search for maze generation",
        "Used A* algorithm for efficient pathfinding",
        "Visualized the maze and solution using Java Swing"
      ],
      images: [
        { src: "/imgs/slidecentral/slcimg1.png", alt: "Homepage; authentication highlighted", description: "Home Page (Signed in)" },
        { src: "/imgs/slidecentral/slcimg2.png", alt: "Maze generation process", description: "Home Page (Authentication highlighted)" },
        { src: "/imgs/slidecentral/slcimg3.png", alt: "Maze generation process", description: "Main slideshow view (w/ fullscreen capabilities)" },
        { src: "/imgs/slidecentral/slcimg4.png", alt: "Maze generation process", description: "Activity creation prompts" },
        { src: "/imgs/slidecentral/slcimg5.png", alt: "Maze generation process", description: "Student side basics" },
        { src: "/imgs/slidecentral/slcimg6.png", alt: "Maze generation process", description: "Dashboard view populated w/ activities" },
        { src: "/imgs/slidecentral/slcimg7.png", alt: "Maze generation process", description: "Activity Dashboard" },
        { src: "/imgs/slidecentral/slcimg8.png", alt: "Maze generation process", description: "Slide generation options" },
        { src: "/imgs/slidecentral/slcimg9.png", alt: "Maze generation process", description: "Basic slide generation form" },
        { src: "/imgs/slidecentral/slcimg10.png", alt: "Maze generation process", description: "Activity dashboard with generated slides per activity" },
      ]
    },
    {
      title: "Ice Dodo",
        description: "An animated cityscape created using Java and JavaFX.",
        bullets: [
          "Implemented custom animation logic",
          "Used JavaFX for rendering graphics",
          "Created a day-night cycle with dynamic lighting"
        ],
        images: [
          { 
            src: "/imgs/icedodo/icedodo.mp4", 
            alt: "Game Trailer", 
            description: "Trailer I made in 2021 with over 63,000 views on YouTube",
            isVideo: true
          },
          { 
            src: "/imgs/icedodo/icedodo1.png", 
            alt: "My levels", 
            description: "My personal 'cup' of 17 levels I developed" 
          },
          { 
            src: "/imgs/icedodo/icedodo2.png", 
            alt: "Credits", 
            description: "My spot at the top of the credits" 
          },
          { 
            src: "/imgs/icedodo/icedodo3.png", 
            alt: "Level", 
            description: "One of my favorite levels I made" 
          },
          { 
            src: "/imgs/icedodo/icedodo4.png", 
            alt: "UI Update", 
            description: "A screenshot from my UI update, which was my first web development experience" 
          },
        ]
      },
      
    {
      title: "Animated Cityscape",
      description: "An animated cityscape created using Java and JavaFX.",
      bullets: [
        "Implemented custom animation logic",
        "Used JavaFX for rendering graphics",
        "Created a day-night cycle with dynamic lighting"
      ],
      images: [
        { 
          src: "/imgs/cityscape/cityscape.mp4", 
          alt: "Animated Cityscape", 
          description: "This is the animation of the cityscape",
          isVideo: true
        },
        { 
          src: "/imgs/cityscape/cityscape.png", 
          alt: "Photo of Java Classes", 
          description: "Classes and flows in this project" 
        },
      ]
    },
    {
      title: "SlasherCrush",
      description: "A Candy Crush inspired game with a Halloween theme, made for AP Microeconomics as an extension to show the near perfect market of 'Match 3' games, and how easy it is to enter the market.",
      bullets: [
        "Developed using Unity and C#",
        "Implemented match-3 game mechanics with a spooky twist",
        "Created custom artwork and animations for a Halloween theme",
        "Integrated economic concepts into gameplay and design"
      ],
      images: [
        { src: "/imgs/slashercrush/scimg1.png", alt: "SlasherCrush Title Screen", description: "Simple Title screen of SlasherCrush" },
        { src: "/imgs/slashercrush/scimg2.png", alt: "Gameplay Screenshot", description: "In-game screenshot showing game board" },
        { src: "/imgs/slashercrush/scimg3.png", alt: "Scaling Gameplay", description: "Scaling Gameplay to level 20, changing to a darker theme, and progressively adding more icons and difficulty" },
        { src: "/imgs/slashercrush/scimg4.png", alt: "Game Over Screen", description: "Game over screen functionality and score" }
      ]
    },
    {
      title: "Personal Portfolio Site",
      description: "This is the site you are currently on! It is a portfolio website that showcases my skills and achievements.",
      bullets: [
        "Used NextJS 14, React, TailwindCSS, and ShadCN Components",
        ""
      ],
      images: [
        { src: "/imgs/personalportfolio/ppimg1.png", alt: "Early Stages", description: "Early stages of development" },
        { src: "/imgs/personalportfolio/ppimg2.png", alt: "Heart Image", description: "Thank you for visting!" },
      ]
    },
    {
      title: "And More!!",
      description: "Over my course of learning to code, I have made many smaller projects along the way as well, inclduing but not limited to:",
      bullets: [
        "Maze Solver app in Java using Data Structures such as Stacks and Queues",
        "A Text-to-Speech physical Calculator using a Raspberry Pi and buttons connected to a Breadboard",
        "Various Text-based RPG Python games",
        "A Universal Paperclips inspired game made in React",
        "A Mental Health AI Chatbot called LiveMore during a Hackathon",
        "Multiple Simple Minecraft Mods",
        "Small 3D experiments in Unity and Blender",
      ],
      images: [
        { src: "/imgs/github1.png", alt: "GitHub projects", description: "Just some of my many tests and GitHub projects" },
        { src: "/imgs/Replit1.png", alt: "Replit projects", description: "Replit is where I started my programming journey and made many projects, as well as many failures (Learning Experiences)" },
      ]
    },

  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <GraduationCap className="ml-6 h-6 w-6" />
            <span className="ml-2 font-bold hidden sm:inline">Connor Furby</span>
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
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Toggle Theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-2"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              Change Theme
            </Button>
          </div>
        </div>
      </header>

      <main className="w-full">
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-[70vh] overflow-hidden pt-16" // Added pt-16 for padding-top
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/imgs/banner1.jpg"
              alt="Banner"
              layout="fill"
              objectFit="cover"
              className="brightness-75"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background banner-gradient"></div>
          </div>
          <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-4">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Welcome to My Portfolio</h1>
            <p className="text-xl mb-8 drop-shadow-md">Aspiring Software Engineer | Passionate Learner | Future Innovator</p>
            <Image
              src="/imgs/pfp1.jpg"
              alt="Connor Furby"
              width={180}
              height={180}
              className="rounded-full mx-auto mb-6 border-4 border-white shadow-lg" // Increased bottom margin
              priority
            />
            <p className="max-w-4xl mx-auto bg-background/30 dark:bg-background/50 p-6 rounded-lg backdrop-blur-sm">
              Hello! My name is Connor Furby, an ambitious and driven student with career aspirations in Computer Science, actively engaged in a variety of extracurricular and career exploration activities. A dedicated club member, athlete, and volunteer, who consistently excels academically. Participated in multiple internships and Hackathons, gaining hands-on experience in app development and programming across a range of languages. Comfortable adapting to new challenges and committed to continuous learning and personal growth.
            </p>
          </div>
        </motion.section>

        <div className="container mx-auto px-4 py-8 bg-background">
          <AnimatedSection id="experience" className="mb-12 pt-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Experience</h2>
            <Tabs defaultValue="internships" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="internships">Internships</TabsTrigger>
                <TabsTrigger value="work">Work</TabsTrigger>
                <TabsTrigger value="volunteering">Volunteering</TabsTrigger>
              </TabsList>
              <TabsContent value="internships">
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Campbell Holzhauer Concierge Law - AI Development Intern</CardTitle>
                    <CardDescription>06/2024 - Current</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Applied software knowledge from classes and school, as well as individual AI research, into a real-world business application.</li>
                      <li>Learned business skills, such as working in a hybrid environment, scheduling and attending meetings, and working with a team, as well as individually.</li>
                      <li>Met with Industry Leaders in the field to compare our products with theirs and learn more about the top tech.</li>
                      <li>Learned about the intersection of tech and AI with the legal industry and how to cater to and develop an AI tool for that field, while maintaining industry standards and precautions</li>
                      <li>Learned how to integrate multiple APIs and software into one application to create the desired product.</li>
                      <li>Went through rigorous testing and tweaking of all of our work.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>DistrictZero - QA Technical Support Intern</CardTitle>
                    <CardDescription>09/2024 - Current</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Assisted in restructuring the app's front-end, improving the UI/UX and interface consistency.</li>
                      <li>Identified, reported, and resolved app bugs to enhance user experience, contributing to the mental health mentorship platform for students.</li>
                      <li>Worked with various frameworks, libraries, applications, and more tech.</li>
                      <li>Enhanced attention to detail by thoroughly testing app features and user flows before implementation</li>
                      <li>Collaborated with the technical team to ensure solutions aligned with the overall project goals and user needs</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="work">
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Jimmy John's Franchise - In Shop Worker</CardTitle>
                    <CardDescription>11/2023 - Current</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Learned to work fast and efficiently with groups of people, balancing making sandwiches, taking orders, and doing all the other tasks necessary to keep the store afloat.</li>
                      <li>Memorized how to make 25+ different types of sandwiches with all of their nuances and ingredients.</li>
                      <li>Kept all foods fresh by practicing food safety techniques.</li>
                      <li>Learned to close and open a shop, as well as doing cleaning duties, such as bathroom and dish duties.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Centennial Beach Grill Naperville - Grill Attendant</CardTitle>
                    <CardDescription>05/2023 - 08/2023</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Worked with many types of people cashiering, including some with special needs or large groups of children within summer camps.</li>
                      <li>Worked shifts between 6 and 8.5 hours.</li>
                      <li>Efficiently managed grill operations, boosting customer satisfaction and service speed.</li>
                      <li>Maintained high standards of food safety.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Naperville Park District - Youth Soccer Referee</CardTitle>
                    <CardDescription>05/2021 - 08/2021</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Worked with young kids, as well as parents, to run a smooth soccer game where kids behaved properly, but also had fun and learned patience skills, as well as the game of soccer.</li>
                      <li>Worked around 6 games in a row on average every weekend and got used to a schedule at a young age.</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="volunteering">
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>CodeBytes Camp - Volunteer Leader</CardTitle>
                    <CardDescription>25+ Hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Co-led an engaging camp with 80+ participants for middle school students focused on Python programming fundamentals.</li>
                      <li>Developed and implemented lesson plans, projects, and activities to introduce coding concepts.</li>
                      <li>Mentored students, fostering their interest in computer science and problem-solving skills.</li>
                      <li>Assisted in developing a Middle School 6 hour Hackathon</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Schoolhouse - SAT Tutoring</CardTitle>
                    <CardDescription>25+ Hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Provided engaging SAT tutoring to 20 high school students, focusing on math and reading comprehension in two seperate bootcamps of 10 students each.</li>
                      <li>Developed personalized study plans and practice materials to address individual student needs.</li>
                      <li>Helped students improve their test-taking strategies and boost their confidence.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Special NeedsSTEM Summer Camp - Volunteer Leader</CardTitle>
                    <CardDescription>15 Hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Assisted in hands-on STEM activities for special needs high school students.</li>
                      <li>Learned how to work with special needs students and how to make learning fun for them, as well as various patience and safety skills.</li>
                      <li>Mentored learners, encouraging their curiosity and interest in STEM fields.</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="projects">
                {projects.map((project, index) => (
                  <Card key={index} className="mb-6">
                    <CardHeader>
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/2">
                        <ul className="list-disc pl-5 space-y-2">
                          {project.bullets.map((bullet, bulletIndex) => (
                            <li key={bulletIndex}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="w-full md:w-1/2">
                        <Carousel className="w-full max-w-md mx-auto">
                          <CarouselContent>
                            {project.images.map((image, imageIndex) => (
                              <CarouselItem key={imageIndex}>
                                <div className="p-1">
                                  <Card>
                                    <CardContent className="p-2">
                                      <AspectRatio ratio={4/3} className="bg-muted">
                                        <div className="relative w-full h-full">
                                          {image.isVideo ? (
                                            <video
                                              src={image.src}
                                              autoPlay
                                              loop
                                              muted
                                              playsInline
                                              className="absolute inset-0 w-full h-full object-cover"
                                            />
                                          ) : (
                                            <>
                                              <Image
                                                src={image.src}
                                                alt={image.alt}
                                                fill
                                                className="object-contain"
                                              />
                                              <div 
                                                className="absolute inset-0 z-10"
                                                style={{
                                                  backgroundImage: `url(${image.src})`,
                                                  backgroundSize: 'cover',
                                                  backgroundPosition: 'center',
                                                  filter: 'blur(20px)',
                                                  opacity: 0.5,
                                                }}
                                              />
                                              <Image
                                                src={image.src}
                                                alt={image.alt}
                                                fill
                                                className="object-contain z-20"
                                              />
                                            </>
                                          )}
                                        </div>
                                      </AspectRatio>
                                    </CardContent>
                                  </Card>
                                  <p className="text-center mt-2 text-sm">{image.description}</p>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </AnimatedSection>

          <AnimatedSection id="education" className="mb-12 pt-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Education</h2>
            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="coursework">Coursework</TabsTrigger>
              </TabsList>
              <Card>
                <CardHeader>
                  <CardTitle>Naperville Central High School</CardTitle>
                  <CardDescription>2021-2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <TabsContent value="stats">
                    <h3 className="text-lg font-semibold mb-2">Academic Statistics</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>GPA:</strong> 4.262</li>
                      <li><strong>SAT Score:</strong> 1510 (760 Math, 750 Reading & Writing)</li>
                    </ul>
                  </TabsContent>
                  <TabsContent value="activities">
                    <h3 className="text-lg font-semibold mb-2">Extracurricular Activities</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>3 Year Cross Country Runner (including extended summer season)</li>
                      <li>3 Year Lacrosse Goalie</li>
                      <li>2 Year Winter Track Distance Runner</li>
                      <li>Senior Class Council Member</li>
                      <li>Computer Science Club Member</li>
                      <li>National Honors Society Member</li>
                      <li>German Club Attendee</li>
                    </ul>
                  </TabsContent>
                  <TabsContent value="coursework">
                    <h3 className="text-lg font-semibold mb-2">Relevant Coursework</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Computer Programming 1</li>
                      <li>Computer Programming 2</li>
                      <li>AP Computer Science A (Recieved 5 on Exam)</li>
                      <li>Software Engineering 1</li>
                      <li>Software Engineering 2</li>
                      <li>AP Calculus BC (Taking exam in May)</li>
                      <li>AP Physics 1 (Recived 4 on Exam)</li>
                      <li>Honors Chemistry</li>
                      <li>AP Microeconomics (Taking exam in May)</li>
                      <li>AP Macroeconomics (Taking exam in May)</li>
                    </ul>
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>
          </AnimatedSection>

          <AnimatedSection id="skills" className="mb-12 pt-16">
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
                      <li>Programming (Python, Java, some knowledge in more languages)</li>
                      <li>Web Development (HTML, CSS, ReactJS, NextJs, TailwindCSS, NodeJS, ExpressJS, some SQL)</li>
                      <li>Data Structures and Algorithms</li>
                      <li>Problem Solving</li>
                      <li>Team Collaboration</li>
                      <li>Creativity</li>
                      <li>Leadership</li>
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
                      <li>National Honors Society Award</li>
                      <li>4.0 Award every semester</li>
                      <li>Software Engineering May 2024 Student of the Month</li>
                      <li>Top 4 Project in HSHacks Hackathon 2024</li>
                      <li>Completed requirementsto earn an endorsement in the IT Career Path from the state of Illinois at graduation</li>
                      <li>On pace to graduate with the Illinois Global Scholar Award</li>
                      <li>Earned a spot near the top of the credits of a popular Chrome Extension game with 600,000+ users: Ice Dodo</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </AnimatedSection>

          <AnimatedSection id="passions" className="mb-12 pt-16 relative z-50">
            <h2 className="text-3xl font-bold mb-6 text-center">Passions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <PassionCard 
                icon={Book} 
                title="Reading" 
                description="I love diving into fantasy worlds and learning new things through books. Reading allows me to explore different perspectives and expand my knowledge across various subjects."
                imageSrc="/imgs/passions/reading.JPG"
              />
              <PassionCard 
                icon={Waves} 
                title="Water Sports" 
                description="Jet skiing and wakeboarding are my favorite summer activities. The thrill of gliding across the water and feeling the spray on my face is unmatched. It's a perfect blend of excitement and relaxation."
                imageSrc="/imgs/passions/watersports.jpg"
              />
              <PassionCard 
                icon={Snowflake} 
                title="Snow Skiing" 
                description="Carving down snowy slopes is an exhilarating winter pastime."
                imageSrc="/imgs/passions/skiing.jpg"
              />
              <PassionCard 
                icon={Code} 
                title="Software Development" 
                description="Creating innovative solutions through code is my true passion."
                imageSrc="/imgs/passions/softwaredevelopment.png"
              />
              <PassionCard 
                icon={Heart} 
                title="Volunteering" 
                description="Giving back to the community brings joy and fulfillment."
                imageSrc="/imgs/passions/volunteering.JPG"
              />
              <PassionCard 
                icon={Gamepad2} 
                title="The Legend of Zelda" 
                description="Exploring Hyrule and solving puzzles is my favorite gaming experience."
                imageSrc="/imgs/passions/zelda.jpg"
              />
              <PassionCard 
                icon={Music} 
                title="Music" 
                description="Music is the soundtrack to my life, always inspiring and motivating me."
                imageSrc="/imgs/passions/music.jpg"
              />
              <PassionCard 
                icon={Users} 
                title="Family & Friends" 
                description="Spending quality time with loved ones is what life is all about."
                imageSrc="/imgs/passions/family.jpg"
              />
              <PassionCard 
                icon={Medal} 
                title="Running" 
                description="Pushing my limits and staying fit through running is a rewarding challenge."
                imageSrc="/imgs/passions/running.png"
              />
              <PassionCard 
                icon={Palette} 
                title="Graphic Design" 
                description="Expressing creativity through visual design is a fulfilling hobby."
                imageSrc="/imgs/passions/graphicdesign.PNG"
              />
              <PassionCard 
                icon={Film} 
                title="Movies" 
                description="Getting lost in cinematic stories and experiencing different worlds."
                imageSrc="/imgs/passions/movies.jpg"
              />
              <PassionCard 
                icon={Utensils} 
                title="Food" 
                description="Exploring diverse cuisines and flavors is a delicious adventure."
                imageSrc="/imgs/passions/food.png"
              />
            </div>
          </AnimatedSection>

          <AnimatedSection className="text-center">
            <h2 className="text-3xl font-bold mb-6">Let's Connect!</h2>
            <p className="mb-4">
              I'm always eager to learn and grow. Feel free to reach out if you have any questions or would like to know
              more about my experiences and aspirations.
            </p>
            <p className="mb-4">
              Email: cafurby27@icloud.com
            </p>
            <div className="w-full max-w-7xl mx-auto mb-6">
              <h3 className="text-2xl font-semibold mb-4 mt-10">My Favorite Spotify Playlists</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <iframe 
                    style={{ borderRadius: "12px" }} 
                    src="https://open.spotify.com/embed/playlist/4moPgBwt9bJWz3UgFhJTd3?utm_source=generator" 
                    width="100%" 
                    height="352" 
                    frameBorder="0" 
                    allowFullScreen 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                  ></iframe>
                  <p className="mt-2 text-sm text-muted-foreground">
                    My favorite playlist to listen to on the Jet Ski or to give summer vibes
                  </p>
                </div>
                <div>
                  <iframe 
                    style={{ borderRadius: "12px" }} 
                    src="https://open.spotify.com/embed/playlist/48LiOY4hhigjbcIFvzOsPd?utm_source=generator" 
                    width="100%" 
                    height="352" 
                    frameBorder="0" 
                    allowFullScreen 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                  ></iframe>
                  <p className="mt-2 text-sm text-muted-foreground">
                    My favorite playlist to listen to at night, while it's raining, or while studying
                  </p>
                </div>
                <div>
                  <iframe 
                    style={{ borderRadius: "12px" }} 
                    src="https://open.spotify.com/embed/playlist/1mVVns1bUDQBd14TnNOu1I?utm_source=generator" 
                    width="100%" 
                    height="352" 
                    frameBorder="0" 
                    allowFullScreen 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                  ></iframe>
                  <p className="mt-2 text-sm text-muted-foreground">
                    My upbeat playlist for running or when I'm in a great mood
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left ml-5">
            Built with ❤️ by Connor Furby in 2024. Thank you for visiting!
          </p>
        </div>
      </footer>
    </div>
  )
}