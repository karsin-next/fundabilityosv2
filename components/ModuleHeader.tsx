import React from "react";

interface ModuleHeaderProps {
  badge: string;
  title: string;
  description: string;
}

export function ModuleHeader({ badge, title, description }: ModuleHeaderProps) {
  return (
    <div className="mb-8 border-l-[4px] border-[#ffd800] bg-white p-6 md:p-8 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] relative overflow-hidden group">
      {/* Decorative background accent */}
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#f2f6fa] to-transparent opacity-50 transform translate-x-10 group-hover:translate-x-0 transition-transform duration-500 pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
        <div className="flex-1 max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="bg-[#ffd800] text-[#022f42] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.15em] rounded-sm shadow-sm inline-block">
              Module {badge}
            </span>
            <div className="h-px bg-[#1e4a62]/10 w-8 md:w-16"></div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black text-[#022f42] tracking-tight leading-tight mb-3">
            {title}
          </h1>
          
          <p className="text-[#1e4a62] text-sm md:text-base leading-relaxed md:leading-relaxed font-medium">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
