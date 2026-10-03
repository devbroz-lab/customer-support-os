"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

type Step = {
  id: string;
  route: string;
  target: string;
  title: string;
  description: string;
  beforeStep?: "activity" | "insights";
};

const steps: Step[] = [
  { id: "workflow-hero", route: "/ai-operations?tab=workflow", target: "[data-tour='agent-workflow']", title: "Welcome to SupportOS", description: "Watch how coordinated AI agents transform an incoming email into a review-ready customer case in seconds." },
  { id: "workflow-stages", route: "/ai-operations?tab=workflow", target: "[data-tour='agent-workflow'] header", title: "Each stage has a specialist agent", description: "Color-coded stages show ingest, triage, context gathering, verification, drafting, and human review." },
  { id: "workflow-explore", route: "/ai-operations?tab=workflow", target: "[data-tour='agent-workflow'] footer", title: "Inspect any agent's role", description: "Click an agent card to see its business purpose, capabilities, and how it contributes to safe automation." },
  { id: "overview-entry", route: "/overview", target: "main header", title: "Now see how teams use this", description: "Operations shows the human side: prioritized queues, AI-prepared drafts, and decision controls." },
  { id: "inbox", route: "/reviews", target: "main section:first-of-type", title: "Focus on the right work", description: "Saved views help agents switch between personal queues, escalations, unassigned work, and SLA risk." },
  { id: "case-workflow", route: "/reviews/CS-2481", target: "main header", title: "Review an AI-prepared case", description: "AI enriches each case with trusted facts, policy guardrails, and a draft response ready for approval." },
  { id: "performance", route: "/performance", target: "main > div > div", title: "Track automation impact", description: "See how AI assistance improves resolution speed, quality, and team capacity over time." },
];

type TourContextValue = { startTour: () => void };
const TourContext = createContext<TourContextValue | null>(null);

export function useProductTour() {
  const value = useContext(TourContext);
  if (!value) throw new Error("useProductTour must be used within ProductTourProvider");
  return value;
}

export function ProductTourProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const didAutoStart = useRef(false);
  const step = steps[stepIndex];

  useEffect(() => {
    if (didAutoStart.current) return;
    const timer = window.setTimeout(() => {
      didAutoStart.current = true;
      setStepIndex(0);
      setActive(true);
      router.push("/ai-operations?tab=workflow");
    }, 700);
    return () => window.clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    if (!active) return;
    const updateRect = () => {
      const target = document.querySelector(step.target);
      if (!target) { setRect(null); return; }
      setRect(target.getBoundingClientRect());
    };
    if (step.beforeStep) window.dispatchEvent(new Event(`supportos-tour-${step.beforeStep}`));
    const timer = window.setTimeout(() => {
      const target = document.querySelector(step.target);
      target?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      updateRect();
    }, pathname === step.route ? 100 : 350);
    const onChange = () => updateRect();
    window.addEventListener("resize", onChange);
    window.addEventListener("scroll", onChange, true);
    return () => { window.clearTimeout(timer); window.removeEventListener("resize", onChange); window.removeEventListener("scroll", onChange, true); };
  }, [active, pathname, step]);

  const finish = () => {
    setActive(false);
  };
  const startTour = () => {
    setStepIndex(0);
    setActive(true);
    router.push("/ai-operations?tab=workflow");
  };
  const move = (direction: -1 | 1) => {
    const next = stepIndex + direction;
    if (next < 0) return;
    if (next >= steps.length) { finish(); router.push("/overview"); return; }
    const nextStep = steps[next];
    setStepIndex(next);
    if (nextStep.route !== pathname) router.push(nextStep.route);
  };

  return <TourContext.Provider value={{ startTour }}>{children}
    {active && <TourOverlay step={step} index={stepIndex} rect={rect} onBack={() => move(-1)} onNext={() => move(1)} onSkip={finish} />}
  </TourContext.Provider>;
}

function TourOverlay({ step, index, rect, onBack, onNext, onSkip }: { step: Step; index: number; rect: DOMRect | null; onBack: () => void; onNext: () => void; onSkip: () => void }) {
  const padding = 8;
  const top = Math.max(0, (rect?.top ?? 0) - padding); const left = Math.max(0, (rect?.left ?? 0) - padding);
  const right = Math.min(window.innerWidth, (rect?.right ?? 0) + padding); const bottom = Math.min(window.innerHeight, (rect?.bottom ?? 0) + padding);
  const cardTop = rect && bottom + 16 < window.innerHeight - 230 ? bottom + 16 : Math.max(18, top - 220);
  const cardLeft = rect ? Math.min(Math.max(18, left), window.innerWidth - 380) : 24;
  return <div className="fixed inset-0 z-[90]" aria-live="polite">{rect && <div className="fixed rounded-2xl border-2 border-indigo-300" style={{ top, left, width: right - left, height: bottom - top, boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.62), 0 0 0 4px rgba(255, 255, 255, 0.85)" }} />}
    <section className="fixed w-[min(360px,calc(100vw-36px))] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl" style={{ top: cardTop, left: cardLeft }}><div className="mb-4 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[.12em] text-indigo-600">SupportOS tour</span><button onClick={onSkip} aria-label="Skip product tour" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="size-4" /></button></div><h2 className="text-lg font-bold tracking-tight text-slate-950">{step.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${((index + 1) / steps.length) * 100}%` }} /></div><div className="mt-4 flex items-center justify-between"><span className="text-xs font-medium text-slate-400">{index + 1} of {steps.length}</span><div className="flex gap-2"><button onClick={onBack} disabled={index === 0} className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-slate-600 disabled:opacity-30"><ArrowLeft className="size-3.5" />Back</button><button onClick={onNext} className="inline-flex h-8 items-center gap-1 rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white hover:bg-indigo-700">{index === steps.length - 1 ? "Finish" : "Next"}<ArrowRight className="size-3.5" /></button></div></div></section></div>;
}
