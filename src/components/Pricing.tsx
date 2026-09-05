import React, { useState } from 'react';
import { Server, Cpu, HardDrive, Network, ShieldCheck, Zap, ArrowRight, Check, Sparkles, Filter, Layers, Globe, Star } from 'lucide-react';
import { KRYONHOST_CONFIG, VPSPlan } from '../config/kryonhost.config';

interface PricingProps {
  onSelectPlan: (planId: string, billingCycle?: 'monthly' | 'quarterly') => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [activeCategory, setActiveCategory] = useState<'budget' | 'standard' | 'performance' | 'power'>('power');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('monthly');
  const [ramFilter, setRamFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');

  // Filter plans based on activeCategory and ramFilter
  const categoryPlans = KRYONHOST_CONFIG.vpsPlans.filter(p => p.category === activeCategory);
  
  const filteredPlans = categoryPlans.filter(p => {
    if (ramFilter === 'small') return p.ramGB <= 8;
    if (ramFilter === 'medium') return p.ramGB >= 16 && p.ramGB <= 32;
    if (ramFilter === 'large') return p.ramGB >= 48;
    return true;
  });

  const categoryMeta = KRYONHOST_CONFIG.vpsCategories.find(c => c.id === activeCategory);

  return (
    <section id="vps-hosting" className="py-24 bg-gradient-to-b from-white via-slate-50 to-white text-slate-900 font-sans border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-mono font-black text-[#0096C7] shadow-sm">
            <Zap className="w-3.5 h-3.5 text-[#0096C7]" />
            <span>ENTERPRISE HARDWARE SPECIFICATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            VPS Hosting
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal">
            Choose the performance tier that fits your workload.
          </p>
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-200/90 p-1.5 rounded-2xl border border-slate-300 max-w-2xl mx-auto shadow-inner">
          {KRYONHOST_CONFIG.vpsCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs font-mono font-black transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0096C7] text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Category Description Banner */}
        {categoryMeta && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200 max-w-3xl mx-auto text-center space-y-1.5 font-mono text-xs shadow-sm">
            <div className="text-[#0096C7] font-black text-sm">{categoryMeta.tagline}</div>
            <div className="text-slate-600 font-sans text-xs">{categoryMeta.description}</div>
          </div>
        )}

        {/* Controls: Monthly / Quarterly Toggle & RAM Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          
          {/* Billing Cycle Toggle */}
          <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200 self-start shadow-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setBillingCycle('quarterly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'quarterly'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Quarterly</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                Save 15%
              </span>
            </button>
          </div>

          {/* RAM Filters */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 self-start sm:self-auto text-xs font-mono shadow-sm">
            <span className="px-2 text-slate-500 text-[11px] font-bold">Filter Memory:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'small', label: '≤ 8 GB' },
              { id: 'medium', label: '16–32 GB' },
              { id: 'large', label: '48 GB+' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setRamFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  ramFilter === f.id
                    ? 'bg-[#E0F2FE] text-[#0096C7] font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlans.map((plan) => {
            // Apply 15% discount calculation for quarterly if selected
            const effectiveMonthlyPrice = billingCycle === 'quarterly'
              ? Math.round(plan.monthlyPriceINR * 0.85)
              : plan.monthlyPriceINR;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl bg-white border flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
                  plan.popular
                    ? 'border-[#0096C7] shadow-xl shadow-[#0096C7]/15 ring-2 ring-[#0096C7]/20 -translate-y-1'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-xl'
                }`}
              >
                {/* Flagship Top Gradient Bar */}
                {plan.popular && (
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#0096C7] via-blue-600 to-indigo-600" />
                )}

                <div className="p-7 space-y-6">
                  
                  {/* Card Header & Badge */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-mono font-bold text-[10px] uppercase tracking-wider">
                        {plan.virtualization} Virtualization
                      </span>

                      {plan.badge && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0096C7] font-mono font-black text-[10px] uppercase tracking-wider border border-[#0096C7]/30 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-[#0096C7]" />
                          <span>{plan.badge}</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-3xl font-black text-slate-900 tracking-tight">
                        {plan.name}
                      </div>
                      <div className="text-xs font-mono font-bold text-[#0096C7] mt-1 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{plan.highlight || plan.cpuArchitecture}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900 tracking-tight">
                          ₹{effectiveMonthlyPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-500 font-mono font-bold">/month</span>
                      </div>
                      {billingCycle === 'quarterly' && (
                        <div className="text-[11px] font-mono text-emerald-700 font-bold mt-1">
                          15% quarterly discount applied
                        </div>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-slate-500 font-bold">
                      Renews monthly
                    </span>
                  </div>

                  {/* Technical Hardware Spec Grid */}
                  <div className="space-y-3 pt-1 font-mono text-xs">
                    
                    {/* Processor */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-[#0096C7]" />
                        <span>Compute Processor</span>
                      </div>
                      <div className="font-black text-slate-900 text-xs">
                        {plan.vcpu} vCPU <span className="font-normal text-slate-600">({plan.cpuArchitecture})</span>
                      </div>
                    </div>

                    {/* Memory */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-purple-600" />
                        <span>System Memory</span>
                      </div>
                      <div className="font-black text-slate-900 text-xs">
                        {plan.ramGB} GB RAM <span className="font-bold text-purple-700">({plan.ramType})</span>
                      </div>
                    </div>

                    {/* NVMe Storage */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                        <span>High-Speed Storage</span>
                      </div>
                      <div className="font-black text-slate-900 text-xs">
                        {plan.storageNVMeGB} GB NVMe <span className="font-normal text-slate-500">(PCIe Gen4/Gen5)</span>
                      </div>
                    </div>

                    {/* Network & DDoS */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1.5">
                        <Network className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Network & Security</span>
                      </div>
                      <div className="font-bold text-slate-800 text-xs">
                        {plan.bandwidth} • DDoS Protection & Snapshots
                      </div>
                    </div>

                  </div>

                </div>

                {/* Deploy Button */}
                <div className="p-7 pt-0">
                  <button
                    onClick={() => onSelectPlan(plan.id, billingCycle)}
                    className={`w-full py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      plan.popular
                        ? 'bg-[#0096C7] hover:bg-[#0284C7] text-white shadow-lg shadow-[#0096C7]/20 hover:-translate-y-0.5'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:-translate-y-0.5'
                    }`}
                  >
                    <span>Deploy Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
