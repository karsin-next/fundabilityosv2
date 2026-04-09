"use client";

import { PredictiveAuditQuestion } from "@/components/assessment/PredictiveAuditQuestion";
import { TrendingUp, ArrowLeft, Target, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function PMFDiagnosticPage() {
  const pmfOptions = [
    { id: "opt-1", label: "Paid Contracts / Revenue Backlog (Commercial validation with high intent)", value: 95 },
    { id: "opt-2", label: "High User Retention & Active Usage (DAU/MAU ratios > 40%)", value: 80 },
    { id: "opt-3", label: "Viral Referral / Organic Word-of-Mouth (Negative churn and low CAC)", value: 85 },
    { id: "opt-4", label: "Qualitative Praise / Pilot Interest (Subjective validation, high potential)", value: 50 },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#022f42]/40 hover:text-[#022f42] transition-colors mb-6"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Audit Hub
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#022f42] text-[#ffd800] flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-[#022f42] uppercase tracking-tighter">1.1.6 Product‑Market Fit Probe</h1>
        </div>
        <p className="text-sm text-[#1e4a62] font-medium leading-relaxed max-w-2xl">
          PMF isn&apos;t a binary switch; it&apos;s a spectrum of &quot;Pull&quot;. This module evaluates if the market is actually pulling the product out of your hands.
        </p>
      </div>

      <div className="space-y-8">
        <PredictiveAuditQuestion
          moduleId="6-pmf"
          questionTitle="What is the strongest quantitative signal of 'Product-Market Pull' you are observing?"
          options={pmfOptions}
          placeholder="If you turned off all paid marketing today, what would happen to your growth? Describe your most successful case study or customer success story."
          onSave={(data) => console.log("PMF diagnostic saved", data)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-[#022f42] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Target size={60} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffd800] mb-4">Investor Lens</h4>
            <p className="text-xs leading-relaxed text-[#b0d0e0] font-medium uppercase tracking-tight">
              &quot;Are they pushing the product, or is the market pulling it? If customers are willing to pay for a buggy MVP, they have a real problem.&quot;
            </p>
          </div>

          <div className="bg-white border-2 border-[#022f42]/5 p-8 flex flex-col justify-between group cursor-pointer hover:border-[#022f42]/20 transition-all">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-[#022f42]" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#022f42]">Academy Resource</h4>
              </div>
              <p className="text-sm font-bold text-[#022f42] mb-2 group-hover:text-[#ffd800] transition-colors">The PMF Calibration Guide</p>
              <p className="text-[11px] text-[#1e4a62]/60 font-medium">Measuring engagement metrics that actually matter to Series A investors.</p>
            </div>
            <Link href="/academy" className="mt-6 text-[9px] font-black uppercase tracking-widest text-[#022f42] flex items-center gap-2">
              View Guide <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
