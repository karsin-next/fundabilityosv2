"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw, ChevronRight } from "lucide-react";
import ProgressTracker from "@/components/chat/ProgressTracker";
import ScoreGaugeMock from "@/components/score/ScoreGaugeMock";
import type { ScoringResult } from "@/lib/scoring";

type InterviewState = "idle" | "loading_question" | "answering" | "scoring" | "done" | "error";

interface HistoryItem {
  question: string;
  answer: string;
}

interface ActiveQuestion {
  title: string;
  description: string;
  options: string[];
}

export default function InterviewPage() {
  const [state, setState] = useState<InterviewState>("idle");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<ActiveQuestion | null>(null);
  
  const [customInput, setCustomInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const initRendered = useRef(false);

  // Fetch the next question (or completion payload)
  const fetchNextNode = useCallback(async (currentHistory: HistoryItem[]) => {
    setState("loading_question");
    setActiveQuestion(null);
    setShowCustomInput(false);
    setCustomInput("");

    try {
      const res = await fetch("/api/interview/tree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: currentHistory }),
      });
      
      if (!res.ok) throw new Error("Failed to load next question");
      const data = await res.json();

      if (data.type === "complete") {
        // Trigger the final score API using the structured payload Claude generated
        runScoring(data.extracted_data);
      } else if (data.type === "question") {
        setActiveQuestion({
          title: data.title,
          description: data.description || "Select the best option tailored to your startup.",
          options: data.options || [],
        });
        setState("answering");
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Connection failed");
      setState("error");
    }
  }, []);

  // Initialize the first question precisely once
  useEffect(() => {
    if (!initRendered.current) {
      initRendered.current = true;
      fetchNextNode([]);
    }
  }, [fetchNextNode]);

  // Scoring Bridge
  const runScoring = async (structuredData: Record<string, unknown>) => {
    setState("scoring");
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: structuredData }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const result: ScoringResult = await res.json();
      setScoringResult(result);
      setState("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Analysis failed");
      setState("error");
    }
  };

  const handleSelectOption = (value: string) => {
    const newHistory = [...history, { question: activeQuestion!.title, answer: value }];
    setHistory(newHistory);
    fetchNextNode(newHistory);
  };

  const handleCustomSubmit = () => {
    if (!customInput.trim()) return;
    const newHistory = [...history, { question: activeQuestion!.title, answer: customInput.trim() }];
    setHistory(newHistory);
    fetchNextNode(newHistory);
  };

  const handleReset = () => {
    setHistory([]);
    setActiveQuestion(null);
    setScoringResult(null);
    setErrorMsg("");
    fetchNextNode([]);
  };

  // ============================================================
  // SCORING PANEL
  // ============================================================
  if (state === "scoring") {
    return (
      <div style={fullPageStyle}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div style={{ position: "relative", width: "64px", height: "64px", marginInline: "auto", marginBottom: "1.5rem" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: "3px solid var(--yellow-20)", borderTopColor: "var(--yellow)", animation: "spin 1s linear infinite" }} />
          </div>
          <h2 className="heading-section" style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
            Analyzing Your Profile…
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.875rem", lineHeight: 1.7 }}>
            Our AI is securely processing your inputs across 8 investor dimensions.
          </p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: "@keyframes spin { to { transform: rotate(360deg); } }" }} />
      </div>
    );
  }

  // ============================================================
  // LOADERS & ERRORS
  // ============================================================
  if (state === "error") {
    return (
      <div style={fullPageStyle}>
        <div style={{ textAlign: "center", maxWidth: "380px" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</div>
          <h2 className="heading-section" style={{ fontSize: "1.35rem", marginBottom: "0.75rem", color: "var(--red)" }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            {errorMsg}
          </p>
          <button onClick={handleReset} className="btn btn-primary">
            <RotateCcw size={14} /> Start Again
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // RESULTS PANEL
  // ============================================================
  if (state === "done" && scoringResult) {
    const { score, band, component_scores, top_3_gaps, investor_loves, investor_concerns, action_items, summary_paragraph } = scoringResult;
    const COMPONENT_META = [
      { key: "problem_clarity", label: "Problem Clarity", max: 15 },
      { key: "revenue", label: "Revenue", max: 20 },
      { key: "runway", label: "Runway", max: 15 },
      { key: "team_size", label: "Team", max: 10 },
      { key: "product_stage", label: "Product Stage", max: 10 },
      { key: "previous_funding", label: "Prev. Funding", max: 10 },
      { key: "market_size", label: "Market Size", max: 10 },
      { key: "ai_confidence", label: "AI Confidence", max: 10 },
    ];

    return (
      <div style={{ paddingTop: "68px", backgroundColor: "var(--navy)", minHeight: "100vh" }}>
        {/* Score header */}
        <section style={{ borderBottom: "3px solid var(--yellow)", padding: "3rem 0 2rem" }}>
          <div className="container result-header-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
            <div>
              <span className="tag-badge" style={{ marginBottom: "1rem" }}>Assessment Complete</span>
              <h1 className="heading-section" style={{ marginBottom: "1rem" }}>Your Fundability Score</h1>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.875rem", lineHeight: 1.75, maxWidth: "28rem" }}>{summary_paragraph}</p>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.75rem", flexWrap: "wrap" }}>
                <Link href="/report" className="btn btn-primary btn-lg">
                  Unlock Full Report — $29 <ArrowRight size={16} />
                </Link>
                <button onClick={handleReset} className="btn btn-ghost">
                  <RotateCcw size={14} /> Retake Assessment
                </button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
              <ScoreGaugeMock score={score} band={band} />
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {COMPONENT_META.map(({ key, label, max }) => {
                  const val = component_scores[key as keyof typeof component_scores] ?? 0;
                  const pct = (val / max) * 100;
                  const colour = pct >= 70 ? "var(--green)" : pct >= 40 ? "var(--amber)" : "var(--red)";
                  return (
                    <div key={key}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.5)" }}>{label}</span>
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, color: colour }}>{val}/{max}</span>
                      </div>
                      <div className="dimension-bar-track">
                        <div className="dimension-bar-fill" style={{ width: `${pct}%`, backgroundColor: colour }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <style dangerouslySetInnerHTML={{ __html: "@media(max-width:768px){.result-header-grid{grid-template-columns:1fr!important;}}" }} />
        </section>

        {/* Gaps + Action Plan */}
        <section style={{ padding: "3rem 0" }}>
          <div className="container">
            <div className="result-body-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              {/* Top 3 gaps */}
              <div>
                <p className="label-mono" style={{ color: "var(--yellow)", marginBottom: "1.25rem" }}>Top 3 Gaps to Fix</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {top_3_gaps.map((gap) => (
                    <div key={gap.dimension} style={{ padding: "1.125rem", borderLeft: `3px solid ${gap.priority === "high" ? "var(--red)" : gap.priority === "medium" ? "var(--amber)" : "var(--green)"}`, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "0 4px 4px 0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: gap.priority === "high" ? "var(--red)" : gap.priority === "medium" ? "var(--amber)" : "var(--green)" }}>{gap.dimension}</span>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>{gap.score}/{gap.max} pts</span>
                      </div>
                      <p style={{ fontSize: "0.825rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.65, marginBottom: "0.5rem" }}>{gap.explanation}</p>
                      <p style={{ fontSize: "0.775rem", color: "var(--yellow)", lineHeight: 1.6 }}>→ {gap.fix}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 30-day action plan */}
              <div>
                <p className="label-mono" style={{ color: "var(--yellow)", marginBottom: "1.25rem" }}>30-Day Action Plan</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {action_items.map((item) => (
                    <div key={item.week} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                      <span style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "var(--yellow)", color: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 900, flexShrink: 0, fontFamily: "var(--font-sans)" }}>W{item.week}</span>
                      <div>
                        <p style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--white)", marginBottom: "0.2rem" }}>{item.action}</p>
                        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>{item.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <p className="label-mono" style={{ color: "var(--green)", marginBottom: "0.625rem", fontSize: "0.6rem" }}>Investors Will Love</p>
                    {investor_loves.map((l, i) => <p key={i} style={{ fontSize: "0.775rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: "0.375rem" }}>✓ {l}</p>)}
                  </div>
                  <div>
                    <p className="label-mono" style={{ color: "var(--red)", marginBottom: "0.625rem", fontSize: "0.6rem" }}>Expect Pushback On</p>
                    {investor_concerns.map((c, i) => <p key={i} style={{ fontSize: "0.775rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: "0.375rem" }}>⚠ {c}</p>)}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA bar */}
            <div style={{ marginTop: "3rem", padding: "2rem", border: "1px solid var(--yellow-20)", borderRadius: "4px", backgroundColor: "rgba(255,216,0,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
              <div>
                <p className="label-mono" style={{ color: "var(--yellow)", marginBottom: "0.25rem", fontSize: "0.6rem" }}>Want the full 8-page report?</p>
                <p style={{ fontSize: "0.9rem", color: "var(--white)", fontWeight: 700 }}>Unlock your Investor-Ready Report — $29 one-time</p>
              </div>
              <Link href="/report" className="btn btn-primary btn-lg">
                Get Full Report — $29 <ArrowRight size={15} />
              </Link>
            </div>
          </div>
          <style dangerouslySetInnerHTML={{ __html: "@media(max-width:768px){.result-body-grid{grid-template-columns:1fr!important;}}" }} />
        </section>
      </div>
    );
  }

  // ============================================================
  // MAIN QUESTIONNAIRE UI (DYNAMIC)
  // ============================================================
  return (
    <div style={{ paddingTop: "68px", minHeight: "100dvh", display: "flex", flexDirection: "column", backgroundColor: "var(--navy)" }}>
      {/* Header logic: Instead of strict 12 steps, let's just show progress abstractly or lengthly. Let's assume it peaks at 15 */}
      <div style={{ borderBottom: "1px solid var(--yellow-20)", padding: "1rem", backgroundColor: "rgba(2,47,66,0.97)", backdropFilter: "blur(8px)", flexShrink: 0 }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <ProgressTracker currentQuestion={Math.min(history.length + 1, 12)} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "3rem 1.25rem 6rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        {state === "loading_question" || !activeQuestion ? (
          <div style={{ textAlign: "center", marginTop: "4rem" }}>
             <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid var(--yellow-20)", borderTopColor: "var(--yellow)", animation: "spin 1s linear infinite", marginInline: "auto", marginBottom: "1.5rem" }} />
             <p style={{ color: "var(--yellow)", fontSize: "0.85rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Analyzing logic tree...</p>
          </div>
        ) : (
          <div style={{ maxWidth: "600px", width: "100%", animation: "fadeIn 0.3s ease" }}>
            <p className="label-mono" style={{ color: "var(--yellow)", marginBottom: "1rem" }}>
              Question {history.length + 1}
            </p>
            <h2 className="heading-section" style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>
              {activeQuestion.title}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2.5rem" }}>
              {activeQuestion.description}
            </p>

            <div className="options-grid">
              {activeQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt)}
                  className="option-card"
                >
                  <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: '2px solid var(--yellow-20)', display: "flex", alignItems: "center", justifyContent: "center", marginRight: "1rem", backgroundColor: 'transparent', flexShrink: 0 }} />
                  <span style={{ fontSize: "0.95rem", fontWeight: 500, textAlign: "left", lineHeight: 1.4 }}>
                    {opt}
                  </span>
                </button>
              ))}
              
              {/* Other Option */}
              {!showCustomInput ? (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="option-card"
                  style={{ backgroundColor: "rgba(255,255,255,0.01)", borderStyle: "dashed", borderColor: "var(--yellow-20)" }}
                >
                  <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: '2px dashed var(--yellow-20)', marginRight: "1rem" }} />
                  <span style={{ fontSize: "0.95rem", fontWeight: 400, opacity: 0.7 }}>Other (Type your own answer)</span>
                </button>
              ) : (
                <div style={{ marginTop: "1rem", backgroundColor: "rgba(2,47,66,0.5)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--yellow)" }}>
                  <p style={{ fontSize: "0.75rem", color: "var(--yellow)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Type Your Answer</p>
                  <textarea 
                    autoFocus
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    rows={2}
                    className="text-input"
                    placeholder="Enter what works best for your situation..."
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem", gap: "0.75rem" }}>
                    <button onClick={() => setShowCustomInput(false)} className="btn btn-ghost" style={{ padding: "0 1rem" }}>Cancel</button>
                    <button onClick={handleCustomSubmit} disabled={!customInput.trim()} className="btn btn-primary" style={{ padding: "0 1.5rem" }}>
                      Submit <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: "\n        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }\n        .text-input { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid var(--yellow-20); border-radius: 4px; padding: 1rem 1.25rem; color: white; font-family: inherit; font-size: 1rem; resize: none; margin-bottom: 0.5rem; }\n        .text-input:focus { outline: none; border-color: var(--yellow); }\n        .options-grid { display: flex; flex-direction: column; gap: 0.75rem; }\n        .option-card { width: 100%; display: flex; align-items: center; padding: 1.25rem 1.5rem; background: rgba(255,255,255,0.03); border: 1px solid var(--yellow-20); border-radius: 6px; color: rgba(255,255,255,0.85); cursor: pointer; transition: all 0.2s; }\n        .option-card:hover { border-color: rgba(255, 216, 0, 0.5); background: rgba(255,255,255,0.05); }\n      " }} />
    </div>
  );
}

const fullPageStyle: React.CSSProperties = {
  minHeight: "100vh", paddingTop: "68px", backgroundColor: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", padding: "68px 1.25rem 3rem",
};
