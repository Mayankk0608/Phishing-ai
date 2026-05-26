import React, { useState, useEffect } from "react";
import { AnalysisResult } from "./types";
import { Dashboard } from "./components/Dashboard";
import { History } from "./components/History";
import { AiInsights } from "./components/AiInsights";
import { SystemMonitor } from "./components/SystemMonitor";
import { AuditLog } from "./components/AuditLog";
import { Settings } from "./components/Settings";
import { 
  ShieldAlert, Database, Cpu, Fingerprint, Settings as SettingsIcon, 
  HelpCircle, LogOut, Loader2, ArrowUpRight, ShieldCheck, RefreshCw, Layers
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "history" | "insights" | "monitor" | "audit" | "settings">("dashboard");
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch pre-seeded history logs from our full-stack server on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/history");
        const payload = await res.json();
        if (payload.status === "success" && Array.isArray(payload.data)) {
          setHistory(payload.data);
          if (payload.data.length > 0) {
            setSelectedScanId(payload.data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch initial telemetry logs database:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHistory();
  }, []);

  // Post new URL scan request directly to the Gemini API endpoint server
  const handleAnalyzeUrl = async (url: string): Promise<AnalysisResult | null> => {
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      const json = await res.json();
      if (json.status === "success" && json.data) {
        // Prepend the new scan to the historical state
        setHistory(prev => [json.data, ...prev]);
        setSelectedScanId(json.data.id);
        return json.data;
      }
    } catch (e) {
      console.error("Server API threat analysis execution failed:", e);
    }
    return null;
  };

  const handleSelectScan = (id: string) => {
    setSelectedScanId(id);
    setActiveTab("insights");
  };

  const clearHistoryRecords = () => {
    setHistory([]);
    setSelectedScanId(null);
  };

  const handleLogOut = () => {
    // Reset session
    const opt = window.confirm("Are you sure you want to reboot and wipe active threat intelligence caches?");
    if (opt) {
      clearHistoryRecords();
      setActiveTab("dashboard");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#d1d5db] flex font-sans select-none antialiased">
      
      {/* 1. SIDEBAR NAVIGATION PANES */}
      <aside className="w-64 border-r border-[#1f2937] bg-gradient-to-b from-[#111827] to-[#0d131f] flex flex-col justify-between shrink-0 hidden md:flex">
        
        {/* Upper nav segment */}
        <div className="space-y-4 pt-1">
          {/* Logo brand */}
          <div className="p-4 border-b border-[#1f2937] flex items-center gap-3 bg-[#111827]">
            <div className="w-6 h-6 bg-[#3b82f6] rounded-sm flex items-center justify-center shrink-0">
              <div className="w-3 h-3 border-2 border-white transform rotate-45"></div>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider text-white uppercase">PhishGuard</h1>
              <span className="text-[10px] font-mono block text-[#6b7280]">v1.0.42</span>
            </div>
          </div>

          {/* Quick inspect URL button action */}
          <div className="px-3">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setTimeout(() => {
                  const inputEl = document.querySelector('input[type="url"]');
                  if (inputEl) {
                    (inputEl as HTMLInputElement).focus();
                  }
                }, 100);
              }}
              className="w-full py-2 px-3 bg-[#1f2937] hover:bg-[#374151] border border-[#374151] hover:border-[#3b82f6] text-[11px] font-bold uppercase tracking-widest text-white rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <ArrowsRight className="w-3.5 h-3.5 text-[#3b82f6]" />
              <span>Scan Target URL</span>
            </button>
          </div>

          {/* Navigation link elements */}
          <nav className="px-2 space-y-0.5">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-sm text-xs font-mono font-bold tracking-normal transition-colors cursor-pointer ${
                activeTab === "dashboard" ? "bg-[#1f2937] text-white border-l-2 border-[#3b82f6]" : "text-[#9ca3af] hover:text-white hover:bg-[#111827]/60"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">dashboard</span>
              <span>Dashboard Control</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-sm text-xs font-mono font-bold tracking-normal transition-colors cursor-pointer ${
                activeTab === "history" ? "bg-[#1f2937] text-white border-l-2 border-[#3b82f6]" : "text-[#9ca3af] hover:text-white hover:bg-[#111827]/60"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">database</span>
              <span>Audit Database</span>
            </button>

            <button
              onClick={() => setActiveTab("insights")}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-sm text-xs font-mono font-bold tracking-normal transition-colors cursor-pointer ${
                activeTab === "insights" ? "bg-[#1f2937] text-white border-l-2 border-[#3b82f6]" : "text-[#9ca3af] hover:text-white hover:bg-[#111827]/60"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">social_leaderboard</span>
              <span>AI Insights</span>
            </button>

            <button
              onClick={() => setActiveTab("monitor")}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-sm text-xs font-mono font-bold tracking-normal transition-colors cursor-pointer ${
                activeTab === "monitor" ? "bg-[#1f2937] text-white border-l-2 border-[#3b82f6]" : "text-[#9ca3af] hover:text-white hover:bg-[#111827]/60"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">monitoring</span>
              <span>System Monitor</span>
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-sm text-xs font-mono font-bold tracking-normal transition-colors cursor-pointer ${
                activeTab === "audit" ? "bg-[#1f2937] text-white border-l-2 border-[#3b82f6]" : "text-[#9ca3af] hover:text-white hover:bg-[#111827]/60"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">fingerprint</span>
              <span>Security Audits</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-sm text-xs font-mono font-bold tracking-normal transition-colors cursor-pointer ${
                activeTab === "settings" ? "bg-[#1f2937] text-white border-l-2 border-[#3b82f6]" : "text-[#9ca3af] hover:text-white hover:bg-[#111827]/60"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">settings</span>
              <span>System Settings</span>
            </button>
          </nav>
        </div>

        {/* Lower segment support */}
        <div className="p-3 border-t border-[#1f2937] space-y-2.5 bg-[#111827]/40">
          <div className="bg-[#0b0e14] border border-[#1f2937] rounded-sm p-2 text-[10px] font-mono space-y-1">
            <span className="text-white font-bold block">Pipeline Node #04</span>
            <p className="text-[#6b7280] leading-tight">Ensemble voting weights and heuristics active.</p>
          </div>

          <button
            onClick={handleLogOut}
            className="w-full py-1 px-2.5 hover:bg-slate-800 text-[#4b5563] hover:text-red-400 text-xs rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer font-mono font-bold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>RESET CACHE</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER FOR SM SCREEN */}
      <div className="flex md:hidden flex-col w-full min-h-screen">
        <header className="bg-[#111827] border-b border-[#1f2937] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#3b82f6] rounded-sm flex items-center justify-center">
              <div className="w-2.5 h-2.5 border border-white transform rotate-45"></div>
            </div>
            <h1 className="text-xs font-bold text-white uppercase tracking-wider">PhishGuard</h1>
          </div>
          
          <select 
            value={activeTab} 
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="bg-[#0b0e14] border border-[#1f2937] text-xs text-white rounded p-1 font-mono focus:outline-none"
          >
            <option value="dashboard">Dashboard</option>
            <option value="history">Audit Database</option>
            <option value="insights">AI Insights</option>
            <option value="monitor">System Monitor</option>
            <option value="audit">Security Audits</option>
            <option value="settings">Settings</option>
          </select>
        </header>

        {/* Render space mobile */}
        <main className="flex-grow p-3 bg-[#0b0e14]">
          {isLoading ? (
            <div className="py-24 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-accent mx-auto" />
              <p className="text-xs font-mono">Initializing SecOps telemetry db...</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {activeTab === "dashboard" && (
                <Dashboard 
                  history={history} 
                  onAnalyze={handleAnalyzeUrl} 
                  onSelectScan={handleSelectScan} 
                />
              )}
              {activeTab === "history" && (
                <History 
                  history={history} 
                  onSelectScan={handleSelectScan} 
                  onClearHistory={clearHistoryRecords}
                />
              )}
              {activeTab === "insights" && (
                <AiInsights 
                  selectedScanId={selectedScanId} 
                  history={history} 
                  onBackToDashboard={() => setActiveTab("dashboard")} 
                />
              )}
              {activeTab === "monitor" && <SystemMonitor />}
              {activeTab === "audit" && <AuditLog />}
              {activeTab === "settings" && <Settings />}
            </div>
          )}
        </main>
      </div>

      {/* DESKTOP CONTENT RENDER AREA */}
      <div className="flex-grow flex flex-col min-h-screen overflow-y-auto hidden md:flex">
        
        {/* Top telemetry status lines based exact on high-density header of specification */}
        <header className="flex items-center justify-between px-4 h-12 border-b border-[#1f2937] bg-[#111827] select-none shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold tracking-wider text-white uppercase flex items-center gap-2">
              PhishGuard <span className="text-[#6b7280] font-normal font-mono text-xs">v1.0.42</span>
            </h1>
            <div className="ml-2 px-2 py-0.5 rounded bg-[#064e3b] text-[#34d399] text-[10px] font-mono uppercase font-bold tracking-wider">System Online</div>
            <span className="text-[#1f2937] ml-2">|</span>
            <span className="text-[10px] text-[#4b5563] font-mono">NODE_ID: PG-US-PROD-01</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-mono">
            <div className="flex flex-col items-end">
              <span className="text-[#6b7280] text-[9px] uppercase tracking-wider">API LATENCY</span>
              <span className="text-[#3b82f6] font-bold">124ms</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[#6b7280] text-[9px] uppercase tracking-wider">AWS REGION</span>
              <span className="text-white font-semibold">us-east-1</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1f2937] border border-[#374151] flex items-center justify-center">
              <span className="text-[10px] text-white font-bold">JD</span>
            </div>
          </div>
        </header>

        {/* Primary Page Canvas padding */}
        <main className="flex-grow p-4 bg-[#0b0e14]">
          {isLoading ? (
            <div className="py-24 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-accent mx-auto" />
              <p className="text-xs font-mono">Initializing SecOps telemetry db...</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto animate-fadeIn gap-3">
              {activeTab === "dashboard" && (
                <Dashboard 
                  history={history} 
                  onAnalyze={handleAnalyzeUrl} 
                  onSelectScan={handleSelectScan} 
                />
              )}
              {activeTab === "history" && (
                <History 
                  history={history} 
                  onSelectScan={handleSelectScan} 
                  onClearHistory={clearHistoryRecords}
                />
              )}
              {activeTab === "insights" && (
                <AiInsights 
                  selectedScanId={selectedScanId} 
                  history={history} 
                  onBackToDashboard={() => setActiveTab("dashboard")} 
                />
              )}
              {activeTab === "monitor" && <SystemMonitor />}
              {activeTab === "audit" && <AuditLog />}
              {activeTab === "settings" && <Settings />}
            </div>
          )}
        </main>
        
        {/* Flat footer for High Density look */}
        <footer className="h-8 border-t border-[#1f2937] bg-[#111827] flex items-center px-4 justify-between text-[10px] font-mono text-[#4b5563] shrink-0">
          <div className="flex gap-4">
            <span>CONTAINERS: 5 ACTIVE</span>
            <span>UPTIME: 342:12:04</span>
            <span>HOST: pg-ops-cluster-v24</span>
          </div>
          <div className="text-[#6b7280]">
            © 2024 PHISHGUARD SECURE PIPELINE
          </div>
        </footer>
        
      </div>

    </div>
  );
}

// Custom simple icons used as placeholders
function ArrowsRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      width="1em" 
      height="1em" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      fill="none" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
