"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Code, Box, Database, Cloud, Terminal, Cpu, Globe, Link } from "lucide-react";

// 🌟 ICON MAPPING DICTIONARY FOR THE ACCORDION TYPES
const categoryIcons = {
  programming_languages: <Code className="w-4 h-4 text-blue-400" />,
  frameworks_and_libraries: <Box className="w-4 h-4 text-purple-400" />,
  databases: <Database className="w-4 h-4 text-emerald-400" />,
  cloud_and_devops: <Cloud className="w-4 h-4 text-cyan-400" />,
  tools_and_platforms: <Terminal className="w-4 h-4 text-amber-400" />,
  ai_and_ml: <Cpu className="w-4 h-4 text-rose-400" />,
  domains_and_concepts: <Globe className="w-4 h-4 text-indigo-400" />,
  apis_and_protocols: <Link className="w-4 h-4 text-orange-400" />
};

const categoryTitles = {
  programming_languages: "Programming Languages",
  frameworks_and_libraries: "Frameworks & Libraries",
  databases: "Databases",
  cloud_and_devops: "Cloud & DevOps",
  tools_and_platforms: "Tools & Platforms",
  ai_and_ml: "AI & Machine Learning",
  domains_and_concepts: "Domains & Core Concepts",
  apis_and_protocols: "APIs & Protocols"
};

export default function SkillsMatrix({ profile }) {
  if (!profile || !profile.skills) {
    return <p className="text-sm text-slate-500">No technical skill profiles parsed.</p>;
  }

  const { skills } = profile;

  return (
    /* 🌟 FIX: Added 'items-start' to prevent vertical row stretching */
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {Object.keys(categoryTitles).map((key) => {
        const skillsList = skills[key] || [];
        return (
          <SkillCategoryCard 
            key={key}
            categoryKey={key}
            title={categoryTitles[key]}
            skills={skillsList}
          />
        );
      })}
    </div>
  );
}

// 🧠 SELF-CONTAINED SUB-COMPONENT FOR TOTAL DROPDOWN ISOLATION
function SkillCategoryCard({ categoryKey, title, skills }) {
  // Each card instance maintains its own dedicated, completely isolated state
  const [isOpen, setIsOpen] = useState(categoryKey === "programming_languages" || categoryKey === "frameworks_and_libraries");

  return (
    /* 🌟 FIX: Added 'h-fit' so the container boundary strictly follows content size instead of expanding with row context */
    <div className="bg-slate-950/40 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200 h-fit">
      
      {/* Clickable Header Node */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between bg-slate-900/20 hover:bg-slate-900/50 transition-colors text-left border-b border-transparent data-[open=true]:border-slate-800/60"
        data-open={isOpen}
      >
        <div className="flex items-center space-x-3">
          {categoryIcons[categoryKey]}
          <span className="text-sm font-bold text-slate-200 tracking-wide">
            {title} ({skills.length})
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>

      {/* Conditionally Rendered Skill Sub-list Area */}
      {isOpen && (
        <div className="p-4 space-y-3 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {skills.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-2">No items classified in this profile section.</p>
          ) : (
            skills.map((skill, idx) => (
              <div 
                key={idx} 
                className="p-3.5 bg-slate-900/40 border border-slate-800/60 rounded-xl space-y-1.5 hover:border-slate-700/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-wide">{skill.name}</span>
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider ${
                      skill.confidence === 'HIGH' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {skill.confidence}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider ${
                      skill.proficiency_signal === 'PRIMARY' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {skill.proficiency_signal}
                    </span>
                  </div>
                </div>
                {skill.evidence && (
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    "{skill.evidence}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}