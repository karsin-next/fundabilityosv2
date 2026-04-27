import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * GET /api/admin/users
 * Returns a paginated list of all registered users from the profiles table,
 * joined with their latest report score from the reports table.
 * Protected by CRON_SECRET header.
 */
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret") || req.nextUrl.searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = (page - 1) * limit;

  try {
    // 1. Get profiles
    const { data: profiles, error: profilesErr, count } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, company_name, is_admin, role, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (profilesErr) {
      console.error("[Admin Users API]", profilesErr.message);
      return NextResponse.json({ error: profilesErr.message }, { status: 500 });
    }

    // 2. Get latest report score per user
    const userIds = (profiles || []).map((p) => p.id);
    let reportsByUser: Record<string, { score: number; band: string; report_id: string; created_at: string }> = {};

    if (userIds.length > 0) {
      const { data: reports } = await supabaseAdmin
        .from("reports")
        .select("id, user_id, score, band, created_at")
        .in("user_id", userIds)
        .order("created_at", { ascending: false });

      if (reports) {
        for (const r of reports) {
          // Keep only the latest report per user
          if (r.user_id && !reportsByUser[r.user_id]) {
            reportsByUser[r.user_id] = {
              score: r.score,
              band: r.band,
              report_id: r.id,
              created_at: r.created_at,
            };
          }
        }
      }
    }

    // 3. Also get orphan reports (user_id is null) — these are from guest users
    const { data: orphanReports } = await supabaseAdmin
      .from("reports")
      .select("id, score, band, created_at")
      .is("user_id", null)
      .order("created_at", { ascending: false });

    // 4. Merge profiles with their scores
    const users = (profiles || []).map((p) => {
      const report = reportsByUser[p.id];
      return {
        ...p,
        fundability_score: report?.score || null,
        band: report?.band || null,
        report_id: report?.report_id || null,
        assessment_date: report?.created_at || null,
      };
    });

    return NextResponse.json({
      users,
      orphan_reports: orphanReports || [],
      total: count,
      page,
      limit,
    });
  } catch (err) {
    console.error("[Admin Users API] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
