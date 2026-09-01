import React, { useState } from 'react';
import { ShieldCheck, HardDrive, Network, Lock, Sparkles, Check, Server, Plus, ArrowRight, Cpu, Layers, Camera, Headphones, Globe, Zap } from 'lucide-react';

interface UpgradeItem {
  id: string;
  name: string;
  price: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
}

export const InfrastructureUpgrades: React.FC<{ onOpenPreOrder?: () => void }> = ({ onOpenPreOrder }) => {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const addonsList: UpgradeItem[] = [
    {
      id: 'daily-backups',
      name: 'Automated Daily Backups',
      price: '₹49/mo',
      description: 'Scheduled automated daily backups of instance state and storage volumes.',
      badge: 'Flexible Add-on',
      icon: <Layers className="w-5 h-5 text-[#0096C7]" />,
    },
    {
      id: 'retention-backups',
      name: 'Automated Backups — 7-Day Retention',
      price: '₹99/mo',
      description: 'Full 7-day rolling recovery points for disaster recovery peace of mind.',
      badge: 'Flexible Add-on',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 'extra-nvme',
      name: 'Extra 50 GB NVMe Storage',
      price: '₹99/mo',
      description: 'Expand your primary disk space with high-speed PCIe NVMe storage.',
      badge: 'Flexible Add-on',
      icon: <HardDrive className="w-5 h-5 text-purple-600" />,
    },
    {
      id: 'dedicated-ipv4',
      name: 'Extra Dedicated IPv4 Address',
      price: '₹100–₹200/mo',
      description: 'Additional clean static IPv4 addresses for SSL certificates and services.',
      badge: 'Flexible Add-on',
      icon: <Globe className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'backup-storage',
      name: 'Additional Backup Storage',
      price: '₹49 / 50 GB',
      description: 'Dedicated offsite object storage bucket for custom backups and dumps.',
      badge: 'Flexible Add-on',
      icon: <Server className="w-5 h-5 text-cyan-600" />,
    },
    {
      id: 'snapshot',
      name: 'On-Demand Instance Snapshot',
      price: '₹29/mo',
      description: 'Create instant point-in-time state snapshots prior to updates or migrations.',
      badge: 'Flexible Add-on',
      icon: <Camera className="w-5 h-5 text-amber-600" />,
    },
    {
      id: 'extra-traffic',
      name: 'Extra Network Traffic',
      price: '₹50–₹100/TB',
      description: 'High-bandwidth overage allocation for extreme traffic applications.',
      badge: 'Flexible Add-on',
      icon: <Zap className="w-5 h-5 text-rose-600" />,
    },
    {
      id: 'managed-support',
      name: 'Managed VPS Support',
      price: '₹199–₹499/mo',
      description: '24/7 priority hands-on support for server setup, tuning, and troubleshooting.',
      badge: 'Flexible Add-on',
      icon: <Headphones className="w-5 h-5 text-[#0096C7]" />,
    },
  ];

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-16 sm:py-20 bg-slate-50 relative overflow-hidden font-sans border-b border-slate-200">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-[#0096C7] text-xs font-mono font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Custom Infrastructure Upgrades</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Add-ons & Upgrades Pricing
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Enhance your VPS instance with automated backups, extra NVMe storage, dedicated IPv4 addresses, and hands-on managed support.
          </p>
        </div>

        {/* Upgrades Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {addonsList.map((addon) => {
            const isSelected = selectedAddons.includes(addon.id);
            return (
              <div
                key={addon.id}
                onClick={() => toggleAddon(addon.id)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-white border-[#0096C7] shadow-xl ring-2 ring-[#0096C7]/30'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200">
                      {addon.icon}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono font-bold">
                      {addon.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">{addon.name}</h3>
                    <div className="text-xl font-mono font-black text-[#0096C7] mt-1">{addon.price}</div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {addon.description}
                  </p>
                </div>

                <button
                  type="button"
                  className={`w-full py-2.5 px-4 rounded-xl font-mono font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#0096C7] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Add-on Selected</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-[#0096C7]" />
                      <span>1-Click Activate</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Founding Locked-in Rate Guarantee Banner */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3 text-xs font-mono text-slate-700">
          <div className="p-2 rounded-xl bg-[#E0F2FE] text-[#0096C7] shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <p className="leading-relaxed">
            ℹ️ <strong className="text-slate-900">Price Guarantee:</strong> Pre-order prices and add-on rates are locked in for founding customers upon physical datacenter node provisioning.
          </p>
        </div>

      </div>
    </section>
  );
};
