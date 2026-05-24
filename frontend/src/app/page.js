"use client";

import React, { useState } from "react";
import RecruiterDashboard from "@/app/components/RecruiterDashboard";
import { BrainCircuit, UploadCloud, FileText, CheckCircle2, Loader2, CheckCircle } from "lucide-react";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [batchResults, setBatchResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleExecuteBatchRanking = async (e) => {
    e.preventDefault();
    
    if (!jobDescription || !jobDescription.trim()) {
      setErrorMessage("Please supply a valid Master Job Description framework first.");
      return;
    }
    if (selectedFiles.length === 0) {
      setErrorMessage("Batch file matrix cannot be empty. Select at least 1 candidate profile.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage("");
    
    const formData = new FormData();
    formData.append("job_description", jobDescription);
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/recruiter/rank-candidates", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Batch parsing runtime error occurred on the pipeline server.");
      }

      const payload = await response.json();
      if (payload.success) {
        setBatchResults(payload.leaderboard);
      }
    } catch (err) {
      setErrorMessage(err.message || "Network layer processing mismatch detected.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-200 antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
      
      {/* Header Framework */}
      <header className="border-b border-[#1E2638] bg-[#0B0F17]/60 backdrop-blur-xl sticky top-0 z-50 px-6 py-4 shadow-xl shadow-black/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white">
                AI-ATS Recruiter Intelligence Suite
              </h1>
              <p className="text-[10px] text-emerald-500/80 font-bold uppercase tracking-wider">
                Enterprise Batch Processing Engine
              </p>
            </div>
          </div>
          
          {batchResults && (
            <button
              onClick={() => { setBatchResults(null); setSelectedFiles([]); }}
              className="px-4 py-2 text-xs font-bold tracking-wide uppercase bg-slate-900 border border-[#1E2638] hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
            >
              Reset Ingestion Pipeline
            </button>
          )}
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
        {errorMessage && (
          <div className="w-full max-w-4xl mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-medium">
            ⚠️ {errorMessage}
          </div>
        )}

        {!batchResults ? (
          /* 🌟 FIXED: Max width restricted to 4xl for a tighter, high-end dashboard structure */
          <div className="w-full max-w-4xl space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-black tracking-tight text-white">
                Talent Acquisition Leaderboard
              </h2>
              <p className="text-xs text-slate-400 max-w-xl mx-auto font-normal">
                Paste corporate tracking specs and drop candidate profiles to generate rank-ordered alignment metrics.
              </p>
            </div>

            <form onSubmit={handleExecuteBatchRanking} className="space-y-5 w-full">
              
              {/* Box 1: Text Area */}
              <div className="space-y-2 w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pl-0.5">
                  1. Master Job Requirements SPEC
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste organizational target specs, tooling criteria, and core responsibilities matrix profile here..."
                  className="w-full h-44 p-4 bg-[#111622]/40 border border-[#1E2638] rounded-2xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 transition-colors shadow-inner resize-none box-border"
                />
              </div>

              {/* Box 2: Drag and Drop Area */}
              <div className="space-y-2 w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pl-0.5">
                  2. Ingest Multiple Applicant Files
                </label>
                <div className="w-full border-2 border-dashed border-[#1E2638] bg-[#111622]/10 rounded-2xl p-8 hover:border-emerald-500/30 bg-slate-950/20 transition-all text-center relative group cursor-pointer shadow-2xl shadow-black/10 box-border">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-3 flex flex-col items-center justify-center">
                    <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    <div className="text-xs text-slate-300 font-semibold tracking-wide">
                      Click or drag to upload multiple applicant files simultaneously
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Supports bulk arrays of raw .pdf or .docx resumes
                    </div>
                  </div>
                </div>
              </div>

              {/* 🌟 FIXED: Streamlined Success Alert Toast */}
              {selectedFiles.length > 0 && (
                <div className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between box-border animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">
                      File uploaded successfully
                    </span>
                    <span className="text-xs text-slate-500 hidden sm:inline-block truncate max-w-[280px] font-mono">
                      ({selectedFiles[0].name} {selectedFiles.length > 1 && `+${selectedFiles.length - 1} more`})
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-emerald-400 shrink-0">
                    <FileText className="w-3 h-3" />
                    <span>READY</span>
                  </div>
                </div>
              )}

              {/* Box 4: Action Button Container */}
              <div className="w-full pt-1">
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/40 text-slate-950 font-bold text-xs uppercase tracking-wide rounded-xl flex items-center justify-center space-x-2 transition-all shadow-xl shadow-emerald-950/10 cursor-pointer box-border"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950 mr-1.5" />
                      <span>Executing Batch Vector Ranking Pipeline...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      <span>Process & Rank Candidate Cohort</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* 🌟 Recruiter Dashboard expands out smoothly to full screen grid when results populate */
          <div className="w-full">
            <RecruiterDashboard candidatesList={batchResults} />
          </div>
        )}
      </main>
    </div>
  );
}