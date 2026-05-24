"use client";

import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import Dashboard from "./components/Dashboard";
import { BrainCircuit } from "lucide-react";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAnalysisComplete = (data) => {
    setAnalysisResult(data);
    setErrorMessage("");
  };

  const handleClear = () => {
    setAnalysisResult(null);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 antialiased">
      {/* Platform Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-500">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
                AI-ATS Intelligence Platform
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Next.js App Engine
              </p>
            </div>
          </div>
          
          {analysisResult && (
            <button
              onClick={handleClear}
              className="px-4 py-2 text-xs font-semibold tracking-wide uppercase bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Reset Session
            </button>
          )}
        </div>
      </header>

      {/* Main Viewport Router */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-medium">
            ⚠️ {errorMessage}
          </div>
        )}

        {!analysisResult ? (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                Profile Evaluation Pipeline
              </h2>
              <p className="text-base text-slate-400 max-w-xl mx-auto">
                Paste your target application requirements and drop your profile file below to trigger structural deep learning analytics.
              </p>
            </div>
            
            <FileUpload 
              onAnalysisComplete={handleAnalysisComplete}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
              setErrorMessage={setErrorMessage}
            />
          </div>
        ) : (
          <Dashboard data={analysisResult} />
        )}
      </main>
    </div>
  );
}