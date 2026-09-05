import React, { useState } from 'react';
import { Network, Copy, Check, Radio, Activity } from 'lucide-react';

export const LatencyMatrix: React.FC = () => {
  const [copiedIP, setCopiedIP] = useState(false);

  const testIP = '103.186.20.1';

  const regions = [
    { city: 'Mumbai / Navi Mumbai', ping: '< 2 ms', status: 'Direct Fiber', isp: 'NIXI / ExtremeIX' },
    { city: 'Pune & Western MH', ping: '< 4 ms', status: 'Direct Peer', isp: 'TATA / Airtel' },
    { city: 'Delhi / NCR & North', ping: '< 12 ms', status: 'Sub-15ms', isp: 'Jio / Airtel' },
    { city: 'Bengaluru & Karnataka', ping: '< 15 ms', status: 'Sub-15ms', isp: 'TATA / NIXI' },
    { city: 'Hyderabad & Telangana', ping: '< 14 ms', status: 'Sub-15ms', isp: 'ExtremeIX' },
    { city: 'Chennai & Tamil Nadu', ping: '< 18 ms', status: 'Low Latency', isp: 'Airtel / Jio' },
    { city: 'Kolkata & East India', ping: '< 24 ms', status: 'Low Latency', isp: 'TATA / RailTel' },
    { city: 'Ahmedabad & Gujarat', ping: '< 7 ms', status: 'Direct Peer', isp: 'Jio / ExtremeIX' },
  ];

  const handleCopyIP = () => {
    navigator.clipboard.writeText(testIP);
    setCopiedIP(true);
    setTimeout(() => setCopiedIP(false), 2000);
  };

  return (
    <section className="py-20 bg-slate-50 text-slate-900 font-sans border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-mono font-bold text-[#0096C7] shadow-sm">
            <Radio className="w-3.5 h-3.5 text-[#0096C7] animate-pulse" />
            <span>INDIAN ISP LATENCY MATRIX</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
            Low Latency Across India
          </h2>
          <p className="text-base text-slate-600 font-normal">
            Direct NIXI & ExtremeIX peering delivers sub-15ms latency to over 80% of Indian internet users.
          </p>
        </div>

        {/* Looking Glass Test Box */}
        <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm font-mono text-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="text-slate-500">Test IP (Mumbai):</span>
            <span className="font-black text-slate-900">{testIP}</span>
          </div>

          <button
            onClick={handleCopyIP}
            className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 font-bold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copiedIP ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedIP ? 'Copied' : 'Copy Test IP'}</span>
          </button>
        </div>

        {/* Latency Table Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {regions.map((r) => (
            <div
              key={r.city}
              className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 hover:border-[#0096C7]/40 transition-all shadow-xs"
            >
              <div className="flex justify-between items-center text-slate-500 text-[10px]">
                <span>{r.status}</span>
                <span className="text-emerald-700 font-bold">{r.isp}</span>
              </div>
              <div className="font-heading font-bold text-slate-900 text-sm truncate">{r.city}</div>
              <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-500 text-[11px]">Avg Latency:</span>
                <span className="font-black text-emerald-600 text-base">{r.ping}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
