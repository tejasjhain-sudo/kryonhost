import React from 'react';
import { Logo } from './Logo';
import { KRYONHOST_CONFIG } from '../config/kryonhost.config';
import { MessageSquare, Twitter, Instagram, Github, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenPreOrder: () => void;
  onOpenLegal: (doc: 'terms' | 'privacy' | 'aup' | 'refund') => void;
  onOpenDocs: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPreOrder, onOpenLegal, onOpenDocs }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand & Slogan */}
          <div className="lg:col-span-2 space-y-3">
            <a href="#" className="inline-block">
              <Logo size="md" />
            </a>
            <p className="text-xs font-bold text-slate-900 tracking-wide">
              {KRYONHOST_CONFIG.brand.tagline}
            </p>
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
              {KRYONHOST_CONFIG.brand.subtext}
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-[11px] font-mono text-[#0096C7]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Pre-launch founding allocation active</span>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">Products</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#vps-plans" className="hover:text-slate-900 transition-colors">
                  Compute VPS
                </a>
              </li>
              <li>
                <a href="#vps-plans" className="hover:text-slate-900 transition-colors">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a href="#locations" className="hover:text-slate-900 transition-colors">
                  Datacenter Regions
                </a>
              </li>
              <li>
                <button onClick={onOpenPreOrder} className="text-[#0096C7] font-bold hover:underline">
                  Pre-Order VPS
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="hover:text-slate-900 transition-colors">
                  Architecture
                </a>
              </li>
              <li>
                <a href="#status" className="hover:text-slate-900 transition-colors">
                  System Status
                </a>
              </li>
              <li>
                <a
                  href={KRYONHOST_CONFIG.contact.discordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 transition-colors"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Docs */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">Legal & Policies</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenDocs} className="hover:text-slate-900 text-left">
                  Documentation
                </button>
              </li>
              <li>
                <a href="#faq" className="hover:text-slate-900 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-slate-900 text-left">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-slate-900 text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('aup')} className="hover:text-slate-900 text-left">
                  Acceptable Use Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('refund')} className="hover:text-slate-900 text-left">
                  Refund Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-mono">
            © 2026 KryonHost. All rights reserved.
          </div>

          <div className="flex items-center space-x-3">
            <a
              href={KRYONHOST_CONFIG.contact.discordUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Discord"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
            <a
              href={KRYONHOST_CONFIG.contact.twitterUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter X"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={KRYONHOST_CONFIG.contact.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={KRYONHOST_CONFIG.contact.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-[#E0F2FE] text-[#0096C7] hover:bg-[#0096C7] hover:text-white transition-colors ml-2"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
