import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Server, Cpu, HardDrive, ShieldCheck, Flame, ArrowRight, Play, Pause, Layers, Globe, Radio, Sparkles } from 'lucide-react';

interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  stats: { label: string; value: string }[];
  accentColor: string;
  icon: React.ReactNode;
}

export const InfrastructureSlideshow: React.FC<{ onOpenPreOrder?: () => void }> = ({ onOpenPreOrder }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides: Slide[] = [
    {
      id: 1,
      badge: '🇮🇳 INDIA - MUMBAI NODE',
      title: 'Tier IV Datacenter & NIXI Domestic Peering',
      subtitle: 'Sub-5ms Ultra-Low Latency Across India',
      description: 'Hosted in Mumbai, India with direct peering via NIXI and ExtremeIX. Built on carrier-neutral Tier IV infrastructure with redundant power and 1 Gbps unmetered connectivity.',
      stats: [
        { label: 'Domestic Latency', value: '< 5ms' },
        { label: 'Uplink Capacity', value: '1 Gbps' },
        { label: 'SLA Uptime', value: '99.99%' },
      ],
      accentColor: 'from-blue-600 via-[#0096C7] to-cyan-500',
      icon: <Globe className="w-10 h-10 text-[#38BDF8]" />,
    },
    {
      id: 2,
      badge: '⚡ ENTERPRISE HARDWARE',
      title: 'Dual AMD EPYC 9004 & PCIe Gen5 NVMe Array',
      subtitle: 'Unthrottled Compute & 7,400 MB/s Disk Speeds',
      description: 'Powered by latest-generation AMD EPYC processors and enterprise Samsung PCIe Gen5 NVMe SSDs in hardware RAID 10. Zero noisy neighbors, zero CPU throttling.',
      stats: [
        { label: 'CPU Clock', value: '3.7 GHz Boost' },
        { label: 'NVMe Read', value: '7,400 MB/s' },
        { label: 'Memory Standard', value: 'DDR5 ECC' },
      ],
      accentColor: 'from-indigo-600 via-purple-600 to-pink-600',
      icon: <Cpu className="w-10 h-10 text-purple-400" />,
    },
    {
      id: 3,
      badge: '🎁 FOUNDING PERK BONUS',
      title: '+4 GB Permanent RAM Launch Bonus',
      subtitle: 'Exclusive Founding Customer RAM Allocation',
      description: 'Pre-order any VPS plan during the founding period and receive +4 GB permanent RAM added to your instance for life at no additional cost.',
      stats: [
        { label: 'Founding Bonus', value: '+4 GB RAM' },
        { label: 'Cost', value: '₹0 (Permanent)' },
        { label: 'Availability', value: 'Limited 30 Slots' },
      ],
      accentColor: 'from-emerald-600 via-teal-600 to-cyan-600',
      icon: <Flame className="w-10 h-10 text-emerald-400" />,
    },
    {
      id: 4,
      badge: '🛡️ SECURITY & CHECKOUT',
      title: 'DDoS Protection & Cashfree Gateway Integration',
      subtitle: 'Always-On L3/L4/L7 Mitigation & Instant Payments',
      description: 'Protected by automated hardware DDoS filtering against volume attacks up to 100 Gbps. Pay seamlessly using UPI, GPay, PhonePe, Paytm, and credit cards.',
      stats: [
        { label: 'DDoS Capacity', value: '100 Gbps+' },
        { label: 'Checkout Provider', value: 'Cashfree Gateway' },
        { label: 'Payment Options', value: 'UPI / Cards / NetBank' },
      ],
      accentColor: 'from-amber-600 via-orange-600 to-red-600',
      icon: <ShieldCheck className="w-10 h-10 text-amber-400" />,
    },
    {
      id: 5,
      badge: '💻 ENTERPRISE VIRTUALIZATION',
      title: 'Proxmox VE KVM Isolation & Rolling Backups',
      subtitle: 'Dedicated Resources & 1-Click OS Templates',
      description: 'Full KVM hardware virtualization ensuring 100% reserved vCPU and RAM resources. Enjoy 7-day rolling backups and instant Ubuntu, Debian, or AlmaLinux OS installs.',
      stats: [
        { label: 'Hypervisor', value: 'Proxmox VE KVM' },
        { label: 'OS Templates', value: 'Linux & Docker' },
        { label: 'Backups', value: '7-Day Rolling' },
      ],
      accentColor: 'from-[#0096C7] via-blue-700 to-slate-900',
      icon: <Server className="w-10 h-10 text-[#38BDF8]" />,
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <section className="py-16 sm:py-24 bg-[#050811] relative overflow-hidden font-sans border-b border-slate-800">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0096C7]/15 border border-[#0096C7]/30 text-[#38BDF8] text-xs font-mono font-black uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Interactive Infrastructure Presentation</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              KryonHost Cloud Node Showcase
            </h2>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-[#0096C7] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="font-mono text-xs text-slate-400 font-bold px-2">
              {currentSlide + 1} / {slides.length}
            </span>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-[#0096C7] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Display Container */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0A1020] to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden transition-all duration-500">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Slide Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[#38BDF8] text-xs font-mono font-black tracking-wider uppercase">
                {slide.badge}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  {slide.title}
                </h3>
                <p className="text-sm font-mono font-extrabold text-[#38BDF8]">
                  {slide.subtitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-xl">
                {slide.description}
              </p>

              <div className="pt-2">
                <button
                  onClick={onOpenPreOrder}
                  className="px-6 py-3 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-mono font-black text-xs shadow-lg shadow-[#0096C7]/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Pre-Order India - Mumbai VPS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide Stats Grid */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
                <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    {slide.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Slide Feature</span>
                    <h4 className="text-base font-black text-white font-mono">{slide.title.split('&')[0]}</h4>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 font-mono text-center">
                  {slide.stats.map((stat, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{stat.label}</div>
                      <div className="text-sm font-black text-[#38BDF8]">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-2 pt-8">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'w-8 bg-[#0096C7]' : 'w-2.5 bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
