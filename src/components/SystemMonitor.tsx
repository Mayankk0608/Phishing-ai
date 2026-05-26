import React, { useState, useEffect } from "react";
import { 
  Cpu, HardDrive, Database, Activity, RefreshCw, 
  Settings2, Terminal, AlertCircle, Play, CheckCircle2, Server, HelpCircle, GitBranch
} from "lucide-react";

export function SystemMonitor() {
  const [cpuUsage, setCpuUsage] = useState(44);
  const [ramUsage, setRamUsage] = useState(62);
  const [latency, setLatency] = useState(240);
  const [requestRate, setRequestRate] = useState(482);
  const [livePoints, setLivePoints] = useState<number[]>([40, 42, 45, 48, 43, 40, 52, 58, 62, 55, 48, 52, 59, 61, 65]);

  // Minor fluctuations to simulate real-time stream telemetries
  useEffect(() => {
    const streamTimer = setInterval(() => {
      setCpuUsage(prev => {
        const delta = Math.floor(Math.random() * 8) - 4;
        return Math.max(10, Math.min(95, prev + delta));
      });
      setRamUsage(prev => {
        const delta = Math.floor(Math.random() * 4) - 2;
        return Math.max(50, Math.min(85, prev + delta));
      });
      setLatency(prev => {
        const delta = Math.floor(Math.random() * 30) - 15;
        return Math.max(180, Math.min(450, prev + delta));
      });
      setRequestRate(prev => {
        const delta = Math.floor(Math.random() * 20) - 10;
        return Math.max(300, Math.min(900, prev + delta));
      });
      setLivePoints(prev => {
        const nextVal = Math.floor(Math.random() * 40) + 30;
        const sliced = prev.slice(1);
        return [...sliced, nextVal];
      });
    }, 2500);

    return () => clearInterval(streamTimer);
  }, []);

  // Standard Docker Node clusters preseeded
  const dockerContainerList = [
    { name: "phishguard-fastapi-app", status: "Healthy", image: "fastapi:alpine-3.19", port: "8000/tcp", node: "us-east-1a", replica: "2/2" },
    { name: "phishguard-gemini-orchestrator", status: "Healthy", image: "node:18-slim", port: "3000/tcp", node: "us-east-1b", replica: "3/3" },
    { name: "phishguard-frontend-nginx", status: "Healthy", image: "nginx:stable-alpine", port: "443/tcp", node: "us-east-1a", replica: "2/2" },
    { name: "phishguard-postgres-db", status: "Healthy", image: "postgres:16-alpine", port: "5432/tcp", node: "us-east-1c", replica: "1/1" }
  ];

  // Pipeline flow mock database
  const pipelineSteps = [
    { name: "AWS VPC & Subnet Provisioning", tool: "Terraform Cloud", status: "PASSED", stamp: "2026-05-25 18:22:10" },
    { name: "VPC Transit Gateways Hardening", tool: "Security Groups", status: "PASSED", stamp: "2026-05-25 18:23:02" },
    { name: "Host VM Configuration Rules", tool: "Ansible Playbook", status: "PASSED", stamp: "2026-05-25 18:24:45" },
    { name: "SELinux Policy Compilation", tool: "Auditd Configuration", status: "PASSED", stamp: "2026-05-25 18:25:01" },
    { name: "GitLab CI Static Pipeline Check", tool: "Snyk / SonarQube", status: "PASSED", stamp: "2026-05-25 18:26:30" }
  ];

  // Map helper to trace SVG graph paths elegantly
  const maxVal = 100;
  const graphWidth = 500;
  const graphHeight = 120;
  const pathData = livePoints
    .map((p, idx) => {
      const x = (idx / (livePoints.length - 1)) * graphWidth;
      const y = graphHeight - (p / maxVal) * graphHeight;
      return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const fillData = `${pathData} L ${graphWidth} ${graphHeight} L 0 ${graphHeight} Z`;

  return (
    <div className="space-y-3">
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1f2937] pb-3 mb-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3b82f6]">monitoring</span>
            DevSecOps Infrastructure Monitor
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Real-time status of PhishGuard AI sandboxes, hardening automation, AWS virtualization logs, and Docker container replication fleets.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#111827] border border-[#1f2937] px-3 py-1.5 rounded-sm text-xs font-mono">
          <Server className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] text-[#9ca3af]">Uptime: <strong className="text-white">16d 4h 12m</strong></span>
        </div>
      </div>

      {/* Primary hardware metrics horizontal widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-[#6b7280] text-[10px] font-bold font-mono uppercase tracking-wider">
            <span>CPU Cluster Load</span>
            <Cpu className="w-3.5 h-3.5 text-[#3b82f6]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-mono">{cpuUsage}%</span>
            <span className="text-[9px] text-emerald-400 font-mono tracking-widest font-bold">NORMAL</span>
          </div>
          <div className="w-full bg-[#0b0e14] h-1.5 rounded-none overflow-hidden border border-[#1f2937]/45">
            <div className="bg-[#3b82f6] h-full transition-all duration-1000" style={{ width: `${cpuUsage}%` }}></div>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-[#6b7280] text-[10px] font-bold font-mono uppercase tracking-wider">
            <span>RAM Allocation</span>
            <HardDrive className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-mono">{ramUsage}%</span>
            <span className="text-[9px] text-[#9ca3af] font-mono">62.4 GB ACTIVE</span>
          </div>
          <div className="w-full bg-[#0b0e14] h-1.5 rounded-none overflow-hidden border border-[#1f2937]/45">
            <div className="bg-purple-500 h-full transition-all duration-1000" style={{ width: `${ramUsage}%` }}></div>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-[#6b7280] text-[10px] font-bold font-mono uppercase tracking-wider">
            <span>Model Latency</span>
            <Activity className="w-3.5 h-3.5 text-[#f59e0b]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-mono">{latency}ms</span>
            <span className="text-[9px] text-orange-400 font-mono tracking-widest font-bold">CONSENSUS</span>
          </div>
          <div className="w-full bg-[#0b0e14] h-1.5 rounded-none overflow-hidden border border-[#1f2937]/45">
            <div className="bg-[#f59e0b] h-full transition-all duration-1000" style={{ width: `${(latency/500)*100}%` }}></div>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-[#6b7280] text-[10px] font-bold font-mono uppercase tracking-wider">
            <span>Request Ingress</span>
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-mono">{requestRate}/M</span>
            <span className="text-[9px] text-emerald-400 font-mono tracking-widest font-bold">STABLE</span>
          </div>
          <div className="w-full bg-[#0b0e14] h-1.5 rounded-none overflow-hidden border border-[#1f2937]/45">
            <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(requestRate/1000)*100}%` }}></div>
          </div>
        </div>

      </div>

      {/* Grid: Graph and Docker nodes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        
        {/* Left column: SVG Telemetry chart */}
        <div className="lg:col-span-2 bg-[#111827] border border-[#1f2937] rounded-sm p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#1f2937] pb-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#9ca3af] text-sm">show_chart</span>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Consensus Inference Queries Rate (Live)</h2>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-sm font-bold uppercase">
              Live Feed
            </span>
          </div>

          <div className="pt-2 h-36 flex items-end relative bg-[#0b0e14] border border-[#1f2937]/65 p-1 rounded-sm">
            <svg viewBox="0 0 500 120" className="w-full h-full overflow-visible">
              {/* Horizontal rule grids */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#1f2937" strokeWidth="0.5"/>
              
              {/* Path area fill vector */}
              <path d={fillData} fill="url(#gradient-flow)" className="transition-all duration-1000" />
              
              {/* Line path vector */}
              <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" className="transition-all duration-1000" />
              
              {/* Linear Gradient declaration */}
              <defs>
                <linearGradient id="gradient-flow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute top-1 right-2 text-[8px] text-[#4b5563] font-mono uppercase font-bold">Y: Queries count / X: Timeline</div>
          </div>

          <div className="flex justify-between text-[9px] text-[#4b5563] font-bold font-mono pt-1">
            <span>-30 SECONDS</span>
            <span>-15 SECONDS</span>
            <span>T-0 NOW</span>
          </div>
        </div>

        {/* Right column: Ansible Automation configuration steps pipeline */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#1f2937] pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-purple-400" />
              GitLab CI/CD Automation
            </h2>
            <span className="text-[9px] font-mono bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded-sm font-bold">
              VERIFIED
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-[11px] bg-[#0b0e14] p-2.5 border border-[#1f2937]/50 rounded-sm">
            {pipelineSteps.map((step) => (
              <div key={step.name} className="flex font-mono items-center gap-2 justify-between py-1 border-b border-[#1f2937]/40 last:border-none">
                <div className="space-y-0.5 max-w-[190px]">
                  <h4 className="text-[#d1d5db] truncate font-bold text-[10px] uppercase">{step.name}</h4>
                  <span className="text-[#4b5563] text-[8px] block uppercase font-bold">Engine: {step.tool}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-emerald-400 text-[9px] font-bold block">✓ PASS</span>
                  <span className="text-[#4b5563] text-[8px] block font-mono">{step.stamp.split(' ')[1]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Fleet of active sandboxed docker nodes */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-4">
        <h2 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5 border-b border-[#1f2937] pb-3 mb-3">
          <span className="material-symbols-outlined text-sm text-[#3b82f6]">grid_view</span>
          Sandbox Container Replication Clusters
        </h2>

        <div className="overflow-x-auto bg-[#0b0e14] border border-[#1f2937]/55 p-1 rounded-sm">
          <table className="w-full border-collapse text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1f2937] text-[#6b7280] uppercase text-[10px] font-bold">
                <th className="pb-2.5 pt-1 px-2">Node Container Name</th>
                <th className="pb-2.5 pt-1 text-center">Active Replicas</th>
                <th className="pb-2.5 pt-1 text-center font-sans">Deployment Tag</th>
                <th className="pb-2.5 pt-1 text-center font-sans">Target Port</th>
                <th className="pb-2.5 pt-1 text-right font-sans px-2">AWS AZ Zone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]/40 text-[#9ca3af]">
              {dockerContainerList.map((container) => (
                <tr key={container.name} className="hover:bg-[#111827]/45 transition-colors">
                  <td className="py-2 px-2 text-white font-bold flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    {container.name}
                  </td>
                  <td className="py-2 text-center text-emerald-400 font-bold">
                    {container.replica}
                  </td>
                  <td className="py-2 text-center text-slate-500 text-[11px]">
                    {container.image}
                  </td>
                  <td className="py-2 text-center text-[#3b82f6] font-bold">
                    {container.port}
                  </td>
                  <td className="py-2 text-right text-slate-500 px-2 uppercase font-bold text-[10px]">
                    {container.node}
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
