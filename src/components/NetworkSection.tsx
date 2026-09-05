import React from 'react';
import { Network, ShieldCheck, Zap, Activity, ArrowRightLeft, Radio, Server, Globe } from 'lucide-react';

export const NetworkSection: React.FC = () => {
  const networkPillars = [
    {
      id: 'latency',
      title: 'Sub-5ms Domestic Latency',
      desc: 'Optimized routing prioritized for direct peering with Indian ISPs and upstream transit exchanges (NIXI, ExtremeIX).',
      icon: Zap,
    },
    {
      id: 'throughput',
      title: '1 Gbps Port Uplink',
      desc: 'High-speed redundant network uplinks designed for unthrottled bandwidth under heavy production workloads.',
      icon: Activity,
    },
    {
      id: 'routing',
      title: 'BGP Multi-Homed Paths',
      desc: 'BGP path optimization automatically redirects traffic away from congested internet links for maximum packet stability.',
      icon: ArrowRightLeft,
    },
    {
      id: 'ddos',
      title: 'Always-On DDoS Scrubbing',
      desc: 'Automated inline hardware packet inspection scrubs volumetric floods (UDP/SYN/NTP) before reaching your VPS.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="network" className="py-24 bg-[#070A0F] text-slate-100 font-sans border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-[#0096C7]">
            <Network className="w-3.5 h-3.5" />
            <span>PACKET BACKBONE & SCRUBBING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Network Architecture
          </h2>
          <p className="text-sm text-slate-400 font-normal">
            Engineered for high packet velocity, clean transit, and automated threat mitigation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {networkPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="p-6 rounded-2xl bg-[#0B0F17] border border-slate-800 hover:border-[#0096C7]/60 transition-all shadow-xl space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-[#0096C7] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{pillar.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
