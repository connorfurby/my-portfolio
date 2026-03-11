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
  ContactFocus,
  ContactLink,
  CourseworkGroup,
  EducationProfile,
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
  { label: "AI Products" },
  { label: "Product Engineering" },
  { label: "Design Systems" },
  { label: "Python" },
  { label: "Java" },
]

export const proofHighlights: ProofHighlight[] = [
  {
    value: "15+",
    label: "Products Shipped",
    description: "Led or contributed to products that moved from prototype to production across internships and side projects.",
  },
  {
    value: "2",
    label: "High-Impact AI Roles",
    description: "Applied AI and full-stack work across mental health and legal-tech products with real users.",
  },
  {
    value: "4.0",
    label: "College GPA",
    description: "Strong academic performance at the University of Wisconsin-Madison while building outside the classroom.",
  },
  {
    value: "600k+",
    label: "Audience Reached",
    description: "Work featured in Ice Dodo and other projects that reached large public audiences.",
  },
]

export const projects: Project[] = [
  {
    title: "SlideCentral",
    description:
      "A full-stack platform for creating, managing, and distributing slide content across school clubs and activities.",
    spotlight: "A longer-form team build that balanced full-stack delivery, role-based access, and content automation.",
    stack: ["React", "Express", "Node.js", "Google Auth", "Agile"],
    bullets: [
      "Built the platform across four Agile sprints over seven months with a small development team.",
      "Implemented Google OAuth and dynamic role-based dashboards for administrators, teachers, and student leaders.",
      "Created club and activity workflows that turned structured form inputs into ready-to-display slide content.",
      "Designed media-forward viewing experiences, including carousels and fullscreen presentation behavior.",
      "Worked through sprint planning, retrospectives, and iterative delivery to keep the product moving from concept to completion.",
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
    description: "A contribution-heavy creative and UI project inside a Chrome extension game with more than 600,000 users.",
    spotlight: "A great example of design instincts, content creation, and shipping work into an already established product ecosystem.",
    stack: ["Game Design", "Level Design", "UI", "Trailer Production"],
    bullets: [
      "Revamped the game's interface to improve clarity, feel, and overall presentation quality.",
      "Designed and shipped 17 additional levels that became part of the official content lineup.",
      "Created a promotional trailer that reached more than 63,000 YouTube views.",
      "Worked in community-facing spaces around the game and received direct player feedback on shipped work.",
      "Earned a featured place in the official credits for sustained contributions.",
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
    description: "A Java animation project focused on generative visuals, object-oriented structure, and motion systems.",
    spotlight: "A foundational CS build that still shows how I think about animation logic, composition, and reusable structure.",
    stack: ["Java", "JFrame", "OOP", "Animation"],
    bullets: [
      "Built the cityscape in Java using Swing components and custom drawing logic.",
      "Implemented randomized building generation with varied dimensions, placement, and lit-window states.",
      "Added overlap detection and scene-balancing logic to keep the generated skyline readable and believable.",
      "Designed frame-update behavior that created the effect of continuous motion across the city.",
      "Structured the project with modular classes to keep visual systems and animation logic manageable.",
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
      "A Halloween-themed Match-3 web game that mixed rapid product delivery with gameplay balancing and polished presentation.",
    spotlight: "A fast-turnaround project that still made room for stronger interaction design, game logic, and visual identity.",
    stack: ["Next.js", "Tailwind", "shadcn/ui", "Game Logic"],
    bullets: [
      "Built and deployed the game on a modern web stack using Next.js, Tailwind CSS, and shadcn/ui.",
      "Completed the project on a short timeline while still focusing on presentation and gameplay feel.",
      "Implemented move-based systems, progressive difficulty, and balancing logic to keep the game challenging.",
      "Used the project to explore how product framing and game mechanics influence engagement.",
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
    description: "A portfolio experience built to present technical work, personality, and product instincts through motion-rich responsive UI.",
    spotlight: "A self-directed front-end system for storytelling, polish, and continuous iteration as my work evolves.",
    stack: ["Next.js", "Tailwind", "Framer Motion", "shadcn/ui"],
    bullets: [
      "Built the site in Next.js with reusable UI primitives, animated transitions, and a layered glass-style visual system.",
      "Integrated dynamic sections such as GitHub, Spotify, LinkedIn, and an AI portfolio assistant.",
      "Used the project as a sandbox for fullscreen media, interaction polish, and responsive layout experimentation.",
      "Continually refines the site as professional experience, academic context, and design taste evolve.",
    ],
    images: [
      { src: "/imgs/personalportfolio/ppimg1.png", alt: "Early Stages", description: "Early stages of development" },
      { src: "/imgs/personalportfolio/ppimg2.png", alt: "Heart Image", description: "Thank you for visting!" },
    ],
  },
  {
    title: "Additional Builds",
    description: "A wider set of smaller experiments that helped sharpen technical range, iteration speed, and creative confidence.",
    spotlight: "These projects mattered because they built repetition: small systems, quick experiments, and constant learning loops.",
    stack: ["Python", "Java", "React", "Raspberry Pi", "Unity"],
    bullets: [
      "A Java maze solver built with data-structure fundamentals like stacks and queues.",
      "A text-to-speech calculator on Raspberry Pi using physical hardware inputs and breadboard wiring.",
      "Text-based RPG experiments in Python and small browser-based game systems in React.",
      "A Universal Paperclips-inspired incremental game and other product-style prototypes.",
      "A hackathon mental-health chatbot called LiveMore and multiple smaller AI-assisted experiments.",
      "Small Minecraft mods and exploratory 3D work in Unity and Blender.",
    ],
    images: [
      { src: "/imgs/github1.png", alt: "GitHub projects", description: "Just some of my many tests and GitHub projects" },
      { src: "/imgs/Replit1.png", alt: "Replit projects", description: "Replit is where I started my programming journey" },
    ],
  },
]

export const internshipEntries: ExperienceEntry[] = [
  {
    title: "AI Software Project Team Lead",
    subtitle: "Concierge Law, by Campbell Holzhauer • Jul 2024 - Jun 2025",
    summary: "Led applied AI product development in a legal-tech setting, moving tools from prototype to working internal software.",
    logoText: "CL",
    accent: "228 88% 64%",
    accentSecondary: "193 92% 63%",
    stats: ["6 AI tools", "75% faster research", "Team lead"],
    particleWords: ["ILCS", "Drafting", "Auth", "Analytics"],
    bullets: [
      "Built and deployed six AI-powered legal automation tools trained on ILCS laws for research and drafting workflows.",
      "Handled more than 100 weekly queries and helped reduce attorney research time by roughly 75%.",
      "Led a team of 5+ interns and coordinated delivery from prototype through production rollout.",
      "Engineered secure authentication and data architecture for persistent, role-based usage.",
      "Designed a real-time analytics dashboard to track usage patterns and improve model performance.",
    ],
  },
  {
    title: "Software Engineer Intern",
    subtitle: "DistrictZero • Sep 2024 - Present",
    summary: "Building product-facing AI infrastructure and full-stack systems for a mental health platform used by students and institutions.",
    logoText: "DZ",
    accent: "171 82% 58%",
    accentSecondary: "225 88% 66%",
    stats: ["500+ students", "95% faster response", "15+ products"],
    particleWords: ["Signals", "React", "Clerk", "AWS"],
    bullets: [
      "Architected a real-time mental health alert system covering 100+ problematic emotion categories for 500+ students.",
      "Helped reduce response time for at-risk cases by roughly 95% through faster signal routing and system design.",
      "Built full-stack architecture with React, Node.js, Vercel AI SDK, Clerk, and AWS CDK for thousands of daily check-ins.",
      "Supported enterprise-facing work, including deployments connected to Loyola University and startup partners in the Drive Capital network.",
      "Led or contributed to 15+ products from prototype to production across multiple stacks and problem spaces.",
    ],
  },
]

export const workEntries: ExperienceEntry[] = [
  {
    title: "Vice President (Programming)",
    subtitle: "Sigma Phi Epsilon • Oct 2025 - Present",
    summary: "A leadership role centered on planning, operations, budgeting, and execution for a large member-facing organization.",
    logoText: "ΣΦΕ",
    accent: "271 85% 68%",
    accentSecondary: "229 86% 65%",
    stats: ["50+ members", "$25K budget", "Weekly operations"],
    particleWords: ["Budget", "Events", "Vendors", "Planning"],
    bullets: [
      "Led strategic planning for programming across a 50+ member chapter with multiple weekly events.",
      "Oversaw an approximately $25K budget and allocated resources across socials, logistics, and operations.",
      "Managed vendor communication, contracts, transportation, venue selection, and compliance details.",
      "Coordinated teams for formals, campus collaborations, and philanthropy efforts that raised more than $3K.",
    ],
  },
  {
    title: "Shift Lead / Closing Manager",
    subtitle: "Jimmy John's • Nov 2023 - Aug 2025",
    summary: "Operational leadership experience that built reliability, speed, and team management under pressure.",
    logoText: "JJ",
    accent: "35 92% 62%",
    accentSecondary: "12 84% 60%",
    stats: ["50+ employees", "$4K-$10K daily", "10+ trained"],
    particleWords: ["Ops", "Speed", "Close", "Training"],
    bullets: [
      "Led shift operations for a team of 50+ employees at the highest-grossing location in a 100+ store franchise network.",
      "Helped manage daily revenue volumes between $4K and $10K while maintaining speed and consistency.",
      "Oversaw inventory, closeout processes, operational compliance, and food safety standards.",
      "Trained 10+ new employees on procedures, service quality, and day-to-day execution.",
    ],
  },
]

export const volunteerEntries: ExperienceEntry[] = [
  {
    title: "CodeBytes Camp - Volunteer Leader",
    subtitle: "25+ Hours",
    summary: "Teaching and mentorship work centered on making computing approachable for younger students.",
    logoText: "CB",
    accent: "200 95% 63%",
    accentSecondary: "171 82% 58%",
    stats: ["80+ students", "Python camp", "Hackathon support"],
    particleWords: ["Python", "Teaching", "Mentor", "Camp"],
    bullets: [
      "Co-led an engaging camp with 80+ participants for middle school students focused on Python programming fundamentals.",
      "Developed and implemented lesson plans, projects, and activities to introduce coding concepts.",
      "Mentored students, fostering their interest in computer science and problem-solving skills.",
      "Helped design a six-hour middle school hackathon experience.",
    ],
  },
  {
    title: "Schoolhouse - SAT Tutoring",
    subtitle: "25+ Hours",
    summary: "Structured tutoring experience that required communication, pacing, and clarity under different learning styles.",
    logoText: "SH",
    accent: "238 88% 69%",
    accentSecondary: "197 82% 66%",
    stats: ["20 students", "2 bootcamps", "Math + reading"],
    particleWords: ["Tutoring", "Strategy", "Practice", "Coaching"],
    bullets: [
      "Provided SAT tutoring to 20 students across two bootcamps focused on math and reading comprehension.",
      "Developed personalized study plans and practice materials to address individual student needs.",
      "Helped students improve test-taking strategy, confidence, and consistency.",
    ],
  },
  {
    title: "Special Needs STEM Summer Camp - Volunteer Leader",
    subtitle: "15 Hours",
    summary: "Hands-on STEM mentorship experience rooted in patience, empathy, and adapting instruction to the room.",
    logoText: "STEM",
    accent: "334 78% 68%",
    accentSecondary: "40 92% 66%",
    stats: ["Hands-on STEM", "Adaptive teaching", "Inclusive support"],
    particleWords: ["Empathy", "STEM", "Support", "Mentorship"],
    bullets: [
      "Assisted in hands-on STEM activities for special needs high school students.",
      "Helped make technical activities more engaging, approachable, and safe for different learners.",
      "Mentored learners, encouraging their curiosity and interest in STEM fields.",
    ],
  },
]

export const educationProfile: EducationProfile = {
  school: "University of Wisconsin-Madison",
  location: "Madison, WI",
  credential: "B.S. Computer Science, Certificate in Business and African-American Studies",
  timeline: "Expected 2029",
  summary:
    "I am currently studying computer science at UW-Madison while building products outside class through internships, leadership roles, and independent projects.",
  highlights: [
    "4.0 GPA",
    "24 advanced-standing credits applied toward degree progress",
    "Strong start in programming, linear algebra, and interdisciplinary coursework",
  ],
  involvement: [
    "Wisconsin AI Safety Initiative (WAISI)",
    "Team Lead in Software Development Club",
    "Interdisciplinary coursework across technical and humanities-focused subjects",
  ],
  honors: [
    "Illinois Global Scholar",
    "College and Career Pathway Endorsement in Information Technology",
    "Academic Excellence Award",
    "Wallace C. Doud Balanced Man Award",
  ],
}

export const courseworkGroups: CourseworkGroup[] = [
  {
    title: "Computer Science",
    caption: "Core programming and theory work already completed or in progress.",
    items: [
      "COMP SCI 200 - Programming I",
      "COMP SCI 300 - Programming II",
      "COMP SCI 400 - Programming III",
      "COMP SCI 240 - Intro to Discrete Mathematics",
      "COMP SCI 252 - Intro to Computer Engineering",
    ],
  },
  {
    title: "Math and Technical Foundations",
    caption: "Quantitative work that supports systems thinking and engineering depth.",
    items: [
      "MATH 221 - Calculus and Analytic Geometry 1",
      "MATH 222 - Calculus and Analytic Geometry 2",
      "MATH 340 - Elementary Matrix and Linear Algebra",
      "PHYSICS 103 - General Physics",
      "GEOG 170 - GIScience and Technology",
    ],
  },
  {
    title: "Breadth and Writing",
    caption: "Coursework that strengthens context, communication, and perspective.",
    items: [
      "AFROAMER 156 - Black Music and American Cultural History",
      "AFROAMER 231 - Intro to African American History",
      "ENGL 177 - Literature and Popular Culture",
      "ENTOM 201 - Insects and Human Culture",
      "ECON 101 and ECON 102 - Microeconomics and Macroeconomics",
    ],
  },
]

export const skills = [
  "Programming (Python, Java, TypeScript, JavaScript)",
  "Web Development (React, Next.js, Tailwind CSS, Node.js, Express, SQL)",
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
    items: ["Node.js", "Express", "Authentication", "API Integration", "SQL", "Clerk", "AWS CDK"],
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
  "4.0 GPA at the University of Wisconsin-Madison",
  "Illinois Global Scholar",
  "College and Career Pathway Endorsement in Information Technology",
  "Academic Excellence Award",
  "Wallace C. Doud Balanced Man Award",
  "Top 4 Project in HSHacks Hackathon 2024",
  "Featured contributor in the credits of Ice Dodo, a Chrome extension game with 600,000+ users",
]

export const techClusters: TechCluster[] = [
  {
    id: "frontend-systems",
    title: "Frontend Systems",
    shortLabel: "Frontend",
    summary: "Interfaces that feel modern, responsive, and polished across portfolio work, internships, and product-focused builds.",
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
      "Built polished React and Next.js interfaces for products, games, and portfolio storytelling.",
      "Improved interface consistency while working on student-facing software in live product environments.",
      "Uses motion, fullscreen media, and adaptive layouts to make software feel intentional rather than purely functional.",
    ],
    projects: ["Personal Portfolio Site", "SlasherCrush", "SlideCentral"],
    focus: ["Rich interaction", "Visual storytelling", "Mobile-friendly design"],
  },
  {
    id: "fullstack-apis",
    title: "Full-Stack and APIs",
    shortLabel: "Full-Stack",
    summary: "Connecting interfaces to real functionality through backend logic, authentication flows, databases, and external integrations.",
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
      { name: "SQL", tier: "strong" },
      { name: "Clerk", tier: "strong" },
      { name: "AWS CDK", tier: "exploring" },
      { name: "Environment Config", tier: "strong" },
      { name: "Vercel Deployments", tier: "strong" },
      { name: "Testing and QA", tier: "strong" },
      { name: "Debugging", tier: "core" },
    ],
    proofs: [
      "Built SlideCentral with authentication, role-based views, dashboards, and generated content workflows.",
      "DistrictZero work includes React, Node.js, Vercel AI SDK, Clerk, and AWS-backed product architecture.",
      "This portfolio already pulls dynamic GitHub, LinkedIn, Spotify, and AI-powered integrations into one experience.",
    ],
    projects: ["SlideCentral", "DistrictZero", "Personal Portfolio Site"],
    focus: ["Product thinking", "Real-world integrations", "Reliable iteration"],
  },
  {
    id: "core-cs",
    title: "Core CS Foundations",
    shortLabel: "Core CS",
    summary: "The problem-solving layer underneath the UI: algorithms, object-oriented design, and durable fundamentals in multiple languages.",
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
      "Built multiple smaller experiments in Python, Java, and game systems while learning across classes and independent projects.",
      "Current college coursework and a 4.0 GPA reinforce the engineering fundamentals shown in project work.",
    ],
    projects: ["Animated Cityscape", "Additional Builds", "Maze Solver"],
    focus: ["Clean logic", "Foundational depth", "Learning speed"],
  },
  {
    id: "creative-tech",
    title: "Creative and Interactive Tech",
    shortLabel: "Creative",
    summary: "A mix of design sense and technical experimentation across games, animation, media, and immersive product presentation.",
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
    summary: "An expanding cluster focused on applied AI, workflow automation, and learning quickly inside real product constraints.",
    icon: Bot,
    accent: "258 78% 64%",
    accentSecondary: "171 82% 54%",
    technologies: [
      { name: "Vercel AI SDK", tier: "core" },
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
      "Current internship work includes AI-assisted systems in mental health and legal-tech environments.",
      "Hackathon and side projects show a willingness to prototype quickly while refining what is actually useful.",
      "Blends experimentation with testing, feedback, and practical constraints instead of just novelty.",
    ],
    projects: ["DistrictZero", "Concierge Law", "Personal Portfolio Site"],
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
      "Internships, service work, and campus leadership reinforce reliability, fast adaptation, and follow-through under real responsibility.",
    ],
    projects: ["SlideCentral", "DistrictZero", "CodeBytes Camp"],
    focus: ["Execution", "Communication", "Reliable momentum"],
  },
]

