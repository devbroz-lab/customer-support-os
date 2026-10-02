"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bot, ChevronDown, Compass, Headphones, Inbox, LayoutDashboard, Menu, Settings, Sparkles } from "lucide-react";
import { useState } from "react";
import { useDemo } from "@/components/demo-provider";
import { useProductTour } from "@/components/product-tour";
import { cn } from "@/lib/utils";

const nav = [{ href: "/", label: "Overview", icon: LayoutDashboard }, { href: "/reviews", label: "Customer inbox", icon: Inbox }, { href: "/performance", label: "Team performance", icon: BarChart3 }, { href: "/ai-operations", label: "AI operations", icon: Bot }];

export function Sidebar() {
  const pathname = usePathname(); const [open, setOpen] = useState(false); const { cases } = useDemo(); const { startTour } = useProductTour();
  const inboxCount = cases.filter((item) => item.status === "New" || item.status === "Open").length;
  return <>
    <button onClick={() => setOpen(!open)} className="fixed left-4 top-4 z-50 rounded-xl border bg-white p-2 text-slate-700 shadow-sm lg:hidden"><Menu className="size-5" /></button>
    <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 transition-transform lg:translate-x-0", open ? "translate-x-0 shadow-2xl" : "-translate-x-full")}>
      <div className="mb-9 flex items-center gap-3 px-2"><div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-700 text-white shadow-lg shadow-indigo-200"><Headphones className="size-5" /></div><div><p className="text-[15px] font-bold tracking-tight">Devbroz SupportOS</p><p className="text-xs text-slate-500">Customer operations</p></div></div>
      <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">Workspace</div>
      <nav className="space-y-1">{nav.map((item) => { const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition", active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950")}><item.icon className="size-[18px]" />{item.label}{item.href === "/reviews" && <span className="ml-auto rounded-md bg-indigo-100 px-1.5 py-0.5 text-[11px] font-bold text-indigo-700">{inboxCount}</span>}</Link>; })}</nav>
      <div className="mt-auto space-y-3"><div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-indigo-200"><Sparkles className="size-3.5" />AI coverage</div><p className="text-2xl font-semibold">94.2%</p><p className="mt-1 text-xs leading-5 text-slate-300">of incoming cases are enriched with actionable context.</p></div><button onClick={() => { setOpen(false); startTour(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"><Compass className="size-[18px]" />Product tour</button><button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-slate-50"><Settings className="size-[18px]" />Workspace settings</button><div className="flex items-center gap-3 border-t pt-4"><div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-amber-200 to-rose-300 text-xs font-bold text-slate-700">MC</div><div className="flex-1"><p className="text-sm font-semibold">Maya Chen</p><p className="text-xs text-slate-500">Senior reviewer</p></div><ChevronDown className="size-4 text-slate-400" /></div></div>
    </aside>
  </>;
}
