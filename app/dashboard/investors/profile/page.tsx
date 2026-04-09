"use client";

import { ModuleHeader } from "@/components/ModuleHeader";
import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="3.2.1"
        title="Investor Profile Builder"
        description="Define your ideal investor using stage, sector, geography, and ticket size."
      />
      <div className="bg-white border-[#ffd800] border-l-[4px] p-8 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)]">
        <h3 className="text-lg font-bold text-[#022f42] mb-4">Methodology Parameters</h3>
        <p className="text-sm text-[#1e4a62]/80 bg-[#1e4a62]/5 p-3 rounded-sm border border-[#1e4a62]/10 mb-6">
          [PHASE 2] This module will implement: Precision archetype filter with real-time matching to the FundabilityOS investor database.
        </p>
        <ComingSoon 
          module="3.2.1 Investor Profile Builder" 
          title="Who to Approach" 
          description="We are currently calibrating the investor DNA mapping algorithm for this module." 
        />
      </div>
    </div>
  );
}
