import React, { useState } from "react";
import { SecurityEvent } from "../types";
import { Terminal, ShieldAlert, CheckCircle, RefreshCw, Layers, ShieldCheck, Download, Trash, Search, SlidersHorizontal, Eye } from "lucide-react";

export function AuditLog() {
  const [severityFilter, setSeverityFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeEvent, setActiveEvent] = useState<SecurityEvent | null>(null);

  // Seeded OS-level firewall and daemon audit records
  const initialEvents: SecurityEvent[] = [
    {
      id: "EVT-8821",
      timestamp: "2026-05-25 19:35:01",
      actor: "firewalld",
      action: "BLOCK_PORTS_SCAN",
      severity: "WARNING",
      sourceIP: "142.250.190.46",
      details: "Anomalous ports probe identified on cloud host port 22/23. Rate limiter triggers rule firewalls permanently drop request packets."
    },
    {
      id: "EVT-8819",
      timestamp: "2026-05-25 19:32:01",
      actor: "phishguard-fastapi-app",
      action: "API_INFERENCE_TRIGGERED",
      severity: "INFO",
      sourceIP: "127.0.0.1",
      details: "Standard POST inbound threat query processed on url 'http://secure-login-update-paypal.com/auth'. Output verdict assigned: Threat (Conf: 98%)."
    },
    {
      id: "EVT-8791",
      timestamp: "2026-05-25 19:22:15",
      actor: "selinux",
      action: "AVC_DENIED_POST_WRITE",
      severity: "CRITICAL",
      sourceIP: "192.168.12.110",
      details: "SELinux security policy blocked attempt to write to /etc/nginx/nginx.conf from unauthorized container namespace. Context validation fail recorded by auditd kernel thread."
    },
    {
      id: "EVT-8750",
      timestamp: "2026-05-25 18:45:00",
      actor: "gitlab-runner-02",
      action: "STATIC_CODE_SCAN_PASS",
      severity: "INFO",
      sourceIP: "10.0.4.15",
      details: "Snyk static dependencies vulnerability checking completed. 0 vulnerability blocks triggered. Deployment pipeline cleared for code replication."
    },
    {
      id: "EVT-8622",
      timestamp: "2026-05-24 16:22:10",
      actor: "vault-manager",
      action: "SECRETS_ROTATION_SUCCESS",
      severity: "INFO",
      sourceIP: "127.0.0.1",
      details: "Automatic 24h cron execution rotate private sandbox API tokens and telemetry keys. System variables cached in isolated key stores successfully."
    },
    {
      id: "EVT-8511",
      timestamp: "2026-05-23 11:20:02",
      actor: "firewalld",
      action: "ANOMALOUS_HOST_QUARANTINE",
      severity: "CRITICAL",
      sourceIP: "185.190.140.12",
      details: "Subnet security daemon flags continuous 100+ fail credential sessions. IP block triggers quarantine; logs routed to Grafana-Cloud alarm boards."
    }
  ];

  const filteredEvents = initialEvents.filter((item) => {
    const matchesSearch = 
      item.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.actor.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.sourceIP.includes(searchQuery);

    if (severityFilter === "All") return matchesSearch;
    return matchesSearch && item.severity === severityFilter;
  });

  const getSeverityBadge = (level: "CRITICAL" | "WARNING" | "INFO") => {
    switch (level) {
      case "CRITICAL":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      case "WARNING":
        return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      case "INFO":
      default:
        return "bg-emerald-500/10 border-emerald-500/30 text-[#10b981]";
    }
  };

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(initialEvents, null, 2));
    const dlLink = document.createElement('a');
    dlLink.setAttribute("href", dataStr);
    dlLink.setAttribute("download", "phishguard-firewall-audit.json");
    document.body.appendChild(dlLink);
    dlLink.click();
    dlLink.remove();
  };

  return (
    <div className="space-y-3">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1f2937] pb-3 mb-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3b82f6]">fingerprint</span>
            OS & Security Audit Logs
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Browse SELinux denials, firewalld packet drop actions, kernel security logs, and container access traces.
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="px-3 py-1.5 bg-[#1f2937] border border-[#374151] hover:border-[#3b82f6] rounded-sm text-xs font-bold uppercase tracking-widest text-[#dae2fd] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#3b82f6]" />
          Export Audit Logs
        </button>
      </div>

      {/* Query filtration bar */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          
          <div className="md:col-span-2 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Query with Event Type, Actor, or IP Address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#0b0e14] border border-[#1f2937] rounded-sm text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3b82f6]"
            />
          </div>

          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-[#0b0e14] border border-[#1f2937] px-2 py-1.5 text-xs text-slate-300 rounded-sm focus:outline-none focus:border-[#3b82f6]"
            >
              <option value="All">All Alarms</option>
              <option value="CRITICAL">Critical Alarms (CRITICAL)</option>
              <option value="WARNING">Mitigation Alarms (WARNING)</option>
              <option value="INFO">Standard Logs (INFO)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Table block */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-sm overflow-hidden text-xs">
        <table className="w-full border-collapse text-left text-xs font-mono">
          <thead>
            <tr className="bg-[#0b0e14] border-b border-[#1f2937] text-[#6b7280] uppercase text-[10px] font-bold">
              <th className="p-2.5 px-3.5 w-20">Trace ID</th>
              <th className="p-2.5 px-3.5 w-36">Timestamp</th>
              <th className="p-2.5 px-3.5 font-bold font-sans">Security Action</th>
              <th className="p-2.5 px-3.5 text-center font-sans">Daemon Source</th>
              <th className="p-2.5 px-3.5 text-center w-24 font-sans">Severity</th>
              <th className="p-2.5 px-3.5 text-center w-36">Source IP</th>
              <th className="p-2.5 px-3.5 text-right font-sans w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f2937]/45 text-[#9ca3af]">
            {filteredEvents.map((evt) => (
              <tr key={evt.id} className="hover:bg-[#1f2937]/40 transition-colors">
                <td className="p-2.5 px-3.5 text-[#4b5563] font-bold">{evt.id}</td>
                <td className="p-2.5 px-3.5 text-slate-500 font-mono text-[11px]">{evt.timestamp}</td>
                <td className="p-2.5 px-3.5 text-[#d1d5db] font-bold">{evt.action}</td>
                <td className="p-2.5 px-3.5 text-center">
                  <span className="bg-[#0b0e14] border border-[#1f2937]/50 px-1.5 py-0.5 rounded-sm text-[10px] text-slate-400 font-mono font-semibold">
                    {evt.actor}
                  </span>
                </td>
                <td className="p-2.5 px-3.5 text-center">
                  <span className={`inline-block px-1.5 py-0.5 rounded-sm text-[9px] font-bold border uppercase tracking-wider ${getSeverityBadge(evt.severity)}`}>
                    {evt.severity}
                  </span>
                </td>
                <td className="p-2.5 px-3.5 text-center text-[#3b82f6] font-bold">{evt.sourceIP}</td>
                <td className="p-2.5 px-3.5 text-right">
                  <button
                    onClick={() => setActiveEvent(evt)}
                    className="p-1 px-1.5 bg-[#1f2937] border border-[#374151] hover:border-[#3b82f6] hover:text-white rounded-sm text-slate-400 cursor-pointer inline-flex items-center gap-1 font-bold text-[10px] uppercase transition-colors"
                    title="Audit Trace Details"
                  >
                    <Eye className="w-3 h-3 text-[#318bf2]" />
                    <span className="hidden sm:inline">Trace</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEvents.length === 0 && (
          <div className="py-12 text-center space-y-2 bg-[#0b0e14]/40">
            <SlidersHorizontal className="w-6 h-6 mx-auto text-slate-500" />
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">No security alarms match filtration</h3>
          </div>
        )}
      </div>

      {/* DETAILED DIALOG MODAL OPEN */}
      {activeEvent && (
        <div className="fixed inset-0 z-50 bg-[#0b0e14]/90 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-4 max-w-lg w-full relative space-y-3.5">
            
            <div className="flex items-center justify-between border-b border-[#1f2937] pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500 text-sm">security</span>
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Trace Details ID: {activeEvent.id}</h3>
              </div>
              <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold border ${getSeverityBadge(activeEvent.severity)}`}>
                {activeEvent.severity}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#0b0e14] p-3 rounded-none border border-[#1f2937] text-[11px]">
                <div>
                  <span className="text-[#6b7280] font-bold block">Daemon Target:</span>
                  <span className="text-white font-semibold">{activeEvent.actor}</span>
                </div>
                <div>
                  <span className="text-[#6b7280] font-bold block">Security Event:</span>
                  <span className="text-[#ff5555] font-bold">{activeEvent.action}</span>
                </div>
                <div>
                  <span className="text-[#6b7280] font-bold block">Originating IP:</span>
                  <span className="text-[#3b82f6] font-bold">{activeEvent.sourceIP}</span>
                </div>
                <div>
                  <span className="text-[#6b7280] font-bold block">Timestamp:</span>
                  <span className="text-[#e5e7eb] font-bold">{activeEvent.timestamp}</span>
                </div>
              </div>

              <div>
                <span className="text-[#6b7280] font-bold block uppercase tracking-wider font-sans text-[9px] mb-1">
                  Trace Log diagnostics message
                </span>
                <p className="bg-[#0b0e14] p-2 px-3 border border-[#1f2937] rounded-none text-[#d1d5db] leading-relaxed text-[11px]">
                  {activeEvent.details}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#1f2937]/50">
              <button
                onClick={() => setActiveEvent(null)}
                className="px-3 py-1.5 bg-[#1f2937] border border-[#374151] hover:border-[#3b82f6] text-white text-[10px] font-bold uppercase tracking-wider rounded-sm cursor-pointer transition-colors"
              >
                Close Audit Records
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
