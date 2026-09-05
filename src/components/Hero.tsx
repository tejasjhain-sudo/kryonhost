import React, { useState, useEffect } from 'react';
import { Server, Cpu, HardDrive, Network, ShieldCheck, ArrowRight, Activity, Terminal, CheckCircle2 } from 'lucide-react';
import { KRYONHOST_CONFIG } from '../config/kryonhost.config';

interface HeroProps {
  onExploreVPS: () => void;
  onExploreGame: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreVPS, onExploreGame }) => {
  // Live Simulated Telemetry Metrics
  const [cpuUsage, setCpuUsage] = useState(14);
  const [ramUsage, setRamUsage] = useState(28);
  const [networkSpeed, setNetworkSpeed] = useState(842);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.min(65, Math.max(8, prev + (Math.floor(Math.random() * 9) - 4))));
      setRamUsage(prev => Math.min(75, Math.max(20, prev + (Math.floor(Math.random() * 5) - 2))));
      setNetworkSpeed(prev => Math.min(980, Math.max(720, prev + (Math.floor(Math.random() * 31) - 15))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-36 pb-20 bg-[#070A0F] text-slate-100 overflow-hidden font-sans border-b border-slate-800/80">
      
      {/* Subtle background tech grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#131B2A_1px,transparent_1px),linear-gradient(to_bottom,#131B2A_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-bold tracking-tight">Infrastructure Online</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-bold">Mumbai Node Active</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Powerful Infrastructure.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0096C7] via-[#00B4D8] to-blue-400">
                Built for What's Next.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed">
              Deploy high-performance VPS and game servers in minutes. Reliable infrastructure, NVMe storage, DDoS protection and transparent pricing.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreVPS}
                className="px-6 py-3 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-bold text-xs shadow-lg shadow-[#0096C7]/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Explore VPS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreGame}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Game Hosting</span>
              </button>
            </div>

            {/* Micro Feature Indicators */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-6 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>KVM Hardware Isolation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Direct NIXI Mumbai Peering</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero CPU Overcommit</span>
              </div>
            </div>

          </div>

          {/* Right Infrastructure Dashboard Visualization */}
          <div className="lg:col-span-5">
            <div className="bg-[#0B0F17] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl relative font-mono text-xs">
              
              {/* Telemetry Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[#0096C7]">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-200 text-xs">Node Telemetry • kh-bom-01</div>
                    <div className="text-[10px] text-slate-500">Tier IV Datacenter, Mumbai</div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  HEALTHY
                </span>
              </div>

              {/* Resource Usage Gauges */}
              <div className="space-y-3.5 pt-4">
                
                {/* CPU Gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-[#0096C7]" />
                      <span>Compute (vCPU Cores)</span>
                    </span>
                    <span className="text-slate-200 font-bold">{cpuUsage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full bg-[#0096C7] transition-all duration-700"
                      style={{ width: `${cpuUsage}%` }}
                    />
                  </div>
                </div>

                {/* RAM Gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-purple-400" />
                      <span>Memory Pool (DDR4/DDR5)</span>
                    </span>
                    <span className="text-slate-200 font-bold">{ramUsage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all duration-700"
                      style={{ width: `${ramUsage}%` }}
                    />
                  </div>
                </div>

                {/* NVMe Storage */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <HardDrive className="w-3 h-3 text-blue-400" />
                      <span>Storage (PCIe NVMe Array)</span>
                    </span>
                    <span className="text-slate-200 font-bold">19% (RAID 10)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div className="h-full bg-blue-500 w-[19%]" />
                  </div>
                </div>

              </div>

              {/* Status Breakdown Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-800 mt-4 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Uplink Speed</div>
                  <div className="font-bold text-slate-200 mt-0.5 flex items-center gap-1.5">
                    <Network className="w-3 h-3 text-[#0096C7]" />
                    <span>{networkSpeed} Mbps</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">DDoS Shield</div>
                  <div className="font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Always-On Scrubbing</span>
                  </div>
                </div>
              </div>

              {/* Live Provisioning State */}
              <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Deployment State:</span>
                <span className="text-[#0096C7] font-bold">Ready • Automated via API</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
