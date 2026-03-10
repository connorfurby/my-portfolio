import {
  Book,
  Bot,
  Boxes,
  BrainCircuit,
  Heart,
  LayoutTemplate,
  Music,
  Orbit,
  ServerCog,
  Waves,
  Snowflake,
  Code,
  Gamepad2,
  Users,
  Medal,
  Palette,
  Film,
  Utensils,
} from "lucide-react"

import type {
  ExperienceEntry,
  HeroPill,
  NavItem,
  Passion,
  ProofHighlight,
  Project,
  SignatureStack,
  SkillGroup,
  SpotifyPlaylist,
  TechCluster,
} from "@/components/portfolio/types"

export const navItems: NavItem[] = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Skills", href: "#skills" },
  { name: "Integrations", href: "#integrations" },
  { name: "Passions", href: "#passions" },
  { name: "Contact", href: "#contact" },
]

export const heroPills: HeroPill[] = [
  { label: "Next.js" },
  { label: "TypeScript" },
  { label: "React" },
  { label: "Python" },
  { label: "Java" },
  { label: "UI Engineering" },
  { label: "Creative Problem Solving" },
]

export const proofHighlights: ProofHighlight[] = [
  {
    value: "6+",
    label: "Featured Projects",
    description: "From full-stack web apps to games and creative experiments.",
  },
  {
    value: "2",
    label: "Current Internships",
    description: "Hands-on experience in AI development, QA, and product improvement.",
  },
  {
    value: "1510",
    label: "SAT Score",
    description: "Strong academic track record alongside technical and extracurricular work.",
  },
  {
    value: "600k+",
    label: "Game Reach",
    description: "Contributions recognized in Ice Dodo, used by hundreds of thousands of players.",
  },
]

