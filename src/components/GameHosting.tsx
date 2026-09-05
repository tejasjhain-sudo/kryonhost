import React, { useState } from 'react';
import { Gamepad2, Cpu, HardDrive, ShieldCheck, Server, ArrowRight, Check, Clock } from 'lucide-react';
import { KRYONHOST_CONFIG } from '../config/kryonhost.config';

interface GameHostingProps {
  onSelectGamePlan: (gameId: string, planDetails: any) => void;
}

export const GameHosting: React.FC<GameHostingProps> = ({ onSelectGamePlan }) => {
  // Minecraft Configurator State
  const [mcRam, setMcRam] = useState(8);
  const [mcSoftware, setMcSoftware] = useState('Paper');

  // Minecraft Pricing Calculation based on exact RAM
  const mcPriceMap: Record<number, number> = {
    4: 459,
    8: 871,
    12: 1254,
    16: 1549,
    24: 2249,
    32: 2949,
  };

  const currentMcPrice = mcPriceMap[mcRam] || 871;

  const handleDeployMinecraft = () => {
    onSelectGamePlan('minecraft', {
      gameName: 'Minecraft Server',
      ramGB: mcRam,
      software: mcSoftware,
      monthlyPriceINR: currentMcPrice,
    });
  };

  return (
    <section id="game-hosting" className="py-24 bg-white text-slate-900 font-sans border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-mono font-bold text-purple-700">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>LOW LATENCY INDIA GAMING</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Game Hosting
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            High-performance game servers, deployed in minutes.
          </p>
        </div>

        {/* Featured Minecraft Dedicated Section */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Minecraft Overview Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300">
                  <span>AVAILABLE NOW • INSTANT SETUP</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Minecraft Server Hosting
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Engineered for high TPS on modded and plugin-heavy communities. Powered by high single-core CPU clocks, DDR4/DDR5 ECC RAM, and enterprise NVMe storage.
                </p>
              </div>

              {/* Key Features List */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Always-On DDoS Shield</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Automated Backups</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sub-5ms Mumbai Latency</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Full SFTP File Access</span>
                </div>
              </div>
            </div>

            {/* Minecraft Configurator Card */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
              
              {/* RAM Selection */}
              <div className="space-y-2">
                <label className="flex justify-between text-xs font-mono font-bold text-slate-800">
                  <span>SELECT MEMORY ALLOCATION:</span>
                  <span className="text-purple-600">{mcRam} GB RAM</span>
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[4, 8, 12, 16, 24, 32].map((gb) => (
                    <button
                      key={gb}
                      onClick={() => setMcRam(gb)}
                      className={`py-2 px-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                        mcRam === gb
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {gb} GB
                    </button>
                  ))}
                </div>
              </div>

              {/* Server Software Dropdown */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-800">
                  SERVER SOFTWARE / CORE:
                </label>
                <select
                  value={mcSoftware}
                  onChange={(e) => setMcSoftware(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:border-purple-600 cursor-pointer"
                >
                  <option value="Paper">Paper (High Performance & Plugins)</option>
                  <option value="Purpur">Purpur (Optimized Fork of Paper)</option>
                  <option value="Spigot">Spigot (Classic Bukkit/Plugin Server)</option>
                  <option value="Vanilla">Vanilla (Official Mojang Release)</option>
                  <option value="Fabric">Fabric (Lightweight Modding Engine)</option>
                  <option value="Forge">Forge (Heavy Modpack Support)</option>
                </select>
              </div>

              {/* Price & Deploy Action */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Monthly Price</div>
                  <div className="text-2xl font-black font-mono text-slate-900">
                    ₹{currentMcPrice.toLocaleString('en-IN')}
                    <span className="text-xs text-slate-500 font-normal">/mo</span>
                  </div>
                </div>

                <button
                  onClick={handleDeployMinecraft}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Deploy Minecraft Server</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Other Supported Games Grid */}
        <div className="space-y-6">
          <div className="text-left space-y-1">
            <h3 className="text-xl font-black text-slate-900">Supported Game Titles</h3>
            <p className="text-xs font-mono text-slate-500">Additional game nodes rolling out to the fleet.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {KRYONHOST_CONFIG.games.filter(g => g.id !== 'minecraft').map((game) => (
              <div
                key={game.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-slate-300 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white border border-slate-200 text-slate-600">
                      {game.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{game.status}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">{game.name}</h4>
                    <p className="text-xs text-slate-600 mt-1 font-normal leading-relaxed">{game.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-1.5 text-[11px] font-mono text-slate-700">
                    {game.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-slate-400" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block">Starting at</span>
                    <span className="text-sm font-black font-mono text-slate-900">₹{game.startingPriceINR}/mo</span>
                  </div>

                  <button
                    disabled
                    className="px-3.5 py-1.5 rounded-lg bg-slate-200 text-slate-400 text-xs font-mono font-bold cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
