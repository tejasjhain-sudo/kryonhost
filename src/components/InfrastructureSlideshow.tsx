import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Server, Cpu, HardDrive, ShieldCheck, Flame, ArrowRight, Play, Pause, Layers, Globe, Radio, Sparkles } from 'lucide-react';

interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  stats: { label: string; value: string }[];
  icon: React.ReactNode;
}

export const InfrastructureSlideshow: React.FC<{ onOpenPreOrder?: () => void }> = ({ onOpenPreOrder }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides: Slide[] = [
    {
      id: 1,
      badge: '🇮🇳 INDIA - MUMBAI DATACENTER',
      title: 'Tier IV Mumbai Datacenter & NIXI Peering',
      subtitle: 'Sub-5ms Ultra-Low Latency Across India',
      description: 'Hosted in our Mumbai facility with direct peering via NIXI and ExtremeIX. Built on enterprise Tier IV infrastructure with 1 Gbps unmetered connectivity.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'Domestic Latency', value: '< 5ms' },
        { label: 'Uplink Capacity', value: '1 Gbps' },
        { label: 'SLA Uptime', value: '99.99%' },
      ],
      icon: <Globe className="w-8 h-8 text-[#0096C7]" />,
    },
    {
      id: 2,
      badge: '⚡ ENTERPRISE HARDWARE',
      title: 'Dual AMD EPYC 9004 & PCIe Gen5 NVMe Array',
      subtitle: '7,400 MB/s Disk Speeds & Dedicated Compute',
      description: 'Powered by latest-generation AMD EPYC processors and enterprise Samsung PCIe Gen5 NVMe SSDs in hardware RAID 10. Zero CPU throttling.',
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'CPU Clock', value: '3.7 GHz Boost' },
        { label: 'NVMe Read', value: '7,400 MB/s' },
        { label: 'Memory Standard', value: 'DDR5 ECC' },
      ],
      icon: <Cpu className="w-8 h-8 text-purple-600" />,
    },
    {
      id: 3,
      badge: '🎁 FOUNDING PERK BONUS',
      title: '+4 GB Permanent RAM Launch Bonus',
      subtitle: 'Exclusive Founding Customer RAM Boost',
      description: 'Pre-order any VPS plan during the founding period and receive +4 GB permanent RAM added to your instance for life at no additional cost.',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'Founding Bonus', value: '+4 GB RAM' },
        { label: 'Cost', value: '₹0 (Permanent)' },
        { label: 'Availability', value: '30 Slots' },
      ],
      icon: <Flame className="w-8 h-8 text-emerald-600" />,
    },
    {
      id: 4,
      badge: '🛡️ SECURITY & CHECKOUT',
      title: '100 Gbps+ DDoS Filtering & Cashfree Gateway',
      subtitle: 'Always-On L3/L4/L7 Mitigation & Instant Payments',
      description: 'Protected by automated hardware DDoS filtering against volume attacks. Pay seamlessly using UPI, GPay, PhonePe, Paytm, and credit cards.',
      image: 'https://images.unsplash.com/photo-1520869578617-557561d7b114?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'DDoS Capacity', value: '100 Gbps+' },
        { label: 'Checkout Provider', value: 'Cashfree' },
        { label: 'Payment Options', value: 'UPI / Cards' },
      ],
      icon: <ShieldCheck className="w-8 h-8 text-amber-600" />,
    },
    {
      id: 5,
      badge: '💻 VIRTUALIZATION & BACKUPS',
      title: 'Proxmox KVM Isolation & 7-Day Rolling Backups',
      subtitle: 'Dedicated Resources & 1-Click OS Templates',
      description: 'Full KVM hardware virtualization ensuring 100% reserved vCPU and RAM resources. Enjoy 7-day rolling backups and instant OS installs.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'Hypervisor', value: 'Proxmox VE' },
        { label: 'OS Templates', value: 'Linux & Docker' },
        { label: 'Backups', value: '7-Day Rolling' },
      ],
      icon: <Server className="w-8 h-8 text-blue-600" />,
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
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden font-sans border-b border-slate-200">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-[#0096C7] text-xs font-mono font-black uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 text-[#0096C7] animate-pulse" />
              <span>Interactive Infrastructure Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              KryonHost Datacenter Node Gallery
            </h2>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
              title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-amber-600" /> : <Play className="w-4 h-4 text-emerald-600" />}
            </button>

            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-[#0096C7] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="font-mono text-xs text-slate-600 font-bold px-2">
              {currentSlide + 1} / {slides.length}
            </span>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-[#0096C7] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Display Container with Datacenter Image */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden transition-all duration-500">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Datacenter Photo Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 group h-64 sm:h-80">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-white text-xs">
                  <span className="px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 font-bold">
                    {slide.badge}
                  </span>
                  <span className="font-bold text-[#38BDF8]">Live Node Photo</span>
                </div>
              </div>
            </div>

            {/* Slide Details Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {slide.title}
                </h3>
                <p className="text-sm font-mono font-extrabold text-[#0096C7]">
                  {slide.subtitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                {slide.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 font-mono text-center pt-2">
                {slide.stats.map((stat, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">{stat.label}</div>
                    <div className="text-xs sm:text-sm font-black text-[#0096C7]">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenPreOrder}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-mono font-black text-xs shadow-md shadow-[#0096C7]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Pre-Order Mumbai VPS Instance</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
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
                  currentSlide === idx ? 'w-8 bg-[#0096C7]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
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
