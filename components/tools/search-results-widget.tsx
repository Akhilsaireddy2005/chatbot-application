"use client";

import React from "react";
import { ExternalLink, Globe, Search } from "lucide-react";

interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
  domain: string;
}

interface SearchResultsWidgetProps {
  query: string;
  results: SearchResultItem[];
  timestamp?: string;
}

export function SearchResultsWidget({ query, results }: SearchResultsWidgetProps) {
  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-sky-500/20 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100">Live Web Search</h4>
            <p className="text-xs text-slate-400">
              Query: <span className="font-medium text-sky-300">"{query}"</span>
            </p>
          </div>
        </div>
        <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs text-sky-400 border border-sky-500/20">
          {results.length} Sources Found
        </span>
      </div>

      {/* Result Cards */}
      <div className="flex flex-col gap-3">
        {results.map((item, idx) => (
          <a
            key={idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-1.5 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 transition-all hover:border-sky-500/40 hover:bg-slate-800/40"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-sky-400">
                <Globe className="h-3.5 w-3.5" />
                <span className="font-medium">{item.domain}</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-sky-400" />
            </div>
            <h5 className="font-medium text-slate-200 group-hover:text-sky-300">
              {item.title}
            </h5>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {item.snippet}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
