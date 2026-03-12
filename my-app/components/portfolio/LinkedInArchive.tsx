"use client"

import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  CalendarDays,
  ExternalLink,
  Globe2,
  Images,
  Link2,
  Linkedin,
  MessageCircle,
  Repeat2,
  Send,
  ThumbsUp,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type LinkedInArchiveLink = {
  label: string
  url: string
}

type LinkedInArchiveImageSlot = {
  fileName: string
  alt: string
  aspect?: "landscape" | "square"
}

type LinkedInArchivePost = {
  id: string
  postedAt: string
  paragraphs: string[]
  hashtags?: string[]
  links?: LinkedInArchiveLink[]
  imageSlots?: LinkedInArchiveImageSlot[]
  repostedFrom?: string
}

const LINKEDIN_IMAGE_DIRECTORY = "/linkedin-posts"

export const linkedinArchivePosts: LinkedInArchivePost[] = [
  {
    id: "2025-11-18-sigep-retreat",
    postedAt: "2025-11-18T13:23:30",
    paragraphs: [
      "This past weekend, the Wisconsin-Beta chapter of Sigma Phi Epsilon (Official) headed to Dixon, Illinois, for our semesterly retreat, and it ended up being one of the most rewarding projects I've taken on in my role as Vice President of Programming. We stayed in a beautiful home on twelve acres along the river, packed with countless amenities and games to grow our brotherhood and make the weekend one to remember.",
      "Jumping into SigEp as a freshman and stepping onto the executive board with no prior experience was a leap I definitely didn't understand at the time. Coming to the University of Wisconsin-Madison, joining a fraternity wasn't even on my radar, yet fate led me to exactly where I was meant to be. My election ran unopposed, largely due to the intense workload that comes with managing programming in a growing chapter. The idea overwhelmed me at first, but I decided early on to commit to it and harness my creativity to go above and beyond, creating something meaningful.",
      "Planning a retreat for an entire chapter is quite the puzzle. Finding a house suited for that many people that is willing to host is rare enough. Then came tedious work like coordinating driving plans across seven cars around everyone's Friday class schedules, building detailed grocery lists for group meals like taco night, burger bar, and our 'king's breakfast,' setting up a shower schedule, and designing programming to keep everyone engaged throughout the whole weekend. It was a long list of moving parts, but I have learned to love the mix of logistics, creativity, and connection that come with bringing people together to make weekends like this happen.",
      "And although the retreat is a highlight, most of my role focuses on week-to-week events for the chapter without the convenience of a house of our own. That challenge has pushed me to be resourceful and resilient as we build community in unconventional spaces for a fraternity, like hosting video game nights in classrooms and bonfires in backyards. With a chapter house coming next year, I'm excited to see how the foundation built by those before me and this executive board will continue to multiply.",
      "I'm grateful for the trust my chapter has placed in me, the support from my mentors and the rest of the Executive Board, and for experiences like this that grow my leadership. This retreat reminded me of how much can happen when a group of people commit to showing up for each other, and I can't wait to do it bigger and better next semester!",
    ],
    imageSlots: [
      {
        fileName: "2025-11-18-sigep-retreat-01.png",
        alt: "Wisconsin-Beta Sigma Phi Epsilon retreat image one",
        aspect: "square",
      },
      {
        fileName: "2025-11-18-sigep-retreat-02.png",
        alt: "Wisconsin-Beta Sigma Phi Epsilon retreat image two",
        aspect: "square",
      },
    ],
  },
  {
    id: "2025-10-12-vice-president-programming",
    postedAt: "2025-10-12T21:46:18",
    paragraphs: [
      "I'm happy to share that I'm starting a new position as Vice President of Programming at Sigma Phi Epsilon (Official)!",
    ],
  },
  {
    id: "2025-10-08-bid-day-repost",
    postedAt: "2025-10-08T11:44:57",
    repostedFrom: "Sigma Phi Epsilon (Official)",
    paragraphs: [
      "Wisconsin Beta at Wisconsin hosted a Bid Day Celebration to welcome new brothers. Our brothers have been working hard since starting back up in the spring of 2024!",
    ],
    hashtags: ["#raiseyourbar"],
    imageSlots: [
      {
        fileName: "2025-10-08-sigep-bid-day.png",
        alt: "Sigma Phi Epsilon bid day celebration image",
      },
    ],
  },
  {
    id: "2025-09-23-uw-ranking-repost",
    postedAt: "2025-09-23T14:47:50",
    repostedFrom: "UW-Madison Computer Sciences",
    paragraphs: [
      "The rankings are in - and University of Wisconsin-Madison is (once again) a top 10 public school for undergraduate computer science education.",
      "UW-Madison Computer Sciences held steady at 16th overall and 9th among publics in its undergraduate computer science ranking, according to U.S. News & World Report.",
      "Ranked specialties include 6th in computer systems (up from 8th), 15th in programming languages, and 23rd in artificial intelligence (up from 25th).",
      "Likewise, UW-Madison made institution-wide gains, jumping to 36th overall and 12th among publics. It also rose 42 places to 47th in 'Best Value Schools.'",
    ],
    links: [
      {
        label: "Inside the rankings",
        url: "https://lnkd.in/ggX4g4_x",
      },
    ],
    imageSlots: [
      {
        fileName: "2025-09-23-uw-ranking.png",
        alt: "UW-Madison Computer Sciences ranking image",
      },
    ],
  },
  {
    id: "2025-09-16-crossy-road",
    postedAt: "2025-09-16T22:55:43",
    paragraphs: [
      "Dear LinkedIn,",
      "My debut post isn't about closing a deal, raising funding, or shipping code. It's about a far greater accomplishment: surpassing the Crossy Road jackpot threshold of 86 points. Not only did I hit the jackpot, I finished with 113.",
      "Why keep going when the prize was the same? Why not just cash in my 1,000 tickets for two pizzas and call it a day? People looked at me like I was doing too much. To me, I did it because the real prize wasn't reaching the goal... it was obliterating it. The tickets were already mine, but the extra 27 points turned 'just winning' into proof of what's possible.",
      "It's just a small story from an arcade with a big reminder: the world pays out at the minimum, but real growth lives beyond it.",
    ],
    imageSlots: [
      {
        fileName: "2025-09-16-crossy-road.png",
        alt: "Crossy Road score image",
      },
    ],
  },
  {
    id: "2025-08-25-peter-hostrawser-repost",
    postedAt: "2025-08-25T14:30:06",
    repostedFrom: "Peter Hostrawser",
    paragraphs: [
      "This is what it looks like when a community truly invests in its students.",
      "One of our incredible internship partners just shared this story about Connor Furby - a former high school senior in the Naperville District 203 Career Internship Program who dove into real projects, gained confidence, and is now starting his journey at University of Wisconsin-Madison.",
      "Connor didn't just learn about computer science; he lived it. With mentors who believed in him, he contributed to meaningful work, grew his skills, and is already paying it forward by mentoring the next wave of students.",
      "This is why we do what we do. When schools, businesses, and community members come together, students don't just graduate - they launch.",
      "Huge thanks to our partners who get it like Uzair Hussain who keep opening doors for students. Let's keep building these connections. Who's ready to mentor the next Connor?",
    ],
    hashtags: [
      "#WorkBasedLearning",
      "#CareerInternships",
      "#TalentPipeline",
      "#DurableSkills",
      "#DisruptEducation",
      "#Naperville203",
    ],
  },
  {
    id: "2025-08-25-uzair-mentorship-repost",
    postedAt: "2025-08-25T09:11:13",
    repostedFrom: "Uzair Hussain",
    paragraphs: [
      "Feeling so proud of Connor Furby as he starts his journey this week at University of Wisconsin-Madison! Late last year, Connor stepped into our team as an eager high school senior intern ready to get his hands dirty in all the code. Congrats Connor - you're about to be the top recruit amongst all classmates.",
      "I've learned so much mentoring Connor and observing his confidence soar. He's improved my own framework for young AI engineers and how to best support the next generation of computer science students incoming to the workforce. Now, Connor's ready to mentor the next batch of high school seniors.",
      "Special thank you to Peter, Brett, and the Naperville District 203 Career Internship Program team - for fostering a next-level batch of high school students. You guys are the best.",
    ],
    imageSlots: [
      {
        fileName: "2025-08-25-uzair-mentorship.png",
        alt: "Uzair Hussain mentorship repost image",
      },
    ],
  },
  {
    id: "2025-04-04-districtzero-launch-repost",
    postedAt: "2025-04-04T07:29:03",
    repostedFrom: "Uzair Hussain",
    paragraphs: [
      "It's been launch week at DistrictZero! We pushed a major re-design to the platform and launched an all new website! This culminates years of user-research, user-testing, and business ROI validation. Not to mention, refactoring over 100K lines of code!",
      "It would mean the world to us if you take a moment to review our new website and let us know what you think. Maybe even share it forward with your favorite most innovative medical professional. Next week is all about stability improvements.",
      "Special shoutout to the DZ squad Arnit, Connor, and Rimel - you all make my day-to-day routine so meaningful. Great work team!",
    ],
    links: [
      {
        label: "DistrictZero launch link",
        url: "https://lnkd.in/gyad68m5",
      },
    ],
  },
  {
    id: "2025-03-04-districtzero-internship",
    postedAt: "2025-03-04T17:02:35",
    paragraphs: [
      "I'm happy to share that I'm starting a new position as Software Engineer Intern at DistrictZero!",
    ],
  },
]

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function formatLinkedInDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString))
}

