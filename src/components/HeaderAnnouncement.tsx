import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X, ShieldCheck, Zap, Server, Network } from 'lucide-react';

interface AnnouncementSlide {
  id: number;
  tag: string;
  tagBg: string;
  icon: React.ReactNode;
  text: string;
  buttonText: string;
}

interface HeaderAnnouncementProps {
  onExplore: () => void;
}

export const HeaderAnnouncement: React.FC<HeaderAnnouncementProps> = ({ onExplore }) => {
  const [visible, setVisible] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: AnnouncementSlide[] = [
    {
      id: 1,
      tag: 'MUMBAI NODE LIVE',
      tagBg: 'bg-emerald-500 text-slate-950 font-bold',
      icon: <Server className="w-3 h-3 text-slate-950" />,
      text: 'Tier IV Mumbai Datacenter Active: Deploy KVM VPS & Game Servers with automated provisioning.',
      buttonText: 'Deploy VPS',
    },
    {
      id: 2,
      tag: '15% QUARTERLY SAVINGS',
      tagBg: 'bg-[#0096C7] text-white font-bold',
      icon: <Zap className="w-3 h-3 text-yellow-300" />,
      text: 'Save 15% instantly on all Budget, Standard, Performance, and Power VPS plans with quarterly billing.',
      buttonText: 'View Plans',
    },
    {
      id: 3,
      tag: 'LOW LATENCY BGP',
      tagBg: 'bg-purple-500 text-white font-bold',
      icon: <Network className="w-3 h-3 text-white" />,
      text: 'Direct NIXI & ExtremeIX peering for sub-5ms low latency across India.',
      buttonText: 'Check Ping',
    },
    {
      id: 4,
      tag: 'DDoS MITIGATION',
      tagBg: 'bg-amber-400 text-slate-950 font-bold',
      icon: <ShieldCheck className="w-3 h-3 text-slate-950" />,
      text: 'Always-on inline hardware DDoS protection included with all compute instances at zero extra cost.',
      buttonText: 'Learn More',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!visible) return null;

  const slide = slides[currentSlide];

  return (
    <div className="w-full bg-[#05070A] text-slate-200 text-xs font-mono py-2 px-4 border-b border-slate-800 relative z-40 transition-all overflow-hidden">
      
      {/* Slide Progress Bar Indicator */}
      <div
        key={currentSlide}
        className="absolute top-0 left-0 h-0.5 bg-[#0096C7] transition-all duration-[4500ms] ease-linear"
        style={{ width: '100%' }}
      />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Ticker Content */}
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0 ${slide.tagBg}`}>
            {slide.icon}
            <span>{slide.tag}</span>
          </span>

          <span className="font-semibold text-slate-200 text-xs truncate transition-all duration-300">
            {slide.text}
          </span>
        </div>

        {/* Controls & CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onExplore}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-[#0096C7] text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{slide.buttonText}</span>
            <ArrowRight className="w-3 h-3 text-[#0096C7]" />
          </button>

          <button
            onClick={() => setVisible(false)}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
