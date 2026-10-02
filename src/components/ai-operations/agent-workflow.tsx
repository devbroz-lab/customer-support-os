"use client";

import { useEffect, useMemo, useState } from "react";
import { Background, BackgroundVariant, Controls, Handle, MiniMap, Position, ReactFlow, type Edge, type Node, type NodeProps } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BrainCircuit, CirclePause, CirclePlay, Database, GitBranch, Mail, MessageSquareText, RotateCcw, Sparkles, UserCheck } from "lucide-react";
import workflow from "@/flows/customer-support-hitl.json";
import { normalizeLangflowFlow } from "@/features/langflow-viewer/lib/normalize-flow";

type Stage = "ingest" | "triage" | "context" | "understand" | "verify" | "draft" | "review";
type AgentData = { title: string; description: string; stage: Stage; active: boolean; underlying: string[] };

const stageInfo: Record<Stage, { label: string; accent: string; soft: string; border: string; icon: typeof Mail }> = {
  ingest: { label: "Ingest", accent: "#3b82f6", soft: "#eff6ff", border: "#bfdbfe", icon: Mail },
  triage: { label: "Triage", accent: "#8b5cf6", soft: "#f5f3ff", border: "#ddd6fe", icon: GitBranch },
  context: { label: "Context", accent: "#14b8a6", soft: "#f0fdfa", border: "#99f6e4", icon: MessageSquareText },
  understand: { label: "Understand", accent: "#6366f1", soft: "#eef2ff", border: "#c7d2fe", icon: BrainCircuit },
  verify: { label: "Verify", accent: "#f59e0b", soft: "#fffbeb", border: "#fde68a", icon: Database },
  draft: { label: "Draft", accent: "#d946ef", soft: "#fdf4ff", border: "#f5d0fe", icon: Sparkles },
  review: { label: "Human review", accent: "#f43f5e", soft: "#fff1f2", border: "#fecdd3", icon: UserCheck },
};

const agents: Array<Omit<Node<AgentData>, "data"> & { data: Omit<AgentData, "active"> }> = [
  { id: "trigger", type: "agent", position: { x: 40, y: 300 }, data: { stage: "ingest", title: "Incoming Case Trigger", description: "Receives a new customer message and starts the workflow.", underlying: ["Incoming event", "Message identifier"] } },
  { id: "intake", type: "agent", position: { x: 350, y: 300 }, data: { stage: "ingest", title: "Email Intake Agent", description: "Retrieves and structures the customer email for analysis.", underlying: ["Email retrieval", "Message preparation"] } },
  { id: "classify", type: "agent", position: { x: 660, y: 170 }, data: { stage: "triage", title: "Message Classification Agent", description: "Assesses relevance and routes eligible customer requests.", underlying: ["Classification", "Relevance gate"] } },
  { id: "history", type: "agent", position: { x: 660, y: 440 }, data: { stage: "context", title: "Conversation History Agent", description: "Rebuilds the complete conversation and related messages.", underlying: ["Conversation lookup", "History assembly", "Thread context"] } },
  { id: "understand", type: "agent", position: { x: 970, y: 170 }, data: { stage: "understand", title: "Customer Understanding Agent", description: "Extracts intent, urgency, tone, and customer identifiers.", underlying: ["Understanding model", "Structured understanding"] } },
  { id: "knowledge", type: "agent", position: { x: 970, y: 440 }, data: { stage: "verify", title: "Company Knowledge Agent", description: "Retrieves trusted company context needed for a safe response.", underlying: ["Company data lookup", "Trusted context"] } },
  { id: "evidence", type: "agent", position: { x: 1280, y:440 }, data: { stage: "verify", title: "Verified Evidence Agent", description: "Structures trusted facts and flags information gaps.", underlying: ["Evidence parsing", "Verified facts"] } },
  { id: "plan", type: "agent", position: { x: 1280, y: 170 }, data: { stage: "draft", title: "Response Planning Agent", description: "Combines customer context and verified facts into a response plan.", underlying: ["Response planning", "Safety guardrails"] } },
  { id: "generate", type: "agent", position: { x: 1590, y: 170 }, data: { stage: "draft", title: "Response Generation Agent", description: "Creates the proposed customer-facing response.", underlying: ["Response generation"] } },
  { id: "quality", type: "agent", position: { x: 1590, y: 440 }, data: { stage: "draft", title: "Response Quality Agent", description: "Structures the final draft for a confident human review.", underlying: ["Draft quality check", "Structured response"] } },
  { id: "handoff", type: "agent", position: { x: 1900, y: 300 }, data: { stage: "review", title: "Human Review Handoff", description: "Packages the case, facts, and draft for SupportOS review.", underlying: ["Review payload", "Case handoff"] } },
];

const connections: Array<[string, string]> = [["trigger", "intake"], ["intake", "classify"], ["intake", "history"], ["classify", "understand"], ["history", "understand"], ["history", "knowledge"], ["understand", "plan"], ["knowledge", "evidence"], ["evidence", "plan"], ["plan", "generate"], ["generate", "quality"], ["quality", "handoff"]];
const playback = ["trigger", "intake", "classify", "history", "understand", "knowledge", "evidence", "plan", "generate", "quality", "handoff"];

