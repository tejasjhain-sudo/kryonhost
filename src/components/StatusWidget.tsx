import React from 'react';
import { KRYONHOST_CONFIG, SystemStatusItem } from '../config/kryonhost.config';
import { Activity, Clock, ExternalLink } from 'lucide-react';

export const StatusWidget: React.FC = () => {
  const statusItems = KRYONHOST_CONFIG.statusItems;

  const getStateBadge = (state: 'green' | 'yellow' | 'gray') => {
    switch (state) {
      case 'green':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Operational
          </span>
        );
      case 'yellow':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Preparing
          </span>
        );
      case 'gray':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Coming Soon
          </span>
        );
    }
  };

  return (
    <section id="status" className="py-16 bg-[#F1F5F9] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-2xl bg-white border border-slate-200 p-6 light-card-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#E0F2FE] text-[#0096C7] border border-[#0096C7]/20">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">KryonHost Infrastructure Status</h3>
                <p className="text-xs text-slate-500">Operational health & pre-launch readiness</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <Clock className="w-3.5 h-3.5 text-[#0096C7]" />
              Real-time update active
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {statusItems.map((item: SystemStatusItem) => (
              <div
                key={item.name}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{item.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{item.detail}</div>
                </div>
                <div>{getStateBadge(item.state)}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Pre-launch services operating within expected parameters.</span>
            <span className="text-[#0096C7] hover:underline flex items-center gap-1 cursor-pointer">
              Status API <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
