"use client";

import { PredictiveAuditQuestion } from "@/components/assessment/PredictiveAuditQuestion";
import { Globe, ArrowLeft, Target, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function MarketDiagnosticPage() {
  const marketOptions = [
    { id: "opt-1", label: "Explosive Growth / Structural Shift (AI, Sustainability, RegTech - High Urgency)", value: 90 },
    { id: "opt-2", label: "Large Stable Market (Established industry ripe for digital disruption)", value: 75 },
    { id: "opt-3", label: "Niche with High Expansion Potential (Small initial focus, huge adjacencies)", value: 70 },
    { id: "opt-4", label: "Highly Targeted / Specialized (Low competition, but limited total ceiling)", value: 45 },
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
            <Globe className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-[#022f42] uppercase tracking-tighter">1.1.5 Market Opportunity</h1>
        </div>
        <p className="text-sm text-[#1e4a62] font-medium leading-relaxed max-w-2xl">
          Market size dictates your potential return. This module analyzes your TAM, SAM, and SOM, and more importantly, why the time to invest is *now*.
        </p>
      </div>

      <div className="space-y-8">
        <PredictiveAuditQuestion
          moduleId="5-market"
          questionTitle="How do you characterize the 'Timing' and 'Magnitude' of your market opportunity?"
          options={marketOptions}
          placeholder="What is the 'Why Now?' factor? Is there a regulatory change, a technical breakthrough, or a cultural shift making your solution inevitable?"
          onSave={(data) => console.log("Market diagnostic saved", data)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-[#022f42] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Target size={60} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffd800] mb-4">Investor Lens</h4>
            <p className="text-xs leading-relaxed text-[#b0d0e0] font-medium uppercase tracking-tight">
              &quot;Can this company reach $100M ARR in 5-7 years? Is the market large enough to support a venture-scale exit?&quot;
            </p>
          </div>

          <div className="bg-white border-2 border-[#022f42]/5 p-8 flex flex-col justify-between group cursor-pointer hover:border-[#022f42]/20 transition-all">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-[#022f42]" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#022f42]">Academy Resource</h4>
              </div>
              <p className="text-sm font-bold text-[#022f42] mb-2 group-hover:text-[#ffd800] transition-colors">Market Sizing for Startups</p>
              <p className="text-[11px] text-[#1e4a62]/60 font-medium">How to calculate a credible TAM that investors actually believe.</p>
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
