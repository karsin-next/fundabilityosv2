"use client";

import { DynamicAuditComponent } from "@/components/assessment/DynamicAuditComponent";
import { Banknote, ArrowLeft, BookOpen, TrendingDown } from "lucide-react";
import Link from "next/link";

/**
 * Module 1.1.9 Financial Snapshot
 * Captures key financial metrics: MRR, burn rate, cash balance → auto-calculates runway
 */
export default function FinancialSnapshotPage() {
  const initialSeedOptions = [
    { id: "opt-1", label: "Generating >$10k MRR with healthy gross margins (>60%)", value: 90 },
    { id: "opt-2", label: "Generating $1k–$10k MRR, unit economics still developing", value: 65 },
    { id: "opt-3", label: "Pre-revenue but strong LOIs or pilot contracts signed", value: 35 },
    { id: "opt-4", label: "Pre-revenue with no committed customers yet", value: 10 },
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
            <Banknote className="w-6 h-6" />
          </div>
        <h1 className="text-3xl font-black text-[#022f42] uppercase tracking-tighter">
            1.1.9 Financial Snapshot
            <span className="block text-[11px] text-[#022f42]/40 tracking-widest mt-1">Snapshot Kewangan</span>
          </h1>
        </div>
        <p className="text-sm text-[#1e4a62] font-medium leading-relaxed max-w-2xl">
          Investors scrutinise your financial health before anything else. This module captures your
          monthly revenue, burn rate, and cash position so we can calculate your real runway and
          flag any red flags before they see your deck.
          <br /><br />
          <span className="italic text-[#022f42]/50 text-[13px]">Pelabur akan meneliti kesihatan kewangan anda terlebih dahulu. Modul ini merekodkan hasil bulanan, kadar perbelanjaan (burn rate), dan kedudukan tunai anda untuk mengira baki tempoh operasi (runway) dan mengenal pasti sebarang risiko sebelum pelabur melihat dek pembentangan anda.</span>
        </p>
      </div>

      <div className="space-y-8">
        <DynamicAuditComponent
          moduleId="9-financial"
          moduleContext="Financial Snapshot — assess monthly revenue (MRR), monthly burn rate, current cash balance, and overall financial runway. Calculate if the startup is default alive or default dead."
          maxQuestions={5}
          initialQuestion={{
            questionTitle:
              "Where does your monthly revenue stand right now?",
            options: initialSeedOptions,
            placeholder:
              "Share your current MRR, gross margins if known, and the primary revenue driver. Include any seasonal patterns or one-off spikes.",
          }}
        />

        {/* Context Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-[#022f42] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingDown size={60} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffd800] mb-4">
              Investor Lens | Lensa Pelabur
            </h4>
            <p className="text-xs leading-relaxed text-[#b0d0e0] font-medium uppercase tracking-tight">
              &quot;Default Alive or Default Dead? If you stop fundraising today, does the business survive
              on current revenue? If not, how many months do you have?&quot;
              <br /><br />
              <span className="text-[10px] text-[#ffd800]/60">Sekiranya anda berhenti mengumpul dana hari ini, adakah perniagaan anda dapat bertahan dengan hasil sedia ada? Jika tidak, berapa bulan lagi anda mampu bertahan?</span>
            </p>
          </div>

          <div className="bg-white border-2 border-[#022f42]/5 p-8 flex flex-col justify-between group cursor-pointer hover:border-[#022f42]/20 transition-all">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-[#022f42]" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#022f42]">
                  Key Metrics
                </h4>
              </div>
              <p className="text-sm font-bold text-[#022f42] mb-2">
                Runway = Cash Balance ÷ Monthly Burn
              </p>
              <p className="text-[11px] text-[#1e4a62]/60 font-medium">
                Have your MRR, monthly burn, and current cash balance handy before answering.
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
