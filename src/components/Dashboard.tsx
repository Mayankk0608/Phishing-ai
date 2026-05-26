import React, { useState, useEffect } from "react";
import { AnalysisResult } from "../types";
import { 
  ShieldAlert, ShieldCheck, ShieldAlert as WarningIcon, 
  Search, RefreshCw, Cpu, Layers, Image, ArrowRight, Eye, Calendar, Globe, Network, AlertTriangle
} from "lucide-react";

interface DashboardProps {
  history: AnalysisResult[];
  onAnalyze: (url: string) => Promise<AnalysisResult | null>;
  onSelectScan: (id: string) => void;
}

export function Dashboard({ history, onAnalyze, onSelectScan }: DashboardProps) {
  const [urlInput, setUrlInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [elapsedScanTime, setElapsedScanTime] = useState(0);
  const [activeScanIndex, setActiveScanIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const currentScan = history[activeScanIndex] || history[0];

  useEffect(() => {
    let timer: any;
    if (isScanning) {
      timer = setInterval(() => {
        setElapsedScanTime(prev => parseFloat((prev + 0.1).toFixed(1)));
        setScanProgress(prev => {
          if (prev >= 100) return 100;
          return prev + Math.floor(Math.random() * 12) + 4;
        });
      }, 100);
    } else {
      setElapsedScanTime(0);
      setScanProgress(0);
    }
    return () => clearInterval(timer);
  }, [isScanning]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setErrorMessage("");
    setIsScanning(true);
    setScanProgress(5);
    
    // Simulate minor lag for dramatic, realistic scanning feedback
    try {
      const result = await onAnalyze(urlInput);
      if (result) {
        setUrlInput("");
        setActiveScanIndex(0); // Set newly added result as the active index
      } else {
        setErrorMessage("Inference offline. Please check network routes.");
      }
    } catch {
      setErrorMessage("System failed to execute scan pipelines.");
    } finally {
      setIsScanning(false);
    }
  };

  const getVerdictStyles = (verdict: string) => {
    switch (verdict) {
      case "Threat":
        return {
          bg: "bg-red-950/40 border-red-500/50 text-red-200",
          text: "text-red-400",
          tagBg: "bg-red-500/15 border-red-500/30 text-red-400",
          badge: <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />,
          desc: "CRITICAL SUSPICION. Multi-modal scoring signals high brand identity spoofing and adversarial structural behaviors. Immediate blacklisting suggested."
        };
      case "Warning":
        return {
          bg: "bg-amber-950/30 border-amber-500/40 text-amber-200",
          text: "text-amber-400",
          tagBg: "bg-amber-500/15 border-amber-500/30 text-amber-400",
          badge: <AlertTriangle className="w-5 h-5 text-amber-500" />,
          desc: "SUSPICIOUS ACTIVITY. Host exhibits high JavaScript obfuscation techniques or dynamic layout templates mismatching its domain history."
        };
      case "Safe":
      default:
        return {
          bg: "bg-emerald-950/20 border-emerald-500/30 text-emerald-200",
          text: "text-emerald-400",
          tagBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
          badge: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
          desc: "VERIFIED SECURE. Layout aligns perfectly with physical domain mapping, DNS telemetry, and secure cryptographic handshakes."
        };
    }
  };

  const activeStyles = currentScan ? getVerdictStyles(currentScan.verdict) : null;

  return (
    <div className="space-y-3" id="dashboard-view">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1f2937] pb-3 mb-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3b82f6]">dashboard</span>
            Threat Detection Control
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Analyze zero-day visual phishing URLs using deep multi-modal lexical, HTML-DOM, and visual CNN alignment blocks.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#111827] border border-[#1f2937] px-3 py-1 rounded bg-[#111827] text-xs font-mono">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>FastAPI Inference Server: <strong className="text-emerald-400">ONLINE</strong></span>
        </div>
      </div>

      {/* Grid Layout: Search bar + primary display cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        
        {/* submission form column */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#3b82f6]"></div>
            
            <h2 className="text-xs font-bold text-white tracking-widest uppercase mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs text-[#3b82f6]">search</span>
              Threat scanner pipeline
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2.5">
                <div className="relative flex-grow">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Globe className="w-4 h-4" />
                  </span>
                  <input
                    type="url"
                    placeholder="Enter targeted phishing URL (e.g., http://secure-login-update-paypal.com)"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={isScanning}
                    className="w-full pl-9 pr-3 py-2 bg-[#0b0e14] border border-[#1f2937] rounded-sm text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-[#3b82f6] transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isScanning}
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-bold px-6 py-2 uppercase tracking-widest rounded-sm transition-colors cursor-pointer shrink-0"
                >
                  {isScanning ? "Scanning..." : "Analyze"}
                </button>
              </div>

              {errorMessage && (
                <div className="text-[11px] font-mono text-red-400 border border-red-950/40 bg-red-950/20 px-3 py-1.5 rounded-sm">
                  {errorMessage}
                </div>
              )}
            </form>

            {/* Scanning Progress bar */}
            {isScanning && (
              <div className="mt-4 space-y-2 border-t border-[#1f2937] pt-3">
                <div className="flex justify-between text-[11px] font-mono text-[#94a3b8]">
                  <span className="flex items-center gap-1.5 text-[#3b82f6]">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Analyzing Lexical, HTML Elements & Visual Spoofing...
                  </span>
                  <span>{elapsedScanTime}s / {Math.min(100, scanProgress)}%</span>
                </div>
                <div className="w-full bg-[#0b0e14] h-1.5 rounded-sm overflow-hidden">
                  <div 
                    className="bg-[#3b82f6] h-full transition-all duration-100 ease-out"
                    style={{ width: `${Math.min(100, scanProgress)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Verdict Display */}
          {currentScan && activeStyles && (
            <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-4 relative transition-all space-y-3">
              {/* Bento Grid Header columns info mirroring target spec blueprint */}
              <div className="grid grid-cols-3 gap-3">
                <div className={`bg-[#0b0e14] border-l-2 p-3 ${
                  currentScan.verdict === "Threat" ? "border-red-500" : currentScan.verdict === "Warning" ? "border-amber-500" : "border-[#10b981]"
                }`}>
                  <div className="text-[10px] text-[#6b7280] uppercase mb-1 font-bold font-mono">Verdict</div>
                  <div className={`text-xl font-bold tracking-tight uppercase ${
                    currentScan.verdict === "Threat" ? "text-red-500" : currentScan.verdict === "Warning" ? "text-amber-500" : "text-emerald-400"
                  }`}>
                    {currentScan.verdict === "Threat" ? "PHISHING" : currentScan.verdict}
                  </div>
                  <div className="text-[10px] text-[#9ca3af] mt-1 font-mono">Ensemble Score: {currentScan.confidence}%</div>
                </div>

                <div className="bg-[#0b0e14] border-l-2 border-[#3b82f6] p-3">
                  <div className="text-[10px] text-[#6b7280] uppercase mb-1 font-bold font-mono">Visual Match</div>
                  <div className="text-sm text-white font-mono uppercase truncate">
                    {currentScan.lexicalInfo.brandSpoof === "None" ? "No Match" : currentScan.lexicalInfo.brandSpoof}
                  </div>
                  <div className="text-[10px] text-[#9ca3af] mt-1 font-mono">CNN Screen Analysis</div>
                </div>

                <div className="bg-[#0b0e14] border-l-2 border-orange-500 p-3">
                  <div className="text-[10px] text-[#6b7280] uppercase mb-1 font-bold font-mono">Domain Age</div>
                  <div className="text-sm text-white font-mono uppercase truncate">
                    {currentScan.lexicalInfo.ageDays} Days
                  </div>
                  <div className="text-[10px] text-[#9ca3af] mt-1 font-mono">WHOIS registration</div>
                </div>
              </div>

              {/* URL and Detailed Message */}
              <div className="bg-[#0b0e14] border border-[#1f2937] p-3 rounded-sm space-y-2">
                <div>
                  <span className="text-[9px] font-mono text-[#6b7280] uppercase tracking-wider block">Inspected Resource URL</span>
                  <div className="text-xs font-mono text-white mt-0.5 break-all select-all select-text font-semibold p-2 bg-[#0d131f] border border-[#1f2937] rounded-sm">
                    {currentScan.url}
                  </div>
                </div>

                <p className="text-xs text-[#9ca3af] leading-relaxed">
                  {activeStyles.desc}
                </p>

                {/* score details */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="bg-[#111827] border border-[#1f2937] p-2 text-center rounded-sm">
                    <span className="text-[9px] font-mono text-[#6b7280] uppercase block">Lexical Match</span>
                    <strong className="text-xs font-mono text-white mt-0.5 block">{currentScan.composition.lexical}%</strong>
                  </div>
                  <div className="bg-[#111827] border border-[#1f2937] p-2 text-center rounded-sm">
                    <span className="text-[9px] font-mono text-[#6b7280] uppercase block">HTML DOM Match</span>
                    <strong className="text-xs font-mono text-white mt-0.5 block">{currentScan.composition.html}%</strong>
                  </div>
                  <div className="bg-[#111827] border border-[#1f2937] p-2 text-center rounded-sm">
                    <span className="text-[9px] font-mono text-[#6b7280] uppercase block">Visual Sim</span>
                    <strong className="text-xs font-mono text-white mt-0.5 block">{currentScan.composition.visual}%</strong>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-[#4b5563] pt-2 border-t border-[#1f2937]/50 mt-1">
                  <span>Trace Hash: {currentScan.id}</span>
                  <button 
                    onClick={() => onSelectScan(currentScan.id)}
                    className="text-[#3b82f6] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    Deep Diagnostic Metrics <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confidence Meter circular gauge column */}
        <div className="space-y-6">
          <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-4 flex flex-col items-center justify-center text-center relative overflow-hidden h-full">
            <h2 className="text-[10px] font-mono font-bold tracking-wider text-[#6b7280] uppercase w-full text-left mb-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs text-[#3b82f6]">analytics</span>
              Dynamic risk output
            </h2>

            {currentScan ? (
              <div className="flex-grow flex flex-col justify-center items-center py-2">
                {/* SVG circular progress */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke="#070a10"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke={currentScan.verdict === "Threat" ? "#ef4444" : currentScan.verdict === "Warning" ? "#f59e0b" : "#10b981"}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={377}
                      strokeDashoffset={377 - (377 * (currentScan.confidence ?? 0)) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col justify-center items-center">
                    <span className="text-2xl font-bold font-mono text-white tracking-tighter">
                      {currentScan.confidence}%
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#6b7280] mt-0.5">
                      Phish Index
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <h4 className="text-xs font-mono font-bold text-white uppercase">
                    {currentScan.verdict === "Threat" ? "High Risk Detected" : currentScan.verdict === "Warning" ? "Mitigated Suspicions" : "Verified Legit Domain"}
                  </h4>
                  <p className="text-[11px] text-[#9ca3af] max-w-[200px] leading-relaxed mx-auto">
                    {currentScan.verdict === "Threat" 
                      ? "The statistical ensemble classifier generated high adversarial threat metrics. Avoid credentials sharing." 
                      : currentScan.verdict === "Warning" 
                      ? "System warning is triggered. Heuristic structures suggest localized testing templates." 
                      : "Clean DNS telemetry, normal registrar history, and authentic cryptographic handshakes."
                    }
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#4b5563] font-mono my-auto">Await submission for threat mapping...</p>
            )}
          </div>
        </div>

      </div>

      {/* Recent Scans Logs */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-4">
        <div className="flex items-center justify-between border-b border-[#1f2937] pb-3 mb-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs text-[#9ca3af]">list_alt</span>
            Recent Inspection Logs
          </h2>
          <span className="text-[10px] font-mono text-[#9ca3af] bg-[#0b0e14] px-2 py-0.5 border border-[#1f2937] rounded-sm">
            Seeded records: <strong className="text-[#3b82f6] font-bold">{history.length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b border-[#1f2937] text-[#6b7280] uppercase">
                <th className="pb-2 pt-1 font-semibold">Target URL</th>
                <th className="pb-2 pt-1 font-semibold text-center">Verdict</th>
                <th className="pb-2 pt-1 font-semibold text-center">Confidence</th>
                <th className="pb-2 pt-1 font-semibold text-center">Brand Target</th>
                <th className="pb-2 pt-1 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]/50 text-[#9ca3af]">
              {history.map((scan, index) => (
                <tr 
                  key={scan.id} 
                  className={`hover:bg-[#1f2937]/50 transition-colors group ${index === activeScanIndex ? "bg-[#0b0e14]" : ""}`}
                >
                  <td className="py-2.5 px-1 max-w-xs md:max-w-md truncate text-[#d1d5db]">
                    <span className="text-[#4b5563] mr-2 text-[10px] font-bold inline-block">
                      {scan.id}
                    </span>
                    {scan.url}
                  </td>
                  <td className="py-2.5 text-center">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] tracking-wider border font-bold ${
                      scan.verdict === "Threat" 
                        ? "bg-red-500/10 border-red-500/20 text-red-400 font-bold" 
                        : scan.verdict === "Warning" 
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-400 font-bold" 
                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold"
                    }`}>
                      {scan.verdict === "Threat" ? "PHISH" : scan.verdict.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2.5 text-center text-white">
                    {scan.confidence}%
                  </td>
                  <td className="py-2.5 text-center text-[#9ca3af] font-bold">
                    {scan.lexicalInfo.brandSpoof === "None" ? (
                      <span className="text-[#4b5563] font-normal">-</span>
                    ) : (
                      <span className="text-[#3b82f6]">{scan.lexicalInfo.brandSpoof}</span>
                    )}
                  </td>
                  <td className="py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setActiveScanIndex(index);
                          const dashboardEl = document.getElementById("dashboard-view");
                          if (dashboardEl) {
                            dashboardEl.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-sm bg-[#0b0e14] border border-[#1f2937]"
                        title="Display in Dashboard View"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                      
                      <button
                        onClick={() => onSelectScan(scan.id)}
                        className="px-2 py-1 bg-[#1f2937] border border-[#374151] hover:border-[#3b82f6] rounded-sm text-[#d1d5db] hover:text-white flex items-center gap-1 text-[10px] font-bold uppercase cursor-pointer transition-colors"
                        title="Open AI Diagnostics"
                      >
                        <Eye className="w-3 h-3 text-[#3b82f6]" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
