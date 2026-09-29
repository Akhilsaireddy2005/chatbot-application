"use client";

import React, { useState } from "react";
import { Message } from "ai";
import { Bot, User, Copy, Check, Sparkles, Loader2, Image as ImageIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import { RAGCitations, CitationItem } from "./rag-citations";
import { ChartWidget } from "./tools/chart-widget";
import { SearchResultsWidget } from "./tools/search-results-widget";
import { WeatherWidget } from "./tools/weather-widget";
import { CalculatorWidget } from "./tools/calculator-widget";
import { ImageGeneratorWidget } from "./tools/image-generator-widget";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  citationsMap: Record<string, CitationItem[]>;
}

export function ChatMessages({ messages, isLoading, citationsMap }: ChatMessagesProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 md:p-6">
      {messages.length === 0 ? (
        <div className="my-auto flex flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-400 text-white shadow-xl shadow-indigo-500/20 ring-1 ring-white/20">
            <Bot className="h-9 w-9" />
          </div>
          <h2 className="mt-4 font-bold text-slate-100 text-xl">Universal AI</h2>
          <p className="mt-1.5 max-w-md text-xs text-slate-400 leading-relaxed">
            Generate text, code, AI images, charts, live web search, and weather. Grounded in RAG knowledge base.
          </p>
        </div>
      ) : (
        messages.map((message) => {
          const isUser = message.role === "user";
          const citations = citationsMap[message.id];

          return (
            <div
              key={message.id}
              className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-md ring-1 ring-white/20">
                  <Bot className="h-5 w-5" />
                </div>
              )}

              <div className={`flex max-w-[85%] flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                  <span>{isUser ? "You" : "Universal AI"}</span>
                  {!isUser && (
                    <span className="flex items-center gap-0.5 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] text-indigo-300 border border-indigo-500/20">
                      <Sparkles className="h-3 w-3" /> Assistant
                    </span>
                  )}
                </div>

                <div
                  className={`group relative rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-lg ${
                    isUser
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "border border-slate-800 bg-slate-900/90 text-slate-200 rounded-bl-none backdrop-blur-md"
                  }`}
                >
                  {/* Multimodal Attachments (Uploaded User Images) */}
                  {message.experimental_attachments && message.experimental_attachments.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {message.experimental_attachments.map((attachment, idx) => (
                        <div key={idx} className="relative overflow-hidden rounded-xl border border-white/20 max-w-xs">
                          {attachment.contentType?.startsWith("image/") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={attachment.url}
                              alt={attachment.name || "Attachment"}
                              className="max-h-48 w-auto object-cover rounded-xl"
                            />
                          ) : (
                            <div className="flex items-center gap-2 bg-slate-950 p-2 text-xs text-slate-300">
                              <ImageIcon className="h-4 w-4" />
                              <span>{attachment.name || "Attached File"}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Text Content */}
                  <div className="prose prose-invert max-w-none text-xs leading-relaxed">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        code({ className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          const codeText = String(children).replace(/\n$/, "");
                          return match ? (
                            <div className="relative my-2 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs text-slate-200">
                              <div className="flex items-center justify-between border-b border-slate-800 px-3 py-1.5 bg-slate-900/60 text-[10px] text-slate-400">
                                <span>{match[1]}</span>
                                <button
                                  onClick={() => handleCopy(codeText, message.id + codeText)}
                                  className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
                                >
                                  {copiedId === message.id + codeText ? (
                                    <Check className="h-3 w-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                  <span>{copiedId === message.id + codeText ? "Copied" : "Copy"}</span>
                                </button>
                              </div>
                              <pre className="p-3 overflow-x-auto text-xs">
                                <code>{children}</code>
                              </pre>
                            </div>
                          ) : (
                            <code className="rounded bg-slate-800/80 px-1.5 py-0.5 text-indigo-300 font-mono text-[11px]" {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>

                  {/* Generative UI Tool Execution Components */}
                  {message.toolInvocations && message.toolInvocations.length > 0 && (
                    <div className="mt-3 flex flex-col gap-2 border-t border-slate-800/80 pt-3">
                      {message.toolInvocations.map((toolInvocation) => {
                        const { toolName, toolCallId, state } = toolInvocation;

                        if (state !== "result") {
                          return (
                            <div
                              key={toolCallId}
                              className="flex items-center gap-2 rounded-xl bg-slate-950/60 p-2.5 text-xs text-indigo-300 border border-indigo-500/20"
                            >
                              <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                              <span>Executing Tool: <strong>{toolName}</strong>...</span>
                            </div>
                          );
                        }

                        const { result } = toolInvocation;

                        if (toolName === "generateImage") {
                          return (
                            <ImageGeneratorWidget
                              key={toolCallId}
                              prompt={result.prompt}
                              imageUrl={result.imageUrl}
                              generatedAt={result.generatedAt}
                            />
                          );
                        }

                        if (toolName === "generateChart") {
                          return (
                            <ChartWidget
                              key={toolCallId}
                              title={result.title}
                              chartType={result.chartType}
                              data={result.data}
                              xAxisLabel={result.xAxisLabel}
                              yAxisLabel={result.yAxisLabel}
                              generatedAt={result.generatedAt}
                            />
                          );
                        }

                        if (toolName === "webSearch") {
                          return (
                            <SearchResultsWidget
                              key={toolCallId}
                              query={result.query}
                              results={result.results}
                              timestamp={result.timestamp}
                            />
                          );
                        }

                        if (toolName === "getWeather") {
                          return (
                            <WeatherWidget
                              key={toolCallId}
                              location={result.location}
                              temp={result.temp}
                              condition={result.condition}
                              humidity={result.humidity}
                              windSpeed={result.windSpeed}
                              high={result.high}
                              low={result.low}
                              unit={result.unit}
                              fetchedAt={result.fetchedAt}
                            />
                          );
                        }

                        if (toolName === "calculateMath") {
                          return (
                            <CalculatorWidget
                              key={toolCallId}
                              expression={result.expression}
                              result={result.result}
                              explanation={result.explanation}
                            />
                          );
                        }

                        return null;
                      })}
                    </div>
                  )}

                  {/* RAG Citations Accordion */}
                  {!isUser && citations && citations.length > 0 && (
                    <RAGCitations citations={citations} />
                  )}
                </div>
              </div>

              {isUser && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-800 text-slate-300 shadow-md">
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Loading Indicator */}
      {isLoading && messages[messages.length - 1]?.role === "user" && (
        <div className="flex gap-3.5 items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-md animate-pulse">
            <Bot className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-xs text-slate-300 shadow-lg">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
            <span>Processing Query & Generating Output...</span>
          </div>
        </div>
      )}
    </div>
  );
}
