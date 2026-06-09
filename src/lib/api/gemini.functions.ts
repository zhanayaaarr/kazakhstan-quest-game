import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const aiHintInput = z.object({
  city: z.string().min(1).max(80),
  monument: z.string().min(1).max(120),
  question: z.string().min(1).max(500),
  currentHint: z.string().min(1).max(500),
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

    const hint = result.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();

    if (!hint) {
      throw new Error("Gemini returned an empty hint.");
    }

    return { hint };
  });
