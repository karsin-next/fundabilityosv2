"use client";

import { DynamicAuditComponent } from "@/components/assessment/DynamicAuditComponent";
import { Users, ArrowLeft, Target, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function TeamDiagnosticPage() {
  const teamOptions = [
    { id: "opt-1", label: "Industry Veterans / Domain Experts (Deep connections and proven sector knowledge)", value: 95 },
    { id: "opt-2", label: "Technical Wizards / Creators (High execution velocity, built the core tech)", value: 85 },
    { id: "opt-3", label: "Serial Entrepreneurs (Proven track record of exits or scaling to Series B+)", value: 90 },
    { id: "opt-4", label: "Growth / Sales Oriented (Strong distribution expertise, fast market capture)", value: 70 },
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
          <h1 className="text-3xl font-black text-[#022f42] uppercase tracking-tighter">1.1.8 Team Composition Audit</h1>
        </div>
        <p className="text-sm text-[#1e4a62] font-medium leading-relaxed max-w-2xl">
          At the earliest stages, investors bet on the jockey, not the horse. This module evaluates your team&apos;s &quot;Founder-Market Fit&quot; and your collective ability to execute under pressure.
        </p>
      </div>

      <div className="space-y-8">
        <DynamicAuditComponent
          moduleId="8-team"
          moduleContext="Execution risk and unfair advantages."
          maxQuestions={5}
          initialQuestion={{
            questionTitle: "What critical skill gap currently exists in the founding team that will prevent you from hitting your next milestone?",
            options: teamOptions,
            placeholder: "Don't sell your strengths here. Be honest about your team's execution weakness. What roles do you desperately need capital to hire?"
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-[#022f42] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Target size={60} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffd800] mb-4">Investor Lens</h4>
            <p className="text-xs leading-relaxed text-[#b0d0e0] font-medium uppercase tracking-tight">
              &quot;Does the team have the technical capability and the commercial grit to survive the &apos;Desert of Death&apos;? Do they have a long history together?&quot;
            </p>
          </div>

          <div className="bg-white border-2 border-[#022f42]/5 p-8 flex flex-col justify-between group cursor-pointer hover:border-[#022f42]/20 transition-all">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-[#022f42]" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#022f42]">Academy Resource</h4>
              </div>
              <p className="text-sm font-bold text-[#022f42] mb-2 group-hover:text-[#ffd800] transition-colors">Founder-Market Fit Breakdown</p>
              <p className="text-[11px] text-[#1e4a62]/60 font-medium">How to signal high-trust and high-competence in your bio slides.</p>
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
