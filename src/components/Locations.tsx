import React from 'react';
import { KRYONHOST_CONFIG, DatacenterLocation } from '../config/kryonhost.config';
import { MapPin, Globe, Server } from 'lucide-react';

export const Locations: React.FC = () => {
  const locations = KRYONHOST_CONFIG.locations;

  return (
    <section id="locations" className="py-20 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-semibold text-[#0096C7] mb-3">
            <Globe className="w-3.5 h-3.5" />
            PLANNED NETWORK REGIONS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Datacenter Locations
          </h2>
          <p className="text-base text-slate-600">
            We list only confirmed and actively prepared infrastructure locations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {locations.map((loc: DatacenterLocation) => (
            <div
              key={loc.id}
              className="rounded-2xl bg-white border border-slate-200 p-6 light-card-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{loc.flag}</span>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">{loc.country}</h3>
                      <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#0096C7]" />
                        {loc.city}
                      </div>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E0F2FE] text-[#0096C7] border border-[#0096C7]/30">
                    {loc.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">{loc.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Server className="w-3.5 h-3.5 text-[#0096C7]" /> Facility Readiness
                  </span>
                  <span className="text-[#0096C7] font-bold">
                    {loc.status === 'Launching Soon' ? 'Hardware Mounting' : 'Planned Region'}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full ${
                      loc.status === 'Launching Soon' ? 'w-3/4 bg-[#0096C7]' : 'w-1/4 bg-[#0096C7]/40'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
