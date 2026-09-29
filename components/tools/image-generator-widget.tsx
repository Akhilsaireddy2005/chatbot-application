"use client";

import React, { useState } from "react";
import { Download, Image as ImageIcon, Sparkles, ExternalLink, RefreshCw } from "lucide-react";

interface ImageGeneratorWidgetProps {
  prompt: string;
  imageUrl: string;
  generatedAt?: string;
}

export function ImageGeneratorWidget({ prompt, imageUrl, generatedAt }: ImageGeneratorWidgetProps) {
  const [loaded, setLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(imageUrl);

  const handleDownload = async () => {
    try {
      const res = await fetch(imgSrc);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-generated-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      window.open(imgSrc, "_blank");
    }
  };

  const handleRegenerate = () => {
    setLoaded(false);
    const newSeed = Math.floor(Math.random() * 1000000);
    const updatedUrl = `${imageUrl.split("&seed=")[0]}&seed=${newSeed}`;
    setImgSrc(updatedUrl);
  };

  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-purple-500/30 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md transition-all">
      {/* Widget Header */}
      <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100">AI Image Generator</h4>
            <p className="text-xs text-slate-400">Generative Vision Artifact</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300 border border-purple-500/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>GenUI Image</span>
        </div>
      </div>

      {/* Image Container with Shimmer Loading */}
      <div className="relative group overflow-hidden rounded-xl border border-slate-800 bg-slate-950 min-h-[300px] flex items-center justify-center">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950 p-6 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500"></div>
            <p className="text-xs text-slate-400 font-medium">Generating high-resolution AI image...</p>
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={prompt}
          onLoad={() => setLoaded(true)}
          className={`w-full max-h-[500px] object-cover transition-all duration-500 ${
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        />

        {/* Hover Overlay Controls */}
        {loaded && (
          <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
            <p className="text-xs font-medium text-slate-200 line-clamp-2 max-w-[70%]">
              "{prompt}"
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRegenerate}
                title="Regenerate Image"
                className="rounded-xl bg-slate-900/80 p-2 text-slate-200 border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={handleDownload}
                title="Download Image"
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg hover:bg-purple-500 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span className="truncate max-w-[80%] font-mono text-[11px] text-purple-300">
          Prompt: "{prompt}"
        </span>
        <a
          href={imgSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] text-purple-400 hover:underline shrink-0"
        >
          <span>Full Res</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