export const projects: Project[] = [
  {
    title: "SlideCentral",
    description:
      "A web app that allows teachers and students who manage clubs or activities to create and manage slides for their meetings and events to be displayed throughout the school.",
    spotlight: "Full-stack school communication platform built over seven months in an Agile team.",
    stack: ["React", "Express", "Node.js", "Google Auth", "Agile"],
    bullets: [
      "Developed a comprehensive project using React JS, Express, Node, and the school database, completed over four sprints across seven months alongside three teammates.",
      "Integrated Google authentication and dynamic user views tailored for roles such as admin, teacher, and student, enhancing user experience and security.",
      "Implemented interactive image carousels with fullscreen and timer functionalities, providing a visually engaging platform for content display.",
      "Created custom activity and club dashboards with auto-generated slides, built from form-collected data to streamline information sharing for clubs and activities.",
      "Applied Agile methodologies, including sprints, retrospectives, and daily scrums, to maintain project momentum and continuous improvement, coordinated through Trello for task organization and collaboration.",
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
    ],
  },
  {
    title: "Ice Dodo",
    description: "A popular chrome extension game I contributed to, with over 600,000 users",
    spotlight: "Game design, UI, level creation, and community-facing creative work on a large existing audience.",
    stack: ["Game Design", "Level Design", "UI", "Trailer Production"],
    bullets: [
      "Revamped User Interface: Designed and implemented a completely new UI to enhance the game's visual appeal and user experience.",
      "Level Creation: Developed 17 additional levels, expanding the game content for players.",
      "Community Engagement: Actively participated in the game's Discord community, receiving positive feedback and support for my work.",
      "Trailer Production: Produced a new game trailer, which attracted over 63,000 views, boosting the game's visibility.",
      "Recognition: Earned a prominent spot in the game's credits, highlighting my contributions and dedication.",
    ],
    images: [
      {
        src: "/imgs/icedodo/icedodo.mp4",
        alt: "Game Trailer",
        description: "Trailer I made in 2021 with over 63,000 views on YouTube",
        isVideo: true,
      },
      {
        src: "/imgs/icedodo/icedodo1.png",
        alt: "My levels",
        description: "My personal 'cup' of 17 levels I developed",
      },
      {
        src: "/imgs/icedodo/icedodo2.png",
        alt: "Credits",
        description: "My spot at the top of the credits",
      },
      {
        src: "/imgs/icedodo/icedodo3.png",
        alt: "Level",
        description: "One of my favorite levels I made",
      },
      {
        src: "/imgs/icedodo/icedodo4.png",
        alt: "UI Update",
        description: "A screenshot from my first UI update",
      },
    ],
  },
  {
    title: "Animated Cityscape",
    description: "An animated cityscape created using Java",
    spotlight: "Object-oriented Java animation project focused on generative visuals and motion systems.",
    stack: ["Java", "JFrame", "OOP", "Animation"],
    bullets: [
      "Cityscape Animation Framework: Made with Java, uses JFrame and JComponent to create and animate a cityscape scene with various elements like buildings, bridges, trees, and clouds.",
      "Building Class: Handles dynamic building creation with a variety of visual characteristics, including randomized dimensions and positions, and window lighting based on a probability threshold, creating a day/night effect.",
      "Billboards, Trees, Cars, etc: Adds diversity with various types of elements throughout the entire project",
      "Multi-object Management: Contains logic to check overlapping positions, ensuring no buildings overlap and maintaining realistic spacing within the cityscape.",
      "Animation and Frame Updates: Utilizes Runnable interface to animate buildings, moving them across the screen to simulate a scrolling city. The nextFrame() method updates the scene continuously.",
      "Custom Colors and Graphics: Implements custom colors for buildings, windows, and sidewalks to create a visually cohesive cityscape.",
      "Agile Techniques in Code Structure: The code is organized into functions and classes to modularize each cityscape component, demonstrating structured coding practices.",
    ],
    images: [
      {
        src: "/imgs/cityscape/cityscape.mp4",
        alt: "Animated Cityscape",
        description: "This is the animation of the cityscape",
        isVideo: true,
      },
      {
        src: "/imgs/cityscape/cityscape.png",
        alt: "Photo of Java Classes",
        description: "Classes and flows in this project",
      },
    ],
  },
  {
    title: "SlasherCrush",
    description:
      "A Candy Crush inspired game with a Halloween theme, made for AP Microeconomics as an extension to show the near perfect market of 'Match 3' games, and how easy it is to enter the market.",
    spotlight: "Rapid product build that mixed gameplay logic, polish, and design experimentation.",
    stack: ["Next.js", "Tailwind", "shadcn/ui", "Game Logic"],
    bullets: [
      "Utilized a modern stack including NextJS, Tailwind CSS, ShadCN components, and various libraries, all hosted on Vercel, to develop the game.",
      "Rapid Development: Completed in just a few days as part of an economics class project.",
      "Game Development Insights: Gained practical knowledge on game mechanics and design principles, learning how to make gameplay engaging and intuitive.",
      "Implemented Advanced Game Logic: Created features like progressive difficulty, move-based gameplay, and level balancing to ensure a challenging yet enjoyable experience.",
      "Responsive and Adaptive Gameplay: Designed the game to respond dynamically to player actions, providing a personalized and fun gaming experience.",
    ],
    images: [
      { src: "/imgs/slashercrush/scimg1.png", alt: "SlasherCrush Title Screen", description: "Simple Title screen of SlasherCrush" },
      { src: "/imgs/slashercrush/scimg2.png", alt: "Gameplay Screenshot", description: "In-game screenshot showing game board" },
      { src: "/imgs/slashercrush/scimg3.png", alt: "Scaling Gameplay", description: "Scaling Gameplay to level 20" },
      { src: "/imgs/slashercrush/scimg4.png", alt: "Game Over Screen", description: "Game over screen functionality and score" },
    ],
  },
  {
    title: "Personal Portfolio Site",
    description: "This is the site you are currently on! It is a portfolio website that showcases my skills and achievements.",
    spotlight: "A self-directed design and engineering project centered on storytelling, motion, and responsive UI.",
    stack: ["Next.js", "Tailwind", "Framer Motion", "shadcn/ui"],
    bullets: [
      "Built with a modern stack using NextJS, Tailwind CSS, ShadCN components, and various libraries, hosted on Vercel, to create a personal website.",
      "Invested substantial time and effort to ensure the site reflects my personality and achievements effectively.",
      "Gained experience with advanced features like embedding Spotify cards, implementing fullscreen modals, and integrating other dynamic elements.",
      "Optimized for responsiveness across all screen sizes, providing a seamless experience on both mobile and desktop devices.",
      "Adaptive Navigation: Navigation bars transform into a side dropdown menu on mobile, enhancing accessibility and usability.",
      "Dynamic Adjustments for Immersive Experience: Various elements adapt to different devices, ensuring a consistent and engaging user experience.",
    ],
    images: [
      { src: "/imgs/personalportfolio/ppimg1.png", alt: "Early Stages", description: "Early stages of development" },
      { src: "/imgs/personalportfolio/ppimg2.png", alt: "Heart Image", description: "Thank you for visting!" },
    ],
  },
  {
    title: "And More!!",
    description: "Over my course of learning to code, I have made many smaller projects along the way as well, inclduing but not limited to:",
    spotlight: "A broad body of smaller builds that sharpened experimentation, iteration, and technical range.",
    stack: ["Python", "Java", "React", "Raspberry Pi", "Unity"],
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
      { src: "/imgs/Replit1.png", alt: "Replit projects", description: "Replit is where I started my programming journey" },
    ],
  },
]

