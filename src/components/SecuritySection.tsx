import React from 'react';
import { ShieldCheck, Lock, Cpu, Server, Activity, ArrowRight } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const securityPillars = [
    {
      title: 'Inline DDoS Packet Inspection',
      desc: 'Hardware scrubbing appliances analyze incoming packets on eth0 at wire-speed, dropping volumetric floods (UDP, SYN, NTP amplification) before reaching your VM.',
      icon: ShieldCheck,
    },
    {
      title: 'Hardware KVM Isolation',
      desc: 'Each virtual machine operates inside its own isolated hypervisor boundaries. CPU instructions, RAM allocations, and storage blocks are hardware-segregated.',
      icon: Lock,
    },
    {
      title: 'Automated Node Health Monitoring',
      desc: 'Hypervisor nodes are continuously monitored 24/7/365. Hardware failures automatically trigger live migration procedures to hot-standby nodes.',
      icon: Activity,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 text-slate-900 font-sans border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-700 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>INFRASTRUCTURE DEFENSE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
            Security & DDoS Mitigation
          </h2>
          <p className="text-base text-slate-600 font-normal">
            Enterprise threat protection engineered into the network core at no extra charge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {securityPillars.map((sp) => {
            const Icon = sp.icon;
            return (
              <div
                key={sp.title}
                className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 w-fit">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-black text-slate-900 text-base tracking-tight">
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
