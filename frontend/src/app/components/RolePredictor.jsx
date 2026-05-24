"use client";

import React from "react";
import { Briefcase, Compass, Target, ArrowUpRight } from "lucide-react";

export default function RolePredictor({ predictions }) {
  if (!predictions || predictions.length === 0) return null;

  return (
    <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 space-y-5">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <Compass className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">AI Career Role Predictor</h3>
          <p className="text-xs text-slate-500">Machine learning vector alignment mapping your top candidate profile tracks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {predictions.map((role, idx) => (
          <div 
            key={idx}
            className="p-4 bg-slate-900/30 border border-slate-800/80 rounded-xl flex flex-col justify-between hover:border-indigo-500/30 transition-colors group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{role.title}</span>
                </div>
                <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                  idx === 0 ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-slate-800 text-slate-400"
                }`}>
                  {idx === 0 ? "PRIMARY MATCH" : `TRACK #${idx + 1}`}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{role.match_reason}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-900 flex items-start space-x-2">
              <Target className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider block">Next Growth Target</span>
                <p className="text-[11px] text-slate-300 font-medium">{role.critical_missing_skill}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}