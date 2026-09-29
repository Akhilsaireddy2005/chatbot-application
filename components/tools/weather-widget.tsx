"use client";

import React from "react";
import { Cloud, CloudRain, Sun, Wind, Droplets, ArrowUp, ArrowDown, MapPin } from "lucide-react";

interface WeatherWidgetProps {
  location: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: string;
  high: number;
  low: number;
  unit?: string;
  fetchedAt?: string;
}

export function WeatherWidget({
  location,
  temp,
  condition,
  humidity,
  windSpeed,
  high,
  low,
  unit = "°C",
  fetchedAt,
}: WeatherWidgetProps) {
  const isRainy = condition.toLowerCase().includes("rain");
  const isSunny = condition.toLowerCase().includes("sun") || condition.toLowerCase().includes("clear");

  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/20 p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-amber-400" />
          <h4 className="font-semibold text-slate-100 capitalize">{location}</h4>
        </div>
        {fetchedAt && (
          <span className="text-xs text-slate-400">Updated {fetchedAt}</span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
            {isRainy ? (
              <CloudRain className="h-8 w-8 text-sky-400" />
            ) : isSunny ? (
              <Sun className="h-8 w-8 text-amber-400" />
            ) : (
              <Cloud className="h-8 w-8 text-slate-300" />
            )}
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-slate-100">{temp}</span>
              <span className="text-xl font-medium text-amber-400">{unit}</span>
            </div>
            <p className="text-sm font-medium text-slate-300">{condition}</p>
          </div>
        </div>

        {/* High / Low */}
        <div className="flex flex-col items-end gap-1 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <ArrowUp className="h-3.5 w-3.5 text-emerald-400" />
            <span>High: {high}{unit}</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowDown className="h-3.5 w-3.5 text-rose-400" />
            <span>Low: {low}{unit}</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-800/80 pt-3 text-xs">
        <div className="flex items-center gap-2 rounded-xl bg-slate-950/40 p-2.5">
          <Droplets className="h-4 w-4 text-sky-400" />
          <div>
            <span className="text-slate-400">Humidity</span>
            <p className="font-semibold text-slate-200">{humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-950/40 p-2.5">
          <Wind className="h-4 w-4 text-teal-400" />
          <div>
            <span className="text-slate-400">Wind Speed</span>
            <p className="font-semibold text-slate-200">{windSpeed}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
