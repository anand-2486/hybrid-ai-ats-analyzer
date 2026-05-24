"use client";

import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

export default function RadarChartWidget({ scores }) {
  // Normalize backend 0-5 integer values to a clean 0-100 percentage scale
  const data = [
    { subject: "Keywords", score: (scores.keyword_relevance_score / 5) * 100 },
    { subject: "Layout", score: (scores.formatting_score / 5) * 100 },
    { subject: "Experience", score: (scores.experience_quality_score / 5) * 100 },
    { subject: "Tech Stack", score: (scores.skills_section_score / 5) * 100 },
    { subject: "Education", score: (scores.education_score / 5) * 100 },
    { subject: "Impact", score: (scores.achievements_score / 5) * 100 },
  ];

  return (
    <div className="w-full h-80 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" /> {/* Slate-700 Grid lines */}
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: "#475569" }} 
            axisLine={false} 
          />
          <Radar
            name="Candidate"
            dataKey="score"
            stroke="#f43f5e"     /* Rose-500 Accent Border */
            fill="#f43f5e"       /* Rose-500 Accent Fill */
            fillOpacity={0.25}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}