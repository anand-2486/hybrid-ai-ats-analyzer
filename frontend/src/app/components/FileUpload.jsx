"use client";

import React, { useState } from "react";
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { analyzeProfile } from "../utils/api";

export default function FileUpload({ 
  onAnalysisComplete, 
  isAnalyzing, 
  setIsAnalyzing, 
  setErrorMessage 
}) {
  const [jobDescription, setJobDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension === 'pdf' || extension === 'docx') {
      setSelectedFile(file);
      setErrorMessage("");
    } else {
      setErrorMessage("Unsupported format! Please drop a valid .pdf or .docx profile document.");
    }
  };

  // Submit Handler connecting to FastAPI
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setErrorMessage("Please supply a target Job Description first.");
      return;
    }
    if (!selectedFile) {
      setErrorMessage("Please upload a resume file to evaluate.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage("");

    try {
      const result = await analyzeProfile(jobDescription, selectedFile);
      if (result.success) {
        onAnalysisComplete(result);
      } else {
        setErrorMessage("The platform returned an unverified evaluation signature.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Pipeline failure connecting to core API port 8000.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Job Description Input Block */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-300 block">
          Target Job Description Requirements
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the target job requirements, qualifications, and core expectations here..."
          className="w-full h-48 px-4 py-3 bg-slate-950 border border-slate-800 focus:border-rose-500/50 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-rose-500/50 transition-all resize-none"
          disabled={isAnalyzing}
        />
      </div>

      {/* 2. Drag-and-Drop Area */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-300 block">
          Upload Profile Document
        </label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging 
              ? "border-rose-500 bg-rose-500/5" 
              : selectedFile 
                ? "border-emerald-500/50 bg-emerald-500/5" 
                : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
          }`}
        >
          <input
            type="file"
            id="file-input"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isAnalyzing}
          />
          
          <div className="space-y-3 pointer-events-none">
            {selectedFile ? (
              <>
                <div className="mx-auto w-12 h-12 flex items-center justify-center bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200 max-w-xs mx-auto truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {(selectedFile.size / 1024).toFixed(1)} KB · Ready for parsing
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="mx-auto w-12 h-12 flex items-center justify-center bg-slate-900 text-slate-400 rounded-xl border border-slate-800">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">
                    Drag & drop your resume file, or <span className="text-rose-400 font-semibold">browse</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Accepts official industry layouts (.PDF, .DOCX)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3. Operational Trigger Action Button */}
      <button
        type="submit"
        disabled={isAnalyzing || !jobDescription || !selectedFile}
        className="w-full h-12 flex items-center justify-center space-x-2 bg-gradient-to-r from-rose-600 to-rose-500 disabled:from-slate-800 disabled:to-slate-800 hover:from-rose-500 hover:to-rose-400 text-white font-semibold rounded-xl tracking-wide text-sm shadow-lg disabled:shadow-none shadow-rose-900/20 disabled:text-slate-500 transition-all cursor-pointer disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Running Framework Intelligence...</span>
          </>
        ) : (
          <>
            <FileText className="w-4 h-4" />
            <span>Execute Matrix Matching Pipeline</span>
          </>
        )}
      </button>
    </form>
  );
}