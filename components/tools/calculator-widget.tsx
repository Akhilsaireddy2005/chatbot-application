"use client";

import React from "react";
import { Calculator, CheckCircle2, FunctionSquare } from "lucide-react";

interface CalculatorWidgetProps {
  expression: string;
  result: string;
  explanation?: string;
}

export function CalculatorWidget({
  expression,
  result,
  explanation,
}: CalculatorWidgetProps) {
  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100">Math & Symbolic Evaluator</h4>
            <p className="text-xs text-slate-400">Step-by-step computation</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Verified</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Expression</span>
          <div className="mt-1 font-mono text-sm text-emerald-300 flex items-center gap-2">
            <FunctionSquare className="h-4 w-4 text-emerald-400" />
            <span>{expression}</span>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3">
          <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">Calculated Result</span>
          <div className="mt-1 text-2xl font-bold text-slate-100 font-mono">
            {result}
          </div>
        </div>

        {explanation && (
          <p className="text-xs text-slate-400 leading-relaxed italic">
            💡 {explanation}
          </p>
        )}
      </div>
    </div>
  );
}