export const internshipEntries: ExperienceEntry[] = [
  {
    title: "Campbell Holzhauer Concierge Law - AI Development Intern",
    subtitle: "06/2024 - Current",
    bullets: [
      "Applied software knowledge from classes and school, as well as individual AI research, into a real-world business application.",
      "Learned business skills, such as working in a hybrid environment, scheduling and attending meetings, and working with a team, as well as individually.",
      "Met with Industry Leaders in the field to compare our products with theirs and learn more about the top tech.",
      "Learned about the intersection of tech and AI with the legal industry and how to cater to and develop an AI tool for that field, while maintaining industry standards and precautions",
      "Learned how to integrate multiple APIs and software into one application to create the desired product.",
      "Went through rigorous testing and tweaking of all of our work.",
    ],
  },
  {
    title: "DistrictZero - QA Technical Support Intern",
    subtitle: "09/2024 - Current",
    bullets: [
      "Assisted in restructuring the app's front-end, improving the UI/UX and interface consistency.",
      "Identified, reported, and resolved app bugs to enhance user experience, contributing to the mental health mentorship platform for students.",
      "Worked with various frameworks, libraries, applications, and more tech.",
      "Enhanced attention to detail by thoroughly testing app features and user flows before implementation",
      "Collaborated with the technical team to ensure solutions aligned with the overall project goals and user needs",
    ],
  },
]

export const workEntries: ExperienceEntry[] = [
  {
    title: "Jimmy John's Franchise - In Shop Worker",
    subtitle: "11/2023 - Current",
    bullets: [
      "Learned to work fast and efficiently with groups of people, balancing making sandwiches, taking orders, and doing all the other tasks necessary to keep the store afloat.",
      "Memorized how to make 25+ different types of sandwiches with all of their nuances and ingredients.",
      "Kept all foods fresh by practicing food safety techniques.",
      "Learned to close and open a shop, as well as doing cleaning duties, such as bathroom and dish duties.",
    ],
  },
  {
    title: "Centennial Beach Grill Naperville - Grill Attendant",
    subtitle: "05/2023 - 08/2023",
    bullets: [
      "Worked with many types of people cashiering, including some with special needs or large groups of children within summer camps.",
      "Worked shifts between 6 and 8.5 hours.",
      "Efficiently managed grill operations, boosting customer satisfaction and service speed.",
      "Maintained high standards of food safety.",
    ],
  },
  {
    title: "Naperville Park District - Youth Soccer Referee",
    subtitle: "05/2021 - 08/2021",
    bullets: [
      "Worked with young kids, as well as parents, to run a smooth soccer game where kids behaved properly, but also had fun and learned patience skills, as well as the game of soccer.",
      "Worked around 6 games in a row on average every weekend and got used to a schedule at a young age.",
    ],
  },
]

