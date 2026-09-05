import React from 'react';
import { ShieldCheck, Check, X, ArrowRight } from 'lucide-react';

interface ComparisonTableProps {
  onExplore: () => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ onExplore }) => {
  const comparisonRows = [
    {
      feature: 'Guaranteed KVM Compute',
      kryon: '100% Dedicated KVM',
      others: 'Shared Container / Oversubscribed',
    },
    {
      feature: 'Storage Performance',
      kryon: 'PCIe Gen5 NVMe (7,400 MB/s)',
      others: 'Standard SATA SSD / HDD (500 MB/s)',
    },
    {
      feature: 'Hidden Fees & Surcharges',
      kryon: 'Zero Hidden Charges ($0)',
      others: 'Expensive Egress & Setup Surcharges',
    },
    {
      feature: 'India Datacenter Facility',
      kryon: 'Tier IV Navi Mumbai',
      others: 'Generic Overseas / Unspecified Tier',
    },
    {
      feature: 'DDoS Scrubbing',
      kryon: 'Always-On Hardware Scrubbing',
      others: 'Extra Paid Addon ($20+/mo)',
    },
    {
      feature: 'Snapshot Backups',
      kryon: 'Included on Standard+',
      others: '20% Extra Monthly Charge',
    },
  ];

  return (
    <section className="py-24 bg-white text-slate-900 font-sans border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-700 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TRANSPARENT VALUE COMPARISON</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
            Why Developers Choose KryonHost
          </h2>
          <p className="text-base text-slate-600 font-normal">
            Clear comparison showing dedicated compute vs traditional legacy hosts.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-lg font-sans text-xs sm:text-sm">
          <div className="grid grid-cols-12 bg-slate-900 text-white p-4 font-mono font-bold text-xs uppercase tracking-wider">
            <div className="col-span-5 sm:col-span-4">Infrastructure Feature</div>
            <div className="col-span-4 sm:col-span-4 text-emerald-400 font-black">KryonHost Cloud</div>
            <div className="col-span-3 sm:col-span-4 text-slate-400">Legacy Hosts</div>
          </div>

          <div className="divide-y divide-slate-200">
            {comparisonRows.map((row) => (
              <div key={row.feature} className="grid grid-cols-12 p-4 items-center hover:bg-white transition-colors">
                <div className="col-span-5 sm:col-span-4 font-bold text-slate-900 font-sans">
                  {row.feature}
                </div>
                <div className="col-span-4 sm:col-span-4 font-mono font-bold text-emerald-700 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{row.kryon}</span>
                </div>
                <div className="col-span-3 sm:col-span-4 font-mono text-slate-500 flex items-center gap-1.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{row.others}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-white border-t border-slate-200 text-center space-y-3">
            <div className="font-mono text-xs text-slate-600">
              Ready to migrate to high-speed Indian KVM infrastructure?
            </div>
            <button
              onClick={onExplore}
              className="px-6 py-3 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-heading font-bold text-xs shadow-md inline-flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Explore KVM Plans from ₹379/mo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
