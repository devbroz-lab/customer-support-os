"use client";

import { useEffect, useState } from "react";
import { Activity, BrainCircuit, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { AgentWorkflow } from "@/components/ai-operations/agent-workflow";
import { cn } from "@/lib/utils";

const metrics = [["94.2%", "Intent accuracy", BrainCircuit], ["82%", "Draft acceptance", CheckCircle2], ["1,204", "Hours saved", Sparkles], ["99.8%", "Safety checks passed", ShieldCheck]];

export default function AiOperationsPage() {
  const [tab, setTab] = useState<"overview" | "workflow">("overview");
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (new URLSearchParams(window.location.search).get("tab") === "workflow") setTab("workflow");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  return <div className="min-h-screen bg-[#f6f7fb] px-5 py-7 lg:px-10 lg:py-9"><div className="mx-auto max-w-7xl"><header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-indigo-600">Automation intelligence</p><h1 className="mt-1 text-3xl font-bold tracking-tight">AI operations</h1><p className="mt-2 text-sm text-slate-500">Monitor how SupportOS augments every customer interaction.</p></div><div className="rounded-xl border bg-white px-3 py-2 text-xs font-medium text-emerald-700"><span className="mr-2 inline-block size-2 rounded-full bg-emerald-500" />All automations healthy</div></header>
    <div className="mt-7 inline-flex rounded-xl border border-slate-200 bg-white p-1"><button onClick={() => setTab("overview")} className={cn("rounded-lg px-4 py-2 text-sm font-semibold transition", tab === "overview" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900")}>Overview</button><button onClick={() => setTab("workflow")} className={cn("rounded-lg px-4 py-2 text-sm font-semibold transition", tab === "workflow" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900")}>Agent workflow <span className="ml-1.5 rounded-md bg-violet-100 px-1.5 py-0.5 text-[10px] text-violet-700">Live demo</span></button></div>
    {tab === "workflow" ? <AgentWorkflow /> : <Overview />}
  </div></div>;
}

function Overview() {
  return <><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([value, label, Icon]) => { const MetricIcon = Icon as typeof Activity; return <div key={label as string} className="rounded-2xl border bg-white p-5"><div className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><MetricIcon className="size-5" /></div><p className="mt-5 text-2xl font-bold">{value as string}</p><p className="mt-1 text-sm text-slate-500">{label as string}</p></div>; })}</div><section className="mt-6 rounded-2xl border bg-white p-6"><div><h2 className="font-semibold">Customer case automation</h2><p className="mt-1 text-sm text-slate-500">A guarded workflow that enriches, assesses, and routes every incoming case.</p></div><div className="mt-10 grid gap-4 md:grid-cols-4">{[["1", "Ingest", "Classify channel and customer context"], ["2", "Understand", "Extract intent, tone, and identifiers"], ["3", "Verify", "Retrieve trusted company context"], ["4", "Assist", "Draft, route, and await approval"]].map(([num, title, text], i) => <div key={title} className="relative rounded-2xl border border-slate-200 p-5"><span className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-xs font-bold text-white">{num}</span><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>{i < 3 && <div className="absolute -right-3 top-8 hidden size-6 rounded-full border bg-white text-center text-sm leading-6 text-indigo-500 md:block">→</div>}</div>)}</div></section><section className="mt-6 grid gap-6 lg:grid-cols-2"><div className="rounded-2xl border bg-white p-6"><h2 className="font-semibold">Human review coverage</h2><div className="mt-6 flex items-center gap-6"><div className="grid size-32 place-items-center rounded-full border-[14px] border-indigo-100 border-t-indigo-600"><span className="text-xl font-bold">18%</span></div><div><p className="text-sm font-semibold">Cases reviewed by specialists</p><p className="mt-2 text-sm leading-6 text-slate-500">High-risk decisions, low-confidence intent, and financial exceptions are automatically routed to human reviewers.</p></div></div></div><div className="rounded-2xl bg-slate-900 p-6 text-white"><p className="flex items-center gap-2 text-sm font-semibold text-indigo-200"><ShieldCheck className="size-4" />Safety controls active</p><h2 className="mt-3 text-xl font-semibold">Every AI response is policy-aware.</h2><p className="mt-3 max-w-md text-sm leading-6 text-slate-300">SupportOS detects sensitive data, makes unsupported promises visible, and requires human approval for protected workflows.</p></div></section></>;
}
