import React from 'react';
import { KRYONHOST_CONFIG } from '../config/kryonhost.config';
import { Server, RefreshCw, Terminal, Activity, Archive, Network, CreditCard, LifeBuoy, ArrowUpCircle, CheckCircle2 } from 'lucide-react';

export const CustomerExperience: React.FC = () => {
  const iconList = [
    Server,
    RefreshCw,
    Terminal,
    Activity,
    Archive,
    Network,
    CreditCard,
    LifeBuoy,
    ArrowUpCircle,
  ];

  return (
    <section className="py-20 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-semibold text-[#0096C7] mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            SELF-SERVICE CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Everything You Need
          </h2>
          <p className="text-base text-slate-600">
            Complete self-service tools built right into the platform for effortless server orchestration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {KRYONHOST_CONFIG.customerCapabilities.map((item, index) => {
            const IconComponent = iconList[index % iconList.length];
            return (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#0096C7] transition-all flex items-start gap-4 light-card-shadow"
              >
                <div className="p-3 rounded-xl bg-[#E0F2FE] text-[#0096C7] border border-[#0096C7]/20 shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
