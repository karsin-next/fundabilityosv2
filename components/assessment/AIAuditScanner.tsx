"use client";

import { useState, useCallback, useEffect } from "react";
import { UploadCloud, FileText, Cpu, CheckCircle2, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export function AIAuditScanner({ onComplete }: { onComplete?: () => void }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [scanStatus, setScanStatus] = useState<"IDLE" | "SCANNING" | "COMPLETE" | "PAYWALL">("IDLE");
  const [progress, setProgress] = useState(0);
  const [metricsExtracted, setMetricsExtracted] = useState<string[]>([]);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const processFile = useCallback((file: File) => {
    setFile(file);
    setScanStatus("SCANNING");
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  useEffect(() => {
    if (scanStatus === "SCANNING") {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => setScanStatus("COMPLETE"), 500);
            return 100;
          }
          return p + 2;
        });
      }, 50);

      const metricsList = [
        "Identified: B2B SaaS Model",
        "Extracted: TAM = $4.2B",
        "Calculated: LTV:CAC = 3.4x",
        "Found: Customer Churn = 4%",
        "Located: Pitch Deck Problem Statement",
        "Correlating: 360° Benchmark Index...",
      ];

      metricsList.forEach((m, idx) => {
        setTimeout(() => setMetricsExtracted(prev => [...prev, m]), idx * 800);
      });

      return () => clearInterval(interval);
    }
  }, [scanStatus]);

  useEffect(() => {
    if (scanStatus === "COMPLETE") {
      setTimeout(() => setScanStatus("PAYWALL"), 2500);
    }
  }, [scanStatus]);

  if (scanStatus === "PAYWALL") {
    return (
      <div className="glass-premium p-10 relative overflow-hidden transition-all animate-in fade-in zoom-in duration-700">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#ffd800] rounded-full opacity-10 blur-[80px]"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#ffd800] rounded-full opacity-5 blur-[80px]"></div>
        
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-20 h-20 bg-white shadow-2xl rounded-sm flex items-center justify-center mb-8 relative border-b-4 border-[#ffd800]">
            <Lock className="w-8 h-8 text-[#022f42]" />
          </div>
          <h3 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase leading-none">Extraction <br/><span className="text-gradient">Finalized.</span></h3>
          <p className="text-sm font-medium text-white/50 mb-10 max-w-sm leading-relaxed">
            Neural sync completed. 41 data points identified across 8 dimensions. Unlock the full Alpha Report to sync with your dashboard.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
             <Link href="/checkout" className="flex flex-col bg-white p-7 hover:scale-[1.02] transition-transform shadow-2xl group border-b-4 border-transparent hover:border-[#ffd800]">
                <span className="text-[10px] font-black uppercase text-[#022f42]/40 mb-2 tracking-widest">Standard Unlock</span>
                <span className="text-3xl font-black text-[#022f42] mb-6 tracking-tighter">$29</span>
                <div className="mt-auto bg-[#022f42] text-white py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-[#1b4f68]">
                   Access Report <ArrowRight size={14}/>
                </div>
             </Link>
             
             <Link href="/checkout" className="flex flex-col bg-[#ffd800] p-7 hover:scale-[1.02] transition-transform shadow-2xl relative group border-b-4 border-[#022f42]">
                <div className="absolute -top-2 -right-2 bg-[#022f42] text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest">Recommended</div>
                <span className="text-[10px] font-black uppercase text-[#022f42]/60 mb-2 tracking-widest">V4 Pro Growth</span>
                <span className="text-3xl font-black text-[#022f42] mb-6 tracking-tighter">$59<span className="text-sm">/mo</span></span>
                <div className="mt-auto bg-[#022f42] text-white py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-[#1b4f68]">
                   Upgrade Plan <ArrowRight size={14}/>
                </div>
             </Link>
          </div>

          <button onClick={() => setScanStatus("IDLE")} className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:text-gray-600 mt-8">
            Discard AI Sync
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`border-4 border-dashed rounded-sm transition-all duration-300 relative overflow-hidden ${dragActive ? 'border-[#ffd800] bg-[#fffdef]' : 'border-[#022f42]/10 bg-white'}`}
      onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
    >
      <div className="p-8 md:p-14 flex flex-col items-center justify-center text-center min-h-[400px]">
        {scanStatus === "IDLE" && (
          <div className="flex flex-col items-center transition-opacity animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-white shadow-2xl rounded-sm flex items-center justify-center mb-8 border border-gray-100 border-b-4 border-[#022f42]">
              <Cpu className="w-10 h-10 text-[#022f42]" />
            </div>
            <h3 className="text-2xl font-black text-[#022f42] tracking-tighter mb-3 uppercase">Institutional Neural Scanner</h3>
            <p className="text-sm font-medium text-gray-400 mb-10 max-w-sm leading-relaxed">
              Drop your Pitch Deck or Financial Model. Our V4 engine will extract 40+ investor metrics and populate your 8 core diagnostics instantly.
            </p>
            <label className="cursor-pointer bg-[#022f42] text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-[#1b4f68] transition-all shadow-xl flex items-center gap-3">
              <UploadCloud className="w-5 h-5"/> Initialize Scan
              <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
            </label>
          </div>
        )}

        {(scanStatus === "SCANNING" || scanStatus === "COMPLETE") && (
          <div className="w-full max-w-lg relative transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* File Info Bar (The Preview) */}
            <div className="flex items-center gap-4 bg-white border border-[#022f42]/10 p-4 rounded-sm mb-6 shadow-sm text-left">
              <div className="w-10 h-10 bg-[#f2f6fa] rounded-sm flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-[#022f42]" />
              </div>
              <div className="overflow-hidden">
                <div className="text-[10px] font-black uppercase text-[#022f42] truncate">{file?.name}</div>
                <div className="text-[9px] font-bold text-gray-400">{(file?.size || 0) / 1024 > 1024 ? ((file?.size || 0) / (1024 * 1024)).toFixed(2) + ' MB' : ((file?.size || 0) / 1024).toFixed(0) + ' KB'} • PDF Document</div>
              </div>
              <div className="ml-auto">
                 {scanStatus === 'COMPLETE' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <div className="w-5 h-5 border-2 border-[#ffd800] border-t-transparent rounded-full animate-spin" />}
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${scanStatus === 'COMPLETE' ? 'bg-emerald-500' : 'bg-[#ffd800] animate-pulse'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#022f42]">
                    {scanStatus === 'COMPLETE' ? 'Extraction Verified' : 'A.I. Diagnostic Processing'}
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{progress}%</span>
              </div>
              
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-8">
                <div className={`h-full transition-all duration-300 ${scanStatus === 'COMPLETE' ? 'bg-emerald-500' : 'bg-[#022f42]'}`} style={{ width: `${progress}%` }} />
              </div>

              {/* Console Preview Area */}
              <div className="bg-[#022f42] text-[#ffd800] p-6 rounded-sm font-mono text-[10px] text-left h-48 overflow-y-auto shadow-inner border border-white/10 transition-all duration-500">
                <p className="mb-2 text-[#90cdf4]">{'// Initiating Institutional Audit Protocol...'}</p>
                <p className="mb-2 text-[#90cdf4]/60 italic">{`> Analyzing: ${file?.name?.substring(0, 30)}...`}</p>
                {metricsExtracted.map((m, i) => (
                  <p key={i} className="mb-1 transition-all animate-in slide-in-from-left-2 duration-300">
                    {'>'} {m}
                  </p>
                ))}
                {scanStatus === "COMPLETE" && (
                  <p className="mt-4 text-emerald-400 font-bold animate-pulse">
                    [SUCCESS] Full Alpha Report ready for sync.
                  </p>
                )}
              </div>

              {/* Paywall Card Overlay (Floating) */}
              {scanStatus === "COMPLETE" && (
                <div className="absolute inset-x-0 -bottom-10 flex items-center justify-center z-20 px-4 transition-all animate-in zoom-in duration-500">
                  <div className="bg-white border-2 border-[#022f42] p-8 shadow-[0_40px_80px_-20px_rgba(2,47,66,0.3)] rounded-sm w-full max-w-sm flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#022f42] rounded-full flex items-center justify-center mb-4">
                      <Lock className="w-6 h-6 text-[#ffd800]" />
                    </div>
                    <h4 className="text-lg font-black text-[#022f42] uppercase tracking-tight mb-2 text-center">Sync Sequence Locked</h4>
                    <p className="text-[11px] font-medium text-gray-500 text-center mb-6 leading-relaxed">
                      Institutional Gap Analysis & Automated Module Syncing. Upgrade to V4 Pro to deploy these results.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 w-full">
                       <Link href="/checkout" className="flex flex-col items-center bg-white border-2 border-[#022f42] px-3 py-4 hover:bg-gray-50 transition-colors group">
                          <span className="text-[11px] font-black text-[#022f42] mb-1">$29</span>
                          <span className="text-[8px] font-black uppercase text-gray-400">Unlock Report</span>
                       </Link>
                       <Link href="/checkout" className="flex flex-col items-center bg-[#022f42] px-3 py-4 hover:bg-[#1b4f68] transition-colors group relative">
                          <div className="absolute -top-3 right-0 bg-[#ffd800] text-[#022f42] px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter">Recommended</div>
                          <span className="text-[11px] font-black text-white mb-1">$59/mo</span>
                          <span className="text-[8px] font-black uppercase text-[#90cdf4]">V4 Pro</span>
                       </Link>
                    </div>
                    
                    <button onClick={() => setScanStatus("IDLE")} className="mt-8 text-[9px] font-bold text-gray-300 uppercase tracking-widest hover:text-gray-500 transition-colors">
                       Clear and start over
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
