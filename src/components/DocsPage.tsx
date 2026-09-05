import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Server, Gamepad2, Network, CreditCard, Terminal, HelpCircle, ChevronRight } from 'lucide-react';

export const DocsPage: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const docs = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Getting Started with KryonHost</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Welcome to KryonHost. Our platform allows developers, gamers, and businesses to deploy high-performance KVM VPS instances and game servers in minutes.
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="text-[#0096C7] font-bold">1. Select your VPS tier (Budget, Standard, Performance, or Power)</div>
            <div className="text-slate-400">2. Configure your hostname and choose your Linux OS distribution</div>
            <div className="text-slate-400">3. Settle payment securely through Cashfree (UPI or Cards)</div>
            <div className="text-emerald-400">4. Receive instant IPv4 address, credentials, and white-label panel access</div>
          </div>
        </div>
      ),
    },
    {
      id: 'vps',
      title: 'VPS Management & SSH',
      icon: Server,
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Connecting to Your VPS via SSH</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Once your instance is provisioned, you have full root access to your virtual machine via standard SSH clients (Terminal, PuTTY, OpenSSH).
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200">
            <span className="text-slate-500"># Connect using your assigned static IPv4</span><br />
            <span className="text-emerald-400">ssh root@YOUR_SERVER_IP</span>
          </div>
          <p className="text-sm text-slate-400">
            Power cycles, OS reinstalls, and VNC rescue console access are available through the white-label control panel.
          </p>
        </div>
      ),
    },
    {
      id: 'minecraft',
      title: 'Minecraft & Game Servers',
      icon: Gamepad2,
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Minecraft Server Setup</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            KryonHost supports Paper, Purpur, Spigot, Vanilla, Fabric, and Forge. Servers run with Java 21 LTS pre-configured and automatic JVM GC flags.
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono text-xs text-slate-400">
            <div>• SFTP Access: Enabled on standard port 22</div>
            <div>• Sub-5ms Mumbai Ping for low-latency player combat</div>
            <div>• Automatic world save backups every 24 hours</div>
          </div>
        </div>
      ),
    },
    {
      id: 'networking',
      title: 'Networking & Firewalls',
      icon: Network,
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Network Configuration & Security</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Every VPS includes 1 dedicated clean IPv4 address routed through our Mumbai edge routers with automated inline DDoS filtering.
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono text-xs text-slate-400">
            <div>• Port 22 (SSH) open by default</div>
            <div>• Ports 80 / 443 open for web traffic (Nginx, Apache, Caddy)</div>
            <div>• Hardware DDoS scrubbing enabled automatically for all UDP/TCP volume attacks</div>
          </div>
        </div>
      ),
    },
    {
      id: 'billing',
      title: 'Billing & Invoices',
      icon: CreditCard,
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Billing Terms & Renewals</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Services can be billed monthly or quarterly (with an automatic 15% discount). Renewal invoices are issued 7 days before service expiration.
          </p>
        </div>
      ),
    },
  ];

  const currentDoc = docs.find(d => d.id === activeSection) || docs[0];

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 font-sans pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            onClick={onBackToHome}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to KryonHost Home</span>
          </button>

          <span className="text-xs font-mono text-slate-400">Technical Knowledge Base</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Docs Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="bg-[#0B0F17] border border-slate-800 rounded-2xl p-3 space-y-1 font-mono text-xs">
              {docs.map((d) => {
                const Icon = d.icon;
                const isActive = activeSection === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setActiveSection(d.id)}
                    className={`w-full p-2.5 rounded-xl transition-all flex items-center justify-between text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#0096C7] text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{d.title}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Docs Content (8 cols) */}
          <div className="lg:col-span-8">
            <div className="bg-[#0B0F17] border border-slate-800 rounded-3xl p-8 shadow-xl">
              {currentDoc.content}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