export const volunteerEntries: ExperienceEntry[] = [
  {
    title: "CodeBytes Camp - Volunteer Leader",
    subtitle: "25+ Hours",
    bullets: [
      "Co-led an engaging camp with 80+ participants for middle school students focused on Python programming fundamentals.",
      "Developed and implemented lesson plans, projects, and activities to introduce coding concepts.",
      "Mentored students, fostering their interest in computer science and problem-solving skills.",
      "Assisted in developing a Middle School 6 hour Hackathon",
    ],
  },
  {
    title: "Schoolhouse - SAT Tutoring",
    subtitle: "25+ Hours",
    bullets: [
      "Provided engaging SAT tutoring to 20 high school students, focusing on math and reading comprehension in two seperate bootcamps of 10 students each.",
      "Developed personalized study plans and practice materials to address individual student needs.",
      "Helped students improve their test-taking strategies and boost their confidence.",
    ],
  },
  {
    title: "Special Needs STEM Summer Camp - Volunteer Leader",
    subtitle: "15 Hours",
    bullets: [
      "Assisted in hands-on STEM activities for special needs high school students.",
      "Learned how to work with special needs students and how to make learning fun for them, as well as various patience and safety skills.",
      "Mentored learners, encouraging their curiosity and interest in STEM fields.",
    ],
  },
]

export const academicStats = [
  "GPA: 4.262",
  "SAT Score: 1510 (760 Math, 750 Reading & Writing)",
]

export const schoolActivities = [
  "3 Year Cross Country Runner (including extended summer season)",
  "3 Year Lacrosse Goalie",
  "2 Year Winter Track Distance Runner",
  "Senior Class Council Member",
  "Computer Science Club Member",
  "National Honors Society Member",
  "German Club Attendee",
]

export const coursework = [
  "Computer Programming 1",
  "Computer Programming 2",
  "AP Computer Science A (Received 5 on Exam)",
  "Software Engineering 1",
  "Software Engineering 2",
  "AP Calculus BC (Taking exam in May)",
  "AP Physics 1 (Received 4 on Exam)",
  "Honors Chemistry",
  "AP Microeconomics (Taking exam in May)",
  "AP Macroeconomics (Taking exam in May)",
]

export const skills = [
  "Programming (Python, Java, some knowledge in more languages)",
  "Web Development (HTML, CSS, ReactJS, NextJs, TailwindCSS, NodeJS, ExpressJS, some SQL)",
  "Data Structures and Algorithms",
  "Problem Solving",
  "Team Collaboration",
  "Creativity",
  "Leadership",
]

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Responsive UI", "Framer Motion"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express", "Authentication", "API Integration", "SQL Basics"],
  },
  {
    title: "Core Foundations",
    items: ["Java", "Python", "Data Structures", "Algorithms", "Problem Solving"],
  },
  {
    title: "Collaboration",
    items: ["Agile", "Teamwork", "Leadership", "Testing", "Product Thinking"],
  },
]

export const achievements = [
  "National Honors Society Award",
  "4.0 Award every semester",
  "Software Engineering May 2024 Student of the Month",
  "Top 4 Project in HSHacks Hackathon 2024",
  "Completed requirements to earn an endorsement in the IT Career Path from the state of Illinois at graduation",
  "On pace to graduate with the Illinois Global Scholar Award",
  "Earned a spot near the top of the credits of a popular Chrome Extension game with 600,000+ users: Ice Dodo",
]

