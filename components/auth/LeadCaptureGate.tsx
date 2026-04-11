"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, ArrowRight, Lock, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function LeadCaptureGate({ children }: Props) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    // Check if user has already bypassed the gate
    const guestEmail = localStorage.getItem("guest_email");
    const supabaseSession = localStorage.getItem("sb-auth-token"); // basic approximation, we'll assume true if exist
    
    if (guestEmail || supabaseSession) {
      setIsUnlocked(true);
    }
    setIsLoading(false);
  }, [pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsSubmitting(true);
    try {
      // Opt: Save lead into Supabase
      await fetch("/api/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          event_name: "lead_captured", 
          email: email,
          metadata: { path: pathname }
        })
      });

      // Unlock gate
      localStorage.setItem("guest_email", email);
      setIsUnlocked(true);
    } catch (err) {
      console.error(err);
      // Failsafe: unlock anyway so we don't block them if API fails
      localStorage.setItem("guest_email", email);
      setIsUnlocked(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return null;

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative w-full max-w-[600px] mx-auto bg-[#022f42] rounded-xl border border-white/10 shadow-2xl p-8 overflow-hidden group animate-fade-in-up">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd800] opacity-5 rounded-full blur-[80px] -z-10 group-hover:opacity-10 transition-opacity"></div>
      
      <div className="flex flex-col items-center text-center relative z-10">
        <div className="w-16 h-16 bg-[#ffd800]/10 rounded-full flex items-center justify-center mb-6 border border-[#ffd800]/20 shadow-[0_0_15px_rgba(255,216,0,0.1)]">
          <ShieldAlert className="w-8 h-8 text-[#ffd800]" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-3">
          Protect Your <span className="text-[#ffd800]">Score</span>.
        </h2>
        
        <p className="text-white/60 text-sm md:text-base mb-8 max-w-[400px] leading-relaxed">
          Before we run the deep diagnostic, where should we securely send your final Fundability Report?
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="relative">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email..."
              className="w-full bg-[#022f42] text-white border-2 border-white/10 rounded-md py-4 px-5 pl-11 focus:outline-none focus:border-[#ffd800] transition-colors font-medium text-sm"
              disabled={isSubmitting}
            />
            <Lock className="w-4 h-4 text-white/30 absolute left-4 top-[1.15rem]" />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#ffd800] border-2 border-[#ffd800] text-[#022f42] hover:bg-transparent hover:text-[#ffd800] py-4 rounded-md font-black text-[13px] uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 group/btn"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Unlock Diagnostic <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-white/30 font-medium tracking-widest uppercase mt-6 text-center">
          No credit card required. Strict privacy.
        </p>
      </div>
    </div>
  );
}
