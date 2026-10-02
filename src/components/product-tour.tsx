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
  { id: "welcome", route: "/", target: "main header", title: "Welcome to SupportOS", description: "This is an AI-powered customer operations workspace. In the next few moments, you will see how teams prioritize, resolve, and govern customer conversations." },
  { id: "metrics", route: "/", target: "main section:first-of-type", title: "See operational health instantly", description: "Open workload, SLA risk, escalations, and resolutions give teams a clear sense of what needs attention now." },
  { id: "priority", route: "/", target: "main section:nth-of-type(2) > div:first-child", title: "Work the highest-impact cases first", description: "Priority Queue combines customer context, case status, and service-level risk so reviewers can act before commitments are missed." },
  { id: "intelligence", route: "/", target: "main section:nth-of-type(2) > div:nth-child(2)", title: "AI prepares the work", description: "SupportOS enriches every incoming case with intent, verified context, and helpful response guidance. Your team keeps the final decision." },
  { id: "workflow-entry", route: "/", target: "[data-tour='workflow-entry']", title: "Explore the orchestration behind SupportOS", description: "This interactive workflow demo shows how specialized agents prepare incoming customer cases for human review." },
  { id: "views", route: "/reviews", target: "main section:first-of-type", title: "Focus on the right work", description: "Saved views help frontline agents and senior reviewers switch between personal queues, escalations, unassigned work, and SLA risk." },
  { id: "inbox", route: "/reviews", target: "main section:nth-of-type(2)", title: "Triage from one operational inbox", description: "Every row has the signals needed to make a quick, informed decision: customer tier, channel, AI confidence, priority, owner, and SLA." },
  { id: "case", route: "/reviews/CS-2481", target: "main header", title: "Enter the case workspace", description: "This high-priority payment dispute shows how SupportOS brings customer context and decision controls into one focused workspace." },
  { id: "customer", route: "/reviews/CS-2481", target: "main aside:first-of-type section:first-child", title: "Keep customer context close", description: "Review account details and the entire conversation without losing your place or switching between systems." },
  { id: "draft", route: "/reviews/CS-2481", target: "main section.min-w-0", title: "Review an AI-assisted response", description: "AI drafts a customer-ready reply using verified facts. Reviewers can edit, save, or use it as a starting point before any message is sent." },
  { id: "insights", route: "/reviews/CS-2481", target: "main aside:last-of-type section:first-child", title: "Make safer decisions with evidence", description: "The AI decision brief separates verified facts, policy guardrails, and classification signals so important judgment stays visible.", beforeStep: "insights" },
  { id: "actions", route: "/reviews/CS-2481", target: "main > div > div:first-child", title: "Approve, send, or escalate", description: "Reviewers can confidently approve a response or route complex cases to specialists. SupportOS records the outcome in the case history." },
  { id: "audit", route: "/reviews/CS-2481", target: "main aside:last-of-type section:first-child", title: "Make every decision accountable", description: "The activity view captures assignments, draft updates, escalation reasons, and resolution events for a transparent audit trail.", beforeStep: "activity" },
  { id: "performance", route: "/performance", target: "main > div > div", title: "Turn support activity into insight", description: "Team leaders can track service quality, resolution trends, capacity, and contributor performance in one view." },
  { id: "automation", route: "/ai-operations?tab=workflow", target: "[data-tour='agent-workflow']", title: "See governed automation in action", description: "This interactive graph shows how coordinated agents enrich, verify, draft, and route each case with human oversight." },
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
      router.push("/");
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
    router.push("/");
  };
  const move = (direction: -1 | 1) => {
    const next = stepIndex + direction;
    if (next < 0) return;
    if (next >= steps.length) { finish(); router.push("/reviews"); return; }
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
