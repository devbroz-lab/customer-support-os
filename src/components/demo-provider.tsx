"use client";

import { createContext, useContext, useState } from "react";
import { demoCases, type SupportCase, type CaseStatus } from "@/lib/demo-data";

type DemoContextValue = {
  cases: SupportCase[];
  updateCase: (id: string, changes: Partial<SupportCase>, audit?: string) => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState(demoCases);
  const updateCase = (id: string, changes: Partial<SupportCase>, audit?: string) => {
    setCases((current) => current.map((item) => item.id !== id ? item : {
      ...item,
      ...changes,
      audit: audit ? [...item.audit, { label: audit, actor: "Maya Chen", time: "Just now" }] : item.audit,
    }));
  };
  return <DemoContext.Provider value={{ cases, updateCase }}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used within DemoProvider");
  return context;
}

export function statusColor(status: CaseStatus) {
  return { New: "bg-blue-50 text-blue-700 ring-blue-200", Open: "bg-indigo-50 text-indigo-700 ring-indigo-200", Waiting: "bg-amber-50 text-amber-700 ring-amber-200", Escalated: "bg-rose-50 text-rose-700 ring-rose-200", Resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200" }[status];
}