export const techClusters: TechCluster[] = [
  {
    id: "frontend-systems",
    title: "Frontend Systems",
    shortLabel: "Frontend",
    summary: "Interfaces that feel modern, responsive, and motion-rich across portfolio work, school builds, and product iterations.",
    icon: LayoutTemplate,
    accent: "230 88% 58%",
    accentSecondary: "197 92% 55%",
    technologies: [
      { name: "React", tier: "core" },
      { name: "Next.js", tier: "core" },
      { name: "TypeScript", tier: "core" },
      { name: "JavaScript", tier: "core" },
      { name: "Tailwind CSS", tier: "core" },
      { name: "Framer Motion", tier: "strong" },
      { name: "shadcn/ui", tier: "strong" },
      { name: "Responsive Design", tier: "core" },
      { name: "UI/UX Polish", tier: "strong" },
      { name: "Animation Systems", tier: "strong" },
      { name: "Accessibility Awareness", tier: "strong" },
      { name: "Component Architecture", tier: "core" },
    ],
    proofs: [
      "Built polished React and Next.js interfaces for portfolio experiences, games, and school tooling.",
      "Improved interface consistency during QA and support internship work on a student-focused app.",
      "Uses motion, fullscreen media, and adaptive layouts to make projects feel more immersive.",
    ],
    projects: ["Personal Portfolio Site", "SlasherCrush", "SlideCentral"],
    focus: ["Rich interaction", "Visual storytelling", "Mobile-friendly design"],
  },
  {
    id: "fullstack-apis",
    title: "Full-Stack and APIs",
    shortLabel: "Full-Stack",
    summary: "Connecting interfaces to real functionality through backend logic, authentication flows, data access, and external integrations.",
    icon: ServerCog,
    accent: "171 82% 48%",
    accentSecondary: "197 70% 48%",
    technologies: [
      { name: "Node.js", tier: "core" },
      { name: "Express", tier: "core" },
      { name: "Route Handlers", tier: "strong" },
      { name: "REST APIs", tier: "core" },
      { name: "Authentication", tier: "strong" },
      { name: "Google Auth", tier: "strong" },
      { name: "API Integration", tier: "core" },
      { name: "SQL Basics", tier: "strong" },
      { name: "Environment Config", tier: "strong" },
      { name: "Vercel Deployments", tier: "strong" },
      { name: "Testing and QA", tier: "strong" },
      { name: "Debugging", tier: "core" },
    ],
    proofs: [
      "Built SlideCentral with authentication, role-based views, dashboards, and generated content workflows.",
      "Internship work includes integrating multiple APIs and testing features against real business needs.",
      "This portfolio already pulls dynamic GitHub, LinkedIn, and Spotify-adjacent integrations into one experience.",
    ],
    projects: ["SlideCentral", "Personal Portfolio Site", "LiveMore"],
    focus: ["Product thinking", "Real-world integrations", "Reliable iteration"],
  },
  {
    id: "core-cs",
    title: "Core CS Foundations",
    shortLabel: "Core CS",
    summary: "The problem-solving layer underneath the UI: algorithms, object-oriented design, and strong fundamentals in multiple languages.",
    icon: BrainCircuit,
    accent: "27 92% 62%",
    accentSecondary: "43 88% 62%",
    technologies: [
      { name: "Java", tier: "core" },
      { name: "Python", tier: "core" },
      { name: "Data Structures", tier: "core" },
      { name: "Algorithms", tier: "core" },
      { name: "Object-Oriented Programming", tier: "core" },
      { name: "Problem Solving", tier: "core" },
      { name: "Recursion", tier: "strong" },
      { name: "Stacks and Queues", tier: "strong" },
      { name: "Simulation Logic", tier: "strong" },
      { name: "Game Logic", tier: "strong" },
      { name: "Performance Mindset", tier: "strong" },
      { name: "Code Organization", tier: "core" },
    ],
    proofs: [
      "Created Java projects such as the animated cityscape and maze-solving work using classic CS structures.",
      "Built multiple smaller experiments in Python, Java, and game systems while learning across classes and side projects.",
      "Strong academic results back up the engineering fundamentals shown in the project work.",
    ],
    projects: ["Animated Cityscape", "And More!!", "Maze Solver"],
    focus: ["Clean logic", "Foundational depth", "Learning speed"],
  },
  {
    id: "creative-tech",
    title: "Creative and Interactive Tech",
    shortLabel: "Creative",
    summary: "A mix of design sense and technical experimentation across games, animation, media, and immersive presentation.",
    icon: Orbit,
    accent: "312 76% 61%",
    accentSecondary: "230 88% 64%",
    technologies: [
      { name: "Game Design", tier: "core" },
      { name: "Level Design", tier: "core" },
      { name: "Trailer Editing", tier: "strong" },
      { name: "Graphic Design", tier: "strong" },
      { name: "Generative Visuals", tier: "strong" },
      { name: "Motion Design", tier: "strong" },
      { name: "Creative Direction", tier: "strong" },
      { name: "UI Refreshes", tier: "strong" },
      { name: "Storytelling", tier: "core" },
      { name: "Media Embeds", tier: "strong" },
      { name: "Interactive Prototypes", tier: "strong" },
      { name: "Product Personality", tier: "core" },
    ],
    proofs: [
      "Contributed UI, levels, and trailer production to Ice Dodo, a game with more than 600,000 users.",
      "Makes projects feel distinctive by blending motion, visuals, and personality into otherwise technical builds.",
      "Enjoys turning straightforward project sections into more cinematic experiences with animation and layout craft.",
    ],
    projects: ["Ice Dodo", "Animated Cityscape", "Personal Portfolio Site"],
    focus: ["Memorable experiences", "Motion-rich UI", "Creative engineering"],
  },
  {
    id: "ai-automation",
    title: "AI, Automation, and Emerging Tools",
    shortLabel: "AI + Tools",
    summary: "An expanding cluster focused on using AI responsibly, integrating modern tools, and learning fast from real product constraints.",
    icon: Bot,
    accent: "258 78% 64%",
    accentSecondary: "171 82% 54%",
    technologies: [
      { name: "AI Product Research", tier: "core" },
      { name: "Prompt Iteration", tier: "strong" },
      { name: "Tool Integration", tier: "core" },
      { name: "Workflow Automation", tier: "strong" },
      { name: "Model Evaluation", tier: "strong" },
      { name: "QA Feedback Loops", tier: "core" },
      { name: "Feature Experimentation", tier: "strong" },
      { name: "Risk Awareness", tier: "strong" },
      { name: "Rapid Prototyping", tier: "core" },
      { name: "Technical Curiosity", tier: "core" },
      { name: "Systems Thinking", tier: "strong" },
      { name: "Emerging Stack Adoption", tier: "exploring" },
    ],
    proofs: [
      "Current AI internship work focuses on product improvement, tool comparison, integration, and careful iteration.",
      "Hackathon and side projects show a willingness to prototype quickly while refining what is actually useful.",
      "Blends experimentation with testing, feedback, and practical constraints instead of just novelty.",
    ],
    projects: ["Campbell Holzhauer Internship", "LiveMore", "Personal Portfolio Site"],
    focus: ["Curiosity with discipline", "Fast learning", "Applied AI"],
  },
  {
    id: "collaboration-delivery",
    title: "Collaboration and Delivery",
    shortLabel: "Delivery",
    summary: "The execution side of building: teamwork, iteration, communication, and following projects through to a polished result.",
    icon: Boxes,
    accent: "12 84% 62%",
    accentSecondary: "27 92% 62%",
    technologies: [
      { name: "Agile", tier: "core" },
      { name: "Sprint Planning", tier: "strong" },
      { name: "Retrospectives", tier: "strong" },
      { name: "Team Communication", tier: "core" },
      { name: "Leadership", tier: "core" },
      { name: "Mentoring", tier: "strong" },
      { name: "Documentation", tier: "strong" },
      { name: "Product Feedback", tier: "core" },
      { name: "Bug Reporting", tier: "strong" },
      { name: "Cross-Functional Work", tier: "strong" },
      { name: "User Empathy", tier: "core" },
      { name: "Ownership", tier: "core" },
    ],
    proofs: [
      "Worked in Agile teams on longer school projects with scrums, retrospectives, and ongoing coordination.",
      "Volunteer and tutoring work show communication, patience, and teaching ability alongside technical growth.",
      "Internships and jobs reinforce reliability, fast adaptation, and follow-through under real responsibility.",
    ],
    projects: ["SlideCentral", "DistrictZero Internship", "CodeBytes Camp"],
    focus: ["Execution", "Communication", "Reliable momentum"],
  },
]

