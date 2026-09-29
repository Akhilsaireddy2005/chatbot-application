"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, FilePlus, Trash2, X, Plus, Layers, CheckCircle2 } from "lucide-react";
import { IngestedDoc } from "@/lib/rag/vector-store";

interface KnowledgeBaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KnowledgeBaseDrawer({ isOpen, onClose }: KnowledgeBaseDrawerProps) {
  const [docs, setDocs] = useState<IngestedDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Form state for new document upload
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Custom Document");
  const [content, setContent] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/rag/ingest");
      const data = await res.json();
      if (data.docs) {
        setDocs(data.docs);
      }
    } catch (err) {
      console.error("Failed to fetch docs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDocs();
    }
  }, [isOpen]);

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setLoading(true);
      const res = await fetch("/api/rag/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, content }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg("Document ingested and vector chunks generated successfully!");
        setTitle("");
        setContent("");
        setIsAdding(false);
        fetchDocs();
      } else {
        setStatusMsg(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/rag/ingest?docId=${encodeURIComponent(docId)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchDocs();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTitle(file.name.replace(/\.[^/.]+$/, ""));
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) setContent(text);
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-xl flex-col bg-slate-900 border-l border-slate-800 shadow-2xl p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Knowledge Base & RAG Index</h3>
              <p className="text-xs text-slate-400">Manage documents grounded in vector search</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status Alert */}
        {statusMsg && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-500/10 p-3 text-xs text-emerald-300 border border-emerald-500/20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{statusMsg}</span>
            </div>
            <button onClick={() => setStatusMsg("")} className="text-emerald-400 font-semibold">
              Dismiss
            </button>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active Documents ({docs.length})
          </span>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30"
          >
            {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isAdding ? "Cancel" : "Add Document"}
          </button>
        </div>

        {/* Add Document Form */}
        {isAdding && (
          <form onSubmit={handleIngest} className="mt-4 flex flex-col gap-3 rounded-2xl border border-indigo-500/20 bg-slate-950 p-4">
            <h4 className="font-medium text-xs text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <FilePlus className="h-4 w-4" /> Ingest New Document
            </h4>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Document Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Next.js Architecture Guide"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Tech Spec / User Manual"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Upload File (.txt, .md, .json)
              </label>
              <input
                type="file"
                accept=".txt,.md,.json"
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-200 hover:file:bg-slate-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Document Text / Markdown</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste or edit text content to index..."
                rows={5}
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              <Layers className="h-4 w-4" />
              Ingest & Generate Vector Chunks
            </button>
          </form>
        )}

        {/* Document List */}
        <div className="mt-4 flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
          {loading && docs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">Loading documents...</div>
          ) : docs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No documents ingested yet. Add a document above to get started with RAG!
            </div>
          ) : (
            docs.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-all hover:border-slate-700"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-semibold text-slate-100 text-sm">{doc.title}</h5>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                        {doc.category}
                      </span>
                      <span>• {doc.chunkCount} Vector Chunks</span>
                      <span>• Added {doc.dateAdded}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    title="Delete Document"
                    className="rounded-lg p-1 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed font-mono bg-slate-900/60 p-2 rounded">
                  {doc.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
