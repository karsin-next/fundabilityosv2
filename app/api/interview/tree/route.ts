import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient, MODELS } from "@/lib/ai";
import { DYNAMIC_TREE_SYSTEM_PROMPT } from "@/lib/prompts";

export const runtime = "nodejs";
export const maxDuration = 60; // Allow enough time for Claude

export async function POST(req: NextRequest) {
  try {
    const { history } = await req.json();

    if (!history || !Array.isArray(history)) {
      return NextResponse.json(
        { error: "Valid history array is required" },
        { status: 400 }
      );
    }

    const anthropic = getAnthropicClient();

    // Prepare conversation for Claude
    // We send the history as a single block of context from the user.
    const promptContext = history.length === 0 
      ? "This is a brand new interview. Start by asking for the company name and what problem they solve."
      : "Here is the founder's answer history so far:\n" + JSON.stringify(history, null, 2);

    const msg = await anthropic.messages.create({
      model: MODELS.CHAT, // Using haiku-4-5 since it's fast and smart enough for tree logic
      max_tokens: 1500,
      temperature: 0.1, // Keep it highly deterministic
      system: DYNAMIC_TREE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: promptContext }],
    });

    const rawText = msg.content[0].type === "text" ? msg.content[0].text : "";

    // Strip markdown fences just in case
    const cleaned = rawText
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    // Extract the JSON
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("Claude did not return valid JSON tree node.");
    }

    const json = JSON.parse(match[0]);
    return NextResponse.json(json);
    
  } catch (err: unknown) {
    console.error("[Dynamic Tree API Error]:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
