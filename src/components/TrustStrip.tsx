import React from 'react';
import { Cpu, HardDrive, ShieldCheck, Zap, Network, Activity } from 'lucide-react';
import { KRYONHOST_CONFIG } from '../config/kryonhost.config';

export const TrustStrip: React.FC = () => {
  const icons = [
    <Cpu className="w-4 h-4 text-[#0096C7]" />,
    <HardDrive className="w-4 h-4 text-[#0096C7]" />,
    <ShieldCheck className="w-4 h-4 text-[#0096C7]" />,
    <Zap className="w-4 h-4 text-[#0096C7]" />,
    <Network className="w-4 h-4 text-[#0096C7]" />,
    <Activity className="w-4 h-4 text-[#0096C7]" />,
  ];

  return (
    <div className="w-full bg-[#070A0F] border-y border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {KRYONHOST_CONFIG.trustStrip.map((item, idx) => (
            <div
              key={item.label}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900/60 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[#0096C7] group-hover:border-[#0096C7]/40 transition-colors shrink-0">
                {icons[idx % icons.length]}
              </div>
              <div className="leading-tight">
                <div className="text-xs font-bold text-slate-200 tracking-tight">{item.label}</div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
