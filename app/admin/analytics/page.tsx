"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Users,
  Mail,
  CheckCircle2,
  TrendingUp,
  Activity,
  BrainCircuit,
  MessageSquare,
  Download,
  RefreshCw,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface FunnelData {
  totalLeads: number;
  totalStarts: number;
  totalCompletions: number;
  avgScore: number | null;
  leads: { email: string; created_at: string; source: string }[];
  completions: { session_id: string; score: number; band: string; created_at: string }[];
  supportSessions: { email: string; created_at: string }[];
}

const supabaseAdmin =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    : null;

export default function AnalyticsDashboard() {
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"leads" | "completions" | "support">("leads");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    if (!supabaseAdmin) return;
    setLoading(true);

    try {
      // Fetch leads (email capture events)
      const { data: leadRows } = await supabaseAdmin
        .from("analytics_events")
        .select("user_email, created_at, metadata")
        .eq("event_name", "lead_captured")
        .order("created_at", { ascending: false });

      // Fetch starts (interview_started events)
      const { data: startRows } = await supabaseAdmin
        .from("analytics_events")
        .select("id")
        .eq("event_type", "interview_started");

      // Fetch completions (assessment_completed events)
      const { data: completionRows } = await supabaseAdmin
        .from("analytics_events")
        .select("session_id, session_score, event_data, created_at")
        .eq("event_type", "assessment_completed")
        .order("created_at", { ascending: false });

      // Fetch support sessions with emails
      const { data: supportRows } = await supabaseAdmin
        .from("support_sessions")
        .select("email, created_at")
        .neq("email", "Anonymous")
        .order("created_at", { ascending: false });

      const leads = (leadRows || []).map((r) => ({
        email: r.user_email || "—",
        created_at: r.created_at,
        source: r.metadata?.path || "/",
      }));

      const completions = (completionRows || []).map((r) => ({
        session_id: r.session_id || "—",
        score: r.session_score || 0,
        band: r.event_data?.band || "—",
        created_at: r.created_at,
      }));

      const scores = completions.map((c) => c.score).filter((s) => s > 0);
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

      setData({
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
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  function downloadCSV(rows: Record<string, unknown>[], filename: string) {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
  }

  const captureRate =
    data && data.totalStarts > 0
      ? Math.round((data.totalLeads / data.totalStarts) * 100)
      : 0;

  const completionRate =
    data && data.totalLeads > 0
      ? Math.round((data.totalCompletions / data.totalLeads) * 100)
      : 0;

  const statsCards = [
    {
      label: "Total Email Leads",
      value: data?.totalLeads ?? "—",
      subLabel: "Emails captured",
      icon: Mail,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: null,
    },
    {
      label: "Diagnostics Started",
      value: data?.totalStarts ?? "—",
      subLabel: "Interview sessions begun",
      icon: Activity,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: null,
    },
    {
      label: "Assessments Completed",
      value: data?.totalCompletions ?? "—",
      subLabel: `Completion rate: ${completionRate}%`,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: completionRate,
    },
    {
      label: "Average Score",
      value: data?.avgScore != null ? `${data.avgScore.toFixed(1)}/100` : "—",
      subLabel: "Across all assessments",
      icon: BrainCircuit,
      color: "text-amber-600",
      bg: "bg-amber-50",
      trend: null,
    },
    {
      label: "Email Capture Rate",
      value: `${captureRate}%`,
      subLabel: "Leads / starts ratio",
      icon: TrendingUp,
      color: "text-rose-600",
      bg: "bg-rose-50",
      trend: captureRate,
    },
    {
      label: "Support Contacts",
      value: data?.supportSessions.length ?? "—",
      subLabel: "Via live chat widget",
      icon: MessageSquare,
      color: "text-teal-600",
      bg: "bg-teal-50",
      trend: null,
    },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-[#022f42] uppercase tracking-tighter">
            Funnel Analytics
          </h2>
          <p className="text-sm font-medium text-[#022f42]/50 mt-1">
            Real-time conversion telemetry — from visitor to completed diagnostic.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-[#022f42]/10 text-[10px] font-black uppercase tracking-widest text-[#022f42] hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button
            onClick={() =>
              downloadCSV(
                (data?.leads || []) as unknown as Record<string, unknown>[],
                "fundabilityos_leads"
              )
            }
            className="flex items-center gap-2 px-6 py-3 bg-[#022f42] text-[#ffd800] text-[10px] font-black uppercase tracking-widest hover:bg-[#ffd800] hover:text-[#022f42] transition-all shadow-lg"
          >
            <Download className="w-4 h-4" /> Export Leads CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((card, i) => (
          <div
            key={i}
            className="bg-white p-6 border border-[#022f42]/5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${card.bg} rounded-sm flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              {card.trend !== null && (
                <div
                  className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm ${
                    (card.trend as number) >= 50
                      ? "bg-emerald-50 text-emerald-600"
                      : (card.trend as number) >= 20
                      ? "bg-amber-50 text-amber-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {(card.trend as number) >= 50 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {card.trend}%
                </div>
              )}
            </div>
            {loading ? (
              <div className="h-8 bg-gray-100 animate-pulse rounded mb-2" />
            ) : (
              <div className="text-3xl font-black text-[#022f42] mb-1">{card.value}</div>
            )}
            <div className="text-[10px] font-bold text-[#022f42]/40 uppercase tracking-widest">
              {card.label}
            </div>
            <div className="text-[10px] font-medium text-[#022f42]/30 mt-0.5">{card.subLabel}</div>
          </div>
        ))}
      </div>

      {/* Funnel Visualizer */}
      <div className="bg-white border border-[#022f42]/5 shadow-xl p-8">
        <div className="text-[10px] font-black uppercase tracking-widest text-[#022f42]/40 mb-6">
          Conversion Funnel
        </div>
        {loading ? (
          <div className="space-y-3">
            {[100, 75, 50, 25].map((w, i) => (
              <div
                key={i}
                className="h-14 bg-gray-100 animate-pulse rounded"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {[
              {
                label: "Visitors (est.)",
                count: Math.max(data?.totalLeads ?? 0, data?.totalStarts ?? 0, 1) * 3,
                color: "bg-[#022f42]",
                textColor: "text-white",
              },
              {
                label: "Diagnostics Started",
                count: data?.totalStarts ?? 0,
                color: "bg-blue-600",
                textColor: "text-white",
              },
              {
                label: "Emails Captured",
                count: data?.totalLeads ?? 0,
                color: "bg-purple-600",
                textColor: "text-white",
              },
              {
                label: "Assessments Completed",
                count: data?.totalCompletions ?? 0,
                color: "bg-emerald-500",
                textColor: "text-white",
              },
            ].map((step, i, arr) => {
              const max = arr[0].count || 1;
              const pct = Math.round((step.count / max) * 100);
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-36 text-[10px] font-black uppercase tracking-widest text-[#022f42]/50 text-right shrink-0">
                    {step.label}
                  </div>
                  <div className="flex-1 bg-gray-50 h-12 relative overflow-hidden">
                    <div
                      className={`${step.color} h-full flex items-center px-4 transition-all duration-700`}
                      style={{ width: `${pct}%`, minWidth: step.count > 0 ? "80px" : "0" }}
                    >
                      <span className={`text-xs font-black ${step.textColor}`}>{step.count}</span>
                    </div>
                  </div>
                  <div className="w-12 text-right text-[10px] font-black text-[#022f42]/40 shrink-0">
                    {pct}%
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Tables */}
      <div className="bg-white border border-[#022f42]/5 shadow-xl overflow-hidden">
        {/* Tab Bar */}
        <div className="flex border-b border-[#022f42]/5 bg-gray-50/50">
          {(
            [
              { key: "leads", label: "Email Leads", count: data?.totalLeads ?? 0, icon: Mail },
              {
                key: "completions",
                label: "Completions",
                count: data?.totalCompletions ?? 0,
                icon: CheckCircle2,
              },
              {
                key: "support",
                label: "Support Contacts",
                count: data?.supportSessions.length ?? 0,
                icon: MessageSquare,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab.key
                  ? "border-[#ffd800] text-[#022f42] bg-white"
                  : "border-transparent text-[#022f42]/40 hover:text-[#022f42]/70"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-[9px] ${
                  activeTab === tab.key
                    ? "bg-[#022f42] text-[#ffd800]"
                    : "bg-gray-200 text-[#022f42]/40"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 space-y-3">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-12 bg-gray-50 animate-pulse rounded" />
                ))}
            </div>
          ) : activeTab === "leads" ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#022f42]/5">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#022f42]/40">
                    Email
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#022f42]/40">
                    Source Page
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#022f42]/40">
                    Captured At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#022f42]/5">
                {data?.leads.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-sm text-[#022f42]/30 font-medium">
                      No leads captured yet.
                    </td>
                  </tr>
                ) : (
                  data?.leads.map((lead, i) => (
                    <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#022f42] rounded-sm flex items-center justify-center text-[#ffd800] font-black text-xs">
                            {lead.email.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-[#022f42]">{lead.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-[#022f42]/5 text-[#022f42]/60">
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-[#022f42]/40 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(lead.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : activeTab === "completions" ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#022f42]/5">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#022f42]/40">
                    Session ID
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#022f42]/40">
                    Score
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#022f42]/40">
                    Band
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#022f42]/40">
                    Completed At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#022f42]/5">
                {data?.completions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-[#022f42]/30 font-medium">
                      No completions recorded yet.
                    </td>
                  </tr>
                ) : (
                  data?.completions.map((c, i) => (
                    <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-[#022f42]/50">
                        #{c.session_id.slice(0, 12)}...
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                c.score >= 70
                                  ? "bg-emerald-500"
                                  : c.score >= 50
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${c.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-black text-[#022f42]">{c.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 ${
                            c.band === "A"
                              ? "bg-emerald-100 text-emerald-700"
                              : c.band === "B"
                              ? "bg-blue-100 text-blue-700"
                              : c.band === "C"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          Band {c.band}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-[#022f42]/40 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(c.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#022f42]/5">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#022f42]/40">
                    Email
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#022f42]/40">
                    Support Started At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#022f42]/5">
                {data?.supportSessions.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-12 text-center text-sm text-[#022f42]/30 font-medium">
                      No support contacts yet.
                    </td>
                  </tr>
                ) : (
                  data?.supportSessions.map((s, i) => (
                    <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-teal-600 rounded-sm flex items-center justify-center text-white font-black text-xs">
                            {s.email.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-[#022f42]">{s.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-[#022f42]/40 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(s.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
