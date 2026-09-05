import React, { useState } from 'react';
import { Layers, Terminal, Server, Check, ArrowRight } from 'lucide-react';

export const OSCatalog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'os' | 'apps'>('os');

  const osList = [
    { name: 'Ubuntu 24.04 LTS', category: 'Linux', arch: 'x86_64', kernel: '6.8.0-generic', icon: '🐧', popular: true },
    { name: 'Debian 12 Bookworm', category: 'Linux', arch: 'x86_64', kernel: '6.1.0-lts', icon: '🌀', popular: true },
    { name: 'AlmaLinux 9.4', category: 'Enterprise', arch: 'x86_64', kernel: '5.14.0-el9', icon: '💎' },
    { name: 'Rocky Linux 9.4', category: 'Enterprise', arch: 'x86_64', kernel: '5.14.0-el9', icon: '⛰️' },
    { name: 'Arch Linux (Rolling)', category: 'Linux', arch: 'x86_64', kernel: '6.9.0-latest', icon: '🏹' },
    { name: 'Windows Server 2022', category: 'Windows', arch: 'x86_64', kernel: 'Build 20348', icon: '🪟' },
  ];

  const appList = [
    { name: 'Docker Engine + Compose', desc: 'Pre-configured container runtime with Docker CLI & Compose v2.', tag: 'Containers' },
    { name: 'Pterodactyl Panel', desc: 'Game server control panel for Minecraft, Rust, and Source games.', tag: 'Gaming' },
    { name: 'CyberPanel + OpenLiteSpeed', desc: 'Next-gen hosting control panel powered by OpenLiteSpeed cache.', tag: 'Web Hosting' },
    { name: 'cPanel & WHM', desc: 'Industry-standard web hosting management software suite.', tag: 'Web Hosting' },
    { name: 'LAMP / LEMP Stack', desc: 'Nginx / Apache, MySQL 8.0, and PHP 8.3 pre-installed.', tag: 'Web Stack' },
    { name: 'Node.js & PM2 Stack', desc: 'Node.js v20 LTS, Nginx reverse proxy, and PM2 process manager.', tag: 'Developer' },
  ];

  return (
    <section className="py-20 bg-slate-50 text-slate-900 font-sans border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-mono font-bold text-[#0096C7] shadow-sm">
            <Layers className="w-3.5 h-3.5" />
            <span>IMAGE & TEMPLATE CATALOG</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
            Supported OS & 1-Click Stacks
          </h2>
          <p className="text-base text-slate-600 font-normal">
            Automated image deployment in under 60 seconds with full root SSH access.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center">
          <div className="bg-slate-200 p-1 rounded-xl border border-slate-300 inline-flex font-mono text-xs">
            <button
              onClick={() => setActiveTab('os')}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'os' ? 'bg-white text-[#0096C7] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Operating Systems ({osList.length})
            </button>
            <button
              onClick={() => setActiveTab('apps')}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'apps' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1-Click App Images ({appList.length})
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {activeTab === 'os' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {osList.map((os) => (
              <div
                key={os.name}
                className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 hover:border-[#0096C7]/50 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="text-2xl">{os.icon}</div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[10px] font-bold text-slate-600 uppercase">
                    {os.category}
                  </span>
                </div>

                <div>
                  <div className="font-heading font-black text-slate-900 text-base group-hover:text-[#0096C7] transition-colors">
                    {os.name}
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                    Kernel: {os.kernel} ({os.arch})
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    60s Provisioning
                  </span>
                  <span>Root / Administrator</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appList.map((app) => (
              <div
                key={app.name}
                className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 hover:border-purple-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-purple-50 border border-purple-200 font-mono text-[10px] font-bold text-purple-700 uppercase">
                    {app.tag}
                  </span>
                  <Terminal className="w-4 h-4 text-purple-600" />
                </div>

                <div className="space-y-1">
                  <div className="font-heading font-black text-slate-900 text-base group-hover:text-purple-600 transition-colors">
                    {app.name}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {app.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span className="flex items-center gap-1 text-purple-600 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    Pre-Configured Stack
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
