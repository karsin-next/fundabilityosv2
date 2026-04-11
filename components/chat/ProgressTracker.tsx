const CORE_DIMENSIONS = [
  "Problem",
  "Market",
  "Revenue",
  "Stage",
  "Team",
  "Runway",
  "Funding",
  "Moat"
] as const;

export type DimensionType = typeof CORE_DIMENSIONS[number];

interface Props {
  currentDimension?: string;
  coveredDimensions?: string[];
}

export default function ProgressTracker({ currentDimension, coveredDimensions = [] }: Props) {
  // Normalize dimension names for comparison
  const normalize = (d: string) => d.split(" ")[0].trim();
  const currentNorm = currentDimension ? normalize(currentDimension) : "";
  const coveredNorms = coveredDimensions.map(normalize);

  return (
    <div className="w-full">
      {/* Header row */}
      <div className="mb-3">
        <span className="text-[#ffd800] text-[10px] md:text-xs font-mono uppercase tracking-widest font-black block">
          FundabilityOS QuickAssess
        </span>
      </div>

      {/* Dimension grid */}
      <div className="flex gap-1.5 flex-wrap">
        {CORE_DIMENSIONS.map((dim) => {
          const isDone = coveredNorms.includes(normalize(dim));
          const isCurrent = normalize(dim) === currentNorm;

          return (
            <div
              key={dim}
              className={`flex items-center gap-1.5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2 py-1 md:px-2.5 md:py-1.5 rounded-sm transition-all duration-300 font-sans border ${
                isCurrent
                  ? "bg-[#ffd800] text-[#022f42] border-[#ffd800] shadow-[0_0_15px_rgba(255,216,0,0.3)]"
                  : isDone
                  ? "bg-[#ffd800]/10 text-[#ffd800] border-[#ffd800]/20"
                  : "bg-white/5 text-white/40 border-white/10"
              }`}
            >
              {isDone && <span className="text-[10px] md:text-xs leading-none">✓</span>}
              {dim}
              {isCurrent && (
                <span className="w-1 h-1 rounded-full bg-[#022f42] animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
