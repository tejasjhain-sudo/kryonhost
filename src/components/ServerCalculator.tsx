import React, { useState } from 'react';
import { Sliders, Cpu, HardDrive, Zap, ArrowRight, Check } from 'lucide-react';

interface ServerCalculatorProps {
  onSelectPlan: (planId: string) => void;
}

export const ServerCalculator: React.FC<ServerCalculatorProps> = ({ onSelectPlan }) => {
  const [ramGB, setRamGB] = useState(16);
  const [selectedOS, setSelectedOS] = useState('Ubuntu 24.04 LTS');

  const vcpu = ramGB <= 4 ? 2 : ramGB <= 8 ? 4 : ramGB <= 16 ? 6 : ramGB <= 32 ? 10 : 14;
  const storageGB = ramGB <= 4 ? 30 : ramGB <= 8 ? 60 : ramGB <= 16 ? 100 : ramGB <= 32 ? 160 : 250;
  
  const calculatedPrice = ramGB <= 4 ? 616 : ramGB <= 8 ? 871 : ramGB <= 16 ? 1424 : ramGB <= 32 ? 2699 : 4824;

  const handleDeployCalculated = () => {
    const planId = ramGB <= 4 ? 'standard-4gb' : ramGB <= 8 ? 'standard-8gb' : ramGB <= 16 ? 'standard-16gb' : ramGB <= 32 ? 'standard-32gb' : 'standard-64gb';
    onSelectPlan(planId);
  };

  return (
    <section className="py-20 bg-white text-slate-900 font-sans border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-mono font-bold text-[#0096C7] shadow-sm">
            <Sliders className="w-3.5 h-3.5" />
            <span>CUSTOM COMPUTE CALCULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
            Estimate Your Custom VPS Specs
          </h2>
          <p className="text-base text-slate-600 font-normal">
            Adjust your compute resources to match your exact workload requirements.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Sliders */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* RAM Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-mono">
                <span className="font-bold text-slate-700 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#0096C7]" />
                  <span>RAM Capacity (DDR5 ECC)</span>
                </span>
                <span className="font-black text-[#0096C7] text-lg">{ramGB} GB RAM</span>
              </div>
              <input
                type="range"
                min="4"
                max="64"
                step="4"
                value={ramGB}
                onChange={(e) => setRamGB(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0096C7]"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>4 GB</span>
                <span>16 GB</span>
                <span>32 GB</span>
                <span>64 GB</span>
              </div>
            </div>

            {/* Derived Specs Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <div className="text-slate-500 text-[10px] flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-[#0096C7]" />
                  <span>vCPU Cores</span>
                </div>
                <div className="font-black text-slate-900 text-sm">{vcpu} vCPU Cores</div>
                <div className="text-[10px] text-slate-500">AMD EPYC / Ryzen</div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <div className="text-slate-500 text-[10px] flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-purple-600" />
                  <span>NVMe RAID Storage</span>
                </div>
                <div className="font-black text-slate-900 text-sm">{storageGB} GB NVMe</div>
                <div className="text-[10px] text-slate-500">7,400 MB/s Read</div>
              </div>
            </div>

            {/* OS Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-700 block">Select Operating System:</label>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {['Ubuntu 24.04 LTS', 'Debian 12', 'AlmaLinux 9', 'Windows Server'].map((os) => (
                  <button
                    key={os}
                    onClick={() => setSelectedOS(os)}
                    className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      selectedOS === os
                        ? 'bg-[#0096C7] text-white border-[#0096C7] font-bold shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {os}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Price Output Card */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-md font-mono text-xs">
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <div className="text-slate-500 text-[11px] uppercase font-bold">Estimated Monthly Cost</div>
              <div className="text-4xl font-black text-slate-900 tracking-tight">
                ₹{calculatedPrice.toLocaleString('en-IN')}
                <span className="text-xs text-slate-500 font-normal"> /mo</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 pt-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Hidden Fees • Cancel Anytime</span>
              </div>
            </div>

            <div className="space-y-2 text-slate-600 font-sans text-xs">
              <div className="flex items-center justify-between">
                <span>Network Port:</span>
                <span className="font-bold text-slate-900 font-mono">1 Gbps Full Duplex</span>
              </div>
              <div className="flex items-center justify-between">
                <span>DDoS Scrubbing:</span>
                <span className="font-bold text-emerald-700 font-mono">Always-On Hardware</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Datacenter:</span>
                <span className="font-bold text-slate-900 font-mono">Tier IV Navi Mumbai</span>
              </div>
              <div className="flex items-center justify-between">
                <span>IPv4 Address:</span>
                <span className="font-bold text-slate-900 font-mono">1 Dedicated Included</span>
              </div>
            </div>

            <button
              onClick={handleDeployCalculated}
              className="w-full py-3.5 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-heading font-bold text-xs shadow-lg shadow-[#0096C7]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Deploy This Spec</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
