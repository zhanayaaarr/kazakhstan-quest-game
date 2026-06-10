import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const aiHintInput = z.object({
  city: z.string().min(1).max(80),
  monument: z.string().min(1).max(120),
  question: z.string().min(1).max(500),
  currentHint: z.string().min(1).max(500),
});

const historyQuestionInput = z.object({
  excludeQuestions: z.array(z.string().min(1).max(300)).max(30).default([]),
});

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

type AiHistoryQuestion = {
  question: string;
  options: string[];
  answer: string;
  hint: string;
  explanation: string;
};

function readGeminiText(result: GeminiGenerateContentResponse) {
  return result.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim() ?? "";
}

function parseJsonObject(text: string) {
  const cleaned = text
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Gemini did not return JSON.");
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

export const getAiHint = createServerFn({ method: "POST" })
  .inputValidator(aiHintInput)
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

    if (!apiKey) {
      throw new Error("Gemini is not configured. Add GEMINI_API_KEY to the server environment.");
    }

    const prompt = [
      "You are a friendly quiz coach for a student playing Kazakhstan Quest.",
      "Give one short helpful hint in simple English.",
      "Do not reveal the exact answer. Do not list possible answers.",
      "Keep it under 35 words.",
      "",
      `City: ${data.city}`,
      `Place or monument: ${data.monument}`,
      `Question: ${data.question}`,
      `Existing hint: ${data.currentHint}`,
    ].join("\n");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 80,
          },
        }),
      },
    );

    const result = (await response.json()) as GeminiGenerateContentResponse;

    if (!response.ok) {
      throw new Error(result.error?.message || "Gemini request failed.");
    }

    const hint = readGeminiText(result);

    if (!hint) {
      throw new Error("Gemini returned an empty hint.");
    }

    return { hint };
  });

export const getKazHistoryQuestion = createServerFn({ method: "POST" })
  .inputValidator(historyQuestionInput)
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

    if (!apiKey) {
      throw new Error("Gemini is not configured. Add GEMINI_API_KEY to the server environment.");
    }

    const excluded = data.excludeQuestions.length
      ? data.excludeQuestions.map((question, index) => `${index + 1}. ${question}`).join("\n")
      : "None";

    const prompt = [
      "Create one Kazakhstan history quiz question for a student.",
      "Avoid repeating or closely rephrasing any excluded question.",
      "Use factual topics: Kazakh Khanate, Silk Road, Golden Horde, Alash movement, independence, capitals, historical figures, UNESCO sites, or space history.",
      "Return only valid JSON with this exact shape:",
      '{"question":"...","options":["...","...","...","..."],"answer":"...","hint":"...","explanation":"..."}',
      "Rules:",
      "- Write in simple English.",
      "- Use exactly 4 answer options.",
      "- The answer must exactly match one option.",
      "- Hint must help but not reveal the answer.",
      "- Explanation must be one short sentence.",
      "",
      "Excluded questions:",
      excluded,
    ].join("\n");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 300,
          },
        }),
      },
    );

    const result = (await response.json()) as GeminiGenerateContentResponse;

    if (!response.ok) {
      throw new Error(result.error?.message || "Gemini request failed.");
    }

    const parsed = parseJsonObject(readGeminiText(result)) as AiHistoryQuestion;
    const question = z
      .object({
        question: z.string().min(8).max(300),
        options: z.array(z.string().min(1).max(120)).length(4),
        answer: z.string().min(1).max(120),
        hint: z.string().min(4).max(220),
        explanation: z.string().min(4).max(260),
      })
      .parse(parsed);

    if (!question.options.includes(question.answer)) {
      throw new Error("Gemini returned an answer that is not in the options.");
    }

    return question;
  });
