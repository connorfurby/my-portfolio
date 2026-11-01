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
          className="flex flex-col gap-5 px-1 py-2"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeading
            eyebrow="Contact"
            title="If the work feels aligned, reach out"
            description="For internships, product-minded engineering roles, collaborations, or just a strong shared interest in building, this should be the easiest part of the site."
          />

          <div className="grid gap-3">
            {contactFocuses.map((focus) => (
              <div key={focus.title} className="border-b border-border/40 pb-3 last:border-b-0 last:pb-0">
                <div className="text-sm font-medium text-foreground">{focus.title}</div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{focus.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {contactLinks.map((link) => {
              const Icon = iconMap[link.label as keyof typeof iconMap] ?? Mail

              return (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={link.label}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-border/70 bg-card px-3.5 text-sm text-foreground transition-colors hover:border-foreground/25 hover:bg-foreground/[0.04]"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {link.label}
                  {link.href.startsWith("http") ? <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" /> : null}
                </a>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="rounded-2xl">
            <CardContent className="p-5 sm:p-6">
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
                      className="rounded-xl border border-border/70 bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary/40"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium">Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@company.com"
                      className="rounded-xl border border-border/70 bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary/40"
                    />
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="text-sm font-medium">Organization or role</span>
                  <input
                    value={organization}
                    onChange={(event) => setOrganization(event.target.value)}
                    placeholder="Team, company, project, or reason for reaching out"
                    className="rounded-xl border border-border/70 bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary/40"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium">Message</span>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="A few lines about the opportunity, project, or conversation you have in mind."
                    rows={5}
                    className="resize-none rounded-xl border border-border/70 bg-background px-3.5 py-3 text-sm leading-6 outline-none transition-colors focus:border-primary/40"
                  />
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" className="px-5">
                    Send Message
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button asChild variant="outline" className="px-5">
                    <a
                      href={contactLinks.find((link) => link.label === "LinkedIn")?.href ?? "https://www.linkedin.com/in/connor-furby/"}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Reach Out on LinkedIn
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                {submitted ? (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    Your message was prepared in email with the details from the form.
                  </div>
                ) : (
                  <div className="rounded-xl border border-border/50 bg-foreground/[0.02] px-4 py-3 text-sm leading-6 text-muted-foreground">
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
