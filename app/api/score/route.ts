import { NextRequest } from "next/server";
import { getAnthropicClient, MODELS } from "@/lib/ai";
import { SCORING_SYSTEM_PROMPT } from "@/lib/prompts";
import { trackEvent } from "@/lib/analytics";
import { sendTelegramAlert } from "@/lib/telegram";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { answers, sessionId } = await req.json();

    if (!answers) {
      return new Response(JSON.stringify({ error: "answers is required" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    const anthropic = getAnthropicClient();
    const prompt = `Here is the founder's interview data. Score this startup according to the rubric.

INTERVIEW DATA:
${JSON.stringify(answers, null, 2)}

Remember: output ONLY the JSON schema. No preamble, no explanation.`;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        try {
          const anthropicStream = await anthropic.messages.stream({
            model: MODELS.ANALYSIS,
            max_tokens: 2500,
            temperature: 0.1,
            system: SCORING_SYSTEM_PROMPT,
            messages: [{ role: "user", content: prompt }],
          });

          for await (const chunk of anthropicStream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              const text = chunk.delta.text;
              fullResponse += text;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: text })}\n\n`));
            }
          }

          // Once complete, attempt to parse the full response to trigger notifications
          try {
            const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const result = JSON.parse(jsonMatch[0]);
              
              // Background tasks (non-blocking for the stream closure)
              trackEvent("assessment_completed", {
                sessionId,
                score: result.score,
                eventData: { band: result.band }
              }).catch(console.error);

              sendTelegramAlert(`🤖 <b>AI Assessment Completed</b>\nScore: ${result.score}/100 (${result.band})\nTop Gap: ${result.top_3_gaps?.[0]?.dimension || "N/A"}`).catch(console.error);
            }
          } catch (e) {
            console.error("[Scoring Post-Processing Error]:", e);
          }

          controller.enqueue(encoder.encode("data: {\"done\": true}\n\n"));
          controller.close();
        } catch (err: unknown) {
          console.error("[Scoring Stream Error]:", err);
          const errorMessage = err instanceof Error ? err.message : "Scoring stream error";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (err: unknown) {
    console.error("[Scoring API Error]:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}
