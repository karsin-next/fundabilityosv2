import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { INVESTOR_REPORT_SYSTEM_PROMPT } from "@/lib/prompts";
import Anthropic from "@anthropic-ai/sdk";

const MODELS = {
  ANALYSIS: "claude-3-haiku-20240307",
};

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch all audit responses
    const { data: responses } = await supabase
      .from("audit_responses")
      .select("*")
      .eq("user_id", user.id);

    // 2. Fetch latest QuickAssess report
    const { data: latestReport } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!responses || responses.length === 0) {
      return NextResponse.json({ error: "No audit data found. Please complete some modules first." }, { status: 400 });
    }

    // 3. Prepare AI Prompt
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const context = {
      quick_assess: latestReport,
      module_responses: responses.map(r => ({
        module: r.module_id,
        q_and_a: r.history
      }))
    };

    const prompt = `Consolidate this founder's audit data into an investor-ready report:\n\n${JSON.stringify(context, null, 2)}\n\nREMEMBER: Respond ONLY with valid JSON matching the specified schema.`;

    const response = await anthropic.messages.create({
      model: MODELS.ANALYSIS,
      max_tokens: 4000,
      temperature: 0.2,
      system: INVESTOR_REPORT_SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Failed to generate valid report JSON");
    }

    const reportJson = JSON.parse(jsonMatch[0]);

    // 4. Update the latest report or create a new one? 
    // Usually we update the latest report with this data
    if (latestReport) {
      await supabase
        .from("reports")
        .update({
          investor_report_json: reportJson,
          updated_at: new Date().toISOString()
        })
        .eq("id", latestReport.id);
    }

    return NextResponse.json(reportJson);
  } catch (error: any) {
    console.error("[Report Gen Error]:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
