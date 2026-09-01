import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Terminal, ArrowRight, CheckCircle } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDoc: 'terms' | 'privacy' | 'aup' | 'refund';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, activeDoc }) => {
  const [currentTab, setCurrentTab] = useState<'terms' | 'privacy' | 'aup' | 'refund'>(activeDoc);

  React.useEffect(() => {
    setCurrentTab(activeDoc);
  }, [activeDoc]);

  if (!isOpen) return null;

  const docTitles = {
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    aup: 'Acceptable Use Policy (AUP)',
    refund: 'Refund & Cancellation Policy',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#E0F2FE] text-[#0096C7] border border-[#0096C7]/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">KryonHost Legal Policies</h3>
              <p className="text-xs text-slate-500 font-mono">Pre-Launch Services Agreement</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex flex-wrap gap-2 text-xs font-mono font-bold">
          {(['terms', 'privacy', 'aup', 'refund'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentTab === tab
                  ? 'bg-[#0096C7] text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {docTitles[tab]}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          {currentTab === 'terms' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">1. Service Agreement & Pre-Orders</h4>
              <p>
                By placing a pre-order on KryonHost (kryonhost.com), you acknowledge that KryonHost is operating in a pre-launch phase. Hardware provisioning will commence upon initial infrastructure node launch.
              </p>
              <h4 className="text-sm font-bold text-slate-900">2. Founding Customer Allocations</h4>
              <p>
                Qualifying founding customer pre-orders receive a permanent allocation of +4 GB RAM added to their selected VPS plan at launch at no extra charge.
              </p>
            </div>
          )}

          {currentTab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Privacy Standard</h4>
              <p>
                We collect minimal operational data (Name, Email, Discord Username, Country) necessary for pre-order processing and customer support. We never sell or distribute customer data.
              </p>
            </div>
          )}

          {currentTab === 'aup' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Acceptable Use Policy</h4>
              <p>
                Outbound network floods, malicious port scanning, spam, and illegal activities are strictly forbidden on KryonHost compute nodes.
              </p>
            </div>
          )}

          {currentTab === 'refund' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">100% Pre-Order Refund Guarantee</h4>
              <p>
                All pre-orders can be cancelled at any time prior to server provisioning for a 100% full refund.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 rounded-xl bg-[#0096C7] text-white font-bold text-xs">
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

export const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void; onOpenPreOrder: () => void }> = ({
  isOpen,
  onClose,
  onOpenPreOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-center space-y-5">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-900">
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0096C7] border border-[#0096C7]/20 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">Control Panel Login</h3>
          <p className="text-xs text-slate-600">
            The KryonHost Control Panel is currently in private pre-launch testing. Credentials will be issued to founding pre-order customers upon physical node provisioning.
          </p>
        </div>

        <div className="pt-2 flex flex-col space-y-2">
          <button
            onClick={() => {
              onClose();
              onOpenPreOrder();
            }}
            className="w-full py-2.5 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-extrabold text-xs shadow flex items-center justify-center gap-1.5"
          >
            <span>Pre-Order VPS to Secure Access</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const DocsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#E0F2FE] text-[#0096C7] border border-[#0096C7]/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">KryonHost Documentation</h3>
              <p className="text-xs text-slate-500 font-mono">Developer guides & API reference preview</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-600 font-mono">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs text-[#0096C7] font-bold">Quick Start Technical Guides</div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-slate-900">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> SSH Key Authentication & Hardening
              </li>
              <li className="flex items-center gap-2 text-slate-900">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> PTR Record & Reverse DNS Setup
              </li>
              <li className="flex items-center gap-2 text-slate-900">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Automated Snapshot & Backup Policy
              </li>
            </ul>
          </div>
          <p>Full API documentation will publish at node deployment launch.</p>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 rounded-xl bg-[#0096C7] text-white font-bold text-xs">
            Close Docs Preview
          </button>
        </div>
      </div>
    </div>
  );
};
