import { FormEvent, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, ExternalLink, Github, Linkedin, Mail, Send } from "lucide-react"

import { contactFocuses, contactLinks } from "@/components/portfolio/data"
import AnimatedSection from "@/components/portfolio/AnimatedSection"
import SectionHeading from "@/components/portfolio/SectionHeading"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [organization, setOrganization] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const emailHref = useMemo(() => {
    const subject = encodeURIComponent(`Portfolio inquiry from ${name.trim() || "a visitor"}`)
    const body = encodeURIComponent(
      [
        `Name: ${name.trim() || "Not provided"}`,
        `Email: ${email.trim() || "Not provided"}`,
        `Organization: ${organization.trim() || "Not provided"}`,
        "",
        "Message:",
        message.trim() || "No message provided.",
      ].join("\n")
    )

    return `mailto:cfurby@wisc.edu?subject=${subject}&body=${body}`
  }, [email, message, name, organization])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    window.location.href = emailHref
  }

  const iconMap = {
    LinkedIn: Linkedin,
    GitHub: Github,
    Email: Mail,
  } as const

  return (
    <AnimatedSection id="contact" className="mb-12 pt-12" delay={0.05}>
      <div className="grid gap-5 xl:grid-cols-[minmax(250px,0.52fr)_minmax(0,1.48fr)]">
        <motion.div
          className="relative flex flex-col gap-4 overflow-hidden rounded-[1.9rem] px-1 py-2"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            className="absolute -left-10 top-8 size-28 rounded-full bg-primary/12 blur-3xl"
            animate={{ x: [0, 20, 0], y: [0, -12, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative">
            <SectionHeading
              eyebrow="Contact"
              title="If the work feels aligned, reach out"
              description="For internships, product-minded engineering roles, collaborations, or just a strong shared interest in building, this should be the easiest part of the site."
            />
          </div>

          <div className="relative grid gap-2">
            {contactFocuses.map((focus) => (
              <div key={focus.title} className="border-b border-border/35 pb-2 last:border-b-0 last:pb-0">
                <div className="text-sm font-medium text-foreground">{focus.title}</div>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">{focus.description}</p>
              </div>
            ))}
          </div>

          <div className="relative flex flex-wrap gap-3 pt-1">
            {contactLinks.map((link) => {
              const Icon = iconMap[link.label as keyof typeof iconMap] ?? Mail

              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={link.label}
                  title={link.label}
                  className="group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-[1.15rem] border border-border/55 bg-[linear-gradient(180deg,hsl(var(--glass-surface-strong)/0.9),hsl(var(--glass-surface)/0.72))] shadow-[0_18px_40px_hsl(var(--glass-shadow)/0.16)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 dark:border-white/12 dark:bg-[linear-gradient(180deg,hsl(var(--glass-surface-strong)/0.5),hsl(var(--glass-surface)/0.18))]"
                  whileHover={{ y: -4, scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="absolute inset-x-2 top-1 h-5 rounded-full bg-white/20 blur-md transition-opacity duration-300 group-hover:opacity-80" />
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.28),transparent_42%),radial-gradient(circle_at_70%_80%,rgba(120,180,255,0.14),transparent_38%)] opacity-90" />
                  <span className="relative z-10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary drop-shadow-[0_4px_16px_rgba(255,255,255,0.18)]" />
                  </span>
                  {link.href.startsWith("http") ? (
                    <ExternalLink className="absolute bottom-1.5 right-1.5 h-3.5 w-3.5 text-muted-foreground/80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  ) : null}
                </motion.a>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Card className="liquid-panel liquid-panel-strong rounded-[2rem]">
            <CardContent className="p-5">
              <SectionHeading
                eyebrow="Message"
                title="Send a message with context"
                description="This opens a prefilled email so the outreach stays personal, but the form makes it much easier to send something useful on the first try."
              />

              <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium">Name</span>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                      className="rounded-[0.95rem] border border-border/55 bg-background/55 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary/40"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium">Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@company.com"
                      className="rounded-[0.95rem] border border-border/55 bg-background/55 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary/40"
                    />
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="text-sm font-medium">Organization or role</span>
                  <input
                    value={organization}
                    onChange={(event) => setOrganization(event.target.value)}
                    placeholder="Team, company, project, or reason for reaching out"
                    className="rounded-[0.95rem] border border-border/55 bg-background/55 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary/40"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium">Message</span>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="A few lines about the opportunity, project, or conversation you have in mind."
                    rows={5}
                    className="resize-none rounded-[0.95rem] border border-border/55 bg-background/55 px-3.5 py-3 text-sm leading-[1.35rem] outline-none transition-colors focus:border-primary/40"
                  />
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" className="rounded-full px-5">
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                  <Button asChild variant="outline" className="rounded-full px-5">
                    <a href={contactLinks.find((link) => link.label === "LinkedIn")?.href ?? "https://www.linkedin.com/in/connor-furby/"} target="_blank" rel="noreferrer">
                      Reach Out on LinkedIn
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>

                {submitted ? (
                  <div className="flex items-center gap-2 rounded-[1.2rem] border border-emerald-500/20 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    Your message was prepared in email with the details from the form.
                  </div>
                ) : (
                  <div className="rounded-[1.2rem] border border-border/40 bg-background/35 px-4 py-3 text-sm leading-7 text-muted-foreground">
                    The form launches a prefilled email draft so you can send through your own inbox while still keeping the outreach structured.
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatedSection>
  )
}
