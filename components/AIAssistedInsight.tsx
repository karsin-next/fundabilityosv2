import { Sparkles } from "lucide-react";

interface AIAssistedInsightProps {
  content: string;
}

export function AIAssistedInsight({ content }: AIAssistedInsightProps) {
  if (!content) return null;

  return (
    <div 
      className="mt-6 flex items-start gap-4 p-5 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 shadow-sm rounded-sm animate-in fade-in slide-in-from-top-1 duration-500"
    >
      <div className="bg-yellow-100 p-2 rounded-full shrink-0">
        <Sparkles className="w-5 h-5 text-yellow-600" />
      </div>
      <div className="flex-1">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-yellow-700 mb-1 flex items-center gap-2">
          AI Assisted Insight
        </h4>
        <p className="text-sm text-yellow-900 font-medium leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
}