function formatLinkedInTime(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString))
}

function LinkedInImageSlot({ slot }: { slot: LinkedInArchiveImageSlot }) {
  const [hasError, setHasError] = useState(false)
  const imageSrc = `${LINKEDIN_IMAGE_DIRECTORY}/${slot.fileName}`

  return (
    <div
      className={cn(
        "group relative isolate overflow-hidden rounded-[1.35rem] border border-foreground/10 bg-[linear-gradient(180deg,rgba(10,102,194,0.12),rgba(10,102,194,0.04))]",
        slot.aspect === "square" ? "aspect-[4/3] max-w-[16rem]" : "aspect-[16/8] max-w-[24rem]"
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(10,102,194,0.2),transparent_58%)]" />
      {!hasError ? (
        <Image
          src={imageSrc}
          alt={slot.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 720px"
          className="object-cover"
          onError={() => setHasError(true)}
        />
      ) : null}
      <div className={cn("absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent", hasError && "opacity-0")} />
      <div className={cn("absolute inset-0 flex flex-col justify-between p-4 transition-opacity duration-300", hasError ? "opacity-100" : "opacity-0")}>
        <div className="self-start rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-white backdrop-blur-xl">
          PNG slot
        </div>
        <div className="rounded-[1rem] border border-white/20 bg-black/35 p-3 text-white backdrop-blur-xl">
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
            <Images className="h-4 w-4" />
            Add image here
          </div>
          <div className="font-mono text-[11px] leading-5 text-white/80">{slot.fileName}</div>
          <div className="mt-1 text-xs text-white/70">{imageSrc}</div>
        </div>
      </div>
    </div>
  )
}

export default function LinkedInArchive() {
  return (
    <div className="w-full">
      <Card className="surface-card relative overflow-hidden rounded-[2rem] border-border bg-card">
        <CardHeader className="border-b border-foreground/8 pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Linkedin className="h-5 w-5 text-[#0A66C2]" />
            LinkedIn
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="max-h-[920px] overflow-y-auto p-4 pr-3 [scrollbar-width:thin] sm:p-5 sm:pr-4">
            <div className="grid gap-4">
              {linkedinArchivePosts.map((post, index) => {
                const displayAuthor = post.repostedFrom ?? "Connor Furby"

                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: index * 0.04 }}
                    whileHover={{ y: -4 }}
                    className="rounded-[1.65rem] border border-foreground/10 bg-background/80 p-5 shadow-[0_20px_60px_hsl(var(--glass-shadow)/0.08)] sm:p-6"
                  >
                    {post.repostedFrom ? (
                      <motion.div
                        animate={{ opacity: [0.72, 1, 0.72], x: [0, 2, 0] }}
                        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0A66C2]/15 bg-[#0A66C2]/8 px-3 py-1.5 text-xs font-medium text-[#0A66C2]"
                      >
                        <Repeat2 className="h-3.5 w-3.5" />
                        Connor Furby reposted {post.repostedFrom}
                      </motion.div>
                    ) : null}

                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0A66C2,#5DA9F6)] text-sm font-semibold text-white shadow-[0_12px_28px_rgba(10,102,194,0.35)]">
                        {getInitials(displayAuthor)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="truncate text-[15px] font-semibold text-foreground">{displayAuthor}</div>
                          {post.repostedFrom ? (
                            <Badge variant="outline" className="rounded-full border-foreground/10 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                              Repost
                            </Badge>
                          ) : null}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span>{formatLinkedInDate(post.postedAt)}</span>
                          <span className="text-foreground/20">•</span>
                          <span>{formatLinkedInTime(post.postedAt)}</span>
                          <span className="text-foreground/20">•</span>
                          <Globe2 className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 space-y-4 text-[15px] leading-7 text-foreground/92">
                      {post.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>

                    {post.links?.length ? (
                      <div className="mt-5 grid gap-3">
                        {post.links.map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group rounded-[1.2rem] border border-[#0A66C2]/15 bg-[#0A66C2]/6 p-4 transition-colors hover:bg-[#0A66C2]/10"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#0A66C2]">
                                  <Link2 className="h-3.5 w-3.5" />
                                  Embedded link
                                </div>
                                <div className="truncate text-sm font-semibold text-foreground">{link.label}</div>
                                <div className="mt-1 truncate text-xs text-muted-foreground">{link.url}</div>
                              </div>
                              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : null}

                    {post.imageSlots?.length ? (
                      <div
                        className={cn(
                          "mt-5 grid gap-3 justify-start",
                          post.imageSlots.length > 1 ? "grid-cols-2 max-w-[34rem]" : "grid-cols-1 max-w-[24rem]"
                        )}
                      >
                        {post.imageSlots.map((slot) => (
                          <LinkedInImageSlot key={slot.fileName} slot={slot} />
                        ))}
                      </div>
                    ) : null}

                    {post.hashtags?.length ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {post.hashtags.map((hashtag) => (
                          <div
                            key={hashtag}
                            className="rounded-full border border-[#0A66C2]/15 bg-[#0A66C2]/6 px-3 py-1 text-xs font-medium text-[#0A66C2]"
                          >
                            {hashtag}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-5 grid grid-cols-4 gap-2 border-t border-foreground/8 pt-4 text-sm text-muted-foreground">
                      {[
                        { label: "Like", icon: ThumbsUp },
                        { label: "Comment", icon: MessageCircle },
                        { label: "Repost", icon: Repeat2 },
                        { label: "Send", icon: Send },
                      ].map((action) => {
                        const Icon = action.icon

                        return (
                          <button
                            key={action.label}
                            type="button"
                            className="flex items-center justify-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-background hover:text-foreground"
                          >
                            <Icon className="h-4 w-4" />
                            <span className="hidden sm:inline">{action.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
