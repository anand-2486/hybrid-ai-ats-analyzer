"use client";

import React, { useState } from "react";
import { ChevronDown, Code, Layout, Database, Cloud, Terminal, Brain, Compass, Cpu } from "lucide-react";

export default function SkillsMatrix({ profile }) {
  const [openSection, setOpenSection] = useState(null);

  // Capture the raw technical dataset mapping layer safely from any slot direction
  const rawSkills = profile || {};

  // 🌟 FORCE ACCENT MATCHING: Styled with the precise icon colors matching Image 1
  const sections = [
    {
      id: "languages",
      title: "Programming Languages",
      icon: <Code className="w-4 h-4 text-blue-400" />,
      items: rawSkills.programming_languages || rawSkills.languages || []
    },
    {
      id: "frameworks",
      title: "Frameworks & Libraries",
      icon: <Layout className="w-4 h-4 text-purple-400" />,
      items: rawSkills.frameworks_libraries || rawSkills.frameworks_and_libraries || []
    },
    {
      id: "databases",
      title: "Databases",
      icon: <Database className="w-4 h-4 text-emerald-400" />,
      items: rawSkills.databases || rawSkills.database || []
    },
    {
      id: "devops",
      title: "Cloud & DevOps",
      icon: <Cloud className="w-4 h-4 text-cyan-400" />,
      items: rawSkills.cloud_devops || rawSkills.cloud_and_devops || []
    },
    {
      id: "tools",
      title: "Tools & Platforms",
      icon: <Terminal className="w-4 h-4 text-amber-400" />,
      items: rawSkills.tools_platforms || rawSkills.tools_and_platforms || []
    },
    {
      id: "ai_ml",
      title: "AI & Machine Learning",
      icon: <Brain className="w-4 h-4 text-rose-400" />,
      items: rawSkills.ai_machine_learning || rawSkills.ai_and_machine_learning || []
    },
    {
      id: "concepts",
      title: "Domains & Core Concepts",
      icon: <Compass className="w-4 h-4 text-indigo-400" />,
      items: rawSkills.domains_core_concepts || rawSkills.domains_and_core_concepts || []
    },
    {
      id: "apis",
      title: "APIs & Protocols",
      icon: <Cpu className="w-4 h-4 text-orange-400" />,
      items: rawSkills.apis_protocols || rawSkills.apis_and_protocols || []
    }
  ];

  // Global metric checker loop to verify if any item arrays contain valid entries
  const totalSkillsParsed = sections.reduce((sum, sec) => sum + (sec.items?.length || 0), 0);

  if (totalSkillsParsed === 0) {
    return (
      <div className="text-xs font-mono text-slate-500 pl-1 py-3">
        No technical skill profiles parsed.
      </div>
    );
  }

  return (
    <div className="w-full box-border">
      {/* 🌟 IMAGE 1 TRANSFORMATION: 2-Column Responsive Grid Wrap Matrix Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {sections.map((section) => {
          const isOpen = openSection === section.id;
          const itemsCount = section.items?.length || 0;

          return (
            <div 
              key={section.id} 
              className="w-full flex flex-col bg-[#0B132B]/30 border border-[#1E2638]/70 rounded-xl overflow-hidden transition-all duration-200"
            >
              {/* Interactive Header Matching Image 1 Typography */}
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? null : section.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#111A36]/30 transition-colors focus:outline-none cursor-pointer"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {section.icon}
                  {/* Clean standard title font formatting directly matching view indices */}
                  <span className="text-sm font-semibold text-slate-100 tracking-wide truncate">
                    {section.title} <span className="text-slate-400 ml-1">({itemsCount})</span>
                  </span>
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${isOpen ? "transform rotate-180 text-slate-300" : ""}`} 
                />
              </button>

              {/* Collapsible Content Dropdown Area */}
              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-[#1E2638]/30 bg-[#070A14]/40 animate-in fade-in slide-in-from-top-1 duration-150">
                  {itemsCount > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {section.items.map((skill, idx) => (
                        <div 
                          key={idx} 
                          className="bg-[#111A36]/60 border border-[#1E2638]/50 px-2.5 py-1 rounded-md text-xs font-mono font-medium text-slate-300 shadow-sm"
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-slate-500 italic mt-2 pl-0.5">
                      Empty segment context.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}