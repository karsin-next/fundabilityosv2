"use client";

import { PredictiveAuditQuestion } from "@/components/assessment/PredictiveAuditQuestion";
import { BarChart3, ArrowLeft, Target, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function RevenueDiagnosticPage() {
  const revenueOptions = [
    { id: "opt-1", label: "Pure SaaS / Recurring (High predictability, low churn, high valuation multiples)", value: 95 },
    { id: "opt-2", label: "Usage-Based / Transactional (Scale-leveraged, variable but high volume)", value: 80 },
    { id: "opt-3", label: "Marketplace / Commission (High network effects, zero inventory risk)", value: 85 },
    { id: "opt-4", label: "Project-Based / Enterprise Professional Services (Lumpy, low multiples)", value: 40 },
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
            <BarChart3 className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-[#022f42] uppercase tracking-tighter">1.1.7 Revenue Model Explorer</h1>
        </div>
        <p className="text-sm text-[#1e4a62] font-medium leading-relaxed max-w-2xl">
          Not all dollars are created equal. This module analyzes your pricing power, unit economics, and the durability of your revenue streams.
        </p>
      </div>

      <div className="space-y-8">
        <PredictiveAuditQuestion
          moduleId="7-revenue"
          questionTitle="How would you characterize the 'Durability' and 'Predictability' of your primary revenue stream?"
          options={revenueOptions}
          placeholder="How much does it cost you to acquire $1 of revenue (CAC)? What is your gross margin, and how do you plan to scale without hiring linearly?"
          onSave={(data) => console.log("Revenue diagnostic saved", data)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-[#022f42] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Target size={60} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffd800] mb-4">Investor Lens</h4>
            <p className="text-xs leading-relaxed text-[#b0d0e0] font-medium uppercase tracking-tight">
              &quot;Can this business reach breakeven? Is the LTV/CAC ratio healthy enough to justify a massive marketing spend?&quot;
            </p>
          </div>

          <div className="bg-white border-2 border-[#022f42]/5 p-8 flex flex-col justify-between group cursor-pointer hover:border-[#022f42]/20 transition-all">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-[#022f42]" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#022f42]">Academy Resource</h4>
              </div>
              <p className="text-sm font-bold text-[#022f42] mb-2 group-hover:text-[#ffd800] transition-colors">Unit Economics 101</p>
              <p className="text-[11px] text-[#1e4a62]/60 font-medium">Why LTV/CAC is the most important metric in your pitch deck.</p>
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
