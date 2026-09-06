import React from 'react';
import { ShieldCheck, Lock, Activity, Zap } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const securityPillars = [
    {
      title: 'Inline DDoS Packet Inspection',
      desc: 'Hardware scrubbing appliances analyze incoming packets on eth0 at wire-speed, dropping volumetric floods (UDP, SYN, NTP amplification) before reaching your VM.',
      icon: ShieldCheck,
      badge: 'Wire-Speed Scrubbing',
    },
    {
      title: 'Hardware KVM Isolation',
      desc: 'Each virtual machine operates inside its own isolated hypervisor boundaries. CPU instructions, RAM allocations, and storage blocks are hardware-segregated.',
      icon: Lock,
      badge: 'Isolated Hypervisor',
    },
    {
      title: 'Automated Node Health Monitoring',
      desc: 'Hypervisor nodes are continuously monitored 24/7/365. Hardware failures automatically trigger live migration procedures to hot-standby nodes.',
      icon: Activity,
      badge: '24/7 Live Failover',
    },
  ];

  return (
    <section className="py-24 bg-slate-50 text-slate-900 font-sans border-b border-slate-200/90 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-700 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>INFRASTRUCTURE DEFENSE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
            Security & DDoS Mitigation
          </h2>
          <p className="text-base text-slate-600 font-normal">
            Enterprise threat protection engineered into the network core at no extra charge.
          </p>
        </div>

        {/* Visual Packet Scrubbing Flow Diagram */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>LIVE DDOS SCRUBBING ARCHITECTURE</span>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
              ● ALWAYS ON
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-slate-500 text-[10px] uppercase font-bold">Stage 1: Ingress Traffic</div>
              <div className="font-black text-amber-700">100 Gbps Backbone Uplink</div>
              <div className="text-[11px] text-slate-500">Raw Internet Traffic Ingestion</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="text-emerald-800 text-[10px] uppercase font-black">Stage 2: Hardware Filter</div>
              <div className="font-black text-emerald-700">Corero Scrubbing Cluster</div>
              <div className="text-[11px] text-emerald-600">&lt;1ms Volumetric Mitigation</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-slate-500 text-[10px] uppercase font-bold">Stage 3: Protected Instance</div>
              <div className="font-black text-[#0096C7]">Clean Transit to Your KVM</div>
              <div className="text-[11px] text-slate-500">Zero Traffic Latency Impact</div>
            </div>
          </div>
        </div>

        {/* 3 Defense Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {securityPillars.map((sp) => {
            const Icon = sp.icon;
            return (
              <div
                key={sp.title}
                className="p-7 rounded-3xl bg-white border border-slate-200/90 space-y-4 hover:border-emerald-500 hover:shadow-xl transition-all group relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {sp.badge}
                  </span>
                </div>

                <h3 className="font-heading font-black text-slate-900 text-lg tracking-tight group-hover:text-emerald-700 transition-colors">
                  {sp.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {sp.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