function AgentNode({ data }: NodeProps<Node<AgentData>>) {
  const info = stageInfo[data.stage]; const Icon = info.icon;
  return <article className="relative h-[142px] w-[254px] overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl" style={{ borderColor: data.active ? info.accent : info.border, boxShadow: data.active ? `0 0 0 4px ${info.accent}2b, 0 16px 34px ${info.accent}30` : undefined }}><div className="h-1.5" style={{ background: info.accent }} /><div className="p-3.5"><div className="flex items-start gap-2.5"><span className="grid size-9 shrink-0 place-items-center rounded-xl" style={{ background: info.soft, color: info.accent }}><Icon className="size-[18px]" /></span><div className="min-w-0"><div className="flex items-center gap-2"><p className="truncate text-sm font-bold text-slate-800">{data.title}</p>{data.active && <span className="size-2 shrink-0 animate-pulse rounded-full" style={{ background: info.accent }} />}</div><p className="mt-0.5 text-[11px] font-bold" style={{ color: info.accent }}>{info.label}</p></div></div><p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">{data.description}</p><div className="mt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-slate-400"><span>{data.underlying.length} capability{data.underlying.length === 1 ? "" : "ies"}</span><span>View details</span></div></div><Handle type="target" position={Position.Left} className="!size-2.5 !border-2 !border-white" style={{ background: info.accent }} /><Handle type="source" position={Position.Right} className="!size-2.5 !border-2 !border-white" style={{ background: info.accent }} /></article>;
}

const nodeTypes = { agent: AgentNode };

export function AgentWorkflow() {
  const [playing, setPlaying] = useState(true); const [step, setStep] = useState(0); const [selected, setSelected] = useState<AgentData | null>(null);
  const graphStats = useMemo(() => normalizeLangflowFlow(workflow), []);
  useEffect(() => { if (!playing) return; const timer = window.setInterval(() => setStep((value) => (value + 1) % playback.length), 2200); return () => window.clearInterval(timer); }, [playing]);
  const current = playback[step];
  const nodes = useMemo<Node<AgentData>[]>(() => agents.map((node) => ({ ...node, data: { ...node.data, active: node.id === current } })), [current]);
  const edges = useMemo<Edge[]>(() => connections.map(([source, target]) => { const stage = nodes.find((node) => node.id === source)?.data.stage ?? "understand"; const active = source === current || target === current; return { id: `${source}-${target}`, source, target, type: "smoothstep", animated: true, style: { stroke: stageInfo[stage].accent, strokeWidth: active ? 3.5 : 2.2, opacity: active ? 1 : 0.65 } }; }), [current, nodes]);
  const activeData = nodes.find((node) => node.id === current)?.data;
  const restart = () => { setStep(0); setPlaying(true); };
  return <section data-tour="agent-workflow" className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><header className="flex flex-col gap-5 border-b border-slate-200 px-6 py-5 lg:flex-row lg:items-center lg:justify-between"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-indigo-600"><Sparkles className="size-3.5" />Live workflow playback</p><h2 className="mt-2 text-xl font-bold tracking-tight">Agent workflow orchestration</h2><p className="mt-1 text-sm text-slate-500">{graphStats.nodes.length} coordinated workflow components, presented as a customer-operations agent map.</p></div><div className="flex flex-wrap items-center gap-2"><button onClick={() => setPlaying(!playing)} className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">{playing ? <CirclePause className="size-4" /> : <CirclePlay className="size-4" />}{playing ? "Pause" : "Play"}</button><button onClick={restart} className="inline-flex h-9 items-center gap-2 rounded-xl bg-indigo-600 px-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700"><RotateCcw className="size-4" />Restart flow</button></div></header><div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/70 px-6 py-4 xl:flex-row xl:items-center xl:justify-between"><div className="flex flex-wrap gap-x-4 gap-y-2">{Object.entries(stageInfo).map(([stage, info]) => <span key={stage} className="flex items-center gap-2 text-xs font-bold text-slate-600"><span className="size-2.5 rounded-full" style={{ background: info.accent }} />{info.label}</span>)}</div>{activeData && <div className="rounded-xl border bg-white px-4 py-2.5" style={{ borderColor: stageInfo[activeData.stage].border }}><p className="text-[10px] font-bold uppercase tracking-[.12em]" style={{ color: stageInfo[activeData.stage].accent }}>Now processing</p><p className="mt-1 text-sm font-semibold text-slate-800">{activeData.title}</p></div>}</div><div className="relative h-[680px] bg-[#f8f9ff]"><ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.14, maxZoom: 0.85 }} minZoom={0.25} maxZoom={1.4} nodesDraggable onNodeClick={(_, node) => setSelected(node.data as AgentData)} proOptions={{ hideAttribution: true }}><Background variant={BackgroundVariant.Dots} gap={22} size={1.5} color="#c7d2fe" /><Controls showInteractive={false} /><MiniMap pannable zoomable nodeColor={(node) => stageInfo[(node.data as AgentData).stage]?.accent ?? "#818cf8"} maskColor="rgba(248,249,255,.7)" /></ReactFlow>{selected && <DetailsPanel data={selected} onClose={() => setSelected(null)} />}</div><footer className="flex flex-col gap-2 border-t border-slate-200 bg-white px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>Colored animated connections represent case data moving between agents.</p><p>Click any agent to inspect its role and capabilities.</p></footer></section>;
}

function DetailsPanel({ data, onClose }: { data: AgentData; onClose: () => void }) {
  const info = stageInfo[data.stage];
  return <aside className="absolute bottom-5 right-5 z-10 w-72 rounded-2xl border bg-white p-5 shadow-2xl" style={{ borderColor: info.border }}><button onClick={onClose} className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-slate-700">Close</button><p className="text-[10px] font-bold uppercase tracking-[.12em]" style={{ color: info.accent }}>{info.label}</p><h3 className="mt-2 pr-9 text-base font-bold text-slate-800">{data.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{data.description}</p><div className="mt-4 border-t pt-4"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Underlying capabilities</p><div className="mt-2 flex flex-wrap gap-1.5">{data.underlying.map((item) => <span key={item} className="rounded-md px-2 py-1 text-[11px] font-semibold" style={{ background: info.soft, color: info.accent }}>{item}</span>)}</div></div></aside>;
}
