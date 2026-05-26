import React, { useState } from "react";
import { AnalysisResult } from "../types";
import { 
  Globe, Clock, Database, Milestone, AlertTriangle, ShieldCheck, 
  Terminal, ShieldAlert, Code2, Binary, Cpu, Layout, HelpCircle, ArrowLeft, RefreshCw
} from "lucide-react";

interface AiInsightsProps {
  selectedScanId: string | null;
  history: AnalysisResult[];
  onBackToDashboard: () => void;
}

export function AiInsights({ selectedScanId, history, onBackToDashboard }: AiInsightsProps) {
  const [activeSegment, setActiveSegment] = useState<"lexical" | "html" | "visual">("lexical");

  // Determine active scan
  const activeScan = history.find(s => s.id === selectedScanId) || history[0];

  if (!activeScan) {
    return (
      <div className="py-12 bg-[#111827] border border-[#1f2937] rounded-sm text-center space-y-3">
        <HelpCircle className="w-8 h-8 mx-auto text-slate-500" />
        <h3 className="text-white text-sm font-bold uppercase tracking-wide">No Inspection Selected</h3>
        <p className="text-xs text-slate-400 font-mono">Please execute or select a scan in the logs database.</p>
        <button 
          onClick={onBackToDashboard}
          className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-bold uppercase tracking-widest rounded-sm cursor-pointer transition-colors"
        >
          Go to Scanner
        </button>
      </div>
    );
  }

  const getStatusColor = (status: "Critical" | "High" | "Medium" | "Low" | "Safe") => {
    switch (status) {
      case "Critical":
        return "text-red-400 border-red-500/30 bg-red-950/20";
      case "High":
        return "text-orange-400 border-orange-500/30 bg-orange-950/20";
      case "Medium":
        return "text-amber-400 border-amber-500/30 bg-amber-950/20";
      case "Low":
        return "text-blue-400 border-blue-500/30 bg-blue-950/20";
      case "Safe":
      default:
        return "text-emerald-400 border-emerald-500/30 bg-emerald-950/20";
    }
  };

  return (
    <div className="space-y-3">
      {/* Upper header action line */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1f2937] pb-3 mb-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#6b7280] uppercase tracking-wider">
            <span>Trace Logs ID:</span>
            <span className="text-[#3b82f6] font-bold">{activeScan.id}</span>
            <span>|</span>
            <span>Inspected: {activeScan.timestamp}</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white mt-0.5 break-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3b82f6]">social_leaderboard</span>
            AI Diagnostic Deep-Dive
          </h1>
        </div>

        <button
          onClick={onBackToDashboard}
          className="px-3 py-1.5 bg-[#1f2937] border border-[#374151] hover:border-[#3b82f6] rounded-sm text-xs font-bold uppercase tracking-widest text-[#d1d5db] transition-all flex items-center gap-1.5 cursor-pointer self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#3b82f6]" />
          Scanner Console
        </button>
      </div>

      {/* Target Preview Details Line */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
        <div className="space-y-1">
          <span className="text-[#6b7280] uppercase text-[9px] tracking-widest block font-bold">Active Sandbox Inspect Target</span>
          <span className="text-white text-xs font-semibold break-all select-all font-mono">{activeScan.url}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[#6b7280] text-[10px] uppercase font-bold">Risk Rating:</span>
          <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold border uppercase tracking-wider ${
            activeScan.verdict === "Threat" 
              ? "bg-red-500/10 border-red-500/20 text-red-500" 
              : activeScan.verdict === "Warning" 
              ? "bg-amber-500/10 border-amber-500/20 text-amber-500" 
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
          }`}>
            {activeScan.verdict === "Threat" ? "PHISHING" : activeScan.verdict.toUpperCase()} ({activeScan.confidence}%)
          </span>
        </div>
      </div>

      {/* Selector Hub Tabs */}
      <div className="flex bg-[#111827] border border-[#1f2937] rounded-sm p-1 gap-1">
        <button
          onClick={() => setActiveSegment("lexical")}
          className={`px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-wider relative transition-colors cursor-pointer flex items-center gap-2 rounded-sm ${
            activeSegment === "lexical" ? "bg-[#3e82f6]/10 text-[#3b82f6] border border-[#3e82f6]/35 font-bold" : "text-[#9ca3af] hover:text-white"
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-[#3b82f6]" />
          Lexical & DNS
        </button>
        <button
          onClick={() => setActiveSegment("html")}
          className={`px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-wider relative transition-colors cursor-pointer flex items-center gap-2 rounded-sm ${
            activeSegment === "html" ? "bg-[#3e82f6]/10 text-[#3b82f6] border border-[#3e82f6]/35 font-bold" : "text-[#9ca3af] hover:text-white"
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-purple-400" />
          HTML / DOM Logic
        </button>
        <button
          onClick={() => setActiveSegment("visual")}
          className={`px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-wider relative transition-colors cursor-pointer flex items-center gap-2 rounded-sm ${
            activeSegment === "visual" ? "bg-[#3e82f6]/10 text-[#3b82f6] border border-[#3e82f6]/35 font-bold" : "text-[#9ca3af] hover:text-white"
          }`}
        >
          <Layout className="w-3.5 h-3.5 text-orange-400" />
          Visual CNN Match
        </button>
      </div>

      {/* Segment Renderers */}
      <div className="space-y-3">
        
        {/* TAB 1: LEXICAL ANALYSIS */}
        {activeSegment === "lexical" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-fadeIn">
            <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-4 md:col-span-2 space-y-4">
              <h3 className="text-xs font-bold tracking-widest text-[#d1d5db] uppercase flex items-center gap-1.5 border-b border-[#1f2937] pb-2">
                <Terminal className="w-4 h-4 text-[#3b82f6]" />
                Whois & Domain Telemetry Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-[11px] font-mono leading-relaxed">
                <div className="bg-[#0b0e14] border border-[#1f2937] rounded-sm p-2.5">
                  <span className="text-[#6b7280] block uppercase text-[8px] font-bold">Registrar Server</span>
                  <span className="text-white text-xs font-medium mt-0.5 block truncate">{activeScan.lexicalInfo.registrar}</span>
                </div>
                <div className="bg-[#0b0e14] border border-[#1f2937] rounded-sm p-2.5">
                  <span className="text-[#6b7280] block uppercase text-[8px] font-bold">Registrant Organization</span>
                  <span className="text-white text-xs font-bold mt-0.5 block truncate">{activeScan.lexicalInfo.registrantOrg}</span>
                </div>
                <div className="bg-[#0b0e14] border border-[#1f2937] rounded-sm p-2.5">
                  <span className="text-[#6b7280] block uppercase text-[8px] font-bold">Nameserver Delegation</span>
                  <span className="text-white text-xs font-mono mt-0.5 block truncate">{activeScan.lexicalInfo.nameserver}</span>
                </div>
                <div className="bg-[#0b0e14] border border-[#1f2937] rounded-sm p-2.5">
                  <span className="text-[#6b7280] block uppercase text-[8px] font-bold">Establishment Epoch</span>
                  <span className="text-white text-xs font-mono mt-0.5 block">{activeScan.lexicalInfo.creationDate.split('T')[0]}</span>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <h4 className="text-[10px] font-bold text-[#6b7280] font-mono tracking-widest uppercase">Statistical Lexical Breakdown</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-center">
                  <div className="bg-[#0b0e14]/55 border border-[#1f2937] rounded-sm p-3">
                    <span className="text-[9px] text-[#6b7280] block uppercase">Entropy Index (Shannon)</span>
                    <strong className="text-base text-white block mt-0.5">{activeScan.lexicalInfo.entropy}</strong>
                    <span className="text-[9px] text-[#4b5563] block mt-0.5">Unpredictability measure</span>
                  </div>
                  <div className="bg-[#0b0e14]/55 border border-[#1f2937] rounded-sm p-3">
                    <span className="text-[9px] text-[#6b7280] block uppercase">Unicode URL Length</span>
                    <strong className="text-base text-white block mt-0.5">{activeScan.lexicalInfo.length} Chars</strong>
                    <span className="text-[9px] text-[#4b5563] block mt-0.5">{activeScan.lexicalInfo.length > 35 ? "Suspicious path" : "Under normal threshold"}</span>
                  </div>
                  <div className="bg-[#0b0e14]/55 border border-[#1f2937] rounded-sm p-3">
                    <span className="text-[9px] text-[#6b7280] block uppercase">Domain Age Allocation</span>
                    <strong className="text-base text-[#3b82f6] block mt-0.5">{activeScan.lexicalInfo.ageDays} Days</strong>
                    <span className="text-[9px] text-[#4b5563] block mt-0.5">{activeScan.lexicalInfo.ageDays < 30 ? "High Vulnerability Epoch" : "Mature Legacy IP"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-4 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold tracking-widest text-[#d1d5db] uppercase flex items-center gap-1.5 border-b border-[#1f2937] pb-2">
                  <Milestone className="w-4 h-4 text-purple-400" />
                  Target Brand Correlation
                </h3>
                <div className="py-4 text-center">
                  <Globe className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                  <span className="text-[9px] font-mono text-[#6b7280] block uppercase font-bold">Target Brand Spoofed</span>
                  <strong className="text-base font-bold text-white mt-0.5 block font-mono">
                    {activeScan.lexicalInfo.brandSpoof === "None" ? "None (Legitimate Host)" : activeScan.lexicalInfo.brandSpoof}
                  </strong>
                </div>
              </div>

              <div className="bg-[#0b0e14] border border-[#1f2937] rounded-sm p-3 text-[11px] space-y-2 font-mono leading-relaxed">
                <span className="text-[10px] font-bold text-purple-400 block uppercase">Correlation Diagnostics</span>
                {activeScan.lexicalInfo.brandSpoof === "None" ? (
                  <p className="text-[#9ca3af] text-[11px]">
                    Host matches verified global namespaces. No brand keywords are located out of context or scrambled in host paths.
                  </p>
                ) : (
                  <p className="text-[#9ca3af] text-[11px]">
                    Host uses the brand prefix <strong className="text-[#3b82f6]">"{activeScan.lexicalInfo.brandSpoof}"</strong> in a sub-namespace with a mismatched registrar context. High threat level.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HTML & DOM INFERENCES */}
        {activeSegment === "html" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-fadeIn">
            <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-4 md:col-span-2 space-y-3">
              <h3 className="text-xs font-bold tracking-widest text-[#d1d5db] uppercase flex items-center gap-1.5 border-b border-[#1f2937] pb-2">
                <Binary className="w-4 h-4 text-purple-400" />
                Heuristic Script & DOM Inspectors
              </h3>

              <div className="space-y-3 font-mono text-[11px]">
                {/* Form Action Inspection */}
                <div className="bg-[#0b0e14] border border-[#1f2937] rounded-sm p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold block uppercase tracking-wider font-mono text-[10px]">1. Form Action Hijacking check</span>
                    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-mono border font-bold ${getStatusColor(activeScan.htmlInfo.formAction.status)}`}>
                      {activeScan.htmlInfo.formAction.status}
                    </span>
                  </div>
                  <p className="text-[#9ca3af] leading-relaxed">
                    {activeScan.htmlInfo.formAction.details}
                  </p>
                </div>

                {/* Obfuscated JS code block */}
                <div className="bg-[#0b0e14] border border-[#1f2937] rounded-sm p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold block uppercase tracking-wider font-mono text-[10px]">2. Script Packing / Cipher Payloads</span>
                    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-mono border font-bold ${getStatusColor(activeScan.htmlInfo.obfuscatedJs.status)}`}>
                      {activeScan.htmlInfo.obfuscatedJs.status}
                    </span>
                  </div>
                  <p className="text-[#9ca3af] leading-relaxed">
                    {activeScan.htmlInfo.obfuscatedJs.details}
                  </p>
                </div>

                {/* Zero Width space evasion detection */}
                <div className="bg-[#0b0e14] border border-[#1f2937] rounded-sm p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold block uppercase tracking-wider font-mono text-[10px]">3. Zero-Width Space Evasion Signature</span>
                    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-mono border font-bold ${getStatusColor(activeScan.htmlInfo.zeroWidth.status)}`}>
                      {activeScan.htmlInfo.zeroWidth.status}
                    </span>
                  </div>
                  <p className="text-[#9ca3af] leading-relaxed">
                    {activeScan.htmlInfo.zeroWidth.details}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-4 space-y-3">
              <h3 className="text-xs font-bold tracking-widest text-[#d1d5db] uppercase flex items-center gap-1.5 border-b border-[#1f2937] pb-2 font-mono">
                <Cpu className="w-4 h-4 text-[#3b82f6]" />
                TF-IDF Lexical Signatures
              </h3>
              <p className="text-[11px] text-[#9ca3af] leading-relaxed">
                Extracted unique host document keywords score relative to a standard legitimate login model corpus.
              </p>

              <div className="space-y-1.5 pt-1">
                {activeScan.htmlInfo.tfidfKeywords.map((tag) => (
                  <div key={tag.word} className="bg-[#0b0e14] border border-[#1f2937] rounded-sm p-2 flex items-center justify-between font-mono text-xs">
                    <span className="text-[#3b82f6] font-bold">"{tag.word}"</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#3b82f6] h-full"
                          style={{ width: `${tag.score * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-[11px] font-bold">{(tag.score * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VISUAL CNN ANALYSES */}
        {activeSegment === "visual" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 animate-fadeIn">
            {/* Left Browser display frame mock */}
            <div className="lg:col-span-3 space-y-3">
              <div className="bg-[#111827] border border-[#1f2937] rounded-sm overflow-hidden shadow-2xl relative">
                {/* Virtual Browser Top Header */}
                <div className="bg-[#090f1e] px-3 py-1.5 flex items-center justify-between border-b border-[#1f2937] font-mono text-[9px] text-[#6b7280]">
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  
                  <div className="bg-[#0b0e14] border border-[#1f2937] px-2 py-0.5 rounded-sm text-[#94a3b8] truncate max-w-[280px] text-center font-bold flex items-center justify-center gap-1 select-all">
                    {activeScan.url.substring(0, 35)}...
                  </div>

                  <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                </div>

                {/* Live Sandbox screenshot element overlay */}
                <div className="relative min-h-[300px] bg-slate-950 flex items-center justify-center overflow-hidden">
                  <img 
                    src={activeScan.visualInfo.imageUrl}
                    alt="PhishGuard Sandbox Screenshot"
                    className="w-full h-full object-cover opacity-60 filter saturate-50 contrast-125"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Holographic matrix targeting grid overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
                  
                  {/* Holographic scanner line for visual excitement */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-scanning"></div>
                  
                  {/* Virtual overlay showing target box coordinates */}
                  <div className="absolute top-4 left-4 font-mono text-[9px] text-red-400 bg-slate-950 border border-red-500/40 px-2 py-1 rounded-sm flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span>CNN ANALYSER COORDINATES: TARGET LOCKED</span>
                  </div>

                  {activeScan.verdict === "Threat" && (
                     <div className="absolute inset-x-0 bottom-4 text-center">
                      <div className="inline-block bg-red-950/90 border border-red-500/40 text-red-200 px-3 py-1.5 rounded-sm text-[11px] font-mono font-bold max-w-sm mx-auto">
                        🔥 ADVERSARIAL TEMPLATE REPLICAS DETECTED
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Diagnostic data column */}
            <div className="lg:col-span-2 space-y-3">
              <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-4 space-y-4">
                <div>
                  <h3 className="text-xs font-bold tracking-widest text-[#d1d5db] uppercase flex items-center gap-1.5 border-b border-[#1f2937] pb-2">
                    <Layout className="w-4 h-4 text-orange-400" />
                    Visual Matrix Insights
                  </h3>
                  <p className="text-[11px] text-[#9ca3af] leading-relaxed mt-1">
                    Visual convolutional layers matches logos, favicon hashes, and geometric layout grids to flag spatial duplication models.
                  </p>
                </div>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className="bg-[#0b0e14] border border-[#1f2937] rounded-sm p-2.5">
                    <span className="text-[#6b7280] block uppercase text-[9px] font-bold">Identified Corporate Brand Logo</span>
                    <strong className="text-white mt-0.5 block">{activeScan.visualInfo.logoRecognition}</strong>
                  </div>
                  
                  <div className="bg-[#0b0e14] border border-[#1f2937] rounded-sm p-2.5">
                    <span className="text-[#6b7280] block uppercase text-[9px] font-bold">Geometric Layout Similarity</span>
                    <strong className="text-white mt-0.5 block">{activeScan.visualInfo.layoutSimilarity}</strong>
                  </div>

                  <div className="bg-[#0b0e14] border border-red-950/30 rounded-sm p-3">
                    <span className="text-red-400 font-bold block uppercase text-[9px] mb-1">Ensemble Visual Conclusion</span>
                    <p className="text-[#9ca3af] leading-relaxed">
                      {activeScan.visualInfo.cnnDecision}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
