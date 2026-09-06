import React, { useState } from 'react';
import { Cpu, HardDrive, Zap, ShieldCheck, ArrowRight, Gauge, Flame } from 'lucide-react';

interface ComparisonTableProps {
  onExplore: () => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ onExplore }) => {
  const [activeBenchmark, setActiveBenchmark] = useState<'storage' | 'cpu' | 'network'>('storage');

  const benchmarks = {
    storage: {
      title: 'PCIe 5.0 NVMe Storage Velocity',
      subtitle: 'Sequential Read/Write Benchmarks (fio test 4k block size)',
      metric: '7,400 MB/s',
      unit: 'Sequential Read Speed',
      iops: '148,000 IOPS',
      desc: 'Enterprise Samsung U.2 NVMe SSDs configured in Hardware RAID-10 with Power Loss Protection (PLP). Zero disk throttling even under peak database operations.',
      bars: [
        { label: 'KryonHost PCIe Gen5 NVMe', value: 100, valText: '7,400 MB/s', isKryon: true },
        { label: 'Standard NVMe SSD', value: 45, valText: '3,500 MB/s', isKryon: false },
        { label: 'SATA SSD (Legacy Host)', value: 15, valText: '550 MB/s', isKryon: false },
      ]
    },
    cpu: {
      title: 'AMD Ryzen 7000 & EPYC Single-Core Boost',
      subtitle: 'Geekbench 6 Single-Core Performance Score',
      metric: '5.7 GHz',
      unit: 'Max Boost Clock',
      iops: '100% Dedicated KVM',
      desc: 'High-frequency bare-metal compute nodes with AVX-512 vector instructions. Designed specifically for demanding game servers, compiled apps, and heavy SQL queries.',
      bars: [
        { label: 'KryonHost High-Clock Node', value: 100, valText: '2,950 Score', isKryon: true },
        { label: 'Generic Cloud vCPU', value: 55, valText: '1,620 Score', isKryon: false },
        { label: 'Shared Web Host CPU', value: 25, valText: '780 Score', isKryon: false },
      ]
    },
    network: {
      title: 'Domestic India Network Velocity',
      subtitle: 'NIXI & ExtremeIX Direct Peering Latency',
      metric: '< 5 ms',
      unit: 'Avg Domestic Ping',
      iops: '1 Gbps Uplink',
      desc: 'Direct BGP peering with TATA, Airtel, Jio, and RailTel across Tier IV datacenters in Navi Mumbai, delivering sub-15ms latency to 80%+ of Indian internet users.',
      bars: [
        { label: 'KryonHost Mumbai Tier IV', value: 100, valText: '< 5 ms Latency', isKryon: true },
        { label: 'Overseas Cloud (Singapore)', value: 40, valText: '65 ms Latency', isKryon: false },
        { label: 'Overseas Cloud (US-East)', value: 15, valText: '210 ms Latency', isKryon: false },
      ]
    }
  };

  const active = benchmarks[activeBenchmark];

  return (
    <section className="py-24 bg-[#F8FAFC] text-slate-900 font-sans border-b border-slate-200/90 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-mono font-bold text-[#0096C7] shadow-xs">
            <Gauge className="w-3.5 h-3.5" />
            <span>ENTERPRISE BENCHMARKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
            Engineered for Maximum Velocity
          </h2>
          <p className="text-base text-slate-600 font-normal">
            Empirical benchmark metrics comparing KryonHost KVM infrastructure against standard cloud hosts.
          </p>
        </div>

        {/* Benchmark Tab Switcher */}
        <div className="flex justify-center">
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 inline-flex font-mono text-xs shadow-xs">
            <button
              type="button"
              onClick={() => setActiveBenchmark('storage')}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeBenchmark === 'storage'
                  ? 'bg-[#0096C7] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>NVMe Storage</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveBenchmark('cpu')}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeBenchmark === 'cpu'
                  ? 'bg-[#0096C7] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Compute & CPU</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveBenchmark('network')}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeBenchmark === 'network'
                  ? 'bg-[#0096C7] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Network Speed</span>
            </button>
          </div>
        </div>

        {/* Main Interactive Benchmark Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl max-w-4xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight">
                {active.title}
              </h3>
              <p className="text-xs font-mono text-[#0096C7] font-bold">
                {active.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shrink-0 font-mono">
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">{active.unit}</div>
                <div className="text-2xl font-black text-slate-900">{active.metric}</div>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Throughput</div>
                <div className="text-sm font-bold text-emerald-600 mt-1">{active.iops}</div>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            {active.desc}
          </p>

          {/* Benchmark Comparison Bars */}
          <div className="space-y-4 font-mono text-xs pt-2">
            {active.bars.map((bar) => (
              <div key={bar.label} className="space-y-1.5">
                <div className="flex justify-between font-bold text-slate-700">
                  <span className={bar.isKryon ? 'text-[#0096C7] font-black flex items-center gap-1.5' : 'text-slate-500'}>
                    {bar.isKryon && <Flame className="w-3.5 h-3.5 text-[#0096C7]" />}
                    {bar.label}
                  </span>
                  <span className={bar.isKryon ? 'text-[#0096C7] font-black' : 'text-slate-500'}>{bar.valText}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200/80">
                  <div
                    className={`h-full transition-all duration-700 rounded-full ${
                      bar.isKryon
                        ? 'bg-gradient-to-r from-[#0077B6] to-[#0096C7] shadow-xs'
                        : 'bg-slate-300'
                    }`}
                    style={{ width: `${bar.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Reserved KVM Hypervisor Isolation Guarantee</span>
            </div>

            <button
              type="button"
              onClick={onExplore}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-heading font-bold text-xs shadow-md shadow-[#0096C7]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Deploy KVM Server →</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
