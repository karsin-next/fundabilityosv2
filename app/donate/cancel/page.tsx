"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function DonateCancelPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-20 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-xl border-t-4 border-red-500 rounded-b-xl p-10 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          
          <h1 className="text-3xl font-black text-[#022f42] uppercase tracking-tighter mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-[#1e4a62] font-medium leading-relaxed mb-8">
            Your donation was cancelled and no charges were made.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/donate"
              className="w-full bg-[#ffd800] text-[#022f42] py-4 rounded-md font-black uppercase tracking-widest text-[11px] flex items-center justify-center hover:-translate-y-0.5 transition-transform"
            >
              Try Again
            </Link>
            <Link
              href="/dashboard"
              className="w-full bg-transparent border-2 border-[#e2e8f0] text-[#022f42] py-4 rounded-md font-black uppercase tracking-widest text-[11px] flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
