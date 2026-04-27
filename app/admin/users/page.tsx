"use client";

import { useEffect, useState } from "react";
import { Users, RefreshCw, CheckCircle, XCircle, Send, ExternalLink, FileText } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
  is_admin: boolean;
  role: string;
  created_at: string;
  fundability_score: number | null;
  band: string | null;
  report_id: string | null;
  assessment_date: string | null;
}

interface OrphanReport {
  id: string;
  score: number;
  band: string;
  created_at: string;
}

/**
 * Admin Users Page (/admin/users)
 * Displays all registered users from the Supabase profiles table,
 * joined with their latest assessment scores.
 * Accessible at /admin/users?secret=YOUR_CRON_SECRET
 */
export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [orphanReports, setOrphanReports] = useState<OrphanReport[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [highlightEmail, setHighlightEmail] = useState<string | null>(null);
  const [telegramStatus, setTelegramStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("secret") || "";
    const email = params.get("email") || null;
    if (email) setHighlightEmail(email);
    if (s) {
      setSecret(s);
      setAuthed(true);
      fetchUsers(s);
    } else {
      setLoading(false);
    }
  }, []);

  /** Fetch users from the admin API */
  async function fetchUsers(s: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?secret=${encodeURIComponent(s)}`);
      if (!res.ok) throw new Error("Unauthorized or server error");
      const data = await res.json();
      setUsers(data.users || []);
      setOrphanReports(data.orphan_reports || []);
      setTotal(data.total || 0);
    } catch (e) {
      console.error(e);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  /** Test Telegram integration */
  async function testTelegram() {
    setTelegramStatus("sending");
    try {
      const res = await fetch(`/api/admin/test-telegram?secret=${encodeURIComponent(secret)}`);
      const data = await res.json();
      setTelegramStatus(data.ok ? "ok" : "error");
      setTimeout(() => setTelegramStatus("idle"), 4000);
    } catch {
      setTelegramStatus("error");
      setTimeout(() => setTelegramStatus("idle"), 4000);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSecret(secretInput);
    setAuthed(true);
    fetchUsers(secretInput);
  }

  function getScoreBadge(score: number | null, band: string | null) {
    if (!score) return <span className="px-2 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-500 rounded">No Score</span>;
    if (score >= 85) return <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded">{score} · {band || "✅"}</span>;
    if (score >= 60) return <span className="px-2 py-0.5 text-[10px] font-bold bg-yellow-100 text-yellow-700 rounded">{score} · {band || "⚠️"}</span>;
    return <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded">{score} · {band || "🔴"}</span>;
  }

  // ── Auth gate ──────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#022f42] flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-white p-10 shadow-2xl w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-block bg-[#ffd800] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#022f42] mb-4">Admin Access</div>
            <h1 className="text-2xl font-black text-[#022f42] uppercase tracking-tight">FundabilityOS</h1>
          </div>
          <label className="block text-xs font-bold text-[#022f42] uppercase tracking-widest mb-2">Admin Secret</label>
          <input
            type="password"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            placeholder="Enter CRON_SECRET"
            className="w-full border-2 border-[#022f42]/20 px-4 py-3 text-sm mb-6 focus:border-[#022f42] outline-none text-[#022f42]"
          />
          <button type="submit" className="w-full bg-[#022f42] text-[#ffd800] font-black uppercase tracking-widest py-3 text-sm hover:bg-[#ffd800] hover:text-[#022f42] transition-all">
            Access Dashboard
          </button>
        </form>
      </div>
    );
  }

  // ── Main dashboard ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f2f6fa]">
      {/* Header */}
      <div className="bg-[#022f42] border-b-4 border-[#ffd800] px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="inline-block bg-[#ffd800] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#022f42] mb-2">Admin Panel</div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Users size={22} className="text-[#ffd800]" />
              Registered Users
            </h1>
            <p className="text-white/40 text-xs mt-1">{total} total users in database</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Telegram Test Button */}
            <button
              onClick={testTelegram}
              disabled={telegramStatus === "sending"}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all border-2 ${
                telegramStatus === "ok" ? "border-emerald-400 bg-emerald-400 text-white" :
                telegramStatus === "error" ? "border-red-400 bg-red-400 text-white" :
                "border-[#ffd800] text-[#ffd800] hover:bg-[#ffd800] hover:text-[#022f42]"
              }`}
            >
              {telegramStatus === "sending" ? <RefreshCw size={12} className="animate-spin" /> :
               telegramStatus === "ok" ? <CheckCircle size={12} /> :
               telegramStatus === "error" ? <XCircle size={12} /> :
               <Send size={12} />}
              {telegramStatus === "sending" ? "Sending..." :
               telegramStatus === "ok" ? "Sent! Check Telegram" :
               telegramStatus === "error" ? "Failed — Check Token" :
               "Test Telegram"}
            </button>

            {/* Refresh */}
            <button
              onClick={() => fetchUsers(secret)}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest bg-white text-[#022f42] hover:bg-[#ffd800] transition-all"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: total },
            { label: "With Scores", value: users.filter(u => u.fundability_score).length },
            { label: "High Scores (85+)", value: users.filter(u => (u.fundability_score ?? 0) >= 85).length },
            { label: "Guest Reports", value: orphanReports.length },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border-2 border-[#022f42]/5 p-6 shadow-sm">
              <div className="text-3xl font-black text-[#022f42] mb-1">{stat.value}</div>
              <div className="text-[10px] font-bold text-[#022f42]/40 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white border-2 border-[#022f42]/5 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#022f42]/5 flex items-center justify-between">
            <h2 className="text-sm font-black text-[#022f42] uppercase tracking-widest">All Users</h2>
            <span className="text-[10px] text-[#022f42]/40 uppercase tracking-widest">{users.length} shown</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#022f42]/10 border-t-[#ffd800] rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center text-[#022f42]/40 text-sm">No users found. Check your secret or database.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#022f42]/3 border-b border-[#022f42]/5">
                    {["#", "Name", "Email", "Company", "Role", "Score", "Assessed", "Signed Up", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] font-black text-[#022f42]/40 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => {
                    const isHighlighted = highlightEmail && u.email.toLowerCase() === highlightEmail.toLowerCase();
                    return (
                      <tr key={u.id} className={`border-b border-[#022f42]/5 transition-colors ${isHighlighted ? "bg-[#ffd800]/15 ring-2 ring-inset ring-[#ffd800]" : "hover:bg-[#022f42]/2"}`}>
                        <td className="px-4 py-3 text-[#022f42]/30 text-xs font-mono">{i + 1}</td>
                        <td className="px-4 py-3 font-bold text-[#022f42]">
                          {u.full_name || <span className="text-[#022f42]/30">—</span>}
                          {u.is_admin && <span className="ml-2 px-1.5 py-0.5 text-[8px] font-black bg-[#ffd800] text-[#022f42] uppercase tracking-widest rounded">Admin</span>}
                        </td>
                        <td className="px-4 py-3 text-[#022f42]/70">{u.email}</td>
                        <td className="px-4 py-3 text-[#022f42]/60">{u.company_name || <span className="text-[#022f42]/30">—</span>}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-[#022f42]/5 text-[#022f42]/60 uppercase tracking-widest rounded">{u.role || "startup"}</span>
                        </td>
                        <td className="px-4 py-3">{getScoreBadge(u.fundability_score, u.band)}</td>
                        <td className="px-4 py-3 text-[#022f42]/50 text-xs whitespace-nowrap">
                          {u.assessment_date ? (
                            <>
                              {new Date(u.assessment_date).toLocaleDateString("en-MY", { day: "2-digit", month: "short", year: "numeric" })}
                              <br />
                              <span className="text-[#022f42]/30">{new Date(u.assessment_date).toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" })}</span>
                            </>
                          ) : (
                            <span className="text-[#022f42]/30">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#022f42]/50 text-xs whitespace-nowrap">
                          {new Date(u.created_at).toLocaleDateString("en-MY", { day: "2-digit", month: "short", year: "numeric" })}
                          <br />
                          <span className="text-[#022f42]/30">{new Date(u.created_at).toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" })}</span>
                        </td>
                        <td className="px-4 py-3">
                          {u.report_id ? (
                            <a href={`/report/${u.report_id}`} target="_blank" rel="noreferrer" className="text-[#022f42]/50 hover:text-[#022f42] transition-colors flex items-center gap-1 text-xs font-bold">
                              <FileText size={12} /> View
                            </a>
                          ) : (
                            <span className="text-[#022f42]/20"><ExternalLink size={12} /></span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Orphan Reports (Guest Users) */}
        {orphanReports.length > 0 && (
          <div className="bg-white border-2 border-[#022f42]/5 shadow-sm overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-[#022f42]/5">
              <h2 className="text-sm font-black text-[#022f42] uppercase tracking-widest">Guest Reports (Unlinked)</h2>
              <p className="text-[10px] text-[#022f42]/40 mt-1">Reports from users who completed the QuickAssess without logging in.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#022f42]/3 border-b border-[#022f42]/5">
                    {["#", "Report ID", "Score", "Band", "Date", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] font-black text-[#022f42]/40 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orphanReports.map((r, i) => (
                    <tr key={r.id} className="border-b border-[#022f42]/5 hover:bg-[#022f42]/2 transition-colors">
                      <td className="px-4 py-3 text-[#022f42]/30 text-xs font-mono">{i + 1}</td>
                      <td className="px-4 py-3 text-[#022f42]/60 text-xs font-mono">{r.id.slice(0, 8)}…</td>
                      <td className="px-4 py-3">{getScoreBadge(r.score, r.band)}</td>
                      <td className="px-4 py-3 text-[#022f42]/60">{r.band}</td>
                      <td className="px-4 py-3 text-[#022f42]/50 text-xs whitespace-nowrap">
                        {new Date(r.created_at).toLocaleDateString("en-MY", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <a href={`/report/${r.id}`} target="_blank" rel="noreferrer" className="text-[#022f42]/50 hover:text-[#022f42] transition-colors flex items-center gap-1 text-xs font-bold">
                          <FileText size={12} /> View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Env Status Card */}
        <div className="mt-6 bg-[#022f42] text-white p-6 shadow-xl">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#ffd800] mb-4">Environment Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {[
              { label: "TELEGRAM_BOT_TOKEN", ok: true },
              { label: "TELEGRAM_ADMIN_CHAT_ID", ok: true },
              { label: "RESEND_API_KEY", ok: true },
              { label: "SUPABASE_SERVICE_ROLE_KEY", ok: true },
              { label: "ANTHROPIC_API_KEY", ok: true },
            ].map(env => (
              <div key={env.label} className="flex items-center gap-2">
                {env.ok ? <CheckCircle size={12} className="text-emerald-400 shrink-0" /> : <XCircle size={12} className="text-red-400 shrink-0" />}
                <span className="text-white/60 font-mono">{env.label}</span>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-[10px] mt-4 uppercase tracking-widest">Note: Use the &quot;Test Telegram&quot; button above to verify live connectivity.</p>
        </div>
      </div>
    </div>
  );
}