export const signatureStacks: SignatureStack[] = [
  {
    title: "Modern Web Builds",
    description: "The stack I reach for when I want a polished, dynamic product experience with strong UI control.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "shadcn/ui"],
  },
  {
    title: "Full-Stack Delivery",
    description: "The backend, auth, and deployment tools I use to turn interfaces into working software.",
    stack: ["Node.js", "Express", "APIs", "Authentication", "SQL", "Clerk", "Vercel", "AWS CDK"],
  },
  {
    title: "Foundations and Experiments",
    description: "The languages and concepts that shaped how I think through logic, systems, and iteration.",
    stack: ["Java", "Python", "OOP", "Data Structures", "Algorithms", "Game Logic"],
  },
]

export const passions: Passion[] = [
  {
    icon: Book,
    title: "Reading",
    description: "Reading helps me widen perspective and recharge creatively, especially through speculative fiction and idea-driven books.",
    imageSrc: "/imgs/passions/reading.JPG",
  },
  {
    icon: Waves,
    title: "Water Sports",
    description:
      "Jet skiing, wakeboarding, and water skiing are some of my favorite ways to reset. Lake mornings are hard to beat.",
    imageSrc: "/imgs/passions/watersports.jpg",
  },
  {
    icon: Snowflake,
    title: "Snow Skiing",
    description: "Skiing has always been part of my family, and I still love the mix of rhythm, focus, and speed that comes with it.",
    imageSrc: "/imgs/passions/skiing.jpg",
  },
  {
    icon: Code,
    title: "Software Development",
    description: "Outside of school and internships, I still spend a lot of time building, refining interfaces, and exploring new tools.",
    imageSrc: "/imgs/passions/softwaredevelopment.png",
  },
  {
    icon: Heart,
    title: "Volunteering",
    description:
      "I care a lot about giving back, especially when I can help make technical concepts more approachable for younger students.",
    imageSrc: "/imgs/passions/volunteering.JPG",
  },
  {
    icon: Gamepad2,
    title: "The Legend of Zelda",
    description:
      "Zelda was one of the earliest reasons I fell in love with games. It shaped a lot of my appreciation for interaction, exploration, and design craft.",
    imageSrc: "/imgs/passions/zelda.jpg",
  },
  {
    icon: Music,
    title: "Music",
    description: "Music is a constant background layer for how I work, think, and relax. I still enjoy building playlists around specific moods and moments.",
    imageSrc: "/imgs/passions/music.jpg",
  },
  {
    icon: Users,
    title: "Family & Friends",
    description: "A lot of my energy comes from the people around me. Time with family and friends keeps everything else in perspective.",
    imageSrc: "/imgs/passions/family.jpg",
  },
  {
    icon: Medal,
    title: "Running",
    description: "Running has stayed with me for years because it clears my head and rewards consistency more than hype.",
    imageSrc: "/imgs/passions/running.png",
  },
  {
    icon: Palette,
    title: "Graphic Design",
    description: "Graphic design sharpened my eye for composition, detail, and personality in digital products long before I knew I wanted to build software.",
    imageSrc: "/imgs/passions/graphicdesign.PNG",
  },
  {
    icon: Film,
    title: "Movies",
    description: "Movies are one of the ways I stay inspired by pacing, world-building, and the emotional side of storytelling.",
    imageSrc: "/imgs/passions/movies.jpg",
  },
  {
    icon: Utensils,
    title: "Food",
    description: "Trying different foods and cuisines is one of my favorite ways to explore new places and spend time with people.",
    imageSrc: "/imgs/passions/food.png",
  },
]

