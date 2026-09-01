import React from 'react';
import { KRYONHOST_CONFIG } from '../config/kryonhost.config';
import { HardDrive, Cpu, Globe, ShieldCheck, Terminal, Zap } from 'lucide-react';

export const Features: React.FC = () => {
  const iconMap: Record<string, React.ElementType> = {
    HardDrive,
    Cpu,
    Globe,
    ShieldCheck,
    Terminal,
    Zap,
  };

  return (
    <section id="features" className="py-20 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-semibold text-[#0096C7] mb-3">
            ENGINEERED FOR STABILITY
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Built Around Performance
          </h2>
          <p className="text-base text-slate-600">
            Uncompromising cloud infrastructure engineered from the kernel up for reliability, raw compute speed, and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {KRYONHOST_CONFIG.features.map((feature) => {
            const IconComponent = iconMap[feature.icon] || Zap;
            return (
              <div
                key={feature.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#0096C7] transition-all duration-200 group light-card-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] text-[#0096C7] border border-[#0096C7]/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