export const signatureStacks: SignatureStack[] = [
  {
    title: "Modern Web Builds",
    description: "The stack I reach for when I want a polished, dynamic product experience.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "shadcn/ui"],
  },
  {
    title: "Full-Stack Delivery",
    description: "The backend and deployment pieces I use to turn interfaces into functioning apps.",
    stack: ["Node.js", "Express", "APIs", "Authentication", "SQL Basics", "Vercel"],
  },
  {
    title: "Foundations and Experiments",
    description: "The languages and concepts that shaped how I think through logic and systems.",
    stack: ["Java", "Python", "OOP", "Data Structures", "Algorithms", "Game Logic"],
  },
]

export const passions: Passion[] = [
  {
    icon: Book,
    title: "Reading",
    description: "I have always loved reading a good book, especially sci-fi and dystopian novels.",
    imageSrc: "/imgs/passions/reading.JPG",
  },
  {
    icon: Waves,
    title: "Water Sports",
    description:
      "Jet skiing, wakeboarding, and water skiing are my favorite summer activities. On mornings at the lake, I always wake up at the crack of dawn to glide on the smooth glass water.",
    imageSrc: "/imgs/passions/watersports.jpg",
  },
  {
    icon: Snowflake,
    title: "Snow Skiing",
    description: "Skiing has been a big part of my family for generations, so I fell in love with the winter sport too.",
    imageSrc: "/imgs/passions/skiing.jpg",
  },
  {
    icon: Code,
    title: "Software Development",
    description: "Creating innovative solutions through code and learning new technologies is one of my favorite things to do.",
    imageSrc: "/imgs/passions/softwaredevelopment.png",
  },
  {
    icon: Heart,
    title: "Volunteering",
    description:
      "This is a picture of me instructing middle schoolers at a coding camp. Giving back to the community brings joy and fulfillment, especially when I can share my passions with others.",
    imageSrc: "/imgs/passions/volunteering.JPG",
  },
  {
    icon: Gamepad2,
    title: "The Legend of Zelda",
    description:
      "Since I was young, Zelda is what made me fall in love with games. I have beat all 20 games over time. Exploring Hyrule and solving puzzles is my favorite gaming experience.",
    imageSrc: "/imgs/passions/zelda.jpg",
  },
  {
    icon: Music,
    title: "Music",
    description: "Music and making playlists is something I have been doing for a long time. I love to create playlists for different activities and moods.",
    imageSrc: "/imgs/passions/music.jpg",
  },
  {
    icon: Users,
    title: "Family & Friends",
    description: "Hanging out with friends and family is something I value a lot. I love to make memories with the people I care about.",
    imageSrc: "/imgs/passions/family.jpg",
  },
  {
    icon: Medal,
    title: "Running",
    description: "I began running in middle school, and it has become a big part of my life. Pushing my limits and staying fit through running is a rewarding challenge.",
    imageSrc: "/imgs/passions/running.png",
  },
  {
    icon: Palette,
    title: "Graphic Design",
    description: "Expressing creativity through visual design is a fulfilling hobby.",
    imageSrc: "/imgs/passions/graphicdesign.PNG",
  },
  {
    icon: Film,
    title: "Movies",
    description: "A picture of me with Stan Lee, the creator of the Marvel Universe. Marvel and Disney movies are my favorite.",
    imageSrc: "/imgs/passions/movies.jpg",
  },
  {
    icon: Utensils,
    title: "Food",
    description: "Exploring diverse cuisines and flavors is always a blast. I love trying new foods from different cultures.",
    imageSrc: "/imgs/passions/food.png",
  },
]

export const spotifyPlaylists: SpotifyPlaylist[] = [
  {
    src: "https://open.spotify.com/embed/playlist/4moPgBwt9bJWz3UgFhJTd3?utm_source=generator",
    description: "My favorite playlist to listen to on the Jet Ski or to give summer vibes",
  },
  {
    src: "https://open.spotify.com/embed/playlist/48LiOY4hhigjbcIFvzOsPd?utm_source=generator",
    description: "My favorite playlist to listen to at night, while it's raining, or while studying",
  },
  {
    src: "https://open.spotify.com/embed/playlist/1mVVns1bUDQBd14TnNOu1I?utm_source=generator",
    description: "My upbeat playlist for running or when I'm in a great mood",
  },
]

export const contactLinks = [
  {
    label: "Email",
    href: "mailto:cafurby27@icloud.com",
    value: "cafurby27@icloud.com",
  },
]
