import { promises as fs } from "fs"
import path from "path"

import {
  achievements,
  academicStats,
  contactLinks,
  coursework,
  heroPills,
  internshipEntries,
  passions,
  projects,
  proofHighlights,
  schoolActivities,
  signatureStacks,
  skillGroups,
  techClusters,
  volunteerEntries,
  workEntries,
} from "@/components/portfolio/data"

type KnowledgeChunkKind =
  | "overview"
  | "project"
  | "experience"
  | "education"
  | "skills"
  | "achievement"
  | "passion"
  | "contact"
  | "resume"
  | "transcript"
  | "document"

export type KnowledgeChunk = {
  id: string
  title: string
  kind: KnowledgeChunkKind
  source: string
  content: string
}

type ChatHistoryMessage = {
  role: "user" | "assistant"
  content: string
}

export class PortfolioChatError extends Error {
  status: number

  constructor(message: string, status = 500) {
    super(message)
    this.name = "PortfolioChatError"
    this.status = status
  }
}

const KNOWLEDGE_DIR = path.join(process.cwd(), "content", "portfolio-ai")
const SUPPORTED_DOCUMENT_EXTENSIONS = new Set([".md", ".txt", ".json", ".tex"])
const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "about",
  "as",
  "at",
  "be",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "the",
  "to",
  "what",
  "with",
  "you",
  "your",
])

function normalizeWhitespace(value: string) {
  return value.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").replace(/[ \t]+/g, " ").trim()
}

