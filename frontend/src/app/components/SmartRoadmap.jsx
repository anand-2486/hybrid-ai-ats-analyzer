"use client";

import React from "react";
import { Milestone, Clock, BookOpen, ChevronRight, CheckSquare } from "lucide-react";

export default function SmartRoadmap({ roadmapData }) {
  if (!roadmapData || !roadmapData.sequential_steps) return null;

  return (
    <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <Milestone className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">Smart Skill Gap Roadmap</h3>
          <p className="text-xs text-slate-500">Targeted, time-bound training path calculated to optimize fit for {roadmapData.target_career_track || "Target Role"}.</p>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/40 p-4 border border-slate-800/60 rounded-xl italic">
        " {roadmapData.strategic_overview} "
      </p>

      {/* Vertical Interactive Timeline Stack */}
      <div className="relative border-l-2 border-slate-800 ml-4 space-y-8 pt-2">
        {roadmapData.sequential_steps.map((step, idx) => (
          <div key={idx} className="relative pl-8 group">
            
            {/* Timeline Numbered Bullet Ring */}
            <div className="absolute -left-[13px] top-0.5 w-6 h-6 bg-slate-950 border-2 border-amber-500 text-[10px] font-black text-amber-400 flex items-center justify-center rounded-full shadow-md transition-transform duration-300 group-hover:scale-110">
              {step.step_number}
            </div>

            <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl space-y-4 hover:border-amber-500/20 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-white tracking-wide">Mastery Segment: {step.technology_or_skill}</h4>
                <div className="flex items-center space-x-1 text-slate-400 font-mono text-[10px] bg-slate-950 px-2 py-1 rounded border border-slate-800 w-fit">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Est. Time: {step.estimated_time}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-start space-x-2 text-[11px]">
                  <CheckSquare className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-slate-300 leading-relaxed"><span className="font-bold text-slate-100">Capstone Objective:</span> {step.actionable_objective}</p>
                </div>
              </div>

              {/* Resources Badges Section */}
              <div className="pt-3 border-t border-slate-900 space-y-2">
                <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <BookOpen className="w-3 h-3" />
                  <span>Recommended Study Vectors</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {step.recommended_resources?.map((res, rIdx) => (
                    <div 
                      key={rIdx} 
                      className="text-[10px] bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 flex items-center space-x-1 text-slate-300 font-medium"
                    >
                      <span>{res.resource_name}</span>
                      <ChevronRight className="w-2.5 h-2.5 text-slate-600" />
                      <span className="text-amber-400 font-semibold">{res.resource_link}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}