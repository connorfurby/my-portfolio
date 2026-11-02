"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Bot, CheckCircle2, Compass, MessageSquareText, SendHorizonal, Sparkles, WandSparkles } from "lucide-react"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

type ChatSource = {
  id: string
  title: string
  kind: string
  source: string
}

const suggestedQuestions = [
  "What technologies do you use most?",
  "What kind of software roles are you targeting?",
  "What are you currently learning?",
  "What experience do you have with internships?",
] as const

function toTitleCase(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function formatSourceLabel(source: ChatSource) {
  if (source.kind === "resume") {
    return "Resume"
  }

  if (source.kind === "transcript") {
    return "Transcript"
  }

  if (source.kind === "document") {
    return toTitleCase(source.title)
  }

  return source.title
}

export default function PortfolioChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "assistant",
      content:
        "Ask anything about Connor's projects, internships, technical strengths, leadership, or current learning focus.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sources, setSources] = useState<ChatSource[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)

  const history = useMemo(
    () => messages.filter((message) => message.id !== "intro").map(({ role, content }) => ({ role, content })),
    [messages]
  )
  const uniqueSources = useMemo(() => {
    const seen = new Set<string>()

    return sources.filter((source) => {
      const label = formatSourceLabel(source)
      const key = `${source.kind}:${label.toLowerCase()}`

      if (seen.has(key)) {
        return false
      }

      seen.add(key)
      return true
    })
  }, [sources])

  useEffect(() => {
    const container = messagesContainerRef.current

    if (!container) {
      return
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, isLoading])

  async function submitQuestion(question: string) {
    const trimmed = question.trim()

    if (!trimmed || isLoading) {
      return
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setErrorMessage(null)
    setSources([])

    try {
      const response = await fetch("/api/portfolio-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          history,
        }),
      })

      const payload = (await response.json()) as
        | {
            answer: string
            sources: ChatSource[]
          }
        | { message: string }

      if (!response.ok || !("answer" in payload)) {
        throw new Error("message" in payload ? payload.message : "Unable to load portfolio chat.")
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: payload.answer,
        },
      ])
      setSources(payload.sources)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load portfolio chat."
      setErrorMessage(message)
      setSources([])
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: message,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
      <Card className="rounded-2xl">
        <CardContent className="flex h-full flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              <Bot className="mr-1.5 h-3.5 w-3.5" />
              Portfolio assistant
            </Badge>
            <Badge variant="secondary">Live with Gemini</Badge>
          </div>

          <div className="space-y-3">
            <div className="section-eyebrow">Interactive Q&amp;A</div>
            <h3 className="font-display text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
              Explore the portfolio through conversation
            </h3>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Visitors can ask about projects, technical depth, internships, leadership, education, and what Connor is focused on next.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.35 }}
              className="rounded-xl border border-border/70 bg-foreground/[0.02] p-4"
            >
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Compass className="h-4 w-4 text-primary" />
                Guided discovery
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                Turns a static portfolio into an interactive conversation about impact, choices, and technical depth.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="rounded-xl border border-border/70 bg-foreground/[0.02] p-4"
            >
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Grounded answers
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                Responses stay anchored to portfolio content, resume details, and supporting documents instead of generic filler.
              </p>
            </motion.div>
          </div>

          <div className="space-y-3">
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Try asking
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <motion.button
                  key={question}
                  type="button"
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.24, delay: index * 0.05 }}
                  onClick={() => submitQuestion(question)}
                  className="rounded-lg border border-border/70 bg-card px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>

          {uniqueSources.length ? (
            <div className="space-y-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Referenced context
              </div>
              <div className="flex flex-wrap gap-2">
                {uniqueSources.slice(0, 6).map((source) => (
                  <Badge key={source.id} variant="outline">
                    {formatSourceLabel(source)}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-foreground/[0.03]">
              <WandSparkles className="h-4.5 w-4.5 text-primary" />
            </div>
            <div className="space-y-1">
              <div>Ask the portfolio assistant</div>
              <div className="text-xs font-normal text-muted-foreground">
                Press `Enter` to send. Use `Shift+Enter` for a new line.
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div
            ref={messagesContainerRef}
            className="max-h-[30rem] min-h-[24rem] space-y-4 overflow-y-auto rounded-xl border border-border/70 bg-foreground/[0.02] p-4"
          >
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.24, delay: index === messages.length - 1 ? 0.02 : 0 }}
                className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-7",
                    message.role === "user"
                      ? "bg-foreground text-background"
                      : "border border-border/70 bg-card text-foreground"
                  )}
                >
                  <div className="mb-1.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] opacity-70">
                    {message.role === "user" ? (
                      <>
                        <MessageSquareText className="h-3 w-3" />
                        Visitor
                      </>
                    ) : (
                      <>
                        <Bot className="h-3 w-3" />
                        Assistant
                      </>
                    )}
                  </div>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: (props) => <p className="mb-3 break-words leading-7 last:mb-0" {...props} />,
                      ul: (props) => <ul className="mb-3 list-disc space-y-2 pl-5 last:mb-0" {...props} />,
                      ol: (props) => <ol className="mb-3 list-decimal space-y-2 pl-5 last:mb-0" {...props} />,
                      li: (props) => <li className="break-words" {...props} />,
                      strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
                      em: (props) => <em className="italic" {...props} />,
                      a: (props) => (
                        <a
                          className="text-primary underline decoration-primary/50 underline-offset-4 transition-colors hover:text-foreground"
                          target="_blank"
                          rel="noreferrer"
                          {...props}
                        />
                      ),
                      code: ({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) =>
                        inline ? (
                          <code
                            className={cn("rounded bg-foreground/8 px-1.5 py-0.5 font-mono text-[0.9em] text-foreground", className)}
                            {...props}
                          >
                            {children}
                          </code>
                        ) : (
                          <code className={cn("font-mono text-[0.92em] text-foreground", className)} {...props}>
                            {children}
                          </code>
                        ),
                      pre: (props) => (
                        <pre
                          className="mb-3 overflow-x-auto rounded-2xl border border-foreground/10 bg-background/70 p-4 font-mono text-[0.92em] leading-6 last:mb-0"
                          {...props}
                        />
                      ),
                      blockquote: (props) => (
                        <blockquote className="mb-3 border-l-2 border-primary/40 pl-4 text-muted-foreground last:mb-0" {...props} />
                      ),
                      h1: (props) => <h1 className="mb-3 text-lg font-semibold tracking-[-0.03em] last:mb-0" {...props} />,
                      h2: (props) => <h2 className="mb-3 text-base font-semibold tracking-[-0.03em] last:mb-0" {...props} />,
                      h3: (props) => <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] last:mb-0" {...props} />,
                      hr: (props) => <hr className="my-4 border-foreground/10" {...props} />,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ))}

            {isLoading ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[92%] rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm text-muted-foreground">
                  <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] opacity-70">
                    <Bot className="h-3 w-3" />
                    Assistant
                  </div>
                  <p className="text-sm">Thinking through the portfolio...</p>
                </div>
              </motion.div>
            ) : null}
          </div>

          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              submitQuestion(input)
            }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-foreground/[0.02]">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault()
                    submitQuestion(input)
                  }
                }}
                placeholder="Ask about projects, technologies, internships, leadership, education, impact, or what Connor is learning next..."
                className="min-h-[7.5rem] w-full resize-none bg-transparent px-4 py-4 pr-28 text-sm text-foreground outline-none placeholder:text-muted-foreground/80"
              />
              <div className="absolute bottom-3 right-3">
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="h-10 px-4 text-sm"
                >
                  Send
                  <SendHorizonal className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Real-time answers grounded in portfolio context
              </div>
              {errorMessage ? <div className="text-xs text-destructive">{errorMessage}</div> : null}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