function stripLatexCommands(value: string) {
  return normalizeWhitespace(
    value
      .replace(/%.*$/gm, "")
      .replace(/\\begin\{[^}]+\}|\\end\{[^}]+\}/g, " ")
      .replace(/\\(?:documentclass|usepackage|pagestyle|thispagestyle|geometry|setlength|newcommand|renewcommand)(?:\[[^\]]*\])?(?:\{[^}]*\})*/g, " ")
      .replace(/\\(?:href|url)\{[^}]*\}\{([^}]*)\}/g, " $1 ")
      .replace(/\\(?:href|url)\{([^}]*)\}/g, " $1 ")
      .replace(/\\(?:section|subsection|subsubsection|textbf|textit|emph|underline|item|small|large|Large|huge|Huge)\*?(?:\[[^\]]*\])?\{([^}]*)\}/g, " $1 ")
      .replace(/\\[a-zA-Z]+\*?(?:\[[^\]]*\])?(?:\{[^}]*\})?/g, " ")
      .replace(/[{}]/g, " ")
  )
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function tokenize(value: string) {
  return normalizeWhitespace(value)
    .toLowerCase()
    .split(/[^a-z0-9+#./-]+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
}

function buildChunk(id: string, title: string, kind: KnowledgeChunkKind, source: string, content: string): KnowledgeChunk {
  return {
    id,
    title,
    kind,
    source,
    content: normalizeWhitespace(content),
  }
}

function chunkLongText(baseId: string, title: string, kind: KnowledgeChunkKind, source: string, text: string) {
  const paragraphs = normalizeWhitespace(text)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  const chunks: KnowledgeChunk[] = []
  let buffer = ""
  let index = 0

  for (const paragraph of paragraphs) {
    const candidate = buffer ? `${buffer}\n\n${paragraph}` : paragraph

    if (candidate.length > 900 && buffer) {
      chunks.push(buildChunk(`${baseId}-${index}`, title, kind, source, buffer))
      buffer = paragraph
      index += 1
      continue
    }

    buffer = candidate
  }

  if (buffer) {
    chunks.push(buildChunk(`${baseId}-${index}`, title, kind, source, buffer))
  }

  return chunks.length ? chunks : [buildChunk(`${baseId}-0`, title, kind, source, text)]
}

function buildPortfolioChunks() {
  const chunks: KnowledgeChunk[] = []

  chunks.push(
    buildChunk(
      "overview-profile",
      "Portfolio overview",
      "overview",
      "Portfolio",
      [
        "Connor Furby is a student software engineer focused on fast, polished, memorable software experiences.",
        `Current themes: ${heroPills.map((pill) => pill.label).join(", ")}.`,
        `Highlighted proof points: ${proofHighlights.map((highlight) => `${highlight.label}: ${highlight.value}`).join("; ")}.`,
      ].join("\n")
    )
  )

  projects.forEach((project) => {
    chunks.push(
      buildChunk(
        `project-${slugify(project.title)}`,
        project.title,
        "project",
        `Project: ${project.title}`,
        [
          project.description,
          project.spotlight ? `Spotlight: ${project.spotlight}` : "",
          project.stack?.length ? `Tech stack: ${project.stack.join(", ")}` : "",
          `Key details: ${project.bullets.join(" ")}`,
        ]
          .filter(Boolean)
          .join("\n")
      )
    )
  })

  internshipEntries.forEach((entry) => {
    chunks.push(
      buildChunk(
        `internship-${slugify(entry.title)}`,
        entry.title,
        "experience",
        "Internships",
        `${entry.subtitle}\n${entry.bullets.join(" ")}`
      )
    )
  })

  workEntries.forEach((entry) => {
    chunks.push(
      buildChunk(
        `work-${slugify(entry.title)}`,
        entry.title,
        "experience",
        "Work",
        `${entry.subtitle}\n${entry.bullets.join(" ")}`
      )
    )
  })

  volunteerEntries.forEach((entry) => {
    chunks.push(
      buildChunk(
        `volunteer-${slugify(entry.title)}`,
        entry.title,
        "experience",
        "Volunteering",
        `${entry.subtitle}\n${entry.bullets.join(" ")}`
      )
    )
  })

  chunks.push(
    buildChunk(
      "education-summary",
      "Education summary",
      "education",
      "Education",
      [
        "School: Naperville Central High School (2021-2025).",
        `Academic stats: ${academicStats.join("; ")}.`,
        `Coursework: ${coursework.join("; ")}.`,
        `Activities: ${schoolActivities.join("; ")}.`,
      ].join("\n")
    )
  )

  techClusters.forEach((cluster) => {
    chunks.push(
      buildChunk(
        `skills-${slugify(cluster.title)}`,
        cluster.title,
        "skills",
        "Skills",
        [
          `Tech cluster ${cluster.title}: ${cluster.summary}`,
          `Technologies: ${cluster.technologies.map((technology) => `${technology.name} (${technology.tier})`).join(", ")}.`,
          `Focus areas: ${cluster.focus.join(", ")}.`,
          `Project links: ${cluster.projects.join(", ")}.`,
          `Proof points: ${cluster.proofs.join(" ")}`,
        ].join("\n")
      )
    )
  })

  signatureStacks.forEach((stack) => {
    chunks.push(
      buildChunk(
        `skills-stack-${slugify(stack.title)}`,
        stack.title,
        "skills",
        "Skills",
        `Signature stack ${stack.title}: ${stack.description} Technologies include ${stack.stack.join(", ")}.`
      )
    )
  })

  skillGroups.forEach((group) => {
    chunks.push(
      buildChunk(
        `skills-legacy-${slugify(group.title)}`,
        `${group.title} foundations`,
        "skills",
        "Skills",
        `Legacy skill grouping for ${group.title}: ${group.items.join(", ")}.`
      )
    )
  })

  achievements.forEach((achievement, index) => {
    chunks.push(
      buildChunk(
        `achievement-${index}`,
        `Achievement ${index + 1}`,
        "achievement",
        "Achievements",
        achievement
      )
    )
  })

  passions.forEach((passion) => {
    chunks.push(
      buildChunk(
        `passion-${slugify(passion.title)}`,
        passion.title,
        "passion",
        "Passions",
        passion.description
      )
    )
  })

  chunks.push(
    buildChunk(
      "contact-details",
      "Contact details",
      "contact",
      "Contact",
      contactLinks.map((link) => `${link.label}: ${link.value}`).join("\n")
    )
  )

  return chunks
}

async function readKnowledgeDocuments() {
  try {
    const files = await fs.readdir(KNOWLEDGE_DIR, { withFileTypes: true })
    const documentChunks: KnowledgeChunk[] = []

    for (const file of files) {
      if (!file.isFile()) {
        continue
      }

      const extension = path.extname(file.name).toLowerCase()

      if (!SUPPORTED_DOCUMENT_EXTENSIONS.has(extension) || file.name.toLowerCase() === "readme.md") {
        continue
      }

      const fullPath = path.join(KNOWLEDGE_DIR, file.name)
      const raw = await fs.readFile(fullPath, "utf8")
      const content = extension === ".tex" ? stripLatexCommands(raw) : normalizeWhitespace(raw)
      const lower = content.toLowerCase()

      if (!content || lower.includes("placeholder:") || lower.includes("paste your") || lower.includes("replace this file")) {
        continue
      }

      const baseName = path.basename(file.name, extension)
      const kind: KnowledgeChunkKind =
        baseName === "resume" ? "resume" : baseName === "transcript" ? "transcript" : "document"

      documentChunks.push(
        ...chunkLongText(`doc-${slugify(baseName)}`, baseName.replace(/[-_]/g, " "), kind, `Document: ${file.name}`, content)
      )
    }

    return documentChunks
  } catch {
    return [] as KnowledgeChunk[]
  }
}

export async function getKnowledgeChunks() {
  const portfolioChunks = buildPortfolioChunks()
  const documentChunks = await readKnowledgeDocuments()

  return [...portfolioChunks, ...documentChunks]
}

export function retrieveRelevantChunks(question: string, chunks: KnowledgeChunk[], limit = 6) {
  const normalizedQuestion = normalizeWhitespace(question)
  const questionTokens = tokenize(normalizedQuestion)
  const asksAboutTechnologies = questionTokens.some((token) =>
    ["tech", "stack", "stacks", "technology", "technologies", "framework", "frameworks", "tools", "use", "using"].includes(token)
  )
  const asksAboutLearning = questionTokens.some((token) =>
    ["learning", "learn", "studying", "study", "improving", "growing"].includes(token)
  )
  const asksAboutProjects = questionTokens.some((token) =>
    ["project", "projects", "built", "build", "app", "apps"].includes(token)
  )
  const asksAboutExperience = questionTokens.some((token) =>
    ["internship", "internships", "experience", "work", "volunteer", "volunteering"].includes(token)
  )

  const scored = chunks
    .map((chunk) => {
      const titleTokens = tokenize(chunk.title)
      const contentTokens = tokenize(chunk.content)

      let score = 0

      for (const token of questionTokens) {
        if (titleTokens.includes(token)) {
          score += 6
        }

        const occurrences = contentTokens.filter((contentToken) => contentToken === token).length
        score += Math.min(occurrences, 4) * 2

        if (chunk.content.toLowerCase().includes(token)) {
          score += 0.5
        }
      }

      if (normalizedQuestion.length > 8 && chunk.title.toLowerCase().includes(normalizedQuestion.toLowerCase())) {
        score += 12
      }

      if (chunk.kind === "project" && asksAboutProjects) {
        score += 1.5
      }

      if ((chunk.kind === "skills" || chunk.kind === "project" || chunk.kind === "experience") && asksAboutTechnologies) {
        score += 4
      }

      if ((chunk.kind === "experience" || chunk.kind === "resume") && asksAboutExperience) {
        score += 4
      }

      if ((chunk.kind === "skills" || chunk.kind === "project" || chunk.kind === "resume") && asksAboutLearning) {
        score += 2
      }

      if (chunk.kind === "passion" && (asksAboutTechnologies || asksAboutExperience)) {
        score -= 3
      }

      if (chunk.kind === "resume" || chunk.kind === "transcript") {
        score += 0.5
      }

      return { chunk, score }
    })
    .sort((left, right) => right.score - left.score)

  const positive = scored.filter((entry) => entry.score > 0)

  if (!positive.length) {
    return chunks.slice(0, limit)
  }

  return positive.slice(0, limit).map((entry) => entry.chunk)
}

function buildPrompt(question: string, history: ChatHistoryMessage[], chunks: KnowledgeChunk[]) {
  const context = chunks
    .map((chunk) => `[${chunk.source}] ${chunk.title}\n${chunk.content}`)
    .join("\n\n")

  const historyText = history
    .slice(-6)
    .map((message) => `${message.role === "user" ? "User" : "Assistant"}: ${message.content}`)
    .join("\n")

  return `
You are an AI assistant embedded inside Connor Furby's portfolio website.

Instructions:
- Answer as a helpful assistant representing Connor and his work.
- Use only the provided portfolio context and document context.
- If information is missing, say you do not see it in the current portfolio knowledge base.
- Be concise but substantive.
- Prefer plain language over buzzwords.
- Do not invent metrics, technologies, schools, or timelines.

Conversation history:
${historyText || "No prior messages."}

Relevant context:
${context}

User question:
${question}
`.trim()
}

async function safeParseJson<T>(response: Response) {
  try {
    return (await response.json()) as T
  } catch {
    return null
  }
}

function buildGeminiErrorMessage(status: number) {
  if (status === 401 || status === 403) {
    return "The portfolio assistant could not authenticate with Gemini."
  }

  if (status === 404) {
    return "The portfolio assistant is pointed at a Gemini model that is unavailable right now."
  }

  if (status === 429) {
    return "The portfolio assistant is temporarily rate-limited by Gemini. Please try again in a moment."
  }

  if (status >= 500) {
    return "Gemini is temporarily unavailable right now. Please try again shortly."
  }

  return "The portfolio assistant could not get a valid response from Gemini."
}

function resolveGeminiModel() {
  const configuredModel = process.env.PORTFOLIO_CHAT_MODEL?.trim()

  if (!configuredModel) {
    return "gemini-2.5-flash"
  }

  if (configuredModel === "gemini-2.0-flash" || configuredModel === "gemini-2.0-flash-lite") {
    return "gemini-2.5-flash"
  }

  return configuredModel
}

function resolveOpenAIModel() {
  const configuredModel = process.env.PORTFOLIO_CHAT_MODEL?.trim()
  return configuredModel?.startsWith("gpt-") ? configuredModel : "gpt-4o-mini"
}

async function generateWithGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new PortfolioChatError("The portfolio assistant is not configured with a Gemini API key.", 500)
  }

  const model = resolveGeminiModel()
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 1200,
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      }),
    }
  )

  if (!response.ok) {
    const errorPayload = await safeParseJson<{
      error?: {
        message?: string
        status?: string
      }
    }>(response)

    console.error("Gemini API request failed.", {
      status: response.status,
      model,
      providerStatus: errorPayload?.error?.status,
      providerMessage: errorPayload?.error?.message,
    })

    throw new PortfolioChatError(buildGeminiErrorMessage(response.status), response.status === 429 ? 503 : response.status)
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      finishReason?: string
      content?: {
        parts?: Array<{ text?: string }>
      }
    }>
  }

  const candidate = payload.candidates?.[0]
  const answer = candidate?.content?.parts?.map((part) => part.text ?? "").join("").trim() || null

  if (!answer) {
    throw new PortfolioChatError("Gemini returned an empty answer.", 502)
  }

  if (candidate?.finishReason === "MAX_TOKENS") {
    console.warn("Gemini response hit max output tokens.", { model, maxOutputTokens: 1200 })
  }

  return answer
}

