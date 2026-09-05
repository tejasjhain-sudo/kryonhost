import React, { useState } from 'react';
import { Server, Cpu, HardDrive, Network, ShieldCheck, Zap, ArrowRight, Check, Sparkles, Star } from 'lucide-react';
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
    <section id="vps-hosting" className="py-20 bg-slate-50 text-slate-900 font-sans border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-mono font-bold text-[#0096C7] shadow-sm animate-pulse-glow">
            <Zap className="w-3.5 h-3.5 text-[#0096C7]" />
            <span>KVM CLOUD HARDWARE NODES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            VPS Hosting Plans
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Dedicated KVM compute resources. Automated 60-second deployment.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300 max-w-xl mx-auto shadow-inner">
          {KRYONHOST_CONFIG.vpsCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-mono font-black transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0096C7] text-white shadow-md scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Category Description Banner */}
        {categoryMeta && (
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 max-w-2xl mx-auto text-center space-y-1 font-mono text-xs shadow-sm">
            <div className="text-[#0096C7] font-black">{categoryMeta.tagline}</div>
            <div className="text-slate-600 font-sans text-xs">{categoryMeta.description}</div>
          </div>
        )}

        {/* Controls: Monthly / Quarterly Toggle & RAM Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Billing Cycle Toggle */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 self-start shadow-sm text-xs font-mono">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setBillingCycle('quarterly')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
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
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 self-start sm:self-auto text-xs font-mono shadow-sm">
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
                    ? 'bg-[#E0F2FE] text-[#0096C7] font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

        </div>

        {/* Compact, Animated, High-Tech Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => {
            // Apply 15% discount calculation for quarterly if selected
            const effectiveMonthlyPrice = billingCycle === 'quarterly'
              ? Math.round(plan.monthlyPriceINR * 0.85)
              : plan.monthlyPriceINR;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl bg-white border flex flex-col justify-between transition-all duration-300 relative group overflow-hidden hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#0096C7]/10 ${
                  plan.popular
                    ? 'border-[#0096C7] ring-2 ring-[#0096C7]/30 shadow-md'
                    : 'border-slate-200 hover:border-[#0096C7]/60 shadow-sm'
                }`}
              >
                {/* Animated Top Light Bar on Popular */}
                {plan.popular ? (
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#0096C7] via-blue-600 to-indigo-600 animate-shimmer" />
                ) : (
                  <div className="h-1 w-full bg-slate-100 group-hover:bg-[#0096C7] transition-colors" />
                )}

                <div className="p-6 space-y-5">
                  
                  {/* Card Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono font-bold text-[10px] uppercase">
                        {plan.virtualization} Virtualization
                      </span>

                      {plan.badge && (
                        <span className="px-2 py-0.5 rounded-md bg-[#E0F2FE] text-[#0096C7] font-mono font-black text-[10px] uppercase border border-[#0096C7]/30 flex items-center gap-1 shadow-sm">
                          <Star className="w-3 h-3 fill-[#0096C7]" />
                          <span>{plan.badge}</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-between">
                        <span>{plan.name}</span>
                        <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {plan.ramGB} GB
                        </span>
                      </h3>
                      
                      <div className="text-[11px] font-mono font-bold text-[#0096C7] mt-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#0096C7]" />
                        <span>{plan.highlight || plan.cpuArchitecture}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compact Price Display */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black font-mono text-slate-900 tracking-tight">
                          ₹{effectiveMonthlyPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">/month</span>
                      </div>
                      {billingCycle === 'quarterly' && (
                        <div className="text-[10px] font-mono text-emerald-700 font-bold">
                          15% quarterly discount applied
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                      Instant Deploy
                    </span>
                  </div>

                  {/* Interactive Hardware Spec Chips */}
                  <div className="space-y-2 font-mono text-xs">
                    
                    {/* Compute Chip */}
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 group-hover:border-[#0096C7]/40 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-[#0096C7] shrink-0" />
                        <span className="font-bold text-slate-900">{plan.vcpu} vCPU</span>
                      </div>
                      <span className="text-[11px] text-slate-600 truncate max-w-[150px] text-right">
                        {plan.cpuArchitecture}
                      </span>
                    </div>

                    {/* RAM Chip */}
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 group-hover:border-purple-300 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Server className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="font-bold text-slate-900">{plan.ramGB} GB RAM</span>
                      </div>
                      <span className="text-[11px] font-bold text-purple-700 text-right">
                        {plan.ramType}
                      </span>
                    </div>

                    {/* Storage Chip */}
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 group-hover:border-blue-300 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="font-bold text-slate-900">{plan.storageNVMeGB} GB NVMe</span>
                      </div>
                      <span className="text-[10px] text-slate-500 text-right font-medium">
                        PCIe Gen4/Gen5
                      </span>
                    </div>

                    {/* Network Chip */}
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Network className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-bold text-slate-900">{plan.bandwidth}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold text-right">
                        DDoS Protected
                      </span>
                    </div>

                  </div>

                </div>

                {/* Animated Action Button */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => onSelectPlan(plan.id, billingCycle)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-md ${
                      plan.popular
                        ? 'bg-[#0096C7] hover:bg-[#0284C7] text-white shadow-sm'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Deploy Now</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
