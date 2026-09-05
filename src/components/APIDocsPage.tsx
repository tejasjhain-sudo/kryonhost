import React, { useState } from 'react';
import { ArrowLeft, Terminal, Key, Server, Gamepad2, Shield, Copy, Check } from 'lucide-react';

export const APIDocsPage: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const curlExample = `curl -X POST https://api.kryonhost.com/v1/vps \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "plan_id": "performance-16gb",
    "hostname": "prod-node-01",
    "os": "ubuntu-24-04",
    "location": "in-mumbai"
  }'`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <button
            onClick={onBackToHome}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to KryonHost Home</span>
          </button>

          <span className="text-xs font-mono text-slate-500">Developer REST API Reference</span>
        </div>

        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-mono font-bold text-amber-800">
            <Terminal className="w-3.5 h-3.5" />
            <span>KRYONHOST REST API V1</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">API Reference & Endpoints</h1>
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-2xl leading-relaxed">
            Automate infrastructure deployment, instance provisioning, power cycles, and DNS configuration through our programmatic REST endpoints.
          </p>
        </div>

        {/* Authentication Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm font-mono text-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-[#0096C7]" />
            <span>Authentication</span>
          </h2>
          <p className="text-slate-600 font-sans text-xs">
            Authenticate all API requests by including your secret API token in the <code className="text-[#0096C7] font-bold">Authorization</code> header as a Bearer token.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
            <code>Authorization: Bearer kh_live_sec_****************</code>
          </div>
        </div>

        {/* VPS Endpoints Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm font-mono text-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-600" />
            <span>VPS Provisioning & Power Endpoints</span>
          </h2>

          <div className="space-y-3">
            {[
              { method: 'POST', path: '/api/v1/vps', desc: 'Deploy a new KVM VPS instance (calls Shulker upstream engine)' },
              { method: 'GET', path: '/api/v1/vps/:id', desc: 'Retrieve details, static IP, and status of an instance' },
              { method: 'POST', path: '/api/v1/vps/:id/reboot', desc: 'Gracefully reboot virtual machine' },
              { method: 'POST', path: '/api/v1/vps/:id/reinstall', desc: 'Reinstall operating system image' },
              { method: 'DELETE', path: '/api/v1/vps/:id', desc: 'Destroy and deprovision VPS instance' },
            ].map((ep) => (
              <div key={ep.path} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                    ep.method === 'POST' ? 'bg-emerald-100 text-emerald-800' :
                    ep.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-bold text-slate-900">{ep.path}</span>
                </div>
                <span className="text-slate-500 text-[11px] font-sans">{ep.desc}</span>
              </div>
            ))}
          </div>

          {/* Quick cURL Example */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-slate-600">
              <span>Example Request:</span>
              <button
                onClick={() => copySnippet('curl', curlExample)}
                className="flex items-center gap-1 text-slate-700 hover:text-slate-900"
              >
                {copiedCode === 'curl' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy cURL</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 overflow-x-auto text-[11px] leading-relaxed">
              {curlExample}
            </pre>
          </div>
        </div>

        {/* Game Server Endpoints Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm font-mono text-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-emerald-600" />
            <span>Game Server Endpoints</span>
          </h2>

          <div className="space-y-3">
            {[
              { method: 'POST', path: '/api/v1/gameservers', desc: 'Provision dedicated game server' },
              { method: 'GET', path: '/api/v1/gameservers/:id', desc: 'Fetch server state, player count, and CPU telemetry' },
              { method: 'POST', path: '/api/v1/gameservers/:id/start', desc: 'Send start signal to game daemon' },
              { method: 'POST', path: '/api/v1/gameservers/:id/stop', desc: 'Send graceful shutdown command to game world' },
            ].map((ep) => (
              <div key={ep.path} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                    ep.method === 'POST' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-bold text-slate-900">{ep.path}</span>
                </div>
                <span className="text-slate-500 text-[11px] font-sans">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
