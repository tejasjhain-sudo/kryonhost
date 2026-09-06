import React, { useState } from 'react';
import { Radio, Copy, Check, Activity } from 'lucide-react';

export const LatencyMatrix: React.FC = () => {
  const [copiedIP, setCopiedIP] = useState(false);

  const testIP = '103.186.20.1';

  const regions = [
    { city: 'Mumbai / Navi Mumbai', ping: '< 2 ms', status: 'Direct Fiber', isp: 'NIXI / ExtremeIX', quality: 'excellent' },
    { city: 'Pune & Western MH', ping: '< 4 ms', status: 'Direct Peer', isp: 'TATA / Airtel', quality: 'excellent' },
    { city: 'Delhi / NCR & North', ping: '< 12 ms', status: 'Sub-15ms', isp: 'Jio / Airtel', quality: 'good' },
    { city: 'Bengaluru & Karnataka', ping: '< 15 ms', status: 'Sub-15ms', isp: 'TATA / NIXI', quality: 'good' },
    { city: 'Hyderabad & Telangana', ping: '< 14 ms', status: 'Sub-15ms', isp: 'ExtremeIX', quality: 'good' },
    { city: 'Chennai & Tamil Nadu', ping: '< 18 ms', status: 'Low Latency', isp: 'Airtel / Jio', quality: 'moderate' },
    { city: 'Kolkata & East India', ping: '< 24 ms', status: 'Low Latency', isp: 'TATA / RailTel', quality: 'moderate' },
    { city: 'Ahmedabad & Gujarat', ping: '< 7 ms', status: 'Direct Peer', isp: 'Jio / ExtremeIX', quality: 'excellent' },
  ];

  const qualityColor: Record<string, string> = {
    excellent: '#34D399',
    good: '#60A5FA',
    moderate: '#FBBF24',
  };

  const handleCopyIP = () => {
    navigator.clipboard.writeText(testIP);
    setCopiedIP(true);
    setTimeout(() => setCopiedIP(false), 2000);
  };

  return (
    <section className="py-24 bg-[#070A0F] text-white font-sans border-b border-slate-800/80 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-[#0096C7]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>INDIAN ISP LATENCY MATRIX</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight">
            Low Latency Across India
          </h2>
          <p className="text-base text-slate-400 font-normal">
            Direct NIXI & ExtremeIX peering delivers sub-15ms latency to over 80% of Indian internet users.
          </p>
        </div>

        {/* Test IP Box */}
        <div className="max-w-xl mx-auto bg-[#0B0F17] border border-slate-700 rounded-2xl p-4 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-slate-400">Test IP (Mumbai):</span>
            <span className="font-black text-white text-sm">{testIP}</span>
          </div>
          <button
            onClick={handleCopyIP}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copiedIP ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedIP ? 'Copied' : 'Copy Test IP'}</span>
          </button>
        </div>

        {/* Latency Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {regions.map((r) => (
            <div
              key={r.city}
              className="p-5 rounded-2xl bg-[#0B0F17] border border-slate-800 space-y-3 hover:border-slate-600 transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${qualityColor[r.quality]}50, transparent)` }} />

              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">{r.status}</span>
                <span className="font-bold" style={{ color: qualityColor[r.quality] }}>{r.isp}</span>
              </div>

              <div className="font-heading font-bold text-white text-sm">{r.city}</div>

              <div className="flex items-baseline justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-600 text-[10px]">Avg Latency:</span>
                <span className="font-black text-lg" style={{ color: qualityColor[r.quality] }}>{r.ping}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};


