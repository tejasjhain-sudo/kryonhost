import React, { useState } from 'react';
import { Server, Cpu, HardDrive, Network, ShieldCheck, Zap, ArrowRight, Check, Sparkles, Filter } from 'lucide-react';
import { KRYONHOST_CONFIG, VPSPlan } from '../config/kryonhost.config';

interface PricingProps {
  onSelectPlan: (planId: string, billingCycle?: 'monthly' | 'quarterly') => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [activeCategory, setActiveCategory] = useState<'budget' | 'standard' | 'performance' | 'power'>('budget');
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
    <section id="vps-hosting" className="py-24 bg-[#070A0F] text-slate-100 font-sans border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-[#0096C7]">
            <span>HIGH-PERFORMANCE COMPUTE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            VPS Hosting
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-normal">
            Choose the performance tier that fits your workload.
          </p>
        </div>

        {/* Category Tabs (Budget, Standard, Performance, Power) */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-[#0B0F17] p-1.5 rounded-2xl border border-slate-800 max-w-2xl mx-auto">
          {KRYONHOST_CONFIG.vpsCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0096C7] text-white shadow-lg shadow-[#0096C7]/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Category Description Banner */}
        {categoryMeta && (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 max-w-3xl mx-auto text-center space-y-1 font-mono text-xs">
            <div className="text-[#0096C7] font-bold">{categoryMeta.tagline}</div>
            <div className="text-slate-400 font-sans text-xs">{categoryMeta.description}</div>
          </div>
        )}

        {/* Controls: Monthly / Quarterly Toggle & RAM Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          
          {/* Billing Cycle Toggle */}
          <div className="flex items-center gap-3 bg-[#0B0F17] p-1 rounded-xl border border-slate-800 self-start">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setBillingCycle('quarterly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'quarterly'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Quarterly</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Save 15%
              </span>
            </button>
          </div>

          {/* RAM Filters */}
          <div className="flex items-center gap-1.5 bg-[#0B0F17] p-1 rounded-xl border border-slate-800 self-start sm:self-auto text-xs font-mono">
            <span className="px-2 text-slate-500 text-[11px] font-bold">Memory:</span>
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
                    ? 'bg-slate-800 text-[#0096C7] font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPlans.map((plan) => {
            // Apply 15% discount calculation for quarterly if selected
            const effectiveMonthlyPrice = billingCycle === 'quarterly'
              ? Math.round(plan.monthlyPriceINR * 0.85)
              : plan.monthlyPriceINR;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl bg-[#0B0F17] border p-6 flex flex-col justify-between transition-all duration-200 relative group hover:border-[#0096C7]/60 ${
                  plan.popular
                    ? 'border-[#0096C7] shadow-xl shadow-[#0096C7]/10'
                    : 'border-slate-800'
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#0096C7] text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-4">
                  
                  {/* Plan Name & Tag */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-white">{plan.name}</h3>
                      <span className="text-[11px] font-mono text-slate-400 font-bold uppercase">{plan.virtualization}</span>
                    </div>
                    {plan.highlight && (
                      <div className="text-[11px] font-mono text-[#0096C7] font-semibold mt-0.5">
                        {plan.highlight}
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="py-2 border-y border-slate-800/80">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black font-mono text-white">
                        ₹{effectiveMonthlyPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">/month</span>
                    </div>
                    {billingCycle === 'quarterly' && (
                      <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
                        Billed quarterly (15% discount applied)
                      </div>
                    )}
                  </div>

                  {/* Resource Specs List */}
                  <div className="space-y-2.5 font-mono text-xs pt-1">
                    <div className="flex items-center gap-2.5 text-slate-200">
                      <Cpu className="w-3.5 h-3.5 text-[#0096C7] shrink-0" />
                      <span>{plan.vcpu} vCPU ({plan.cpuArchitecture})</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-slate-200">
                      <Server className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="font-bold">{plan.ramGB} GB RAM ({plan.ramType})</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-slate-200">
                      <HardDrive className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{plan.storageNVMeGB} GB NVMe Storage</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-slate-200">
                      <Network className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{plan.bandwidth}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-slate-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>DDoS Protection & Snapshots</span>
                    </div>
                  </div>

                </div>

                {/* Deploy Button */}
                <div className="pt-6">
                  <button
                    onClick={() => onSelectPlan(plan.id, billingCycle)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      plan.popular
                        ? 'bg-[#0096C7] hover:bg-[#0284C7] text-white shadow-md shadow-[#0096C7]/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>Deploy Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
