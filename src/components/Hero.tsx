import React, { useState, useEffect } from 'react';
import { Shield, Cpu, HardDrive, Network, ArrowRight, ChevronRight, Zap, CheckCircle2, Server, Play, Square, RotateCw, Sparkles, Terminal, Sliders, Layers, Pause, PlayCircle, Star, BadgePercent, MapPin } from 'lucide-react';
import { KRYONHOST_CONFIG } from '../config/kryonhost.config';

interface HeroProps {
  onOpenPreOrder: (planId?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenPreOrder }) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [heroServerState, setHeroServerState] = useState<'Online' | 'Offline' | 'Restarting'>('Online');
  const [selectedOS, setSelectedOS] = useState('ubuntu');

  // Concise, Punchy Animated Taglines (2-Second Rotation)
  const taglines = [
    { main: "Powerful VPS.", highlight: "Built for What's Next." },
    { main: "India's Lowest Price.", highlight: "Unbeatable Performance." },
    { main: "No One Beats Our Price", highlight: "in Overall India." },
    { main: "Enterprise KVM VPS", highlight: "Starting at ₹199/mo." },
    { main: "Dedicated IPv4 & NVMe", highlight: "Included Free." },
  ];

  const [taglineIndex, setTaglineIndex] = useState(0);

  // 2-Second Animated Tagline Cycler
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [taglines.length]);

  // Configurator state
  const [customVCPU, setCustomVCPU] = useState(4);
  const [customRAM, setCustomRAM] = useState(8);
  const [customNVMe, setCustomNVMe] = useState(100);

  const slides = [
    { id: 'overview', title: 'Telemetry & Controls', icon: Server },
    { id: 'deployer', title: '1-Click OS Deployer', icon: Layers },
    { id: 'terminal', title: 'Live SSH Console', icon: Terminal },
    { id: 'configurator', title: 'Custom Builder', icon: Sliders },
  ];

  // Auto-rotating timer for right console card
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const handleHeroAction = (action: string) => {
    setIsAutoPlaying(false);
    if (action === 'Stop') setHeroServerState('Offline');
    else if (action === 'Start') setHeroServerState('Online');
    else if (action === 'Restart') {
      setHeroServerState('Restarting');
      setTimeout(() => setHeroServerState('Online'), 1500);
    }
  };

  const estimatedPriceUSD = Math.max(4.99, Number((customVCPU * 2.5 + customRAM * 1.5 + customNVMe * 0.08).toFixed(2)));
  const estimatedPriceINR = Math.round(estimatedPriceUSD * 80);

  const trustIndicators = [
    { name: 'Cheapest in India', detail: 'Starting ₹199/mo ($2.49)' },
    { name: 'Dedicated IPv4', detail: 'Clean Static IP Included' },
    { name: 'PCIe NVMe Speed', detail: 'High IOPS Storage' },
    { name: 'India - Mumbai', detail: 'Low Latency Node' },
  ];

  const osList = [
    { id: 'ubuntu', name: 'Ubuntu 24.04 LTS', category: 'Linux Server', desc: 'Popular distribution for web servers, Docker, and Python apps.' },
    { id: 'debian', name: 'Debian 12', category: 'Linux Server', desc: 'Ultra-stable, lightweight Linux OS preferred for high uptime.' },
    { id: 'almalinux', name: 'AlmaLinux 9', category: 'Enterprise Linux', desc: 'RHEL-compatible enterprise OS for corporate software stacks.' },
    { id: 'docker', name: 'Docker Engine Container', category: 'Container Node', desc: 'Pre-configured Docker & Portainer stack ready out-of-the-box.' },
  ];

  const terminalLogs = [
    '[   0.000000] Linux version 6.8.0-31-generic (buildd@kryon-host)',
    '[   0.042109] KVM Virtualization Hypervisor initialized cleanly.',
    '[   0.120931] NVMe RAID-10 Array: Attached 100 GB /dev/nvme0n1.',
    '[   0.459012] Network Interface eth0: 1000 Mbps full duplex link UP.',
    '[   0.891230] BGP Routing Table bound: India - Mumbai Datacenter Node.',
    '[   1.204918] DDoS Inline Filtering Shield: Active & Scrubbing.',
    'root@kryonhost-node01:~# systemctl status vps-instance',
    '● vps-instance.service - KryonHost Compute Instance (Mumbai)',
    '   Active: active (running) since Tue 2026-09-01 18:15:00 UTC',
  ];

  return (
    <section className="relative pt-36 pb-24 bg-[#F8FAFC] border-b border-slate-200 bg-tech-grid overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Smooth Animated Rotating Headline & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Value Highlight Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-semibold text-[#0096C7] shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0096C7] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0096C7]"></span>
              </span>
              <span className="font-extrabold tracking-wide uppercase">CHEAPEST VPS IN OVERALL INDIA</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-900 font-bold flex items-center gap-1">
                From ₹199/mo <Zap className="w-3.5 h-3.5 fill-[#0096C7] text-[#0096C7]" />
              </span>
            </div>

            {/* 2-Second Smooth Animated Cycling Headline */}
            <div className="min-h-[140px] sm:min-h-[160px] flex items-center py-2">
              <h1
                key={taglineIndex}
                className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] animate-tagline w-full"
              >
                {taglines[taglineIndex].main}{' '}
                <span className="text-gradient-cyan inline-block">
                  {taglines[taglineIndex].highlight}
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-600 font-semibold leading-relaxed max-w-xl">
              Unbeatable pricing across all of India. Get dedicated IPv4, PCIe NVMe storage, and KVM hardware isolation starting at just ₹199/mo ($2.49/mo).
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => onOpenPreOrder('performance')}
                className="px-8 py-4 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-extrabold text-base shadow-lg shadow-[#0096C7]/25 hover:shadow-xl hover:shadow-[#0096C7]/35 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <span>Pre-Order VPS Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#vps-plans"
                className="px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-base border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <span>View ₹199 Plans</span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </a>
            </div>

            <div className="pt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {trustIndicators.map((item) => (
                <div key={item.name} className="space-y-0.5">
                  <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0096C7] shrink-0" />
                    {item.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Auto-Rotating Interactive Product Console Slideshow */}
          <div className="lg:col-span-6" onMouseEnter={() => setIsAutoPlaying(false)} onMouseLeave={() => setIsAutoPlaying(true)}>
            <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 premium-card-shadow space-y-5 relative">
              {/* Slideshow Top Navigation Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold overflow-x-auto">
                  {slides.map((slide, idx) => {
                    const Icon = slide.icon;
                    const isActive = activeSlide === idx;
                    return (
                      <button
                        key={slide.id}
                        onClick={() => {
                          setIsAutoPlaying(false);
                          setActiveSlide(idx);
                        }}
                        className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                          isActive
                            ? 'bg-[#0096C7] text-white shadow-sm font-extrabold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{slide.title}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="p-1 rounded text-slate-400 hover:text-[#0096C7] transition-colors"
                    title={isAutoPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
                  >
                    {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                  </button>
                  <span className="px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0096C7] border border-[#0096C7]/30 text-[10px] font-mono font-bold uppercase">
                    SLIDE {activeSlide + 1}/4
                  </span>
                </div>
              </div>

              {/* Progress Bar for Auto-Rotation */}
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-[#0096C7] transition-all duration-300 ${isAutoPlaying ? 'animate-pulse' : ''}`}
                  style={{ width: `${((activeSlide + 1) / 4) * 100}%` }}
                />
              </div>

              {/* SLIDE 1: Telemetry & Controls */}
              {activeSlide === 0 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-slate-900 tracking-tight">KryonHost Performance VPS</span>
                        <span className="px-2 py-0.5 rounded bg-[#E0F2FE] text-[#0096C7] text-[10px] font-mono font-bold">
                          🇮🇳 India - Mumbai
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">
                        ubuntu-24.04-lts • 4 vCPU / 8 GB RAM / 100 GB NVMe
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono">
                      {heroServerState === 'Online' && (
                        <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Running
                        </span>
                      )}
                      {heroServerState === 'Offline' && (
                        <span className="text-rose-600 font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500" /> Stopped
                        </span>
                      )}
                      {heroServerState === 'Restarting' && (
                        <span className="text-amber-600 font-bold flex items-center gap-1.5">
                          <RotateCw className="w-3.5 h-3.5 animate-spin" /> Rebooting...
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex justify-between text-slate-600 font-bold">
                        <span>vCPU Load</span>
                        <span className="text-slate-900 font-mono">{heroServerState === 'Online' ? '12.4%' : '0.0%'}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-[#0096C7] rounded-full" style={{ width: heroServerState === 'Online' ? '12.4%' : '0%' }} />
                      </div>
                      <div className="text-[10px] text-slate-500">4 High-Frequency Cores</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex justify-between text-slate-600 font-bold">
                        <span>Memory (RAM)</span>
                        <span className="text-slate-900 font-mono">{heroServerState === 'Online' ? '2.8 / 12 GB' : '0 / 12 GB'}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-[#0096C7] rounded-full" style={{ width: heroServerState === 'Online' ? '23%' : '0%' }} />
                      </div>
                      <div className="text-[10px] text-[#0096C7] font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> +4 GB Permanent RAM
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex justify-between text-slate-600 font-bold">
                        <span>NVMe Storage</span>
                        <span className="text-slate-900 font-mono">18.2 / 100 GB</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-[#0096C7] rounded-full w-[18.2%]" />
                      </div>
                      <div className="text-[10px] text-slate-500">PCIe NVMe Speed</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex justify-between text-slate-600 font-bold">
                        <span>Network Uplink</span>
                        <span className="text-slate-900 font-mono">{heroServerState === 'Online' ? '4.2 Mb/s' : '0 Mb/s'}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: heroServerState === 'Online' ? '15%' : '0%' }} />
                      </div>
                      <div className="text-[10px] text-slate-500">1 Gbps Unmetered Port</div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleHeroAction('Start')}
                        disabled={heroServerState === 'Online'}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-extrabold flex items-center gap-1 disabled:opacity-40"
                      >
                        <Play className="w-3.5 h-3.5 fill-emerald-600" /> Start
                      </button>
                      <button
                        onClick={() => handleHeroAction('Stop')}
                        disabled={heroServerState === 'Offline'}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold flex items-center gap-1 disabled:opacity-40"
                      >
                        <Square className="w-3.5 h-3.5 fill-rose-600" /> Stop
                      </button>
                      <button
                        onClick={() => handleHeroAction('Restart')}
                        className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-extrabold flex items-center gap-1"
                      >
                        <RotateCw className="w-3.5 h-3.5" /> Reboot
                      </button>
                    </div>

                    <button
                      onClick={() => onOpenPreOrder('performance')}
                      className="px-4 py-2 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-extrabold text-xs shadow flex items-center gap-1 cursor-pointer"
                    >
                      <span>Pre-Order Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* SLIDE 2: 1-Click OS Deployer */}
              {activeSlide === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="text-xs text-slate-600 font-medium">
                    Select a clean operating system or container image for single-click automated provisioning:
                  </div>

                  <div className="space-y-2">
                    {osList.map((os) => (
                      <div
                        key={os.id}
                        onClick={() => {
                          setIsAutoPlaying(false);
                          setSelectedOS(os.id);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          selectedOS === os.id
                            ? 'bg-[#E0F2FE] border-[#0096C7] text-slate-900 shadow-sm'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs flex items-center gap-2">
                            {os.name}
                            <span className="text-[10px] font-mono text-slate-500 font-normal">({os.category})</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{os.desc}</div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedOS === os.id ? 'border-[#0096C7] bg-[#0096C7]' : 'border-slate-300'}`}>
                          {selectedOS === os.id && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-mono">Selected: {osList.find(o => o.id === selectedOS)?.name}</span>
                    <button
                      onClick={() => onOpenPreOrder('performance')}
                      className="px-5 py-2 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-extrabold text-xs shadow flex items-center gap-1.5"
                    >
                      <span>Deploy Image</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* SLIDE 3: Live SSH Terminal Stream */}
              {activeSlide === 2 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                      <Terminal className="w-4 h-4 text-[#0096C7]" />
                      <span>Console TTY / SSH Stream</span>
                    </div>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Stream
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-1 shadow-inner h-52 overflow-y-auto leading-relaxed border border-slate-800">
                    {terminalLogs.map((log, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-slate-500 select-none">&gt;</span>
                        <span className={log.includes('Active: active') ? 'text-emerald-400 font-bold' : log.includes('systemctl') ? 'text-[#38BDF8]' : 'text-slate-300'}>
                          {log}
                        </span>
                      </div>
                    ))}
                    <div className="pt-1 flex items-center gap-1 text-[#38BDF8] font-bold">
                      <span>root@kryonhost-node01:~#</span>
                      <span className="w-2 h-4 bg-[#38BDF8] animate-pulse inline-block ml-1" />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-mono">Out-of-band VNC Console Ready</span>
                    <button
                      onClick={() => onOpenPreOrder('performance')}
                      className="px-4 py-2 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-extrabold text-xs shadow flex items-center gap-1"
                    >
                      <span>Access Terminal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* SLIDE 4: Interactive Custom Resource Configurator */}
              {activeSlide === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="text-xs text-slate-600 font-medium">
                    Adjust resource sliders to build your custom VPS specification:
                  </div>

                  <div className="space-y-3.5">
                    {/* vCPU Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-700">vCPU Cores</span>
                        <span className="font-mono text-[#0096C7]">{customVCPU} Cores</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        step="1"
                        value={customVCPU}
                        onChange={(e) => {
                          setIsAutoPlaying(false);
                          setCustomVCPU(Number(e.target.value));
                        }}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0096C7]"
                      />
                    </div>

                    {/* RAM Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-700">Memory (RAM)</span>
                        <span className="font-mono text-[#0096C7]">{customRAM} GB (+4GB Bonus = {customRAM + 4} GB)</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="16"
                        step="2"
                        value={customRAM}
                        onChange={(e) => {
                          setIsAutoPlaying(false);
                          setCustomRAM(Number(e.target.value));
                        }}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0096C7]"
                      />
                    </div>

                    {/* NVMe Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-700">NVMe Storage</span>
                        <span className="font-mono text-[#0096C7]">{customNVMe} GB NVMe</span>
                      </div>
                      <input
                        type="range"
                        min="25"
                        max="200"
                        step="25"
                        value={customNVMe}
                        onChange={(e) => {
                          setIsAutoPlaying(false);
                          setCustomNVMe(Number(e.target.value));
                        }}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0096C7]"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-500 font-mono">Custom Build Estimate</div>
                      <div className="text-xs font-bold text-slate-900">
                        {customVCPU} vCPU / {customRAM + 4} GB RAM / {customNVMe} GB NVMe
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-mono font-black text-[#0096C7]">₹{estimatedPriceINR}/mo</div>
                      <div className="text-[10px] text-emerald-600 font-bold">+4GB Founding Bonus Active</div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end border-t border-slate-100">
                    <button
                      onClick={() => onOpenPreOrder('performance')}
                      className="px-6 py-2.5 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-extrabold text-xs shadow flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Pre-Order Custom Build</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