export const spotifyPlaylists: SpotifyPlaylist[] = [
  {
    label: "Summer energy",
    src: "https://open.spotify.com/embed/playlist/4moPgBwt9bJWz3UgFhJTd3?utm_source=generator",
    description: "The one I go back to for summer energy, lake days, or anything that needs momentum.",
  },
  {
    label: "Late-night focus",
    src: "https://open.spotify.com/embed/playlist/48LiOY4hhigjbcIFvzOsPd?utm_source=generator",
    description: "A go-to playlist for late-night focus, studying, or quieter work sessions.",
  },
  {
    label: "Running tempo",
    src: "https://open.spotify.com/embed/playlist/1mVVns1bUDQBd14TnNOu1I?utm_source=generator",
    description: "The higher-tempo rotation I use for runs or when I want a bit more energy in the background.",
  },
]

export const contactLinks: ContactLink[] = [
  {
    label: "Email",
    href: "mailto:cfurby@wisc.edu",
    value: "cfurby@wisc.edu",
    description: "Best for internship, project, and collaboration conversations.",
    ctaLabel: "Send Email",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/connor-furby/",
    value: "linkedin.com/in/connor-furby",
    description: "Best for professional networking, background, and longer-form updates.",
    ctaLabel: "Open LinkedIn",
  },
  {
    label: "GitHub",
    href: "https://github.com/connorfurby",
    value: "github.com/connorfurby",
    description: "Best for code, recent repositories, and public technical activity.",
    ctaLabel: "View GitHub",
  },
]

export const contactFocuses: ContactFocus[] = [
  {
    title: "Software engineering internships",
    description: "Roles where I can contribute to product work, move fast, and keep building depth across the stack.",
  },
  {
    title: "Applied AI and product engineering",
    description: "Teams exploring practical AI systems, workflow automation, and software that needs both rigor and usability.",
  },
  {
    title: "Builder-minded collaborations",
    description: "Projects where engineering, design taste, and iteration speed all matter at the same time.",
  },
]
