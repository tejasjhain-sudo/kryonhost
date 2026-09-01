import React from 'react';
import { Network, ShieldCheck, Zap, Activity, ArrowRightLeft, Radio, Server, Globe } from 'lucide-react';

export const NetworkSection: React.FC = () => {
  const networkPillars = [
    {
      id: 'latency',
      title: 'Low Latency',
      desc: 'Optimized routing tables prioritized for direct peering with regional ISPs and upstream transit exchanges.',
      icon: Zap,
    },
    {
      id: 'throughput',
      title: 'High Throughput',
      desc: 'High-speed redundant network uplinks designed for unthrottled bandwidth under heavy application load.',
      icon: Activity,
    },
    {
      id: 'routing',
      title: 'Reliable Routing',
      desc: 'BGP multi-homed path optimization automatically redirecting traffic away from congested internet links.',
      icon: ArrowRightLeft,
    },
    {
      id: 'ddos',
      title: 'DDoS Protection',
      desc: 'Always-on inline packet inspection designed to scrub malicious volumetric floods before reaching compute nodes.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="network" className="py-20 bg-[#F1F5F9] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-semibold text-[#0096C7] mb-3">
            PACKET BACKBONE & SCRUBBING
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Network Architecture
          </h2>
          <p className="text-base text-slate-600">
            Engineered for high packet velocity, clean transit, and automated threat mitigation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {networkPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="p-5 rounded-xl bg-white border border-slate-200 hover:border-[#0096C7] transition-all light-card-shadow"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0096C7] flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{pillar.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl bg-white border border-slate-200 p-6 light-card-shadow">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 font-mono text-xs">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#0096C7]" />
              <span className="font-bold text-slate-900 uppercase">Inline Packet Scrubbing Topology</span>
            </div>
            <span className="text-emerald-600 font-bold">INLINE SHIELD ACTIVE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <Globe className="w-8 h-8 text-[#0096C7] mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-900">Client & ISP Ingress</div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">Multi-Homed Transit</div>
            </div>

            <div className="p-4 rounded-xl bg-white border-2 border-[#0096C7] shadow-sm">
              <ShieldCheck className="w-8 h-8 text-[#0096C7] mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-900">Automated Scrubbing Shield</div>
              <div className="text-[10px] text-[#0096C7] font-mono mt-1 font-bold">Volumetric Mitigation</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-emerald-300">
              <Server className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-900">Protected KVM VPS Node</div>
              <div className="text-[10px] text-emerald-600 font-mono mt-1 font-bold">Isolated Tenant Port</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
