"use server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function getAnswer(question: string, system?: string) {
  const { text, finishReason, usage } = await generateText({
    model: openai("gpt-3.5-turbo"),
    system: system,
    prompt: question,
  });

  return { text, finishReason, usage };
}