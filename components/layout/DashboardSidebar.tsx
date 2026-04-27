/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Lightbulb, User, Swords, Package, Globe, TrendingUp,
  DollarSign, HeartHandshake, Banknote, Target,
  ChevronRight, Settings, BookOpen, Lock, FileText,
  CheckCircle2, Database, X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { createClient } from "@/lib/supabase/client";

/** All 10 audit modules */
const AUDIT_MODULES = [
  { id: "1-problem",    name: "1.1.1 Problem & Hypothesis",          href: "/dashboard/audit/1-problem",     icon: Lightbulb },
  { id: "2-customer",   name: "1.1.2 Customer Persona",               href: "/dashboard/audit/2-customer",    icon: User },
  { id: "3-competitor", name: "1.1.3 Competitor Analysis",            href: "/dashboard/audit/3-competitor",  icon: Swords },
  { id: "4-product",    name: "1.1.4 Product Readiness",              href: "/dashboard/audit/4-product",     icon: Package },
  { id: "5-market",     name: "1.1.5 Market Opportunity",             href: "/dashboard/audit/5-market",      icon: Globe },
  { id: "6-pmf",        name: "1.1.6 Product-Market Fit & Traction",  href: "/dashboard/audit/6-pmf",         icon: TrendingUp },
  { id: "7-revenue",    name: "1.1.7 Revenue Model Explorer",         href: "/dashboard/audit/7-revenue",     icon: DollarSign },
  { id: "8-team",       name: "1.1.8 Team Composition Audit",         href: "/dashboard/audit/8-team",        icon: HeartHandshake },
  { id: "9-financial",  name: "1.1.9 Financial Snapshot",             href: "/dashboard/audit/9-financial",   icon: Banknote },
  { id: "10-fundraising", name: "1.1.10 Fundraising Ask",             href: "/dashboard/audit/10-fundraising", icon: Target },
];

/**
 * Progress ring SVG drawn inline — avoids extra deps.
 * @param progress - 0 to 1
 */
function ProgressRing({ progress, done, total }: { progress: number; done: number; total: number }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ - progress * circ;
  return (
    <div className="flex flex-col items-center gap-1.5 py-4">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r={r} strokeWidth="5" stroke="rgba(255,255,255,0.07)" fill="none" />
          <circle
            cx="28" cy="28" r={r} strokeWidth="5"
            stroke="#ffd800" fill="none"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-black text-white leading-none">{done}</span>
          <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">/{total}</span>
        </div>
      </div>
      <p className="text-[9px] font-black uppercase tracking-widest text-[#b0d0e0]/60">
        {done === total ? "✦ All Complete" : `${total - done} remaining`}
      </p>
    </div>
  );
}

/** Teaser modal for locked features */
function DataRoomModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022f42]/95 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#022f42]/30 hover:text-[#022f42] transition-colors"
        >
          <X size={18} />
        </button>
        <div className="w-14 h-14 bg-[#022f42] text-[#ffd800] flex items-center justify-center mb-6 mx-auto">
          <Database size={28} />
        </div>
        <h3 className="text-xl font-black text-[#022f42] uppercase tracking-tight text-center mb-3">
          Data Room Accelerator
        </h3>
        <p className="text-sm text-[#022f42]/60 font-medium leading-relaxed text-center mb-6">
          Organize, share, and permission-control your investor documents with a single link.
          Track who viewed what — and for how long.
        </p>
        <div className="space-y-3 mb-8">
          {["Structured document templates", "Investor access tracking", "Version-controlled uploads", "One-click NDA gating"].map(f => (
            <div key={f} className="flex items-center gap-3 text-sm text-[#022f42]/70 font-medium">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              {f}
            </div>
          ))}
        </div>
        <a
          href="mailto:hello@nextblaze.asia?subject=Data Room Accelerator Waitlist"
          className="block w-full bg-[#ffd800] text-[#022f42] font-black text-[11px] uppercase tracking-widest py-3.5 text-center hover:bg-[#022f42] hover:text-[#ffd800] transition-all"
        >
          Join the Waitlist
        </a>
        <p className="text-[10px] text-[#022f42]/30 text-center mt-3 font-medium">
          Coming Soon · Early access to founding members
        </p>
      </div>
    </div>
  );
}

/**
 * DashboardSidebar
 * Streamlined navigation: 10-module audit, report, data-room placeholder, settings, logout.
 * Fetches module completion state from audit_responses.
 */
