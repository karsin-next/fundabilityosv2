import { Zap, PieChart, Activity, Target, Clock, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Methodology | FundabilityOS",
  description: "The 4-pillar methodology behind FundabilityOS.",
};

const pillars = [
  {
    id: "1. DIAGNOSE",
    title: "Establish Baseline",
    icon: Zap,
    description: "Before you pitch, you must understand exactly how investors see you. We expose the hidden gaps in your narrative through a 360° audit.",
    modules: [
      { name: "1.1 360° Fundability Audit", items: ["1.1.1 Problem & Hypothesis (LIVE)", "1.1.2 Personas", "1.1.3 SWOT & Moat", "1.1.4 MVP & Readiness", "1.1.5 TAM / SAM / SOM", "1.1.6 PMF", "1.1.7 Revenue Model", "1.1.8 Founding Team"] },
      { name: "1.2 Live Fundability Score", items: ["Live Calculation Matrix"] },
      { name: "1.3 Gap Analysis Report", items: ["Top 3 Gaps & Actions"] }
    ]
  },
  {
    id: "2. ACTIVATE",
    title: "Financial Foundation",
    icon: PieChart,
    description: "Capital is fuel. You must prove you know how to combust it efficiently. We build your unshakeable financial logic and valuation thesis.",
    modules: [
      { name: "2.1 Manual Financial Input", items: ["Key Metrics", "Breakeven", "Cash Flow"] },
      { name: "2.2 Investor Dashboard", items: ["Runway", "Revenue", "Expense"] },
      { name: "2.3 Unit Economics", items: ["CAC", "LTV", "Gross Margin", "CCC"] },
      { name: "2.4 Fundraising Strategy Canvas", items: ["Capital Needs", "Use of Funds", "Match Type"] },
      { name: "2.5 Data Room Builder", items: ["Structure", "Checklist", "Readiness Score"] }
    ]
  },
  {
    id: "3. ACCELERATE",
    title: "Closing Gaps",
    icon: Activity,
    description: "Knowing your weaknesses isn't enough. You must close them before investors diligence you. We provide the tools and network to do it.",
    modules: [
      { name: "3.1 Gap Closure Workbench", items: ["Action Plan", "Tool Library", "AI Coach"] },
      { name: "3.2 Investor Targeting", items: ["Profile Builder", "Portfolio Match"] },
      { name: "3.3 Visibility & Verification", items: ["Profile Toggle", "Verified Badge"] }
    ]
  },
  {
    id: "4. MASTER",
    title: "Advanced Topics",
    icon: Target,
    description: "When the sheet drops, you must be ready. Simulate the hardest investor questions and negotiate terms from a position of absolute leverage.",
    modules: [
      { name: "4.1 Term Sheet Mastery", items: ["Anatomy", "Valuation Sim", "Liquidation Sim", "Anti-Dilution"] },
      { name: "4.2 Due Diligence Simulator", items: ["Legal", "Financial", "IP Audit", "Mock Q&A"] }
    ]
  }
];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen font-sans bg-[#f2f6fa]">
      <main className="pt-16 md:pt-24 pb-24">
        {/* Hero Section */}
        <section className="px-6 max-w-7xl mx-auto mb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#1e4a62]/10 mb-8 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#ffd800]" />
            <span className="text-xs font-bold text-[#022f42] uppercase tracking-widest">Table 1 Framework</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[#022f42] tracking-tight leading-tight mb-8">
            The Startup-Side <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#022f42] to-[#1b4f68]">Methodology.</span>
          </h1>
          <p className="text-xl text-[#1e4a62] max-w-3xl mx-auto leading-relaxed font-medium">
            FundabilityOS isn&apos;t just software; it&apos;s a strict, 4-pillar methodology engineered to reverse-engineer venture capital decision making.
          </p>
        </section>

        {/* The 4 Pillars */}
        <section className="px-6 max-w-7xl mx-auto space-y-12">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.id} className="bg-white rounded-sm shadow-xl border-t-[6px] border-[#022f42] overflow-hidden flex flex-col lg:flex-row relative group">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-[#f2f6fa] to-transparent opacity-50 transform translate-x-10 group-hover:translate-x-0 transition-transform duration-700 pointer-events-none"></div>

                {/* Info Column */}
                <div className="lg:w-2/5 p-10 md:p-14 bg-[#022f42] text-white relative flex flex-col justify-center">
                  <div className="absolute top-0 right-0 p-8 opacity-10 blur-[1px]">
                    <span className="text-9xl font-black">{index + 1}</span>
                  </div>
                  <div className="w-16 h-16 bg-[#ffd800] rounded-sm flex items-center justify-center mb-8 shadow-lg relative z-10">
                    <Icon className="w-8 h-8 text-[#022f42]" />
                  </div>
                  <h2 className="text-sm font-black text-[#ffd800] uppercase tracking-[0.2em] mb-3 relative z-10">{pillar.id}</h2>
                  <h3 className="text-4xl font-black mb-6 tracking-tight relative z-10">{pillar.title}</h3>
                  <p className="text-[#b0d0e0] leading-relaxed relative z-10 font-medium">
                    {pillar.description}
                  </p>
                </div>

                {/* Modules Column */}
                <div className="lg:w-3/5 p-10 md:p-14 relative z-10">
                  <h4 className="text-lg font-black text-[#022f42] mb-8 flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#ffd800] rounded-full"></div>
                    Methodology Architecture
                  </h4>
                  <div className="space-y-8">
                    {pillar.modules.map((mod, i) => (
                      <div key={i} className="border-l-2 border-[#1e4a62]/10 pl-6 relative">
                        <div className="absolute w-3 h-3 bg-white border-2 border-[#ffd800] rounded-full -left-[7px] top-1.5"></div>
                        <h5 className="font-bold text-[#022f42] text-lg mb-3 flex items-center flex-wrap gap-2">
                          {mod.name}
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {mod.items.map((item, j) => {
                            const isLive = item.includes("(LIVE)");
                            const cleanName = item.replace(" (LIVE)", "");
                            return (
                              <div key={j} className={`px-3 py-1.5 text-xs font-bold rounded-sm border flex items-center gap-1.5 transition-colors ${
                                isLive 
                                  ? "bg-[#ffd800]/10 border-[#ffd800]/50 text-[#022f42]" 
                                  : "bg-white border-[#1e4a62]/10 text-[#1e4a62]/60 hover:border-[#1e4a62]/30"
                              }`}>
                                {isLive ? (
                                  <>
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    {cleanName}
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3 opacity-50" />
                                    {cleanName}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
