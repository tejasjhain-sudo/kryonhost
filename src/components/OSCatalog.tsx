import React, { useState } from 'react';
import { Layers, Terminal, Check, Sparkles } from 'lucide-react';

export const OSCatalog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'os' | 'apps'>('os');

  const osList = [
    {
      name: 'Ubuntu 24.04 LTS',
      category: 'Linux',
      arch: 'x86_64',
      kernel: '6.8.0-generic',
      badge: 'Recommended',
      icon: (
        <svg className="w-9 h-9 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#E95420" />
          <circle cx="12" cy="6.2" r="1.6" fill="#FFF" />
          <circle cx="7" cy="14.8" r="1.6" fill="#FFF" />
          <circle cx="17" cy="14.8" r="1.6" fill="#FFF" />
          <path d="M12 8.5A3.5 3.5 0 1 0 15.5 12" stroke="#FFF" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      )
    },
    {
      name: 'Debian 12 Bookworm',
      category: 'Linux',
      arch: 'x86_64',
      kernel: '6.1.0-lts',
      badge: 'Popular',
      icon: (
        <svg className="w-9 h-9 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#A80030" />
          <path d="M12 6c-3.2 0-5.8 2.3-5.8 5.2 0 2.6 2 4.3 4.3 4.3 1.4 0 2.3-.9 2.3-1.8 0-.8-.6-1.4-1.4-1.4-.5 0-.9.2-.9.5" stroke="#FFF" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )
    },
    {
      name: 'AlmaLinux 9.4',
      category: 'Enterprise',
      arch: 'x86_64',
      kernel: '5.14.0-el9',
      icon: (
        <svg className="w-9 h-9 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#004F9F" />
          <path d="M12 5.5L16.5 10L12 14.5L7.5 10L12 5.5Z" fill="#00A4E4" />
          <path d="M12 9.5L14.5 12L12 14.5L9.5 12L12 9.5Z" fill="#FFF" />
          <path d="M12 14.5L16.5 19L12 17.5L7.5 19L12 14.5Z" fill="#38BDF8" />
        </svg>
      )
    },
    {
      name: 'Rocky Linux 9.4',
      category: 'Enterprise',
      arch: 'x86_64',
      kernel: '5.14.0-el9',
      icon: (
        <svg className="w-9 h-9 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#10B981" />
          <path d="M6.5 16.5L10 9L12.5 13L15 9.5L17.5 16.5H6.5Z" fill="#FFF" />
        </svg>
      )
    },
    {
      name: 'Arch Linux (Rolling)',
      category: 'Linux',
      arch: 'x86_64',
      kernel: '6.9.0-latest',
      icon: (
        <svg className="w-9 h-9 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#1793D1" />
          <path d="M12 5.5L6 17.5H8.3L9.7 14.7C10.6 15.2 11.4 15.4 12 15.4C12.6 15.4 13.4 15.2 14.3 14.7L15.7 17.5H18L12 5.5ZM12 10.8L13.7 14.2C13.2 14.4 12.6 14.5 12 14.5C11.4 14.5 10.8 14.4 10.3 14.2L12 10.8Z" fill="#FFF" />
        </svg>
      )
    },
    {
      name: 'Windows Server 2022',
      category: 'Windows',
      arch: 'x86_64',
      kernel: 'Build 20348',
      icon: (
        <svg className="w-9 h-9 shrink-0" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="6" fill="#0078D4" />
          <path d="M4.5 6.5L11 5.6V11.5H4.5V6.5ZM4.5 17.5L11 18.4V12.5H4.5V17.5ZM19.5 4.5L12 5.5V11.5H19.5V4.5ZM19.5 19.5L12 18.5V12.5H19.5V19.5Z" fill="#FFF" />
        </svg>
      )
    },
  ];

  const appList = [
    {
      name: 'Docker Engine + Compose',
      desc: 'Pre-configured container runtime with Docker CLI & Compose v2.',
      tag: 'Containers',
      icon: (
        <svg className="w-9 h-9 shrink-0" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="6" fill="#1D63ED" />
          <path d="M5 13.5H7V15.5H5V13.5ZM8 13.5H10V15.5H8V13.5ZM11 13.5H13V15.5H11V13.5ZM14 13.5H16V15.5H14V13.5ZM8 11H10V13H8V11ZM11 11H13V13H11V11ZM14 11H16V13H14V11ZM11 8.5H13V10.5H11V8.5Z" fill="#FFF" />
          <path d="M3.5 16.5C4.5 18.5 7.5 19.5 12 19.5C16.5 19.5 19.5 18.5 20.5 16.5C21 15.5 20.5 14.5 19 14C18.5 15 17 15.5 15.5 15.5H8.5C7 15.5 5.5 15 5 14C3.5 14.5 3 15.5 3.5 16.5Z" fill="#FFF" />
        </svg>
      )
    },
    {
      name: 'Pterodactyl Panel',
      desc: 'Game server control panel for Minecraft, Rust, and Source games.',
      tag: 'Gaming',
      icon: (
        <svg className="w-9 h-9 shrink-0" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="6" fill="#10B981" />
          <path d="M12 5L17.5 15.5H6.5L12 5Z" stroke="#FFF" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
          <path d="M9.5 11.5L12 15.5L14.5 11.5" stroke="#FFF" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      name: 'CyberPanel + OpenLiteSpeed',
      desc: 'Next-gen hosting control panel powered by OpenLiteSpeed cache.',
      tag: 'Web Hosting',
      icon: (
        <svg className="w-9 h-9 shrink-0" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="6" fill="#7C3AED" />
          <path d="M13 5L6 14H12L11 19L18 10H12L13 5Z" fill="#FFF" />
        </svg>
      )
    },
    {
      name: 'cPanel & WHM',
      desc: 'Industry-standard web hosting management software suite.',
      tag: 'Web Hosting',
      icon: (
        <svg className="w-9 h-9 shrink-0" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="6" fill="#FF6C2C" />
          <circle cx="12" cy="12" r="5" stroke="#FFF" strokeWidth="2.2" />
          <circle cx="12" cy="12" r="2" fill="#FFF" />
        </svg>
      )
    },
    {
      name: 'LAMP / LEMP Stack',
      desc: 'Nginx / Apache, MySQL 8.0, and PHP 8.3 pre-installed.',
      tag: 'Web Stack',
      icon: (
        <svg className="w-9 h-9 shrink-0" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="6" fill="#0096C7" />
          <path d="M7 8H17M7 12H17M7 16H13" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      name: 'Node.js & PM2 Stack',
      desc: 'Node.js v20 LTS, Nginx reverse proxy, and PM2 process manager.',
      tag: 'Developer',
      icon: (
        <svg className="w-9 h-9 shrink-0" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="6" fill="#5FA04E" />
          <path d="M12 5.5L17.5 8.75V15.25L12 18.5L6.5 15.25V8.75L12 5.5Z" stroke="#FFF" strokeWidth="1.8" fill="none" />
          <path d="M12 9L15 10.5V13.5L12 15L9 13.5V10.5L12 9Z" fill="#FFF" />
        </svg>
      )
    },
  ];

  return (
    <section className="py-24 bg-[#F8FAFC] text-slate-900 font-sans border-b border-slate-200/90 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-mono font-bold text-[#0096C7]">
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

        {/* Tab Selector */}
        <div className="flex justify-center">
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 inline-flex font-mono text-xs shadow-sm">
            <button
              onClick={() => setActiveTab('os')}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'os'
                  ? 'bg-[#0096C7] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Operating Systems ({osList.length})
            </button>
            <button
              onClick={() => setActiveTab('apps')}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'apps'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              1-Click App Images ({appList.length})
            </button>
          </div>
        </div>

        {/* OS Grid */}
        {activeTab === 'os' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {osList.map((os) => (
              <div
                key={os.name}
                className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 hover:border-[#0096C7] hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between">
                  {os.icon}
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {os.badge && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {os.badge}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-mono text-[10px] font-bold text-slate-600 uppercase">
                      {os.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <h3 className="font-heading font-black text-slate-900 text-lg group-hover:text-[#0096C7] transition-colors">
                    {os.name}
                  </h3>
                  <div className="font-mono text-xs text-slate-500">
                    Kernel: {os.kernel} ({os.arch})
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                    <Check className="w-4 h-4" />
                    60s Provisioning
                  </span>
                  <span className="text-slate-500">Root / Administrator</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {appList.map((app) => (
              <div
                key={app.name}
                className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 hover:border-purple-400 hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between">
                  {app.icon}
                  <span className="px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200 font-mono text-[10px] font-bold text-purple-700 uppercase">
                    {app.tag}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-heading font-black text-slate-900 text-lg group-hover:text-purple-600 transition-colors">
                    {app.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {app.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-purple-600 font-bold">
                    <Check className="w-4 h-4" />
                    Pre-Configured Stack
                  </span>
                  <Terminal className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};


