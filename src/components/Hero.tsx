import React, { useState, useEffect } from 'react';
import { Server, Cpu, HardDrive, Network, ShieldCheck, ArrowRight, Activity, Terminal, CheckCircle2, Copy, Check, Radio, Zap, Sparkles } from 'lucide-react';
import { KRYONHOST_CONFIG } from '../config/kryonhost.config';

interface HeroProps {
  onExploreVPS: () => void;
  onExploreGame: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreVPS, onExploreGame }) => {
  // Live Simulated Telemetry Metrics
  const [cpuUsage, setCpuUsage] = useState(18);
  const [ramUsage, setRamUsage] = useState(32);
  const [nvmeIops, setNvmeIops] = useState(148200);
  const [latencyMs, setLatencyMs] = useState(3.4);
  const [copiedSSH, setCopiedSSH] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.min(58, Math.max(12, prev + (Math.floor(Math.random() * 9) - 4))));
      setRamUsage(prev => Math.min(68, Math.max(26, prev + (Math.floor(Math.random() * 5) - 2))));
      setNvmeIops(prev => Math.min(185000, Math.max(130000, prev + (Math.floor(Math.random() * 4000) - 2000))));
      setLatencyMs(prev => Number((Math.min(4.2, Math.max(2.8, prev + (Math.random() * 0.4 - 0.2)))).toFixed(1)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleCopySSH = () => {
    navigator.clipboard.writeText('ssh root@103.186.20.48');
    setCopiedSSH(true);
    setTimeout(() => setCopiedSSH(false), 2000);
  };

  return (
    <section className="relative pt-36 pb-24 bg-gradient-to-b from-white via-slate-50 to-white text-slate-900 overflow-hidden font-sans border-b border-slate-200">
      
      {/* Background Decorative Ambient Radial Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#0096C7]/15 via-blue-100/40 to-purple-100/20 blur-3xl pointer-events-none rounded-full" />
      
      {/* Precision Technical Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Live Infrastructure Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-mono shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-900 font-black tracking-tight uppercase text-[11px]">Infrastructure Online</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#0096C7] font-bold text-[11px] flex items-center gap-1">
                <Radio className="w-3 h-3 text-[#0096C7] animate-pulse" />
                <span>Tier IV Mumbai ({latencyMs}ms)</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08]">
              Powerful Infrastructure.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0077B6] via-[#0096C7] to-blue-600">
                Built for What's Next.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
              Deploy high-performance KVM VPS and low-latency game servers in minutes. Powered by AMD Ryzen 7000, Intel 13th Gen, enterprise NVMe storage, and 1 Gbps unmetered connectivity.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreVPS}
                className="px-7 py-3.5 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-black text-xs sm:text-sm shadow-xl shadow-[#0096C7]/25 flex items-center gap-2.5 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Explore VPS Plans</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreGame}
                className="px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 font-bold text-xs sm:text-sm transition-all hover:-translate-y-0.5 shadow-sm cursor-pointer"
              >
                <span>Game Server Hosting</span>
              </button>
            </div>

            {/* Enterprise Trust Micro-Grid */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-xs font-mono text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">KVM Virtualization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">PCIe Gen5 NVMe</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">Direct NIXI Peering</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">Dedicated IPv4</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">Always-On DDoS</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">Automated Setup</span>
              </div>
            </div>

          </div>

          {/* Right Column: Ultra-Premium Hardware Console */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-slate-200/60 relative font-mono text-xs space-y-5">
              
              {/* Telemetry Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#E0F2FE] border border-[#0096C7]/30 text-[#0096C7] shadow-sm">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-xs">kh-node-bom01.kryonhost.com</div>
                    <div className="text-[10px] text-slate-500 font-sans">Tier IV Datacenter • Navi Mumbai, India</div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                  ONLINE
                </span>
              </div>

              {/* Hardware Spec Badges Strip */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold">COMPUTE ARCH</span>
                  <span className="font-black text-slate-900">Ryzen 7000 / EPYC</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold">MEMORY STANDARD</span>
                  <span className="font-black text-purple-700">DDR5 ECC RAM</span>
                </div>
              </div>

              {/* Live Resource Telemetry Gauges */}
              <div className="space-y-3.5 pt-1">
                
                {/* CPU Gauge */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-700 flex items-center gap-1.5 font-bold">
                      <Cpu className="w-3.5 h-3.5 text-[#0096C7]" />
                      <span>vCPU Hardware Load</span>
                    </span>
                    <span className="text-slate-900 font-black">{cpuUsage}% (Boost: 5.7 GHz)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-[#0096C7] to-blue-600 transition-all duration-700"
                      style={{ width: `${cpuUsage}%` }}
                    />
                  </div>
                </div>

                {/* RAM Gauge */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-700 flex items-center gap-1.5 font-bold">
                      <Activity className="w-3.5 h-3.5 text-purple-600" />
                      <span>DDR5 Memory Pool</span>
                    </span>
                    <span className="text-slate-900 font-black">{ramUsage}% Reserved</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-700"
                      style={{ width: `${ramUsage}%` }}
                    />
                  </div>
                </div>

                {/* NVMe IOPS */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-700 flex items-center gap-1.5 font-bold">
                      <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                      <span>NVMe PCIe Gen5 RAID-10</span>
                    </span>
                    <span className="text-slate-900 font-black">7,450 MB/s ({nvmeIops.toLocaleString()} IOPS)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 w-[24%]" />
                  </div>
                </div>

              </div>

              {/* SSH Terminal Connection Bar */}
              <div className="pt-2 border-t border-slate-100">
                <div className="p-3 rounded-xl bg-slate-900 text-slate-200 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2 text-xs truncate">
                    <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-400 font-bold font-mono">ssh root@103.186.20.48</span>
                  </div>
                  <button
                    onClick={handleCopySSH}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
                    title="Copy SSH command"
                  >
                    {copiedSSH ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Provisioning Engine Status */}
              <div className="p-3 rounded-xl bg-[#E0F2FE]/70 border border-[#0096C7]/20 flex items-center justify-between text-[11px]">
                <span className="text-slate-700 font-bold">Automated Provisioning:</span>
                <span className="text-[#0096C7] font-black">Ready • 60-Second Setup</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
