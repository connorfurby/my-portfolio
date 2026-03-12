import { NextResponse } from "next/server"

import { PortfolioChatError, answerPortfolioQuestion } from "@/lib/portfolio-chat"

type ChatRequest = {
  question?: string
  history?: Array<{
    role: "user" | "assistant"
    content: string
  }>
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ChatRequest
    const question = payload.question?.trim()

    if (!question) {
      return NextResponse.json({ message: "A question is required." }, { status: 400 })
    }

    const history = Array.isArray(payload.history)
      ? payload.history.filter(
          (message): message is { role: "user" | "assistant"; content: string } =>
            Boolean(message?.content) && (message.role === "user" || message.role === "assistant")
        )
      : []

    const result = await answerPortfolioQuestion(question, history)

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof PortfolioChatError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: error.status }
      )
    }

    console.error("Portfolio chat route failed:", error)
    return NextResponse.json(
      {
        message: "The portfolio assistant is temporarily unavailable.",
      },
      { status: 500 }
    )
  }
}
