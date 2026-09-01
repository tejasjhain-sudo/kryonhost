import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X, Flame, ChevronLeft, ChevronRight, ShieldCheck, Zap, CreditCard } from 'lucide-react';

interface AnnouncementSlide {
  id: number;
  tag: string;
  tagBg: string;
  icon: React.ReactNode;
  text: string;
  buttonText: string;
}

interface HeaderAnnouncementProps {
  onOpenPreOrder: () => void;
}

export const HeaderAnnouncement: React.FC<HeaderAnnouncementProps> = ({ onOpenPreOrder }) => {
  const [visible, setVisible] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: AnnouncementSlide[] = [
    {
      id: 1,
      tag: 'FOUNDING OFFER',
      tagBg: 'bg-amber-400 text-slate-950',
      icon: <Flame className="w-3 h-3 text-red-600 animate-bounce" />,
      text: '🇮🇳 India - Mumbai Datacenter Launch: Get up to 30% OFF + Free +4 GB Permanent RAM Bonus!',
      buttonText: 'Pre-Order Now',
    },
    {
      id: 2,
      tag: 'EPYC HARDWARE',
      tagBg: 'bg-purple-500 text-white',
      icon: <Zap className="w-3 h-3 text-yellow-300" />,
      text: 'Dual AMD EPYC 9004 Compute Nodes & PCIe Gen5 NVMe (7,400 MB/s Read Speeds)!',
      buttonText: 'Explore Specs',
    },
    {
      id: 3,
      tag: 'RISK-FREE GUARANTEE',
      tagBg: 'bg-emerald-500 text-white',
      icon: <ShieldCheck className="w-3 h-3 text-white" />,
      text: 'Pre-orders are 100% fully refundable anytime prior to physical node provisioning!',
      buttonText: 'Claim Slot',
    },
    {
      id: 4,
      tag: 'CASHFREE GATEWAY',
      tagBg: 'bg-cyan-500 text-slate-950',
      icon: <CreditCard className="w-3 h-3 text-slate-950" />,
      text: 'Instant 1-Click Payments via UPI, GPay, PhonePe, Paytm, and All Credit Cards!',
      buttonText: 'Checkout Now',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!visible) return null;

  const slide = slides[currentSlide];

  return (
    <div className="w-full bg-gradient-to-r from-[#0096C7] via-blue-600 to-indigo-600 text-white text-xs font-mono py-2.5 px-4 shadow-md border-b border-white/10 relative z-40 transition-all overflow-hidden">
      
      {/* Automatic Slide Progress Bar Indicator */}
      <div
        key={currentSlide}
        className="absolute top-0 left-0 h-0.5 bg-amber-400/90 transition-all duration-[4000ms] ease-linear"
        style={{ width: '100%' }}
      />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Automatic Slideshow Ticker Content */}
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider shadow-sm shrink-0 ${slide.tagBg}`}>
            {slide.icon}
            <span>{slide.tag}</span>
          </span>

          <span className="font-extrabold text-white text-xs sm:text-sm tracking-wide truncate transition-all duration-500">
            {slide.text}
          </span>
        </div>

        {/* Slideshow Controls & CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Slide Progress Dots */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/10 border border-white/20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/40 hover:bg-white'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={onOpenPreOrder}
            className="px-3.5 py-1.5 rounded-full bg-white text-slate-950 hover:bg-slate-100 font-black text-xs transition-all flex items-center gap-1.5 shadow-sm hover:scale-105 cursor-pointer shrink-0"
          >
            <span>{slide.buttonText}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0096C7]" />
          </button>

          <button
            onClick={() => setVisible(false)}
            className="p-1 text-white/80 hover:text-white transition-colors"
            title="Dismiss announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
