"use client";

import React from "react";
import {
  Bot,
  BookOpen,
  Key,
  Plus,
  Sparkles,
  Cpu,
  Layers,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface SidebarProps {
  model: string;
  setModel: (m: string) => void;
  provider: string;
  setProvider: (p: string) => void;
  ragEnabled: boolean;
  setRagEnabled: (b: boolean) => void;
  onOpenApiKeyModal: () => void;
  onOpenKnowledgeBase: () => void;
  onNewChat: () => void;
  apiKeySet: boolean;
}

export function Sidebar({
  model,
  setModel,
  provider,
  setProvider,
  ragEnabled,
  setRagEnabled,
  onOpenApiKeyModal,
  onOpenKnowledgeBase,
  onNewChat,
  apiKeySet,
}: SidebarProps) {
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setModel(val);
    if (val.includes("gemini")) {
      setProvider("google");
    } else if (val.includes("gpt")) {
      setProvider("openai");
    } else {
      setProvider("groq");
    }
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-800/80 bg-slate-950 p-4 text-slate-200">
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-400 shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-100 tracking-tight">
              Universal AI
            </h1>
            <span className="flex items-center gap-1 text-[11px] font-medium text-indigo-400">
              <Sparkles className="h-3 w-3" /> Text & Image AI
            </span>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all hover:opacity-90 active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" />
        New Chat
      </button>

      {/* Main Settings List */}
      <div className="mt-5 flex flex-1 flex-col gap-4 overflow-y-auto pr-1 text-xs">
        {/* Model Selector */}
        <div className="flex flex-col gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3.5">
          <div className="flex items-center gap-2 text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span>AI Model Engine</span>
          </div>
          <select
            value={model}
            onChange={handleModelChange}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none cursor-pointer"
          >
            <optgroup label="Groq (High Speed)">
              <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Text & Code)</option>
              <option value="llama-3.2-11b-vision-preview">Llama 3.2 11B (Vision)</option>
            </optgroup>
            <optgroup label="Google Gemini">
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Multimodal)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            </optgroup>
            <optgroup label="OpenAI">
              <option value="gpt-4o-mini">GPT-4o mini</option>
            </optgroup>
          </select>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
            <span>Provider: <strong className="text-indigo-300 capitalize">{provider}</strong></span>
            <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-indigo-300 font-mono">Vision & Image</span>
          </div>
        </div>

        {/* RAG Knowledge Base */}
        <div className="flex flex-col gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              <span>RAG Knowledge Base</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={ragEnabled}
                onChange={(e) => setRagEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          <button
            onClick={onOpenKnowledgeBase}
            className="mt-1 flex items-center justify-between rounded-xl border border-indigo-500/20 bg-indigo-950/20 px-3 py-2 text-xs font-medium text-indigo-300 transition-colors hover:bg-indigo-900/40"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
              <span>Manage Documents</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Footer API Key Button */}
      <div className="mt-auto border-t border-slate-800/80 pt-3">
        <button
          onClick={onOpenApiKeyModal}
          className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-slate-300 transition-colors hover:border-indigo-500/40 hover:bg-slate-800"
        >
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-indigo-400" />
            <span className="font-medium">API Keys</span>
          </div>
          {apiKeySet ? (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" /> Configured
            </span>
          ) : (
            <span className="text-[10px] text-slate-500">Default Env</span>
          )}
        </button>
      </div>
    </aside>
  );
}
