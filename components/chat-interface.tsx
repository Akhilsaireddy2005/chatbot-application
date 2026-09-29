"use client";

import React, { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { ApiKeyModal } from "./api-key-modal";
import { KnowledgeBaseDrawer } from "./knowledge-base-drawer";
import { CitationItem } from "./rag-citations";
import {
  Bot,
  Sparkles,
  Layers,
  BookOpen,
  Key,
  Plus,
  ChevronRight,
  ShieldCheck,
  Menu,
} from "lucide-react";

export function ChatInterface() {
  const [ragEnabled, setRagEnabled] = useState(true);
  const [userApiKey, setUserApiKey] = useState("");
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [citationsMap, setCitationsMap] = useState<Record<string, CitationItem[]>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("custom_ai_api_key");
      if (saved) setUserApiKey(saved);
    }
  }, []);

  const { messages, input, setInput, handleSubmit, isLoading, stop, setMessages } = useChat({
    api: "/api/chat",
    body: { ragEnabled, userApiKey },
    onResponse: (response) => {
      setApiError(null);
      const header = response.headers.get("x-rag-citations");
      if (header) {
        try {
          const parsed: CitationItem[] = JSON.parse(decodeURIComponent(header));
          setTimeout(() => {
            setMessages((prev) => {
              if (prev.length > 0) {
                const lastId = prev[prev.length - 1].id;
                setCitationsMap((c) => ({ ...c, [lastId]: parsed }));
              }
              return prev;
            });
          }, 100);
        } catch {}
      }
    },
    onError: (error) => {
      console.error("Chat Error:", error);
      setApiError(error?.message || "Something went wrong. Check your API key.");
    },
  });

  const handleNewChat = () => {
    setMessages([]);
    setCitationsMap({});
    setApiError(null);
  };

  const handleFormSubmit = (e: React.FormEvent, attachments?: any) => {
    if (attachments?.length > 0) {
      handleSubmit(e, { experimental_attachments: attachments });
    } else {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* ─── Sidebar ─── */}
      <aside
        className={`${
          isSidebarOpen ? "flex" : "hidden"
        } md:flex h-full w-60 shrink-0 flex-col border-r border-slate-800/80 bg-slate-950 p-4`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-400 shadow-lg ring-1 ring-white/10">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-slate-100">Universal AI</p>
            <p className="flex items-center gap-1 text-[11px] text-indigo-400">
              <Sparkles className="h-3 w-3" /> Multimodal assistant
            </p>
          </div>
        </div>

        {/* New Chat */}
        <button
          onClick={handleNewChat}
          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-colors active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> New Chat
        </button>

        {/* RAG Toggle */}
        <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3.5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold uppercase tracking-wider text-[11px] text-slate-300">
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              RAG Knowledge Base
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={ragEnabled}
                onChange={(e) => setRagEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="peer h-5 w-9 rounded-full bg-slate-800 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white" />
            </label>
          </div>
          <button
            onClick={() => setIsKnowledgeBaseOpen(true)}
            className="mt-1 flex items-center justify-between rounded-xl border border-indigo-500/20 bg-indigo-950/20 px-3 py-2 font-medium text-indigo-300 transition-colors hover:bg-indigo-900/40"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
              Manage Docs
            </div>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-slate-800/80 pt-3">
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-slate-300 hover:border-indigo-500/40 hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-indigo-400" />
              <span className="font-medium">API Key (Groq)</span>
            </div>
            {userApiKey ? (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" /> Set
              </span>
            ) : (
              <span className="text-[10px] text-slate-500">From .env</span>
            )}
          </button>
        </div>
      </aside>

      {/* ─── Main Area ─── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-xl border border-slate-800 p-2 text-slate-400 hover:bg-slate-900"
            >
              <Menu className="h-5 w-5" />
            </button>
            <p className="text-sm font-semibold text-slate-100">Universal AI <span className="font-normal text-slate-400">· Multimodal assistant</span></p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${
                ragEnabled
                  ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-300"
                  : "border-slate-800 bg-slate-900 text-slate-500"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              RAG {ragEnabled ? "On" : "Off"}
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-purple-300">
              <Sparkles className="h-3.5 w-3.5" />
              Text · Image · Vision
            </span>
          </div>
        </header>

        {/* Error Banner */}
        {apiError && (
          <div className="mx-4 mt-3 flex items-start justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-3 text-xs text-rose-300">
            <div>
              <p className="font-semibold text-rose-200 mb-0.5">⚠️ API Error</p>
              <p className="text-rose-300/80">{apiError}</p>
              <p className="mt-1 text-rose-400/70">
                Check the API key for the selected model in your <code className="rounded bg-rose-900/60 px-1">.env.local</code> file, then restart the dev server.
              </p>
            </div>
            <button onClick={() => setApiError(null)} className="shrink-0 text-rose-400 hover:text-rose-200 text-base leading-none">✕</button>
          </div>
        )}

        {/* Messages */}
        <ChatMessages messages={messages} isLoading={isLoading} citationsMap={citationsMap} />

        {/* Input */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          onStop={stop}
        />
      </div>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={userApiKey}
        setApiKey={(k) => {
          setUserApiKey(k);
          localStorage.setItem("custom_ai_api_key", k);
        }}
      />
      <KnowledgeBaseDrawer isOpen={isKnowledgeBaseOpen} onClose={() => setIsKnowledgeBaseOpen(false)} />
    </div>
  );
}
