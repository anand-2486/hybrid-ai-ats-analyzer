"use client";

import React, { useState } from "react";
import SkillsMatrix from "./SkillsMatrix";
import PercentileChart from "./PercentileChart"; 
import { Users, FileText, Star, ShieldCheck, AlertTriangle } from "lucide-react";

export default function RecruiterDashboard({ candidatesList }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeCandidate = candidatesList[selectedIdx] || null;

  if (!activeCandidate) return <p className="text-sm text-slate-500">No applicants parsed.</p>;

  const formatCategoryLabel = (str) => {
    return str.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Clean text-parsing engine to split and emphasize bold sub-headings inside bullet arrays
  const renderFormattedBullet = (bulletText, highlightClass = "text-emerald-400") => {
    let cleanText = bulletText.replace(/^[\s·•\-*]+/, "").trim();
    let heading = "";
    let body = cleanText;

    if (cleanText.includes("**")) {
      const parts = cleanText.split("**");
      if (parts.length >= 3) {
        heading = parts[1];
        body = parts.slice(2).join("**").trim();
      }
    } else if (cleanText.includes(":")) {
      const firstColonIdx = cleanText.indexOf(":");
      heading = cleanText.substring(0, firstColonIdx);
      body = cleanText.substring(firstColonIdx + 1).trim();
    }

    if (heading) {
      heading = heading.replace(/:$/, "").trim();
      return (
        <span className="text-xs text-slate-300 leading-relaxed">
          <strong className={`font-bold uppercase tracking-wide text-[11px] ${highlightClass}`}>{heading}:</strong> {body}
        </span>
      );
    }

    return <span className="text-xs text-slate-300 leading-relaxed">{cleanText}</span>;
  };

  const calculateGradeMetric = (score) => {
    if (score >= 90) return { label: "Grade: A+", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
    if (score >= 80) return { label: "Grade: A-", style: "bg-green-500/10 text-green-400 border-green-500/20" };
    if (score >= 70) return { label: "Grade: B-", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
    if (score >= 60) return { label: "Grade: C+", style: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
    return { label: "Grade: D", style: "bg-rose-500/10 text-rose-400 border-rose-500/20" };
  };

  const gradeInfo = calculateGradeMetric(activeCandidate.match_index);

  return (
    <div className="w-full max-w-full space-y-6 animate-in fade-in duration-300 box-border text-slate-200">
      
      {/* ── SECTION 1: GLOBAL APPLICANT SELECTION POOL ROW ──────────────────── */}
      <div className="w-full space-y-2">
        <div className="flex items-center space-x-2 pl-1">
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Applicant Pool Leaderboard ({candidatesList.length})
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
          {candidatesList.map((candidate, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={candidate.candidate_id}
                onClick={() => setSelectedIdx(idx)}
                className={`w-full p-3.5 flex items-center justify-between rounded-xl border text-left transition-all duration-200 cursor-pointer shadow-md ${
                  isSelected 
                    ? "bg-[#111622]/90 border-emerald-500 text-white shadow-lg shadow-emerald-950/10" 
                    : "bg-[#111622]/20 border-[#1E2638] text-slate-300 hover:border-slate-700 hover:bg-[#111622]/40"
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className={`w-5.5 h-5.5 rounded-md flex items-center justify-center font-mono text-[10px] font-bold border ${
                    idx === 0 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-900 border-[#1E2638] text-slate-500"
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="truncate space-y-0.5">
                    <p className="text-xs font-bold tracking-wide text-slate-200 truncate">{candidate.candidate_name}</p>
                    <p className="text-[9px] font-mono font-medium text-slate-500 uppercase truncate">{candidate.filename}</p>
                  </div>
                </div>
                <span className={`text-xs font-black tracking-tight shrink-0 pl-2 ${isSelected ? "text-emerald-400" : "text-white"}`}>
                  {candidate.match_index}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 2: TOP INTEGRATED SUMMARY, STRENGTHS & DEFICITS ─────────── */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Circular Score Indicator */}
        <div className="xl:col-span-3 bg-[#111622]/40 border border-[#1E2638] rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-xl shadow-black/10 backdrop-blur-md relative">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="41" fill="transparent" stroke="#1E2638" strokeWidth="5" />
              <circle 
                cx="50" 
                cy="50" 
                r="41" 
                fill="transparent" 
                stroke="#10b981" 
                strokeWidth="5" 
                strokeDasharray="257.6" 
                strokeDashoffset={257.6 - (257.6 * activeCandidate.match_index) / 100} 
                strokeLinecap="round" 
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="z-10 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white tracking-tight">{activeCandidate.match_index}</span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">ATS Score</span>
            </div>
          </div>
          <div className={`mt-3 px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${gradeInfo.style}`}>
            {gradeInfo.label}
          </div>
        </div>

        {/* Right Multi-column Insights Sheet */}
        <div className="xl:col-span-9 bg-[#111622]/40 border border-[#1E2638] rounded-2xl p-5 shadow-xl shadow-black/10 backdrop-blur-md grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Executive Overview Summary */}
          <div className="space-y-2 md:border-r md:border-[#1E2638]/60 md:pr-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">Summary</span>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {activeCandidate.ats_details?.summary}
              </p>
            </div>
            <div className="text-[9px] font-mono text-slate-600 truncate pt-2">
              FILE: {activeCandidate.filename}
            </div>
          </div>

          {/* Core Strengths */}
          <div className="space-y-2 md:border-r md:border-[#1E2638]/60 md:pr-4">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Core Strengths</span>
            </div>
            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {activeCandidate.ats_details?.strengths?.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2 bg-slate-950/20 p-2 border border-[#1E2638]/30 rounded-xl">
                  <span className="text-emerald-400 text-xs mt-0.5 shrink-0">•</span>
                  {renderFormattedBullet(item, "text-emerald-400")}
                </div>
              )) || <p className="text-xs text-slate-500">No parameters identified.</p>}
            </div>
          </div>

          {/* Detected Vulnerabilities */}
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-500 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Detected Vulnerabilities</span>
            </div>
            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {activeCandidate.ats_details?.weaknesses?.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2 bg-slate-950/20 p-2 border border-[#1E2638]/30 rounded-xl">
                  <span className="text-amber-500 text-xs mt-0.5 shrink-0">•</span>
                  {renderFormattedBullet(item, "text-amber-500")}
                </div>
              )) || <p className="text-xs text-emerald-400 font-medium">Zero structural flaws detected!</p>}
            </div>
          </div>

        </div>
      </div>

      {/* ── SECTION 3: SIDE-BY-SIDE DOUBLE COLUMN SECTION (Scores + Chart) ── */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Column: Vertical Segment Progress Bars */}
        <div className="lg:col-span-6 bg-[#111622]/40 border border-[#1E2638] rounded-2xl p-5 shadow-xl shadow-black/10 backdrop-blur-md flex flex-col justify-between space-y-4">
          <div className="flex items-center space-x-1.5 border-b border-[#1E2638]/60 pb-2">
            <Star className="w-3.5 h-3.5 text-emerald-400" />
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Section Scores
            </h4>
          </div>
          
          <div className="space-y-3 w-full flex-grow flex flex-col justify-around">
            {Object.entries(activeCandidate.scoring_categories || {}).map(([key, value]) => (
              <div key={key} className="p-3 bg-[#0B0F17]/30 border border-[#1E2638]/60 rounded-xl flex items-center justify-between shadow-inner w-full gap-4">
                <span className="font-bold text-xs text-slate-300 shrink-0 min-w-[110px]">{formatCategoryLabel(key)}</span>
                <div className="flex items-center space-x-3 w-full justify-end">
                  <div className="w-full max-w-[160px] h-2 bg-[#0B0F17] rounded-full overflow-hidden shadow-inner hidden sm:block">
                    <div 
                      className="h-full bg-emerald-500/80 rounded-full transition-all duration-500 shadow-md shadow-emerald-400/20" 
                      style={{ width: `${value}%` }} 
                    />
                  </div>
                  <span className="font-mono font-bold text-xs text-slate-400 shrink-0">{value}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Full-Height Percentile Distribution Chart */}
        <div className="lg:col-span-6 flex flex-col">
          <PercentileChart 
            matchIndex={activeCandidate.match_index} 
            percentileAhead={activeCandidate.percentile_ahead} 
            name={activeCandidate.candidate_name}
          />
        </div>

      </div>

      {/* ── SECTION 4: TECHNICAL TAXONOMY ACCORDION ROWS ──────────────────────── */}
      <div className="w-full bg-[#111622]/20 border border-[#1E2638] rounded-2xl p-5 shadow-xl shadow-black/10 backdrop-blur-md space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pl-1">
          Technical Taxonomy
        </span>
        <SkillsMatrix profile={activeCandidate.skills_details} />
      </div>

    </div>
  );
}