async function generateWithOpenAI(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new PortfolioChatError("The portfolio assistant is not configured with an OpenAI API key.", 500)
  }

  const model = resolveOpenAIModel()
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant embedded inside Connor Furby's portfolio website. Use only the supplied context, avoid fabrications, and answer clearly.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    const errorPayload = await safeParseJson<{
      error?: {
        message?: string
      }
    }>(response)

    console.error("OpenAI API request failed.", {
      status: response.status,
      model,
      providerMessage: errorPayload?.error?.message,
    })

    throw new PortfolioChatError("The portfolio assistant could not get a valid response from OpenAI.", response.status)
  }

  const payload = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string
      }
    }>
  }

  const answer = payload.choices?.[0]?.message?.content?.trim() || null

  if (!answer) {
    throw new PortfolioChatError("OpenAI returned an empty answer.", 502)
  }

  return answer
}

export async function answerPortfolioQuestion(question: string, history: ChatHistoryMessage[]) {
  const chunks = await getKnowledgeChunks()
  const relevantChunks = retrieveRelevantChunks(question, chunks)
  const prompt = buildPrompt(question, history, relevantChunks)
  const preferredProvider = process.env.PORTFOLIO_CHAT_PROVIDER?.toLowerCase()
  const provider = preferredProvider === "openai" ? "openai" : "gemini"
  const answer = provider === "openai" ? await generateWithOpenAI(prompt) : await generateWithGemini(prompt)

  return {
    answer,
    mode: "ai" as const,
    sources: relevantChunks.map((chunk) => ({
      id: chunk.id,
      title: chunk.title,
      kind: chunk.kind,
      source: chunk.source,
    })),
  }
}
