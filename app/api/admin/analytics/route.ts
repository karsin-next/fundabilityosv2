import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service-role client bypasses RLS — admin eyes only
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    // 1. Email leads (from LeadCaptureGate + deck uploads)
    const { data: leadRows } = await supabaseAdmin
      .from("analytics_events")
      .select("user_email, created_at, metadata, event_name")
      .in("event_name", ["lead_captured", "deck_uploaded"])
      .order("created_at", { ascending: false });

    // 2. Interview starts
    const { data: startRows } = await supabaseAdmin
      .from("analytics_events")
      .select("id")
      .eq("event_type", "interview_started");

    // 3. Completed assessments (event_type column, not event_name)
    const { data: completionRows } = await supabaseAdmin
      .from("analytics_events")
      .select("session_id, session_score, event_data, created_at")
      .eq("event_type", "assessment_completed")
      .order("created_at", { ascending: false });

    // 4. Support sessions with emails
    const { data: supportRows } = await supabaseAdmin
      .from("support_sessions")
      .select("email, created_at")
      .neq("email", "Anonymous")
      .order("created_at", { ascending: false });

    const leads = (leadRows || []).map((r) => ({
      email: r.user_email || "—",
      created_at: r.created_at,
      source: r.metadata?.path || (r.event_name === "deck_uploaded" ? "/upload" : "/"),
    }));

    const completions = (completionRows || []).map((r) => ({
      session_id: r.session_id || "—",
      score: r.session_score || 0,
      band: r.event_data?.band || "—",
      created_at: r.created_at,
    }));

    const scores = completions.map((c) => c.score).filter((s) => s > 0);
    const avgScore =
      scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

    return NextResponse.json({
      totalLeads: leads.length,
      totalStarts: (startRows || []).length,
      totalCompletions: completions.length,
      avgScore,
      leads,
      completions,
      supportSessions: (supportRows || []).map((r) => ({
        email: r.email,
        created_at: r.created_at,
      })),
    });
  } catch (err) {
    console.error("[Admin Analytics Error]:", err);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
