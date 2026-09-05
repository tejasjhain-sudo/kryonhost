import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Server, Gamepad2, ArrowRight, ExternalLink, Mail, Phone } from 'lucide-react';
import { KRYONHOST_CONFIG } from '../config/kryonhost.config';

interface FooterProps {
  onNavigate: (view: 'home' | 'checkout' | 'account' | 'status' | 'network' | 'docs' | 'api-docs') => void;
  onOpenLegal: (doc: 'terms' | 'privacy' | 'refund' | 'aup') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLegal }) => {
  const scrollTo = (id: string) => {
    onNavigate('home');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-slate-900 text-xs font-mono font-bold max-w-sm">
              Powerful Infrastructure. Built for What's Next.
            </p>
            <p className="text-slate-600 text-xs font-normal max-w-sm leading-relaxed">
              High-performance KVM VPS and low-latency game hosting without the enterprise price tag. Hosted in Tier IV Mumbai datacenter with direct NIXI peering.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-800 font-mono text-[11px] font-bold">
                Tier IV Mumbai Node Operational
              </span>
            </div>
          </div>

          {/* Products Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-900 tracking-wider">Products</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollTo('vps-hosting')}
                  className="hover:text-slate-900 hover:underline transition-colors cursor-pointer"
                >
                  VPS Hosting
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('game-hosting')}
                  className="hover:text-slate-900 hover:underline transition-colors cursor-pointer"
                >
                  Game Server Hosting
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('vps-hosting')}
                  className="hover:text-slate-900 hover:underline transition-colors cursor-pointer"
                >
                  Budget Compute
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('vps-hosting')}
                  className="hover:text-slate-900 hover:underline transition-colors cursor-pointer"
                >
                  Power Ryzen 7000 Tier
                </button>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-900 tracking-wider">Resources</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('docs')}
                  className="hover:text-slate-900 hover:underline transition-colors cursor-pointer"
                >
                  Documentation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('status')}
                  className="hover:text-slate-900 hover:underline transition-colors cursor-pointer"
                >
                  Status Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('api-docs')}
                  className="hover:text-slate-900 hover:underline transition-colors cursor-pointer"
                >
                  API Reference
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('network')}
                  className="hover:text-slate-900 hover:underline transition-colors cursor-pointer"
                >
                  Network & Ping Test
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-900 tracking-wider">Company & Legal</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-slate-900 hover:underline transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-slate-900 hover:underline transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('refund')}
                  className="hover:text-slate-900 hover:underline transition-colors cursor-pointer"
                >
                  Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('aup')}
                  className="hover:text-slate-900 hover:underline transition-colors cursor-pointer"
                >
                  Acceptable Use Policy
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] text-slate-500">
          <div>
            © 2026 KryonHost. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Support: support@kryonhost.com</span>
            <span>Tel: +91 8750287172</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
