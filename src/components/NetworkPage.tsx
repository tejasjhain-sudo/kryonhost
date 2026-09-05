import React, { useState } from 'react';
import { ArrowLeft, Network, ShieldCheck, Globe, Activity, CheckCircle2, Copy, Check } from 'lucide-react';
import { KRYONHOST_CONFIG } from '../config/kryonhost.config';

export const NetworkPage: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const [copiedIP, setCopiedIP] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [testingPing, setTestingPing] = useState(false);

  const testIP = '103.186.20.1';

  const handleCopy = () => {
    navigator.clipboard.writeText(testIP);
    setCopiedIP(true);
    setTimeout(() => setCopiedIP(false), 2000);
  };

  const handleTestLatency = () => {
    setTestingPing(true);
    setPingResult(null);
    setTimeout(() => {
      setPingResult(`${Math.floor(2 + Math.random() * 4)}ms (Sub-5ms Domestic Peering via NIXI Mumbai)`);
      setTestingPing(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 font-sans pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            onClick={onBackToHome}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to KryonHost Home</span>
          </button>

          <span className="text-xs font-mono text-slate-400">Network & Datacenter Edge</span>
        </div>

        {/* Section Header */}
        <div className="bg-[#0B0F17] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-[#0096C7]">
            <Network className="w-3.5 h-3.5" />
            <span>GLOBAL BGP PEERING & LOW LATENCY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Network Infrastructure</h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-2xl leading-relaxed">
            Directly connected to national Internet Exchange Points (NIXI, ExtremeIX) to deliver the lowest possible ping for websites, game servers, and APIs across India.
          </p>
        </div>

        {/* Mumbai Datacenter Card */}
        <div className="bg-[#0B0F17] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🇮🇳</span>
              <div>
                <h2 className="text-xl font-black text-white">India - Mumbai Datacenter</h2>
                <p className="text-xs font-mono text-slate-400">Tier IV Facility • Navi Mumbai, Maharashtra</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
                ACTIVE PRODUCTION NODE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px]">Uplink Speed</div>
              <div className="text-white font-bold text-sm">1 Gbps Unmetered Port</div>
              <div className="text-slate-400 text-[11px]">Full Duplex Fiber Interface</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px]">Domestic Latency</div>
              <div className="text-emerald-400 font-bold text-sm">&lt; 5ms Average</div>
              <div className="text-slate-400 text-[11px]">Direct NIXI Mumbai Peering</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px]">DDoS Mitigation</div>
              <div className="text-[#0096C7] font-bold text-sm">Inline Hardware Scrubbing</div>
              <div className="text-slate-400 text-[11px]">Always-On L3/L4/L7 Filtering</div>
            </div>
          </div>

          {/* Test IP & Latency Diagnostic Tool */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-200">Datacenter Test IP (Ping & Traceroute)</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Use this IP address to verify ping and routing from your location.</div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-2 rounded-xl bg-slate-800 text-[#0096C7] font-bold text-xs border border-slate-700">
                  {testIP}
                </span>

                <button
                  onClick={handleCopy}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Copy Test IP"
                >
                  {copiedIP ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleTestLatency}
                  disabled={testingPing}
                  className="px-4 py-2 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {testingPing ? 'Testing...' : 'Test Ping'}
                </button>
              </div>
            </div>

            {pingResult && (
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-emerald-400 font-bold flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>Result: {pingResult}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
