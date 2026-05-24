"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import SkillsMatrix from "./SkillsMatrix";
import FocusPlan from "./FocusPlan";
import { LayoutDashboard, ShieldCheck, AlertTriangle, Layers, Lightbulb, FileText, Cpu } from "lucide-react";

// 🌟 Dynamically import RadarChart with SSR disabled to bypass client-side rendering mismatches
const RadarChartWidget = dynamic(() => import("./RadarChart"), { ssr: false });

export default function Dashboard({ data }) {
  const [activeTab, setActiveTab] = useState("ats");

  // Destructure structured parameters out of the unified server data contract
  const { semantic_score, ats, skills } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Hero Metrics Ribbon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-950/40 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Structural & Layout Metric</p>
            <h3 className="text-3xl font-black text-white mt-1">
              {/* Calculate aggregate structural score from 6 pillars (Max 30) */}
              {int(((ats.keyword_relevance_score + ats.formatting_score + ats.experience_quality_score + 
                     ats.skills_section_score + ats.education_score + ats.achievements_score) / 30) * 100)}%
            </h3>
          </div>
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
            <LayoutDashboard className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-slate-950/40 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Classic ML Vector Similarity</p>
            <h3 className="text-3xl font-black text-rose-400 mt-1">{semantic_score} / 100</h3>
          </div>
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Interactive Navigation Segment Controller */}
      <div className="flex border-b border-slate-800 space-x-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("ats")}
          className={`pb-4 text-sm font-semibold border-b-2 tracking-wide transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "ats" ? "border-rose-500 text-white" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          📊 ATS Analysis Dashboard
        </button>
        <button
          onClick={() => setActiveTab("skills")}
          className={`pb-4 text-sm font-semibold border-b-2 tracking-wide transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "skills" ? "border-rose-500 text-white" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          🛠️ Skills Matrix & Gap Plan
        </button>
      </div>

      {/* 3. Panel Render Windows */}
      <div className="space-y-6">
        {activeTab === "ats" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Radar Chart Pillar Column */}
            <div className="lg:col-span-1 p-6 bg-slate-950/20 border border-slate-800/80 rounded-2xl h-fit">
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-1">Dimension Matrix</h4>
              <p className="text-xs text-slate-500 mb-4">Performance across core evaluation frameworks.</p>
              <RadarChartWidget scores={ats} />
            </div>

            {/* Right Structural Feedback Blocks Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Strengths & Weaknesses Stack Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-slate-950/30 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
                    <ShieldCheck className="w-4 h-4" /> <span>Core Candidate Strengths</span>
                  </div>
                  <ul className="space-y-2">
                    {ats.strengths?.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-2 border border-slate-800/60 rounded-md">· {item}</li>
                    )) || <p className="text-xs text-slate-500">No major structural strengths detected.</p>}
                  </ul>
                </div>

                <div className="p-5 bg-slate-950/30 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center space-x-2 text-rose-400 font-semibold text-sm">
                    <AlertTriangle className="w-4 h-4" /> <span>Detected Vulnerabilities</span>
                  </div>
                  <ul className="space-y-2">
                    {ats.weaknesses?.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-2 border border-slate-800/60 rounded-md">· {item}</li>
                    )) || <p className="text-xs text-emerald-500">Zero major structural flaws found!</p>}
                  </ul>
                </div>
              </div>

              {/* Missing Keywords Inline Badges Matrix */}
              <div className="p-5 bg-slate-950/30 border border-slate-800 rounded-xl space-y-3">
                <h4 className="text-sm font-bold text-slate-200">🔍 Key Concept Coverage & Missing Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {ats.missing_keywords?.map((keyword, idx) => (
                    <span key={idx} className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded-md font-medium">
                      ⚠️ {keyword}
                    </span>
                  )) || <span className="text-xs text-emerald-400 font-medium">🎉 Perfect coverage metrics achieved.</span>}
                </div>
              </div>

              {/* Executive Summary Container */}
              <div className="p-5 bg-slate-950/30 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center space-x-2 text-blue-400 font-semibold text-sm">
                  <FileText className="w-4 h-4" /> <span>Executive Parsing Summary</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">{ats.summary}</p>

                {/* 🧠 PYTORCH BI-LSTM DEEP LEARNING INFERRED NER TAGS CONTAINER */}
                {ats.deep_learning_entities && ats.deep_learning_entities.length > 0 && (
                  <div className="pt-4 border-t border-slate-800/60 space-y-2">
                    <div className="flex items-center space-x-1.5 text-rose-400 font-bold text-xs uppercase tracking-wider">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Neural Network Token Inference Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {ats.deep_learning_entities.map((entity, idx) => (
                        <span 
                          key={idx} 
                          className="text-[10px] font-mono bg-slate-900 border border-rose-500/20 rounded px-2.5 py-1 flex items-center space-x-2"
                        >
                          <span className="text-slate-300 font-medium">{entity.token}</span>
                          <span className="text-rose-500 font-bold bg-rose-500/10 px-1 rounded text-[9px]">
                            {entity.confidence_class}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 8-Part Skill Matrix Columns */}
            <div className="lg:col-span-2">
              <SkillsMatrix profile={skills} />
            </div>
            {/* Targeted Action Focus Plan Column */}
            <div className="lg:col-span-1">
              <FocusPlan plan={skills.jd_targeted_focus_plan} />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

// Inline helper script to convert floating point ratios safely
function int(val) {
  return Math.floor(val);
}