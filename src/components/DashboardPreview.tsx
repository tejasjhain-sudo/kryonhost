import React, { useState } from 'react';
import { Play, Square, RotateCw, Terminal, HardDrive, RefreshCw, Archive, Settings, LayoutDashboard, Cpu, Network, Shield, AlertCircle } from 'lucide-react';

export const DashboardPreview: React.FC = () => {
  const [vpsState, setVpsState] = useState<'Online' | 'Offline' | 'Restarting'>('Online');

  const handleAction = (action: string) => {
    if (action === 'Stop') {
      setVpsState('Offline');
    } else if (action === 'Start') {
      setVpsState('Online');
    } else if (action === 'Restart') {
      setHeroState('Restarting');
    }
  };

  const setHeroState = (s: 'Online' | 'Offline' | 'Restarting') => {
    setVpsState(s);
    if (s === 'Restarting') setTimeout(() => setVpsState('Online'), 1500);
  };

  return (
    <section id="control-panel" className="py-20 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-semibold text-[#0096C7] mb-3">
            <LayoutDashboard className="w-3.5 h-3.5" />
            KryonHost Control Panel — Coming Soon
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Control Panel Preview
          </h2>
          <p className="text-base text-slate-600">
            Preview the custom instance management dashboard for power actions, telemetry monitoring, and backups.
          </p>
        </div>

        <div className="max-w-5xl mx-auto rounded-2xl bg-white border border-slate-200 light-card-shadow overflow-hidden">
          <div className="px-6 py-4 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white text-[#0096C7] font-mono font-bold text-xs border border-slate-200">
                KRY-1001
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  ubuntu-24.04-lts-node01
                  <span className="text-xs text-slate-500 font-mono font-normal">(103.189.x.x)</span>
                </h3>
                <div className="text-xs text-slate-500 font-mono">Delhi NCR • 4 vCPU / 8 GB RAM / 100 GB NVMe</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-mono">
              <span className="text-slate-500">STATUS:</span>
              {vpsState === 'Online' && (
                <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Running
                </span>
              )}
              {vpsState === 'Offline' && (
                <span className="text-rose-600 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Stopped
                </span>
              )}
              {vpsState === 'Restarting' && (
                <span className="text-amber-600 font-bold flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Rebooting...
                </span>
              )}
            </div>
          </div>

          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAction('Start')}
                disabled={vpsState === 'Online'}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1.5 disabled:opacity-40"
              >
                <Play className="w-3.5 h-3.5 fill-emerald-600" /> Start
              </button>
              <button
                onClick={() => handleAction('Stop')}
                disabled={vpsState === 'Offline'}
                className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold flex items-center gap-1.5 disabled:opacity-40"
              >
                <Square className="w-3.5 h-3.5 fill-rose-600" /> Stop
              </button>
              <button
                onClick={() => handleAction('Restart')}
                className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold flex items-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" /> Restart
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-white text-slate-800 border border-slate-200 font-semibold flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-[#0096C7]" /> Console VNC
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-white text-slate-800 border border-slate-200 font-semibold flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 text-[#0096C7]" /> Reinstall
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-white text-slate-800 border border-slate-200 font-semibold flex items-center gap-1">
                <Archive className="w-3.5 h-3.5 text-[#0096C7]" /> Backups
              </button>
              <button className="px-3.5 py-1.5 rounded-lg bg-[#0096C7] text-white font-extrabold flex items-center gap-1">
                <Settings className="w-3.5 h-3.5" /> Manage
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                  <span>CPU LOAD</span>
                  <span className="text-slate-900 font-bold">{vpsState === 'Online' ? '12.4%' : '0.0%'}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-[#0096C7]" style={{ width: vpsState === 'Online' ? '12.4%' : '0%' }} />
                </div>
                <div className="mt-2 text-[10px] text-slate-500">4 vCPU Cores</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                  <span>MEMORY (RAM)</span>
                  <span className="text-slate-900 font-bold">{vpsState === 'Online' ? '2.8 / 12 GB' : '0 / 12 GB'}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-[#0096C7]" style={{ width: vpsState === 'Online' ? '23%' : '0%' }} />
                </div>
                <div className="mt-2 text-[10px] text-[#0096C7] font-bold">+4 GB Founding Bonus</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                  <span>STORAGE NVME</span>
                  <span className="text-slate-900 font-bold">18.2 / 100 GB</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-[#0096C7] w-[18.2%]" />
                </div>
                <div className="mt-2 text-[10px] text-slate-500">Enterprise RAID Array</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                  <span>BANDWIDTH</span>
                  <span className="text-slate-900 font-bold">{vpsState === 'Online' ? '4.2 Mb/s' : '0 Mb/s'}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: vpsState === 'Online' ? '15%' : '0%' }} />
                </div>
                <div className="mt-2 text-[10px] text-slate-500">1 Gbps Uplink</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-mono flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#0096C7] shrink-0" />
              <span>Control panel preview. API controls activate upon pre-order infrastructure launch.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
