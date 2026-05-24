"use client";

import React from "react";
import { Lightbulb, CheckSquare } from "lucide-react";

export default function FocusPlan({ plan = [] }) {
  return (
    <div className="p-5 bg-slate-950/20 border border-slate-800 rounded-2xl space-y-4 h-full">
      <div>
        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">🎯 Targeted Preparation Plan</h4>
        <p className="text-xs text-slate-500 mt-0.5">Automated delta analysis targeting core requirements gaps.</p>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
        {plan.length > 0 ? (
          plan.map((item, idx) => {
            const priority = item.priority_level?.toUpperCase() || "MEDIUM";
            
            return (
              <div key={idx} className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-rose-500" />
                    {item.skill_or_concept}
                  </h5>
                  <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded shrink-0 ${
                    priority === "HIGH" 
                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                      : priority === "MEDIUM" 
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {priority}
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-500">Profile Status:</span> {item.current_status}
                </p>

                <div className="flex items-start gap-1.5 p-2 bg-slate-900/60 rounded-lg border border-slate-800/60">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    {item.actionable_preparation_step}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-600 italic">No preparation steps found. Verify that both inputs contain robust context.</p>
        )}
      </div>
    </div>
  );
}