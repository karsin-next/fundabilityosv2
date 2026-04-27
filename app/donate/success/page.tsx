"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function DonateSuccessPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-20 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-xl border-t-4 border-green-500 rounded-b-xl p-10 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-black text-[#022f42] uppercase tracking-tighter mb-4">
            Thank You!
          </h1>
          
          <p className="text-[#1e4a62] font-medium leading-relaxed mb-8">
            Your generous donation has been received successfully. We deeply appreciate your support in helping us maintain and grow FundabilityOS!
          </p>

          <Link
            href="/dashboard"
            className="w-full bg-[#022f42] text-white py-4 rounded-md font-black uppercase tracking-widest text-[11px] flex items-center justify-center hover:bg-[#1e4a62] transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
