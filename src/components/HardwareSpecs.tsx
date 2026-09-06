import React from 'react';
import { Cpu, HardDrive, Activity, Server, CheckCircle2 } from 'lucide-react';

export const HardwareSpecs: React.FC = () => {
  const specs = [
    {
      title: 'AMD Ryzen 7000 & EPYC Nodes',
      desc: 'High single-core boost clock up to 5.7 GHz. Ideal for demanding game servers, compiled web apps, and databases.',
      icon: Cpu,
      accentColor: '#0096C7',
      accentBg: '#E0F2FE',
      highlights: ['PCIe 5.0 Bus', 'AVX-512 Instruction Set', 'Dedicated KVM Cores'],
    },
    {
      title: 'PCIe Gen5 NVMe RAID-10',
      desc: 'Enterprise U.2 NVMe storage arrays delivering up to 7,400 MB/s sequential reads and ~148,000 IOPS.',
      icon: HardDrive,
      accentColor: '#7C3AED',
      accentBg: '#F3E8FF',
      highlights: ['Hardware RAID-10 Redundancy', 'Power Loss Protection (PLP)', 'Zero Disk Throttling'],
    },
    {
      title: 'DDR5 ECC Registered RAM',
      desc: 'High-frequency error-correcting code memory preventing bit flips and memory corruption under heavy multi-threading.',
      icon: Activity,
      accentColor: '#059669',
      accentBg: '#D1FAE5',
      highlights: ['4800+ MT/s Frequency', 'Hardware Bit-Correction', 'Full RAM Isolation'],
    },
    {
      title: 'Tier IV Navi Mumbai Datacenter',
      desc: 'N+1 concurrent maintainability with dual power feeds, Diesel Generators, and precision climate management.',
      icon: Server,
      accentColor: '#D97706',
      accentBg: '#FEF3C7',
      highlights: ['99.982% Facility SLA', '24/7 On-Site Engineers', 'NIXI Direct Interconnect'],
    },
  ];

  return (
    <section className="py-24 bg-white text-slate-900 font-sans border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-[#0096C7] shadow-xs">
            <Server className="w-3.5 h-3.5 text-[#0096C7]" />
            <span>HARDWARE ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
            Built On Enterprise Bare-Metal Nodes
          </h2>
          <p className="text-base text-slate-600 font-normal">
            We do not oversubscribe hardware. Every VPS gets guaranteed KVM compute allocations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specs.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-7 rounded-3xl bg-slate-50/80 border border-slate-200/90 space-y-5 hover:border-[#0096C7] hover:bg-white hover:shadow-xl transition-all group relative overflow-hidden"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="p-3.5 rounded-2xl shrink-0 border border-slate-200/60 shadow-xs"
                    style={{ backgroundColor: item.accentBg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: item.accentColor }} />
                  </div>
                  <h3 className="font-heading font-black text-slate-900 text-lg tracking-tight group-hover:text-[#0096C7] transition-colors">
                    {item.title}
                  </h3>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {item.desc}
                </p>

                <div className="pt-4 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                  {item.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-slate-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

