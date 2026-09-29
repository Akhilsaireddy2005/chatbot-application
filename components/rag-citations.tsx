"use client";

import React, { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, FileText, Sparkles } from "lucide-react";

export interface CitationItem {
  docTitle: string;
  category: string;
  score: number; // 0 to 1
  snippet: string;
}

interface RAGCitationsProps {
  citations: CitationItem[];
}

export function RAGCitations({ citations }: RAGCitationsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!citations || citations.length === 0) return null;

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-indigo-500/20 bg-slate-900/60 p-3.5 shadow-sm text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between font-medium text-indigo-300 transition-colors hover:text-indigo-200"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-indigo-400" />
          <span>Retrieved Context ({citations.length} Grounded Sources)</span>
          <span className="flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] text-indigo-400 border border-indigo-500/20">
            <Sparkles className="h-3 w-3" /> RAG Grounded
          </span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {isOpen && (
        <div className="mt-3 flex flex-col gap-2.5 border-t border-slate-800 pt-3">
          {citations.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 transition-colors hover:border-indigo-500/30"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 font-medium text-slate-200">
                  <FileText className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{item.docTitle}</span>
                  <span className="text-[10px] text-slate-400">({item.category})</span>
                </div>
                <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                  {(item.score * 100).toFixed(0)}% Match
                </span>
              </div>
              <p className="text-slate-400 line-clamp-3 leading-relaxed text-[11px] font-mono bg-slate-900/80 p-2 rounded">
                "{item.snippet}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