export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useUser();
  const supabase = createClient();

  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [auditOpen, setAuditOpen] = useState(true);
  const [showDataRoom, setShowDataRoom] = useState(false);

  // Fetch completion state
  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("audit_responses")
      .select("module_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setCompletedIds(new Set(data.map((r: any) => r.module_id)));
      });
  }, [user?.id]);

  // Auto-expand audit section when on an audit page
  useEffect(() => {
    if (pathname.startsWith("/dashboard/audit")) setAuditOpen(true);
  }, [pathname]);

  const doneCount = AUDIT_MODULES.filter(m => completedIds.has(m.id)).length;
  const isActive = (href: string) => pathname === href;

  return (
    <>
      {showDataRoom && <DataRoomModal onClose={() => setShowDataRoom(false)} />}

      <aside className="w-64 bg-[#022f42] border-r border-[#1b4f68] hidden md:flex flex-col flex-shrink-0 min-h-screen sticky top-0 overflow-y-auto">
        <div className="flex-1 py-5 flex flex-col">

          {/* ── Logo / Brand ── */}
          <div className="px-4 mb-2">
            <Link href="/dashboard" className="block">
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffd800]">FundabilityOS</div>
              <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest">by NextBlaze</div>
            </Link>
          </div>

          {/* ── User Identity ── */}
          <div className="px-4 mb-4">
            <div className="bg-white/5 border border-[#1b4f68] p-3 rounded-sm">
              <div className="w-8 h-8 bg-[#ffd800] text-[#022f42] rounded-sm font-black flex items-center justify-center text-lg mb-2 shadow-sm">
                {(user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "F").toUpperCase()}
              </div>
              <h2 className="text-sm font-bold text-white leading-tight truncate">
                {user?.user_metadata?.full_name || "Founder"}
              </h2>
              {user?.email && (
                <p className="text-[9px] text-white/50 truncate leading-tight mt-1 font-mono">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          {/* ── Progress Ring ── */}
          <ProgressRing progress={doneCount / AUDIT_MODULES.length} done={doneCount} total={AUDIT_MODULES.length} />

          <nav className="flex-1 px-3 space-y-1">

            {/* ─── Section 1: Dashboard Hub ─── */}
            <Link
              href="/dashboard"
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-[12px] font-bold transition-colors mb-3 ${
                isActive("/dashboard")
                  ? "bg-[#1b4f68] text-[#ffd800]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Target className="w-3.5 h-3.5 shrink-0" />
              Dashboard
            </Link>

            {/* ─── 10 Audit Modules ─── */}
            <div className="mb-3">
              <button
                onClick={() => setAuditOpen(o => !o)}
                className="w-full flex items-center justify-between px-1 mb-1 group"
              >
                <span className="text-[9px] font-black uppercase tracking-widest text-[#b0d0e0]/60 group-hover:text-[#b0d0e0] transition-colors">
                  Fundability Audit
                </span>
                <ChevronRight
                  className={`w-3 h-3 text-[#b0d0e0]/30 transition-transform duration-300 ${auditOpen ? "rotate-90 text-[#ffd800]" : ""}`}
                />
              </button>

              <div
                className={`space-y-0.5 overflow-hidden transition-all duration-300 ${
                  auditOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                }`}
              >
                {AUDIT_MODULES.map(mod => {
                  const active = isActive(mod.href);
                  const done = completedIds.has(mod.id);
                  return (
                    <Link
                      key={mod.id}
                      href={mod.href}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-sm text-[11px] transition-colors group ${
                        active
                          ? "bg-[#1b4f68] text-[#ffd800] font-black"
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <mod.icon className={`w-3 h-3 shrink-0 ${active ? "text-[#ffd800]" : done ? "text-emerald-400" : "text-white/30"}`} />
                        <span className="truncate">{mod.name}</span>
                      </div>
                      {done && !active && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 ml-1" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ─── Divider ─── */}
            <div className="border-t border-[#1b4f68]/50 my-3" />

            {/* ─── Report Section ─── */}
            <div className="mb-1">
              <div className="text-[9px] font-black uppercase tracking-widest text-[#b0d0e0]/60 px-1 mb-1">
                Report
              </div>
              <Link
                href="/dashboard/report"
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-[12px] font-bold transition-colors ${
                  pathname.startsWith("/dashboard/report")
                    ? "bg-[#1b4f68] text-[#ffd800]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                Generate &amp; View Reports
              </Link>
            </div>

            {/* ─── Divider ─── */}
            <div className="border-t border-[#1b4f68]/50 my-3" />

            {/* ─── Data Room Accelerator (Locked) ─── */}
            <button
              onClick={() => setShowDataRoom(true)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-[12px] font-bold text-white/30 hover:text-white/50 transition-colors group text-left"
            >
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>Data Room Accelerator</span>
              <span className="ml-auto text-[7px] font-black uppercase tracking-widest text-[#ffd800]/50 bg-[#ffd800]/10 px-1.5 py-0.5 rounded-sm shrink-0">
                Soon
              </span>
            </button>

            {/* ─── Divider ─── */}
            <div className="border-t border-[#1b4f68]/50 my-3" />

            {/* ─── Academy ─── */}
            <Link
              href="/academy"
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-[12px] font-bold transition-colors ${
                pathname.startsWith("/academy")
                  ? "bg-[#1b4f68] text-[#ffd800]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              Fundability Academy
            </Link>

            {/* ─── Settings ─── */}
            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-[12px] font-bold transition-colors ${
                isActive("/dashboard/settings")
                  ? "bg-[#1b4f68] text-[#ffd800]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Settings className="w-3.5 h-3.5 shrink-0" />
              Settings
            </Link>
          </nav>
        </div>

        {/* ── Bottom Actions ── */}
        <div className="p-4 border-t border-[#1b4f68]/50 space-y-2">
          <Link
            href="/donate"
            className="w-full bg-[#ffd800] hover:bg-[#ffd800]/90 text-[#022f42] transition-colors rounded-sm py-2.5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-sm"
          >
            <HeartHandshake className="w-4 h-4" /> Support Us
          </Link>
          <button
            onClick={async () => { await signOut(); window.location.href = "/login"; }}
            className="w-full bg-[#1b4f68]/20 hover:bg-red-500/10 hover:text-red-400 text-white/50 transition-colors border border-white/5 rounded-sm py-2.5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
