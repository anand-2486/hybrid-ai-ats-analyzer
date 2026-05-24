"use client";

import React from "react";
import { Layers, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

export default function ResumeHeatmap({ atsData }) {
  if (!atsData) return null;

  // Map your 0-5 numerical scores into clear UI display entities
  const sections = [
    {
      id: "keyword_relevance",
      label: "Keyword Alignment",
      score: atsData.keyword_relevance_score || 0,
      desc: "Measures technical domain vocabulary density against the target job requirements.",
    },
    {
      id: "formatting",
      label: "Layout & Formatting",
      score: atsData.formatting_score || 0,
      desc: "Evaluates visual hierarchy, font structural parseability, and scan cleanliness.",
    },
    {
      id: "experience",
      label: "Experience Quality",
      score: atsData.experience_quality_score || 0,
      desc: "Assesses progressive career timeline logic and active accomplishment action verbs.",
    },
    {
      id: "skills",
      label: "Skills Depth",
      score: atsData.skills_section_score || 0,
      desc: "Checks for explicitly categorized, high-fidelity core engineering framework blocks.",
    },
    {
      id: "education",
      label: "Education Context",
      score: atsData.education_score || 0,
      desc: "Validates presence of academic degree parameters, timelines, and certifications.",
    },
    {
      id: "achievements",
      label: "Quantified Impact",
      score: atsData.achievements_score || 0,
      desc: "Scans for numerical business metrics, statistical vectors, and key performance proofs.",
    },
  ];

  // Helper mapping function to assign Tailwind heatmap color gradations based on score (0 to 5)
  const getColorClass = (score) => {
    if (score >= 4.5) return "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"; // Exceptional Strength
    if (score >= 3.5) return "bg-green-500/10 border-green-500/30 text-green-400";     // Strong Baseline
    if (score >= 2.5) return "bg-amber-500/10 border-amber-500/30 text-amber-400";     // Moderate / Needs Tweak
    if (score >= 1.5) return "bg-orange-500/10 border-orange-500/30 text-orange-400";   // Weak / High Risk
    return "bg-rose-500/20 border-rose-500/40 text-rose-400";                          // Critical Deficit
  };

  const getStatusIcon = (score) => {
    if (score >= 3.5) return <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />;
    if (score >= 1.5) return <HelpCircle className="w-4 h-4 shrink-0 text-amber-400" />;
    return <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />;
  };

  return (
    <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 space-y-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl">
          <Layers className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">Profile Section Heatmap Matrix</h3>
          <p className="text-xs text-slate-500">Visual strength index mapping across deep optimization vectors.</p>
        </div>
      </div>

      {/* The Dynamic Heatmap Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`p-4 border rounded-xl flex flex-col justify-between space-y-3 transition-all duration-300 ${getColorClass(
              section.score
            )}`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wide text-slate-100">{section.label}</span>
                {getStatusIcon(section.score)}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-normal">{section.desc}</p>
            </div>

            {/* Visual Heatmap Slider Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono opacity-80">
                <span>Power Index</span>
                <span className="font-bold">{section.score} / 5.0</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-current transition-all duration-500"
                  style={{ width: `${(section.score / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}