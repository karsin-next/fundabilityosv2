import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient, MODELS } from "@/lib/ai";
import { DYNAMIC_TREE_SYSTEM_PROMPT } from "@/lib/prompts";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { history } = await req.json();

    if (!history || !Array.isArray(history)) {
      return NextResponse.json({ error: "Valid history array is required" }, { status: 400 });
    }

    const anthropic = getAnthropicClient();
    const promptContext = history.length === 0 
      ? "This is a brand new interview. Start by asking for the company name and what problem they solve."
      : "Here is the founder's answer history so far:\n" + JSON.stringify(history, null, 2);

    // Create a TransformStream to pipe Claude's output to the client
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const anthropicStream = await anthropic.messages.stream({
            model: MODELS.CHAT,
            max_tokens: 1500,
            temperature: 0.1,
            system: DYNAMIC_TREE_SYSTEM_PROMPT,
            messages: [{ role: "user", content: promptContext }],
          });

          for await (const chunk of anthropicStream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              const text = chunk.delta.text;
              // Format as simple SSE payload
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: text })}\n\n`));
            }
          }

          controller.enqueue(encoder.encode("data: {\"done\": true}\n\n"));
          controller.close();
        } catch (err: any) {
          console.error("[Stream Error]:", err);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`));
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
    
  } catch (err: any) {
    console.error("[Dynamic Tree API Error]:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
