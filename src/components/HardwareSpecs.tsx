import React from 'react';
import { Cpu, HardDrive, Activity, Server, CheckCircle2 } from 'lucide-react';

export const HardwareSpecs: React.FC = () => {
  const specs = [
    {
      title: 'AMD Ryzen 7000 & EPYC Nodes',
      desc: 'High single-core boost clock up to 5.7 GHz. Ideal for demanding game servers, compiled web apps, and databases.',
      icon: Cpu,
      accentColor: '#0096C7',
      accentBg: 'rgba(0,150,199,0.12)',
      highlights: ['PCIe 5.0 Bus', 'AVX-512 Instruction Set', 'Dedicated KVM Cores'],
    },
    {
      title: 'PCIe Gen5 NVMe RAID-10',
      desc: 'Enterprise U.2 NVMe storage arrays delivering up to 7,400 MB/s sequential reads and ~148,000 IOPS.',
      icon: HardDrive,
      accentColor: '#A78BFA',
      accentBg: 'rgba(167,139,250,0.12)',
      highlights: ['Hardware RAID-10 Redundancy', 'Power Loss Protection (PLP)', 'Zero Disk Throttling'],
    },
    {
      title: 'DDR5 ECC Registered RAM',
      desc: 'High-frequency error-correcting code memory preventing bit flips and memory corruption under heavy multi-threading.',
      icon: Activity,
      accentColor: '#34D399',
      accentBg: 'rgba(52,211,153,0.10)',
      highlights: ['4800+ MT/s Frequency', 'Hardware Bit-Correction', 'Full RAM Isolation'],
    },
    {
      title: 'Tier IV Navi Mumbai Datacenter',
      desc: 'N+1 concurrent maintainability with dual power feeds, Diesel Generators, and precision climate management.',
      icon: Server,
      accentColor: '#F59E0B',
      accentBg: 'rgba(245,158,11,0.10)',
      highlights: ['99.982% Facility SLA', '24/7 On-Site Engineers', 'NIXI Direct Interconnect'],
    },
  ];

  return (
    <section className="py-24 bg-[#070A0F] text-white font-sans border-b border-slate-800/80 relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-[#0096C7]">
            <Server className="w-3.5 h-3.5" />
            <span>HARDWARE ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight">
            Built On Enterprise Bare-Metal Nodes
          </h2>
          <p className="text-base text-slate-400 font-normal">
            We do not oversubscribe hardware. Every VPS gets guaranteed KVM compute allocations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specs.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-7 rounded-3xl bg-[#0B0F17] border border-slate-800 space-y-5 hover:border-slate-600 transition-all group relative overflow-hidden"
                style={{ boxShadow: `0 0 0 0 ${item.accentColor}` }}
              >
                {/* Subtle glow top line */}
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${item.accentColor}60, transparent)` }} />

                <div className="flex items-center gap-4">
                  <div
                    className="p-3.5 rounded-2xl shrink-0"
                    style={{ background: item.accentBg, border: `1px solid ${item.accentColor}40` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: item.accentColor }} />
                  </div>
                  <h3 className="font-heading font-black text-white text-lg tracking-tight group-hover:text-slate-100 transition-colors">
                    {item.title}
                  </h3>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed font-normal">
                  {item.desc}
                </p>

                <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                  {item.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-slate-300 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: item.accentColor }} />
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


