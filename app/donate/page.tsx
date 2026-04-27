"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const SUGGESTED_AMOUNTS = [5, 10, 25, 50];

export default function DonatePage() {
  const { user } = useUser();
  const [amount, setAmount] = useState<number | "">("");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setAmount("");
  };

  const handleDonate = async () => {
    setError("");
    let finalAmount = amount;
    if (customAmount) {
      finalAmount = parseFloat(customAmount);
    }

    if (!finalAmount || isNaN(finalAmount as number) || (finalAmount as number) < 1) {
      setError("Please enter an amount of at least $1.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout-donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCents: Math.round((finalAmount as number) * 100),
          userId: user?.id,
          userEmail: user?.email,
          donorName: name,
          donorMessage: message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initiate checkout");

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-20 flex justify-center">
        <div className="max-w-2xl w-full bg-white shadow-xl border-t-4 border-[#ffd800] rounded-b-xl p-10 mt-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#ffd800]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-[#ffd800] fill-current" />
            </div>
            <h1 className="text-3xl font-black text-[#022f42] uppercase tracking-tighter mb-4">
              Support FundabilityOS
            </h1>
            <p className="text-[#1e4a62] font-medium leading-relaxed max-w-lg mx-auto">
              Your contribution helps us maintain and expand the platform. Donations are entirely voluntary and do not unlock features. Thank you for believing in our mission!
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-8">
            <div>
              <label className="block text-[#022f42] text-[10px] font-black uppercase tracking-widest mb-4">
                Select Amount (USD)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {SUGGESTED_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAmountSelect(val)}
                    className={`py-3 rounded-md font-bold transition-all border-2 ${
                      amount === val
                        ? "bg-[#022f42] text-[#ffd800] border-[#022f42]"
                        : "bg-white text-[#022f42] border-[#e2e8f0] hover:border-[#022f42]"
                    }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#022f42] font-bold">$</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Custom Amount"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="w-full pl-8 pr-4 py-3 bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-md focus:outline-none focus:border-[#ffd800] font-bold text-[#022f42] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#e2e8f0]">
              <div>
                <label className="block text-[#022f42] text-[10px] font-black uppercase tracking-widest mb-2">
                  Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="How should we recognize you?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-md focus:outline-none focus:border-[#ffd800] font-medium text-[#022f42] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[#022f42] text-[10px] font-black uppercase tracking-widest mb-2">
                  Message (Optional)
                </label>
                <textarea
                  placeholder="Leave a message for the team..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-md focus:outline-none focus:border-[#ffd800] font-medium text-[#022f42] transition-colors resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleDonate}
              disabled={isLoading || (!amount && !customAmount)}
              className="w-full bg-[#ffd800] text-[#022f42] py-4 rounded-md font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:shadow-[0_10px_30px_-10px_rgba(255,216,0,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  Donate ${(amount || customAmount || "0").toString()}
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-[#1e4a62]/60 font-bold uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> Secure payment via Stripe
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
