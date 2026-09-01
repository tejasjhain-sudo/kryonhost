import React, { useState } from 'react';
import { Sparkles, ArrowRight, X, Flame } from 'lucide-react';

interface HeaderAnnouncementProps {
  onOpenPreOrder: () => void;
}

export const HeaderAnnouncement: React.FC<HeaderAnnouncementProps> = ({ onOpenPreOrder }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-[#0096C7] via-blue-600 to-indigo-600 text-white text-xs font-mono py-2.5 px-4 shadow-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm animate-pulse shrink-0">
            <Flame className="w-3 h-3 text-red-600" />
            FOUNDING OFFER
          </span>

          <span className="font-extrabold text-white text-xs sm:text-sm tracking-wide">
            🇮🇳 India - Mumbai Datacenter Launch: Get up to 30% OFF + Free +4 GB Permanent RAM Bonus!
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenPreOrder}
            className="px-4 py-1.5 rounded-full bg-white text-slate-950 hover:bg-slate-100 font-black text-xs transition-all flex items-center gap-1.5 shadow-sm hover:scale-105 cursor-pointer"
          >
            <span>Pre-Order Now</span>
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
