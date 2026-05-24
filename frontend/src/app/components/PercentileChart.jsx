"use client";

import React from "react";
import { TrendingUp, Users } from "lucide-react";

export default function PercentileChart({ matchIndex, percentileAhead, name }) {
  // Generate points along an analytical Gaussian normal curve formula array
  const points = [];
  for (let x = 15; x <= 100; x += 1) {
    const mean = 62;
    const stdDev = 12;
    const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    points.push({ x: (x - 15) * 5.8, y: 140 - (y * 3800) }); 
  }

  // Convert the points array to an inline SVG polyline string path vector
  const pathData = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Map candidate match index score directly to horizontal plot vector coordinates
  const markerX = Math.max(10, Math.min(490, (matchIndex - 15) * 5.8));
  const normalizedZIndexY = 140 - ((1 / (12 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((matchIndex - 62) / 12, 2)) * 3800);

  return (
    <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Talent Pool Percentile Distribution</h4>
            <p className="text-xs text-slate-500">Applicant positioning vector across cross-platform global resume data.</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-black text-emerald-400 block tracking-tight">Ahead of {percentileAhead}%</span>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">of competing applicants</span>
        </div>
      </div>

      {/* SVG Canvas Area drawing the Bell Curve */}
      <div className="relative pt-4 bg-slate-900/10 border border-slate-900 rounded-2xl p-4">
        <svg viewBox="0 0 500 150" className="w-full h-auto overflow-visible">
          {/* Shaded baseline fill path block */}
          <polyline fill="rgba(99, 102, 241, 0.04)" stroke="none" points={`0,140 ${pathData} 500,140`} />
          {/* Main distribution line vector geometry */}
          <polyline fill="none" stroke="rgba(71, 85, 105, 0.6)" strokeWidth="2" points={pathData} />
          {/* Baseline chart guide anchor */}
          <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(51, 65, 85, 0.4)" strokeWidth="1" />

          {/* Dynamic tracking point marker mapping the active file profile position */}
          <circle cx={markerX} cy={normalizedZIndexY} r="5" className="fill-indigo-400 stroke-slate-950 stroke-2 animate-bounce" />
          <line x1={markerX} y1={normalizedZIndexY} x2={markerX} y2="140" stroke="rgba(129, 140, 248, 0.4)" strokeWidth="1.5" strokeDasharray="3,3" />
        </svg>

        {/* Minimalist Axis Labels */}
        <div className="flex justify-between text-[9px] font-mono font-bold text-slate-600 px-1 pt-1.5 border-t border-slate-900">
          <span>LOW MATCH INDEX (15)</span>
          <span className="text-indigo-500/60">POOL AVERAGE MEAN (62)</span>
          <span>HIGH MATCH INDEX (100)</span>
        </div>
      </div>
      
      <p className="text-[11px] text-slate-400 leading-relaxed font-normal italic">
        💡 <span className="font-bold text-slate-300">{name}</span> outscores the target baseline cohort metrics because of high density specialization structures inside their skills taxonomy parameters.
      </p>
    </div>
  );
}