"use client";

import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f2f6fa]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#022f42]/10 border-t-[#ffd800] rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#022f42]">Loading your Dashboard...</p>
        </div>
      </div>
    );
  }

  // Protected route check
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen bg-[#f2f6fa]">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
