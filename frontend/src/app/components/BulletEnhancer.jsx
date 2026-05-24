"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, ArrowRight, Loader2 } from "lucide-react";
import { enhanceBulletPoint } from "../utils/api";

export default function BulletEnhancer() {
  const [weakBullet, setWeakBullet] = useState("");
  const [targetFocus, setTargetFocus] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleOptimize = async (e) => {
    e.preventDefault();
    if (!weakBullet.trim()) return;
    
    setLoading(true);
    setResult(null);
    setCopied(false);
    try {
      const response = await enhanceBulletPoint(weakBullet, targetFocus || "General Engineering");
      if (response.success) {
        setResult(response.data);
      }
    } catch (err) {
      alert("Error optimizing text block. Verify backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.enhanced_bullet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    /* 🎨 Card base optimized to match the clean, deep charcoal container theme */
    <div className="bg-[#111622]/40 border border-[#1E2638] rounded-3xl p-6 space-y-6 mt-8 shadow-2xl shadow-black/20 backdrop-blur-md">
      <div className="flex items-center space-x-3">
        {/* Swapped token box to emerald branding */}
        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">AI Bullet Point Optimizer</h3>
          <p className="text-xs text-slate-500">Transform passive descriptions into quantified, high-impact technical metrics.</p>
        </div>
      </div>

      <form onSubmit={handleOptimize} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">Passive Resume Sentence</label>
          <textarea
            value={weakBullet}
            onChange={(e) => setWeakBullet(e.target.value)}
            placeholder="e.g., I worked on the frontend dashboard using React."
            className="w-full h-24 p-3.5 bg-[#0B0F17]/60 border border-[#1E2638] rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 resize-none transition-colors shadow-inner"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">Target Tech / Focus Domain</label>
          <textarea
            value={targetFocus}
            onChange={(e) => setTargetFocus(e.target.value)}
            placeholder="e.g., Next.js, Web Vitals, page load latency optimizations"
            className="w-full h-24 p-3.5 bg-[#0B0F17]/60 border border-[#1E2638] rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 resize-none transition-colors shadow-inner"
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          {/* Main solid emerald action button */}
          <button
            type="submit"
            disabled={loading || !weakBullet.trim()}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/30 text-slate-950 font-bold text-xs uppercase tracking-wide rounded-xl flex items-center justify-center space-x-2 transition-all shadow-xl shadow-emerald-950/10 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950 mr-1" />
                <span>Refactoring Framework Parameters...</span>
              </>
            ) : (
              <>
                <span>Execute XYZ Optimization</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 text-slate-950" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Result feedback block matches the clean emerald/slate aesthetic */}
      {result && (
        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-3 animate-in fade-in duration-300">
          <div className="flex items-start justify-between space-x-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">ATS Optimization Result</span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">"{result.enhanced_bullet}"</p>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 bg-slate-950 border border-[#1E2638] rounded-lg hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors shrink-0 cursor-pointer shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="pt-2 border-t border-[#1E2638]">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Transformation Matrix Feedback</span>
            <p className="text-[11px] text-slate-400 italic mt-0.5">{result.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}