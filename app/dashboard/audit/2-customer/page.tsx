"use client";

import { DynamicAuditComponent } from "@/components/assessment/DynamicAuditComponent";
import { Users, ArrowLeft, Target, BookOpen } from "lucide-react";
import Link from "next/link";

export default function CustomerDiagnosticPage() {
  const customerOptions = [
    { id: "opt-1", label: "Institutional / Enterprise (Budget holder, complex procurement, high LTV)", value: 85 },
    { id: "opt-2", label: "Mid-Market / SMB Business Owner (Focused on immediate ROI and efficiency)", value: 75 },
    { id: "opt-3", label: "Individual Power User (Utility-driven, low sales friction, high churn risk)", value: 50 },
    { id: "opt-4", label: "Early Adopter / Innovator (Experimental budget, helps refine roadmap)", value: 65 },
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
            <Users className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-[#022f42] uppercase tracking-tighter">1.1.2 Customer Clarity Scan</h1>
        </div>
        <p className="text-sm text-[#1e4a62] font-medium leading-relaxed max-w-2xl">
          If you solve a problem for everyone, you solve it for no one. This module validates your ICP (Ideal Customer Profile) and their willingness to pay.
        </p>
      </div>

      <div className="space-y-8">
        <DynamicAuditComponent
          moduleId="2-customer"
          moduleContext="Validating ICP maturity and enterprise value."
          maxQuestions={5}
          initialQuestion={{
            questionTitle: "Who specifically is the economic buyer, and what strict KPI triggers their purchase decision?",
            options: customerOptions,
            placeholder: "Describe their job title, their biggest professional KPI, and why they would choose 'now' to buy your solution."
          }}
        />

        {/* Supporting Context Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-[#022f42] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Target size={60} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffd800] mb-4">Investor Lens</h4>
            <p className="text-xs leading-relaxed text-[#b0d0e0] font-medium uppercase tracking-tight">
              &quot;Does the founder understand the difference between the User and the Buyer? Is the sales cycle repeatable, or is every deal a custom project?&quot;
            </p>
          </div>

          <div className="bg-white border-2 border-[#022f42]/5 p-8 flex flex-col justify-between group cursor-pointer hover:border-[#022f42]/20 transition-all">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-[#022f42]" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#022f42]">Academy Resource</h4>
              </div>
              <p className="text-sm font-bold text-[#022f42] mb-2 group-hover:text-[#ffd800] transition-colors">ICP & Market Sizing Guide</p>
              <p className="text-[11px] text-[#1e4a62]/60 font-medium">How to prove a massive TAM using bottom-up customer data.</p>
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

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
