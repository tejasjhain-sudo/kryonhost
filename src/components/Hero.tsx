import React, { useState, useEffect } from 'react';
import { Cpu, ArrowRight, Activity, Terminal, CheckCircle2, Copy, Check, Radio, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreVPS: () => void;
  onExploreGame: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreVPS, onExploreGame }) => {
  const [activeConsoleTab, setActiveConsoleTab] = useState<'telemetry' | 'terminal' | 'network'>('telemetry');
  const [copiedSSH, setCopiedSSH] = useState(false);

  // 2-Second Smooth Rotating Highlights
  const rotatingHighlights = [
    "Zero Hidden Charges.",
    "No Setup Fees or Surcharges.",
    "Starting at Just ₹379/mo.",
    "Sub-5ms Domestic India Ping.",
    "Instant 60-Second Provisioning."
  ];

  const [highlightIndex, setHighlightIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setHighlightIndex((prev) => (prev + 1) % rotatingHighlights.length);
        setIsFading(false);
      }, 250); // 250ms smooth fadeout/fadein transition
    }, 2000); // Rotates every 2 seconds

    return () => clearInterval(interval);
  }, [rotatingHighlights.length]);

  const handleCopySSH = () => {
    navigator.clipboard.writeText('ssh root@YOUR_SERVER_IP');
    setCopiedSSH(true);
    setTimeout(() => setCopiedSSH(false), 2000);
  };

  return (
    <section className="relative pt-12 sm:pt-16 pb-16 bg-white text-slate-900 overflow-hidden font-sans border-b border-slate-200">
      
      {/* Background Animated Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#0096C7]/15 via-blue-100/30 to-purple-100/20 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-tech-grid opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Infrastructure Online Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 text-xs font-mono shadow-sm animate-pulse-glow">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-900 font-extrabold tracking-tight uppercase text-[11px]">Infrastructure Online</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#0096C7] font-bold text-[11px] flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-[#0096C7] animate-pulse" />
                <span>Tier IV Mumbai • Starting at ₹379/mo</span>
              </span>
            </div>

            {/* Dynamic Headline with Smooth 2-Second Rotating Text */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-slate-900 tracking-tight leading-[1.08]">
              High-Performance India VPS.<br />
              <span className="block min-h-[1.2em] relative overflow-hidden">
                <span
                  className={`inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#0077B6] via-[#0096C7] to-cyan-500 transition-all duration-300 transform ${
                    isFading ? 'opacity-0 -translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'
                  }`}
                >
                  {rotatingHighlights[highlightIndex]}
                </span>
              </span>
            </h1>

            {/* Supporting Copy (Structured Value Prop) */}
            <div className="space-y-2.5 text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#0096C7] shrink-0" />
                <span>KryonHost provides ultra-fast KVM cloud VPS with 100% billing transparency.</span>
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm font-sans text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Zero Hidden Charges</strong>: No setup fees, no surcharges, fixed monthly billing.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Enterprise Speed</strong>: Powered by AMD Ryzen 7000, DDR5 ECC RAM & Gen5 NVMe.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Low Latency Peering</strong>: 1 Gbps port with direct NIXI & ExtremeIX India routing.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Instant 60s Deploy</strong>: Full root SSH access, dedicated IPv4 & DDoS protection.</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onExploreVPS}
                className="px-6 py-3.5 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-heading font-bold text-xs shadow-lg shadow-[#0096C7]/25 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Deploy VPS from ₹379/mo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreGame}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-heading font-bold text-xs transition-all hover:scale-[1.02] shadow-sm cursor-pointer"
              >
                <span>Game Server Hosting</span>
              </button>
            </div>

            {/* Compact Technical Highlights */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap gap-3 text-xs font-mono text-slate-600">
              <div className="flex items-center gap-1.5 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800">No Setup Fees</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800">DDR5 ECC RAM</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800">7,400 MB/s NVMe</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800">Dedicated IPv4</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hardware Console Card */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-5 relative font-mono text-xs space-y-4">
              
              {/* Interactive Console Navigation Tabs */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px]">
                  <button
                    onClick={() => setActiveConsoleTab('telemetry')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      activeConsoleTab === 'telemetry' ? 'bg-white text-[#0096C7] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Telemetry
                  </button>
                  <button
                    onClick={() => setActiveConsoleTab('terminal')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      activeConsoleTab === 'terminal' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Console
                  </button>
                  <button
                    onClick={() => setActiveConsoleTab('network')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      activeConsoleTab === 'network' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    BGP Edge
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Tab 1: Hardware Specs (static, honest) */}
              {activeConsoleTab === 'telemetry' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  
                  {/* CPU Spec Row with Animated Waveform */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-700 font-bold flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-[#0096C7]" />
                        <span>AMD Ryzen 7000 Series (KVM)</span>
                      </span>
                      
                      {/* Animated Soundwave Bars */}
                      <div className="flex items-center gap-0.5 h-4">
                        <div className="w-0.5 bg-[#0096C7] rounded-full animate-wave-1" />
                        <div className="w-0.5 bg-[#0096C7] rounded-full animate-wave-2" />
                        <div className="w-0.5 bg-[#0096C7] rounded-full animate-wave-3" />
                        <div className="w-0.5 bg-[#0096C7] rounded-full animate-wave-4" />
                        <div className="w-0.5 bg-[#0096C7] rounded-full animate-wave-5" />
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans">Up to 5.7 GHz Boost · PCIe Gen5 · DDR5 ECC</div>
                  </div>

                  {/* RAM Spec */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-700 font-bold flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-purple-600" />
                        <span>DDR5 ECC Memory</span>
                      </span>
                      <span className="text-purple-700 font-black">Up to 64 GB</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans">Error-correcting · Low-latency · Full isolation</div>
                  </div>

                  {/* NVMe & Network Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-slate-500 text-[10px]">NVMe Storage</div>
                      <div className="font-black text-slate-900 mt-0.5">7,400 MB/s</div>
                      <div className="text-[10px] text-blue-600 font-bold">PCIe Gen5 NVMe</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-slate-500 text-[10px]">Network Port</div>
                      <div className="font-black text-slate-900 mt-0.5">1 Gbps</div>
                      <div className="text-[10px] text-emerald-600 font-bold">Full Duplex Uplink</div>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 2: Interactive Terminal Console */}
              {activeConsoleTab === 'terminal' && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-1 h-36 overflow-y-auto">
                    <div className="text-emerald-400">[   0.0012] KVM Hypervisor initialized cleanly.</div>
                    <div className="text-blue-400">[   0.1420] NVMe RAID-10: attached /dev/nvme0n1 (7400 MB/s).</div>
                    <div className="text-purple-400">[   0.3104] BGP Peering NIXI Mumbai: UP (AS133982).</div>
                    <div className="text-slate-400">[   0.8920] Inline DDoS Mitigation active on eth0.</div>
                    <div className="text-white font-bold pt-1">root@kh-bom-node:~# systemctl is-active vps-core</div>
                    <div className="text-emerald-400 font-bold">active (running)</div>
                  </div>
                </div>
              )}

              {/* Tab 3: BGP Edge Peering */}
              {activeConsoleTab === 'network' && (
                <div className="space-y-2.5 animate-in fade-in duration-200 text-[11px]">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Facility:</span>
                      <span className="font-bold text-slate-900">Tier IV Datacenter, Mumbai</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Transit:</span>
                      <span className="font-bold text-slate-900">NIXI + ExtremeIX Direct Peer</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Connectivity:</span>
                      <span className="font-black text-emerald-600">1 Gbps Uplink · DDoS Protected</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Copyable SSH Bar */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200 text-[11px]">
                <div className="flex items-center gap-1.5 truncate">
                  <Terminal className="w-3.5 h-3.5 text-[#0096C7] shrink-0" />
                  <span className="font-bold text-slate-800">ssh root@YOUR_SERVER_IP</span>
                </div>
                <button
                  onClick={handleCopySSH}
                  className="px-2 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10px] transition-colors flex items-center gap-1 cursor-pointer shadow-sm shrink-0"
                >
                  {copiedSSH ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSSH ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
