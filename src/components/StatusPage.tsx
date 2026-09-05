import React from 'react';
import { ArrowLeft, CheckCircle2, AlertTriangle, Activity, Clock, ShieldCheck, Server } from 'lucide-react';
import { KRYONHOST_CONFIG } from '../config/kryonhost.config';

export const StatusPage: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 font-sans pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            onClick={onBackToHome}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to KryonHost Home</span>
          </button>

          <span className="text-xs font-mono text-slate-400">Live Status Telemetry</span>
        </div>

        {/* Status Overall Banner */}
        <div className="bg-[#0B0F17] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ALL SYSTEMS OPERATIONAL</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">System & Infrastructure Status</h1>
              <p className="text-xs sm:text-sm text-slate-400 font-sans">
                Real-time operational health of KryonHost compute nodes, control panel, network edge, and payment systems.
              </p>
            </div>
          </div>
        </div>

        {/* Components Grid */}
        <div className="bg-[#0B0F17] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl font-mono text-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
            Infrastructure Components
          </h2>

          <div className="space-y-3">
            {KRYONHOST_CONFIG.statusItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="font-bold text-slate-200 text-xs flex items-center gap-2">
                    <span>{item.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.detail}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-emerald-400">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Log */}
        <div className="bg-[#0B0F17] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl font-mono text-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
            Recent Maintenance & Incident Log
          </h2>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-slate-400">
            <div className="font-bold text-slate-200">Routine Kernel & Security Patching</div>
            <div className="text-[11px] text-slate-500">Completed with zero downtime via live KVM migration.</div>
          </div>
        </div>

      </div>
    </div>
  );
};
