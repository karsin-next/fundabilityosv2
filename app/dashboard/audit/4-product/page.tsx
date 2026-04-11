"use client";

import { DynamicAuditComponent } from "@/components/assessment/DynamicAuditComponent";
import { Package, ArrowLeft, Target, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ProductDiagnosticPage() {
  const productOptions = [
    { id: "opt-1", label: "Live with Paying Customers (Validated market demand and functionality)", value: 95 },
    { id: "opt-2", label: "Public Beta / Active Free Users (Proven engagement, pre-monetization)", value: 75 },
    { id: "opt-3", label: "Closed MVP / Internal Pilot (Functionality proven in controlled environment)", value: 55 },
    { id: "opt-4", label: "Technical Prototype / Mockups (Validation is primarily theoretical)", value: 30 },
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
            <Package className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-[#022f42] uppercase tracking-tighter">1.1.4 Product Readiness</h1>
        </div>
        <p className="text-sm text-[#1e4a62] font-medium leading-relaxed max-w-2xl">
          Product-market fit starts with a product that actually works. This module assesses your technical maturity and the &quot;Magic Moment&quot; your users experience.
        </p>
      </div>

      <div className="space-y-8">
        <DynamicAuditComponent
          moduleId="4-product"
          moduleContext="Execution velocity and scalability risk."
          maxQuestions={5}
          initialQuestion={{
            questionTitle: "What is the primary technical or operational bottleneck preventing you from scaling 10x right now?",
            options: productOptions,
            placeholder: "Describe the core technical risk. Is it architecture, hiring, or dependencies on third-party platforms?"
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-[#022f42] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Target size={60} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffd800] mb-4">Investor Lens</h4>
            <p className="text-xs leading-relaxed text-[#b0d0e0] font-medium uppercase tracking-tight">
              &quot;Is this a technical risk or a market risk? Can the team actually build what they promise, and is the product sticky enough to retain users?&quot;
            </p>
          </div>

          <div className="bg-white border-2 border-[#022f42]/5 p-8 flex flex-col justify-between group cursor-pointer hover:border-[#022f42]/20 transition-all">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-[#022f42]" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#022f42]">Academy Resource</h4>
              </div>
              <p className="text-sm font-bold text-[#022f42] mb-2 group-hover:text-[#ffd800] transition-colors">MVP to Scale Roadmap</p>
              <p className="text-[11px] text-[#1e4a62]/60 font-medium">Prioritizing features that drive fundability and user retention.</p>
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
