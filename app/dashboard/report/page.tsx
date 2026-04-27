"use client";

import { useState, useEffect } from "react";
import { 
  FileText, Sparkles, Loader2, Lock, CheckCircle2, 
  ArrowRight, Download, Share2, AlertTriangle, ShieldCheck
} from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import { loadStripe } from "@stripe/stripe-js";

export default function ReportPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [report, setReport] = useState<any>(null);
  const [latestReportId, setLatestReportId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      setLoading(true);

      // 1. Check completed modules
      const { data: responses } = await supabase
        .from("audit_responses")
        .select("module_id")
        .eq("user_id", user.id);
      
      if (responses) {
        setCompletedModules(responses.map(r => r.module_id));
      }

      // 2. Check for existing investor report
      const { data: latest } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (latest) {
        setLatestReportId(latest.id);
        if (latest.investor_report_json) {
          setReport(latest);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [user]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/dashboard/generate-report", { method: "POST" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      // Refresh to get the updated report
      const { data: updated } = await supabase
        .from("reports")
        .select("*")
        .eq("id", latestReportId)
        .single();
      
      setReport(updated);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handlePayment = async () => {
    try {
      const res = await fetch("/api/stripe/checkout-investor-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: latestReportId, userId: user?.id })
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#022f42]/10 mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-[#022f42]/40">Loading Report Status...</p>
      </div>
    );
  }

  const isReady = completedModules.length >= 5;
  const isUnlocked = report?.investor_report_unlocked;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#022f42] text-[#ffd800] flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-[#022f42] uppercase tracking-tighter">Investor-Ready Report</h1>
        </div>
        <p className="text-sm text-[#1e4a62] font-medium leading-relaxed max-w-2xl">
          A high-conviction narrative consolidated from your 10-module audit. Designed to answer the &quot;Why Now?&quot; and &quot;How?&quot; questions institutional investors ask first.
        </p>
      </div>

      {!report && (
        <div className="bg-white border-2 border-[#022f42]/5 p-12 text-center flex flex-col items-center">
          <Sparkles className="w-12 h-12 text-[#ffd800] mb-6" />
          <h2 className="text-xl font-black text-[#022f42] uppercase tracking-tight mb-4">
            Consolidate Your Audit Data
          </h2>
          <p className="text-sm text-[#1e4a62]/60 font-medium max-w-md mx-auto mb-10 leading-relaxed">
            Ready to see the big picture? Our AI will analyze your {completedModules.length} completed modules and the landing page results to build a professional narrative.
          </p>

          <div className="mb-10 w-full max-w-sm space-y-3">
             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#022f42]/40">
                <span>Progress</span>
                <span>{completedModules.length} / 10 Modules</span>
             </div>
             <div className="w-full h-2 bg-[#022f42]/5 overflow-hidden">
                <div 
                  className="h-full bg-[#ffd800] transition-all duration-1000"
                  style={{ width: `${(completedModules.length / 10) * 100}%` }}
                />
             </div>
             {completedModules.length < 5 && (
               <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                 <AlertTriangle size={10} /> Complete at least 5 modules to generate
               </p>
             )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={!isReady || generating}
            className={`px-10 py-5 font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 ${
              !isReady || generating
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#022f42] text-[#ffd800] hover:bg-[#ffd800] hover:text-[#022f42] shadow-xl"
            }`}
          >
            {generating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing 10-Module Dataset...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Generate Full Narrative Report</>
            )}
          </button>
        </div>
      )}

      {report && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Action Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#022f42] p-6 text-white border-b-8 border-[#ffd800]">
             <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-[#ffd800] mb-1">Status: {isUnlocked ? "UNLOCKED" : "PREVIEW MODE"}</h2>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Version 1.0 (Draft)</p>
             </div>
             <div className="flex gap-3">
               {!isUnlocked ? (
                 <button 
                  onClick={handlePayment}
                  className="bg-[#ffd800] text-[#022f42] px-8 py-3.5 font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg flex items-center gap-2"
                 >
                   <Lock size={14} /> Remove Watermark & Unlock PDF — $9
                 </button>
               ) : (
                 <>
                   <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2">
                     <Download size={14} /> Download PDF
                   </button>
                   <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2">
                     <Share2 size={14} /> Share Link
                   </button>
                 </>
               )}
             </div>
          </div>

          <div className="relative">
            {/* Watermark Overlay */}
            {!isUnlocked && (
              <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden select-none flex flex-col items-center justify-center gap-20 opacity-[0.03]">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="text-8xl font-black uppercase tracking-[0.5em] -rotate-45 whitespace-nowrap">
                    FUNDABILITY PREVIEW
                  </div>
                ))}
              </div>
            )}

            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${!isUnlocked ? "blur-[1px]" : ""}`}>
              
              {/* Main Report Column */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Executive Summary */}
                <div className="bg-white border-2 border-[#022f42]/5 p-10">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#022f42]/30 mb-6">Executive Summary</h3>
                   <div className="text-lg font-black text-[#022f42] leading-tight uppercase tracking-tight mb-6">
                     {report.investor_report_json.report_title}
                   </div>
                   <p className="text-sm text-[#1e4a62] font-medium leading-relaxed whitespace-pre-wrap">
                     {report.investor_report_json.executive_summary}
                   </p>
                </div>

                {/* Narrative Sections */}
                {report.investor_report_json.sections.map((section: any, i: number) => (
                  <div key={i} className="bg-white border-2 border-[#022f42]/5 p-10">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#022f42] mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#ffd800]" /> {section.title}
                    </h4>
                    <p className="text-sm text-[#1e4a62]/80 font-medium leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Sidebar Column */}
              <div className="space-y-8">
                
                {/* Score Card */}
                <div className="bg-[#022f42] p-8 text-center text-white border-b-4 border-[#ffd800]">
                  <div className="text-5xl font-black mb-2">{report.investor_report_json.score}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#ffd800] mb-6">Fundability Index</div>
                  <div className="bg-white/5 border border-white/10 p-4">
                    <div className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Band</div>
                    <div className="text-xs font-black uppercase tracking-widest">{report.investor_report_json.band}</div>
                  </div>
                </div>

                {/* Strengths */}
                <div className="bg-white border-2 border-[#022f42]/5 p-8">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-6 flex items-center gap-2">
                     <ShieldCheck size={16} /> Top 3 Strengths
                   </h4>
                   <div className="space-y-4">
                     {report.investor_report_json.strengths.map((s: string, i: number) => (
                       <div key={i} className="flex gap-3">
                         <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                         <span className="text-[11px] font-bold text-[#022f42] leading-relaxed uppercase tracking-tight">{s}</span>
                       </div>
                     ))}
                   </div>
                </div>

                {/* Gaps & Insights */}
                <div className="bg-white border-2 border-[#022f42]/5 p-8">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-6 flex items-center gap-2">
                     <AlertTriangle size={16} /> Critical Gaps
                   </h4>
                   <div className="space-y-6">
                     {report.investor_report_json.gaps.map((g: any, i: number) => (
                       <div key={i} className="space-y-2">
                         <div className="flex gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                           <span className="text-[11px] font-black text-[#022f42] uppercase tracking-tight">{g.gap}</span>
                         </div>
                         <div className="pl-4 border-l-2 border-[#ffd800] py-1">
                           <p className="text-[10px] font-bold text-[#022f42]/40 uppercase tracking-widest mb-1">Actionable Insight:</p>
                           <p className="text-[11px] font-medium text-[#1e4a62]/70 leading-relaxed">{g.insight}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>

                {/* Verdict */}
                <div className="p-8 bg-[#ffd800]/5 border-2 border-[#ffd800]/20">
                   <h4 className="text-[9px] font-black uppercase tracking-widest text-[#022f42]/40 mb-3">Analyst Verdict</h4>
                   <p className="text-xs font-black text-[#022f42] italic leading-relaxed">
                     &quot;{report.investor_report_json.investor_verdict}&quot;
                   </p>
                </div>

              </div>
            </div>

            {/* Overlay CTA if locked */}
            {!isUnlocked && (
              <div className="absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-white via-white/90 to-transparent z-20 flex flex-col items-center justify-end pb-12">
                 <button 
                   onClick={handlePayment}
                   className="bg-[#022f42] text-[#ffd800] px-12 py-6 font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex flex-col items-center gap-1"
                 >
                   <span>Unlock Full Branded Report</span>
                   <span className="text-[8px] opacity-60">One-time payment of $9</span>
                 </button>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
