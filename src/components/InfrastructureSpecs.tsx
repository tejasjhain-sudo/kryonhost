import React from 'react';
import { KRYONHOST_CONFIG } from '../config/kryonhost.config';
import { Server, CheckCircle2 } from 'lucide-react';

export const InfrastructureSpecs: React.FC = () => {
  const specs = KRYONHOST_CONFIG.infrastructureSpecs;

  return (
    <section id="infrastructure" className="py-20 bg-[#F1F5F9] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-semibold text-[#0096C7] mb-3">
            HARDWARE & NETWORK STANDARDS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Technical Infrastructure Specifications
          </h2>
          <p className="text-base text-slate-600">
            Direct insight into server hardware specifications. Parameters will update as physical hardware deployment is finalized.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl bg-white border border-slate-200 shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-[#0096C7]" />
              <span className="font-bold text-slate-900 text-sm">
                Bare-Metal Server Node Specifications
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              Pre-Launch Setup Active
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {specs.map((item) => (
              <div
                key={item.key}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {item.label}
                  </div>
                  <div className="text-base font-mono font-bold text-slate-900">{item.value}</div>
                </div>

                <div className="flex flex-col sm:items-end space-y-0.5">
                  {item.isFinalized ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed Standard
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0096C7]">
                      Final Hardware Allocation Pending
                    </span>
                  )}
                  <span className="text-xs text-slate-500">{item.notes}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>Primary Location: Delhi NCR Datacenter Facility</span>
            <span>Hypervisor: Hardware KVM</span>
          </div>
        </div>
      </div>
    </section>
  );
};
