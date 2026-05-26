import React, { useState } from "react";
import { AnalysisResult } from "../types";
import { Search, Download, RefreshCw, Eye, Trash2, SlidersHorizontal } from "lucide-react";

interface HistoryProps {
  history: AnalysisResult[];
  onSelectScan: (id: string) => void;
  onClearHistory?: () => void;
}

export function History({ history, onSelectScan, onClearHistory }: HistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVerdict, setFilterVerdict] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "confidence">("newest");

  // Filter application
  const filteredHistory = history.filter((item) => {
    const matchesSearch = 
      item.url.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterVerdict === "All") return matchesSearch;
    return matchesSearch && item.verdict === filterVerdict;
  });

  // Sort application
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    if (sortBy === "confidence") {
      return b.confidence - a.confidence;
    }
    return 0;
  });

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case "Threat":
        return "bg-red-500/10 border-red-500/20 text-red-400";
      case "Warning":
        return "bg-amber-500/10 border-amber-500/20 text-amber-400";
      case "Safe":
      default:
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    }
  };

  // Truncate function
  const truncateUrl = (url: string, limit = 55) => {
    if (url.length <= limit) return url;
    return url.substring(0, limit) + "...";
  };

  // Safe Export implementation using runtime Blobs
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `phishguard-threat-intelligence-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-3">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1f2937] pb-3 mb-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3b82f6]">database</span>
            Audit Database & Records
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Browse and query the history of URL inspections triggered in PhishGuard AI environment.
          </p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          {onClearHistory && (
            <button
              onClick={onClearHistory}
              className="px-3 py-1.5 bg-[#451a03]/20 border border-orange-950/40 hover:border-orange-500 text-orange-400 rounded-sm text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors"
            >
              Reset Records
            </button>
          )}

          <button
            onClick={handleExportJson}
            disabled={history.length === 0}
            className="px-3 py-1.5 bg-[#1f2937] border border-[#374151] hover:border-[#3b82f6] text-[#dae2fd] rounded-sm text-xs font-bold uppercase tracking-widest cursor-pointer flex items-center gap-1.5 transition-colors disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-[#3b82f6]" />
            Export Intel
          </button>
        </div>
      </div>

      {/* Filters and Search Tools */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
          
          {/* Keyword Query Box */}
          <div className="md:col-span-2 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Query with Target URL or Trace ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#0b0e14] border border-[#1f2937] rounded-sm text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3b82f6]"
            />
          </div>

          {/* Filtering Verdict */}
          <div className="relative">
            <select
              value={filterVerdict}
              onChange={(e) => setFilterVerdict(e.target.value)}
              className="w-full bg-[#0b0e14] border border-[#1f2937] px-2 py-1.5 text-xs text-slate-300 rounded-sm focus:outline-none focus:border-[#3b82f6]"
            >
              <option value="All">All Verdicts</option>
              <option value="Safe">Legit Verified (Safe)</option>
              <option value="Warning">Suspicious Threats (Warning)</option>
              <option value="Threat">Phishing Confirmed (Threat)</option>
            </select>
          </div>

          {/* Sorters */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#0b0e14] border border-[#1f2937] px-2 py-1.5 text-xs text-slate-300 rounded-sm focus:outline-none focus:border-[#3b82f6]"
            >
              <option value="newest">Order: Newest First</option>
              <option value="oldest">Order: Oldest First</option>
              <option value="confidence">Order: Risk confidence</option>
            </select>
          </div>

        </div>
      </div>

      {/* History log database results */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-sm overflow-hidden text-xs">
        {sortedHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs font-mono">
              <thead>
                <tr className="bg-[#0b0e14] border-b border-[#1f2937] text-[#6b7280] uppercase text-[10px] tracking-wider">
                  <th className="p-2.5 px-3 w-20">Trace ID</th>
                  <th className="p-2.5 px-3 font-bold font-sans">Inspected Target Resource</th>
                  <th className="p-2.5 px-3 w-32 text-center font-sans">Verdict</th>
                  <th className="p-2.5 px-3 w-20 text-center font-sans">Score</th>
                  <th className="p-2.5 px-3 font-sans w-36">Registry</th>
                  <th className="p-2.5 px-3 font-sans w-36 text-center">Timestamp</th>
                  <th className="p-2.5 px-3 text-right font-sans w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2937]/50 text-[#9ca3af]">
                {sortedHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#070d19]/40 transition-colors group">
                    <td className="p-2 px-3 text-[#4b5563] font-bold">
                      {item.id}
                    </td>
                    <td className="p-2 px-3 text-[#d1d5db] select-all font-mono break-all font-medium">
                      {item.url}
                    </td>
                    <td className="p-2 px-3 text-center">
                      <span className={`inline-block px-1.5 py-0.5 rounded-sm text-[10px] tracking-wider uppercase border font-semibold ${getVerdictBadge(item.verdict)}`}>
                        {item.verdict}
                      </span>
                    </td>
                    <td className="p-2 px-3 text-center font-bold text-white text-xs">
                      {item.confidence}%
                    </td>
                    <td className="p-2 px-3 text-slate-400 font-sans select-none text-[11px] truncate max-w-[125px]">
                      {item.lexicalInfo.registrar.split(',')[0]}
                    </td>
                    <td className="p-2 px-3 text-center text-slate-500 font-mono text-[10px]">
                      {item.timestamp}
                    </td>
                    <td className="p-2 px-3 text-right">
                      <button
                        onClick={() => onSelectScan(item.id)}
                        className="px-2.5 py-1 bg-[#1f2937] border border-[#374151] hover:border-[#3b82f6] rounded-sm text-[#e5e7eb] cursor-pointer inline-flex items-center gap-1 font-bold text-[10px] uppercase transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <SlidersHorizontal className="w-8 h-8 mx-auto text-slate-500" />
            <h3 className="text-sm font-semibold text-white">No database entries found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No inspections match your filter queries. Consider resetting your searches or inspecting a new resource in the Dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
