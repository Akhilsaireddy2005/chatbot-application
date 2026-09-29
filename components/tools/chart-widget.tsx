"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon, Sparkles } from "lucide-react";

interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

interface ChartWidgetProps {
  title: string;
  chartType: "bar" | "line" | "pie";
  data: DataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  generatedAt?: string;
}

const COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#f97316", // Orange
];

export function ChartWidget({
  title,
  chartType,
  data,
  xAxisLabel,
  yAxisLabel,
  generatedAt,
}: ChartWidgetProps) {
  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-indigo-500/20 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md transition-all hover:border-indigo-500/40">
      {/* Widget Header */}
      <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
            {chartType === "bar" && <BarChart3 className="h-5 w-5" />}
            {chartType === "line" && <LineIcon className="h-5 w-5" />}
            {chartType === "pie" && <PieIcon className="h-5 w-5" />}
          </div>
          <div>
            <h4 className="font-semibold text-slate-100">{title}</h4>
            <p className="text-xs text-slate-400">
              Interactive Generative UI Chart • {chartType.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 border border-indigo-500/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>GenUI</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#94a3b8"
                tickLine={false}
                label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -10, fill: "#94a3b8" } : undefined}
              />
              <YAxis stroke="#94a3b8" tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  color: "#f8fafc",
                }}
              />
              <Bar dataKey="value" name={yAxisLabel || "Value"} fill="#6366f1" radius={[6, 6, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
              {data[0]?.secondaryValue !== undefined && (
                <Bar dataKey="secondaryValue" name="Comparison" fill="#10b981" radius={[6, 6, 0, 0]} />
              )}
            </BarChart>
          ) : chartType === "line" ? (
            <LineChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} />
              <YAxis stroke="#94a3b8" tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  color: "#f8fafc",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                name={yAxisLabel || "Value"}
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 5, fill: "#6366f1" }}
                activeDot={{ r: 7 }}
              />
              {data[0]?.secondaryValue !== undefined && (
                <Line
                  type="monotone"
                  dataKey="secondaryValue"
                  name="Comparison"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#10b981" }}
                />
              )}
            </LineChart>
          ) : (
            <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                nameKey="label"
                label={({ label, percent }) => `${label}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  color: "#f8fafc",
                }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: "#94a3b8" }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {generatedAt && (
        <div className="mt-2 text-right text-[10px] text-slate-500">
          Generated at {generatedAt}
        </div>
      )}
    </div>
  );
}
