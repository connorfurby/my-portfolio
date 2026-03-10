"use client"

import { useMemo, useState } from "react"
import { Bot, FileText, GraduationCap, Loader2, MessagesSquare, SendHorizonal, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
  "Tell me about your Discord-related or community projects.",
  "What are you currently learning?",
  "What experience do you have with internships?",
] as const

export default function PortfolioChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "assistant",
      content:
        "Ask about projects, skills, internships, awards, or anything from the portfolio. If you add resume/transcript docs in `content/portfolio-ai/`, I can answer from those too.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sources, setSources] = useState<ChatSource[]>([])

  const history = useMemo(
    () => messages.filter((message) => message.id !== "intro").map(({ role, content }) => ({ role, content })),
    [messages]
  )

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
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: error instanceof Error ? error.message : "Unable to load portfolio chat.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.84fr_1.16fr]">
      <Card className="surface-card rounded-[2rem] border-border bg-card">
        <CardContent className="flex h-full flex-col gap-6 p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="rounded-full border-foreground/10 bg-background/75 px-4 py-1 font-mono text-[11px] uppercase tracking-[0.24em]">
              <Bot className="mr-2 h-3.5 w-3.5" />
              AI portfolio chat
            </Badge>
            <Badge variant="outline" className="rounded-full border-foreground/10 bg-background/75 px-4 py-1 font-mono text-[11px] uppercase tracking-[0.24em]">
              Retrieval grounded
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Ask about Connor
            </div>
            <h3 className="font-display text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
              A small assistant trained on the portfolio, resume, and transcript
            </h3>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              This chat uses retrieval over the portfolio data plus the docs you place in `content/portfolio-ai/`. Add an AI API key and it upgrades into a fuller RAG experience automatically.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-foreground/10 bg-background/45 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                Resume ready
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                Drop your resume into `content/portfolio-ai/resume.md` and the assistant will cite it naturally.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-foreground/10 bg-background/45 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <GraduationCap className="h-4 w-4 text-primary" />
                Transcript ready
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                Add coursework, GPA, awards, or transcript details in `content/portfolio-ai/transcript.md`.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Suggested prompts
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => submitQuestion(question)}
                  className="rounded-full border border-foreground/10 bg-background/55 px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors duration-200 hover:bg-background/75 hover:text-foreground"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {sources.length ? (
            <div className="space-y-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Current sources
              </div>
              <div className="flex flex-wrap gap-2">
                {sources.slice(0, 6).map((source) => (
                  <Badge key={source.id} variant="outline" className="rounded-full border-foreground/10 bg-background/65 px-3 py-1 text-[10px] uppercase tracking-[0.18em]">
                    {source.title}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="surface-card rounded-[2rem] border-border bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <MessagesSquare className="h-5 w-5 text-primary" />
            Portfolio assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="max-h-[28rem] min-h-[24rem] space-y-3 overflow-y-auto rounded-[1.5rem] border border-foreground/10 bg-background/40 p-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`max-w-[90%] rounded-[1.25rem] px-4 py-3 text-sm leading-7 ${
                  message.role === "user"
                    ? "ml-auto bg-foreground text-background"
                    : "border border-foreground/10 bg-background/70 text-foreground"
                }`}
              >
                <div className="mb-1 text-[10px] uppercase tracking-[0.2em] opacity-70">
                  {message.role === "user" ? "You" : "Portfolio AI"}
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </motion.div>
            ))}
            {isLoading ? (
              <div className="inline-flex items-center gap-2 rounded-[1.25rem] border border-foreground/10 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking through the portfolio...
              </div>
            ) : null}
          </div>

          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              submitQuestion(input)
            }}
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about projects, internships, technologies, awards, or what Connor is learning..."
              className="min-h-[7rem] rounded-[1.5rem] border border-foreground/10 bg-background/45 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground/20"
            />
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Grounded in portfolio data and local docs
              </div>
              <Button type="submit" disabled={isLoading || !input.trim()} className="rounded-full px-5">
                Ask
                <SendHorizonal className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
