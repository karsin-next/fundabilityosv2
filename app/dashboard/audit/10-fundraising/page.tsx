"use client";

import { DynamicAuditComponent } from "@/components/assessment/DynamicAuditComponent";
import { Target, ArrowLeft, BookOpen, DollarSign } from "lucide-react";
import Link from "next/link";

/**
 * Module 1.1.10 Fundraising Ask
 * Captures target raise amount, use-of-funds breakdown, and target close date.
 */
export default function FundraisingAskPage() {
  const initialSeedOptions = [
    { id: "opt-1", label: "Pre-Seed: Under $500k — focused on MVP and initial customers", value: 80 },
    { id: "opt-2", label: "Seed: $500k–$2M — product-market fit and early team scaling", value: 85 },
    { id: "opt-3", label: "Series A: $2M–$10M — revenue scaling and market expansion", value: 90 },
    { id: "opt-4", label: "Series B+: Above $10M — aggressive growth and international", value: 75 },
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
            <Target className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-[#022f42] uppercase tracking-tighter">
            1.1.10 Fundraising Ask
            <span className="block text-[11px] text-[#022f42]/40 tracking-widest mt-1">Permintaan Pendanaan</span>
          </h1>
        </div>
        <p className="text-sm text-[#1e4a62] font-medium leading-relaxed max-w-2xl">
          The fundraising ask is often the most under-prepared slide in a deck. This module forces
          you to define your raise amount, use-of-funds, and target close date with the precision
          investors actually expect.
          <br /><br />
          <span className="italic text-[#022f42]/50 text-[13px]">Permintaan pendanaan sering kali menjadi slaid yang paling kurang bersedia dalam dek pembentangan. Modul ini memaksa anda untuk menentukan jumlah kutipan, penggunaan dana, dan tarikh sasaran penutupan dengan ketepatan yang diharapkan oleh pelabur.</span>
        </p>
      </div>

      <div className="space-y-8">
        <DynamicAuditComponent
          moduleId="10-fundraising"
          moduleContext="Fundraising Ask — establish the target raise amount, the precise use-of-funds breakdown (hiring, product, marketing, ops), the target close date, and how this capital gets the startup to the next funding milestone."
          maxQuestions={5}
          initialQuestion={{
            questionTitle:
              "What funding round are you raising, and how much are you targeting?",
            options: initialSeedOptions,
            placeholder:
              "State the exact amount you are raising and whether you have a lead investor committed. Include your target close date if you have one.",
          }}
        />

        {/* Context Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-[#022f42] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <DollarSign size={60} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffd800] mb-4">
              Investor Lens | Lensa Pelabur
            </h4>
            <p className="text-xs leading-relaxed text-[#b0d0e0] font-medium uppercase tracking-tight">
              &quot;Why this amount? What milestone does it unlock? Can you show me a 24-month model
              that proves this capital gets you to the next fundable moment?&quot;
              <br /><br />
              <span className="text-[10px] text-[#ffd800]/60">Mengapa jumlah ini? Apakah pencapaian yang akan dicapai? Bolehkah anda menunjukkan model 24 bulan yang membuktikan modal ini akan membawa anda ke tahap pendanaan seterusnya?</span>
            </p>
          </div>

          <div className="bg-white border-2 border-[#022f42]/5 p-8 flex flex-col justify-between group cursor-pointer hover:border-[#022f42]/20 transition-all">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-[#022f42]" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#022f42]">
                  Use-of-Funds Framework
                </h4>
              </div>
              <p className="text-sm font-bold text-[#022f42] mb-2">
                Hiring · Product · GTM · Ops
              </p>
              <p className="text-[11px] text-[#1e4a62]/60 font-medium">
                Break your raise into these four buckets with approximate percentages before
                answering for the most detailed AI assessment.
              </p>
            </div>
            <Link
              href="/academy"
              className="mt-6 text-[9px] font-black uppercase tracking-widest text-[#022f42] flex items-center gap-2"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
