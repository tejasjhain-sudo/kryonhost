import React from 'react';
import { Network, ShieldCheck, Zap, Activity, ArrowRightLeft } from 'lucide-react';

export const NetworkSection: React.FC = () => {
  const networkPillars = [
    {
      id: 'latency',
      title: 'Sub-5ms Domestic Latency',
      desc: 'Optimized routing prioritized for direct peering with Indian ISPs and upstream transit exchanges (NIXI, ExtremeIX).',
      icon: Zap,
      accent: '#0096C7',
      accentBg: '#E0F2FE',
    },
    {
      id: 'throughput',
      title: '1 Gbps Port Uplink',
      desc: 'High-speed redundant network uplinks designed for unthrottled bandwidth under heavy production workloads.',
      icon: Activity,
      accent: '#059669',
      accentBg: '#D1FAE5',
    },
    {
      id: 'routing',
      title: 'BGP Multi-Homed Paths',
      desc: 'BGP path optimization automatically redirects traffic away from congested internet links for maximum packet stability.',
      icon: ArrowRightLeft,
      accent: '#7C3AED',
      accentBg: '#F3E8FF',
    },
    {
      id: 'ddos',
      title: 'Always-On DDoS Scrubbing',
      desc: 'Automated inline hardware packet inspection scrubs volumetric floods (UDP/SYN/NTP) before reaching your VPS.',
      icon: ShieldCheck,
      accent: '#D97706',
      accentBg: '#FEF3C7',
    },
  ];

  return (
    <section id="network" className="py-24 bg-white text-slate-900 font-sans border-b border-slate-200/90 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-mono font-bold text-[#0096C7] shadow-xs">
            <Network className="w-3.5 h-3.5" />
            <span>PACKET BACKBONE & SCRUBBING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
            Network Architecture
          </h2>
          <p className="text-base text-slate-600 font-normal">
            Engineered for high packet velocity, clean transit, and automated threat mitigation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {networkPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/90 hover:border-[#0096C7] hover:bg-white hover:shadow-xl transition-all space-y-4 relative overflow-hidden group"
              >
                <div
                  className="w-11 h-11 rounded-2xl border border-slate-200/60 flex items-center justify-center shrink-0 shadow-xs"
                  style={{ backgroundColor: pillar.accentBg }}
                >
                  <Icon className="w-5 h-5" style={{ color: pillar.accent }} />
                </div>
                <h3 className="text-base font-heading font-bold text-slate-900 group-hover:text-[#0096C7] transition-colors">{pillar.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

