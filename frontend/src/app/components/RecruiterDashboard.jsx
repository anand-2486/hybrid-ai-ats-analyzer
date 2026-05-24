"use client";

import React, { useState } from "react";
import SkillsMatrix from "./SkillsMatrix";
import PercentileChart from "./PercentileChart"; 
import { FileText, Star, ShieldCheck, AlertTriangle, Target, Lightbulb, Code2 } from "lucide-react";

export default function RecruiterDashboard({ candidatesList }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeCandidate = candidatesList[selectedIdx] || null;

  if (!activeCandidate) return <p className="text-sm text-slate-500">No applicants parsed.</p>;

  const formatCategoryLabel = (str) => {
    return str.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const renderFormattedBullet = (bulletText, highlightClass = "text-emerald-400") => {
    let cleanText = bulletText.replace(/^[\s·•\-*]+/, "").trim();
    const headingMatch = cleanText.match(/^(\*\*|)(.*?)\1\s*:\s*(.*)$/s);

    if (headingMatch) {
      let heading = headingMatch[2].trim();
      let body = headingMatch[3].trim();
      heading = heading.replace(/\*\*$/, "").replace(/:$/, "").trim();

      return (
        <span className="text-xs text-slate-300 leading-relaxed">
          <strong className={`font-bold uppercase tracking-wide text-[11px] block md:inline mb-1 md:mb-0 ${highlightClass}`}>
            {heading}:
          </strong>{" "}
          {body}
        </span>
      );
    }

    return <span className="text-xs text-slate-300 leading-relaxed">{cleanText}</span>;
  };

  const calculateGradeMetric = (score) => {
    if (score >= 90) return { label: "GRADE: A+", style: "bg-emerald-500/5 text-emerald-400 border-emerald-500/20" };
    if (score >= 80) return { label: "GRADE: A-", style: "bg-green-500/5 text-green-400 border-green-500/20" };
    if (score >= 70) return { label: "GRADE: B-", style: "bg-emerald-500/5 text-emerald-400 border-emerald-500/20" };
    if (score >= 60) return { label: "GRADE: C+", style: "bg-amber-500/5 text-amber-400 border-amber-500/20" };
    return { label: "GRADE: D", style: "bg-rose-500/5 text-rose-400 border-rose-500/20" };
  };

  const gradeInfo = calculateGradeMetric(activeCandidate.match_index);

  return (
    <div className="w-full max-w-full space-y-6 animate-in fade-in duration-300 box-border text-slate-200">
      
      {/* ── SECTION 1: GLOBAL APPLICANT SELECTION POOL ROW ── */}
      <div className="w-full">
        <div className={`w-full gap-3 ${
          candidatesList.length === 1 
            ? "flex flex-col" 
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}>
          {candidatesList.map((candidate, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={candidate.candidate_id}
                onClick={() => setSelectedIdx(idx)}
                className={`w-full p-3.5 flex items-center justify-between rounded-xl border text-left transition-all duration-200 cursor-pointer shadow-md box-border ${
                  isSelected 
                    ? "bg-[#111622]/90 border-emerald-500 text-white shadow-lg shadow-emerald-950/10" 
                    : "bg-[#111622]/20 border-[#1E2638] text-slate-300 hover:border-slate-700 hover:bg-[#111622]/40"
                }`}
              >
                <div className="truncate space-y-0.5 min-w-0 flex-grow pr-3">
                  <p className="text-xs font-bold tracking-wide text-slate-200 truncate">{candidate.candidate_name}</p>
                  <p className="text-[9px] font-mono font-medium text-slate-500 uppercase truncate">{candidate.filename}</p>
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
        <div className="xl:col-span-3 bg-[#111622]/40 border border-[#1E2638] rounded-2xl p-5 flex flex-col items-center justify-between text-center shadow-xl shadow-black/10 backdrop-blur-md relative min-h-[290px]">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block w-full text-left pl-0.5 mb-2">
            Dashboard Summary
          </span>
          
          <div className="relative w-44 h-44 flex items-center justify-center flex-grow my-auto">
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="43" fill="transparent" stroke="#1A2130" strokeWidth="5.5" />
              <circle 
                cx="50" 
                cy="50" 
                r="43" 
                fill="transparent" 
                stroke="#10b981" 
                strokeWidth="5.5" 
                strokeDasharray="270.1" 
                strokeDashoffset={270.1 - (270.1 * activeCandidate.match_index) / 100} 
                strokeLinecap="round" 
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="z-10 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white tracking-tighter leading-none">{activeCandidate.match_index}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">ATS Score</span>
            </div>
          </div>

          <div className={`mt-4 w-full py-3 rounded-xl border text-center font-black text-lg tracking-wide uppercase shadow-inner ${gradeInfo.style}`}>
            {gradeInfo.label.split(": ")[0]}: <span className="text-white ml-0.5">{gradeInfo.label.split(": ")[1]}</span>
          </div>
        </div>

        {/* Right Multi-column Insights Sheet */}
        <div className="xl:col-span-9 bg-[#111622]/40 border border-[#1E2638] rounded-2xl p-5 shadow-xl shadow-black/10 backdrop-blur-md grid grid-cols-1 md:grid-cols-3 gap-5">
          
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

          <div className="space-y-2 md:border-r md:border-[#1E2638]/60 md:pr-4">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Core Strengths</span>
            </div>
            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {activeCandidate.ats_details?.strengths?.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2 bg-slate-950/20 p-2.5 border border-[#1E2638]/30 rounded-xl">
                  <span className="text-emerald-400 text-xs mt-0.5 shrink-0">•</span>
                  {renderFormattedBullet(item, "text-emerald-400")}
                </div>
              )) || <p className="text-xs text-slate-500">No parameters identified.</p>}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-500 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Detected Vulnerabilities</span>
            </div>
            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {activeCandidate.ats_details?.weaknesses?.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2 bg-slate-950/20 p-2.5 border border-[#1E2638]/30 rounded-xl">
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

      {/* ── 🌟 NEW SECTION 5: TARGETED FOCUS AREAS & PROJECT ROADMAP ─────────── */}
      <div className="w-full bg-[#111622]/40 border border-[#1E2638] rounded-2xl p-6 shadow-xl shadow-black/10 backdrop-blur-md space-y-5">
        
        {/* Header Block with Active Target Role Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1E2638]/60 pb-3.5 gap-3">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Strategic Upskilling & Roadmap Advisory
            </h4>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-500/5 border border-emerald-500/20 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Role:</span>
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wide">Frontend Developer Intern</span>
          </div>
        </div>

        {/* Dynamic Gap Layout Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Sub-Column A: Skills/Domains to Focus On */}
          <div className="space-y-3 bg-[#0B0F17]/30 border border-[#1E2638]/60 p-4 rounded-xl shadow-inner">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Priority Skill Domains</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal pl-0.5">
              To transform this profile from a generalist student track into a competitive Engineering shortlist candidate, focus on eliminating these structural gaps:
            </p>
            
            <div className="space-y-2 pt-1">
              <div className="bg-[#111622]/50 p-3 border border-[#1E2638]/40 rounded-xl flex flex-col space-y-1">
                <span className="text-[11px] font-black uppercase text-slate-300 tracking-wide">Production Portfolio Proof</span>
                <span className="text-xs text-slate-400 leading-relaxed">The single most critical vulnerability is the absolute absence of an isolated **Projects** section. Recruiters discard technical student profiles without verified source repositories.</span>
              </div>
              <div className="bg-[#111622]/50 p-3 border border-[#1E2638]/40 rounded-xl flex flex-col space-y-1">
                <span className="text-[11px] font-black uppercase text-slate-300 tracking-wide">Advanced State Architecture</span>
                <span className="text-xs text-slate-400 leading-relaxed">While base HTML/CSS/React competencies are identified, you must demonstrate explicit familiarity with production hooks, Context APIs, or global state architectures like Redux/Zustand.</span>
              </div>
            </div>
          </div>

          {/* Sub-Column B: Recommended High-Impact Projects */}
          <div className="space-y-3 bg-[#0B0F17]/30 border border-[#1E2638]/60 p-4 rounded-xl shadow-inner">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>Recommended Technical Projects</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal pl-0.5">
              Build and explicitly document at least one of these complex architectures to showcase real engineering depth:
            </p>

            <div className="space-y-2 pt-1">
              <div className="bg-[#111622]/50 p-3 border border-[#1E2638]/40 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black uppercase text-emerald-400 tracking-wide">1. Real-time Collaboration Board</span>
                  <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-bold border border-emerald-500/10">HIGH IMPACT</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Build a collaborative design grid or interactive kanban board utilizing canvas layout features, optimizing client renders using WebSockets/Socket.io to demonstrate robust state synchronization under high event frequencies.
                </p>
              </div>

              <div className="bg-[#111622]/50 p-3 border border-[#1E2638]/40 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black uppercase text-slate-300 tracking-wide">2. Performant Data Analytics Console</span>
                  <span className="text-[9px] font-mono bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-bold border border-[#1E2638]">CORE DEPTH</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Create a telemetry visualization platform implementing mock multi-dimensional vector inputs, handling large dataset pagination, responsive chart elements, and performance tracking matrices (e.g., custom layout lazy-loading structures).
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}