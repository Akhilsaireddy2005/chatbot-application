"use client";

import React, { useState } from "react";
import { Send, Image as ImageIcon, X, Sparkles, StopCircle } from "lucide-react";

interface Attachment {
  name: string;
  contentType: string;
  url: string;
}

interface ChatInputProps {
  input: string;
  setInput: (v: string) => void;
  onSubmit: (e: React.FormEvent, attachments?: Attachment[]) => void;
  isLoading: boolean;
  onStop: () => void;
}

const SAMPLES = [
  { label: "🎨 Generate Image", text: "Generate an image of a neon cyberpunk city at night." },
  { label: "📊 Bar Chart", text: "Create a bar chart of top 5 programming languages by popularity." },
  { label: "🔍 Web Search", text: "Search the web for the latest AI news today." },
  { label: "⛅ Weather", text: "What is the weather in Tokyo right now?" },
];

export function ChatInput({ input, setInput, onSubmit, isLoading, onStop }: ChatInputProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const textRef = React.useRef<HTMLTextAreaElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAttachments((p) => [
          ...p,
          { name: file.name, contentType: file.type, url: ev.target?.result as string },
        ]);
      };
      reader.readAsDataURL(file);
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !attachments.length) || isLoading) return;
    onSubmit(e, attachments.length ? attachments : undefined);
    setAttachments([]);
  };

  return (
    <div className="flex flex-col gap-3 border-t border-slate-800/80 bg-slate-950 p-4">
      {/* Sample prompts */}
      <div className="flex flex-wrap gap-2">
        <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400">
          <Sparkles className="h-3 w-3" /> Try:
        </span>
        {SAMPLES.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => { setInput(s.text); textRef.current?.focus(); }}
            className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-300 hover:border-indigo-500/40 hover:text-indigo-200 transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form
        onSubmit={submit}
        className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/90 p-3 shadow-xl focus-within:border-indigo-500/50 transition-colors"
      >
        {/* Attachment previews */}
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2 border-b border-slate-800 pb-2">
            {attachments.map((a, i) => (
              <div key={i} className="relative flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-slate-950 px-2.5 py-1.5 text-xs text-indigo-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.url} alt={a.name} className="h-6 w-6 rounded object-cover" />
                <span className="max-w-[100px] truncate text-[11px]">{a.name}</span>
                <button type="button" onClick={() => setAttachments((p) => p.filter((_, j) => j !== i))}>
                  <X className="h-3.5 w-3.5 text-slate-400 hover:text-rose-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={textRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) submit(e); }}
          placeholder="Chat, ask, generate images, search the web…"
          rows={2}
          className="w-full resize-none bg-transparent px-1 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />

        <div className="mt-2 flex items-center justify-between border-t border-slate-800/60 pt-2">
          <div>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFile} className="hidden" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 hover:border-indigo-500/30 hover:text-indigo-300 transition-colors"
            >
              <ImageIcon className="h-4 w-4 text-indigo-400" />
              Image
            </button>
          </div>

          {isLoading ? (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 transition-colors"
            >
              <StopCircle className="h-4 w-4" /> Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() && !attachments.length}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-40 transition-all active:scale-[0.98]"
            >
              <Send className="h-4 w-4" /> Send
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
