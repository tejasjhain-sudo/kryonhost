import React, { useState } from 'react';
import { KRYONHOST_CONFIG, VPSPlan, AddOnItem } from '../config/kryonhost.config';
import { Cpu, HardDrive, Network, Shield, Check, Zap, ArrowRight, Table, LayoutGrid, Sparkles, Archive, RotateCw, Database, Camera, Activity, Headphones, PlusCircle } from 'lucide-react';

interface PricingProps {
  onSelectPlan: (planId: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const plans = KRYONHOST_CONFIG.plans;
  const addOns = KRYONHOST_CONFIG.addOns;

  const iconMap: Record<string, React.ElementType> = {
    Archive,
    RotateCw,
    HardDrive,
    Network,
    Database,
    Camera,
    Activity,
    Headphones,
  };

  return (
    <section id="vps-plans" className="py-24 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-extrabold text-[#0096C7] mb-3">
            COMPUTE INFRASTRUCTURE MATRIX
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Choose Your VPS
          </h2>
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            Simple, transparent resources without confusing hosting packages.
          </p>

          {/* Controls Bar */}
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-4 p-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-[#0096C7] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Plan Cards View
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'table'
                    ? 'bg-[#0096C7] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Table className="w-3.5 h-3.5" /> Comparison Table
              </button>
            </div>

            {/* Currency Switcher */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setCurrency('INR')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-extrabold transition-colors ${
                  currency === 'INR' ? 'bg-[#0096C7] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                INR (₹)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-extrabold transition-colors ${
                  currency === 'USD' ? 'bg-[#0096C7] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>

        {/* Primary Cards Grid - Responsive for 5 tiers */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 items-stretch">
            {plans.map((plan: VPSPlan) => {
              const priceDisplay =
                currency === 'INR'
                  ? `₹${plan.monthlyPriceINR.toLocaleString('en-IN')}`
                  : `$${plan.monthlyPriceUSD.toFixed(2)}`;

              const isBonusEligible = plan.bonusEligible !== false;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl flex flex-col justify-between p-6 transition-all duration-200 ${
                    plan.popular
                      ? 'bg-white border-2 border-[#0096C7] shadow-xl scale-[1.03] z-10'
                      : 'bg-white border border-slate-200 hover:border-slate-300 premium-card-shadow'
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#0096C7] text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-white" />
                      {plan.badge || 'MOST POPULAR'}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{plan.name}</h3>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-5 min-h-[32px] leading-relaxed font-medium">
                      {plan.description}
                    </p>

                    {/* Price Block */}
                    <div className="mb-5 pb-5 border-b border-slate-100 min-h-[76px] flex flex-col justify-end">
                      <div className="flex items-baseline gap-1 font-mono">
                        <span className="text-3xl font-black text-slate-900 tracking-tight">
                          {priceDisplay}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">/mo</span>
                      </div>
                      {isBonusEligible ? (
                        <div className="mt-1 text-[11px] text-[#0096C7] font-extrabold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>+4 GB Bonus Eligible</span>
                        </div>
                      ) : (
                        <div className="mt-1 text-[11px] text-slate-400 font-medium">
                          Standard Plan Rate
                        </div>
                      )}
                    </div>

                    {/* Specs List */}
                    <ul className="space-y-3 mb-6 text-xs font-medium">
                      <li className="flex items-center gap-2.5 text-slate-900">
                        <div className="p-1 rounded bg-[#E0F2FE] text-[#0096C7]">
                          <Cpu className="w-3.5 h-3.5" />
                        </div>
                        <span>
                          <strong className="font-extrabold">{plan.vcpu} vCPU</strong> Cores
                        </span>
                      </li>

                      <li className="flex items-center gap-2.5 text-slate-900">
                        <div className="p-1 rounded bg-[#E0F2FE] text-[#0096C7]">
                          <Zap className="w-3.5 h-3.5" />
                        </div>
                        <span>
                          <strong className="font-extrabold">{plan.ramGB} GB RAM</strong>
                          {isBonusEligible && (
                            <span className="text-[10px] text-[#0096C7] ml-1 font-extrabold">(+4GB Bonus)</span>
                          )}
                        </span>
                      </li>

                      <li className="flex items-center gap-2.5 text-slate-900">
                        <div className="p-1 rounded bg-[#E0F2FE] text-[#0096C7]">
                          <HardDrive className="w-3.5 h-3.5" />
                        </div>
                        <span>
                          <strong className="font-extrabold">{plan.storageNVMeGB} GB</strong> NVMe
                        </span>
                      </li>

                      <li className="flex items-center gap-2.5 text-slate-600 text-[11px]">
                        <div className="p-1 rounded bg-[#E0F2FE] text-[#0096C7]">
                          <Network className="w-3.5 h-3.5" />
                        </div>
                        <span>
                          <strong className="text-slate-900 font-bold">{plan.bandwidth}</strong> Uplink
                        </span>
                      </li>

                      <li className="flex items-center gap-2 text-slate-600 text-[11px]">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{plan.ipv4}</span>
                      </li>

                      <li className="flex items-center gap-2 text-slate-600 text-[11px]">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{plan.virtualization} Virtualization</span>
                      </li>

                      <li className="flex items-center gap-2 text-slate-600 text-[11px]">
                        <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>DDoS Protection</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <button
                      onClick={() => onSelectPlan(plan.id)}
                      className={`w-full py-3 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 group cursor-pointer ${
                        plan.popular
                          ? 'bg-[#0096C7] hover:bg-[#0284C7] text-white shadow-md shadow-[#0096C7]/20'
                          : 'bg-slate-900 hover:bg-[#0096C7] text-white shadow-sm'
                      }`}
                    >
                      <span>Pre-Order</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="mt-2 text-center text-[10px] text-slate-500 font-medium">
                      Provisioning at launch
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table Comparison View */
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-900 border-b border-slate-200 text-xs font-mono font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">KryonHost Plan</th>
                  <th className="py-4 px-4 text-center">RAM</th>
                  <th className="py-4 px-4 text-center">vCPU</th>
                  <th className="py-4 px-4 text-center">NVMe Storage</th>
                  <th className="py-4 px-4 text-center">Network & DDoS</th>
                  <th className="py-4 px-4 text-center">Suggested Price</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {plans.map((plan: VPSPlan) => {
                  const priceDisplay =
                    currency === 'INR'
                      ? `₹${plan.monthlyPriceINR.toLocaleString('en-IN')}`
                      : `$${plan.monthlyPriceUSD.toFixed(2)}`;

                  const isBonusEligible = plan.bonusEligible !== false;

                  return (
                    <tr key={plan.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold">{plan.name}</span>
                          {plan.popular && (
                            <span className="px-2 py-0.5 rounded bg-[#0096C7] text-white text-[10px] font-extrabold uppercase">
                              POPULAR
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-normal mt-0.5">{plan.description}</div>
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-bold text-slate-900">
                        {plan.ramGB} GB
                        {isBonusEligible && (
                          <span className="block text-[10px] text-[#0096C7] font-extrabold">+4GB Bonus</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-bold text-slate-900">{plan.vcpu} vCPU</td>
                      <td className="py-4 px-4 text-center font-mono font-bold text-slate-900">{plan.storageNVMeGB} GB</td>
                      <td className="py-4 px-4 text-center text-xs text-slate-600">
                        <div>1 Gbps Unmetered</div>
                        <div className="text-emerald-600 font-semibold">DDoS Shield</div>
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-black text-xl text-slate-900">{priceDisplay}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => onSelectPlan(plan.id)}
                          className="px-4 py-2 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-extrabold text-xs inline-flex items-center gap-1 cursor-pointer shadow-sm"
                        >
                          <span>Pre-Order</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Add-ons & Upgrades Showcase Section */}
        <div className="mt-20 pt-16 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-bold text-[#0096C7] mb-2.5">
              <PlusCircle className="w-3.5 h-3.5" />
              CUSTOM INFRASTRUCTURE UPGRADES
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
              Add-ons & Upgrades Pricing
            </h3>
            <p className="text-sm text-slate-600">
              Enhance your VPS instance with automated backups, extra NVMe storage, dedicated IPv4 addresses, and hands-on managed support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {addOns.map((item: AddOnItem) => {
              const IconComponent = iconMap[item.icon] || PlusCircle;
              const priceDisplay = currency === 'INR' ? item.priceINR : item.priceUSD;

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#0096C7] transition-all duration-200 premium-card-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0096C7] flex items-center justify-center border border-[#0096C7]/20">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-900 font-mono font-black text-xs">
                        {priceDisplay}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 mb-1.5">{item.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Flexible Add-on</span>
                    <span className="text-[#0096C7] font-bold">1-Click Activate</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-slate-500 font-medium">
          ℹ️ Pre-order prices and add-on rates are locked in for founding customers upon physical datacenter node provisioning.
        </div>
      </div>
    </section>
  );
};
