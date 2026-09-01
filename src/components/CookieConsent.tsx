import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Check, X, Lock } from 'lucide-react';

interface CookieConsentProps {
  onOpenPrivacy: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ onOpenPrivacy }) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('kryonhost_cookie_consent');
    if (!consent) {
      // Delay slightly for smooth entrance
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('kryonhost_cookie_consent', 'accepted_all');
    setShowBanner(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('kryonhost_cookie_consent', 'essential_only');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300 font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4 relative overflow-hidden text-slate-900">
        
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0096C7] via-blue-600 to-indigo-600" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#E0F2FE] text-[#0096C7] shrink-0">
              <Cookie className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 font-mono flex items-center gap-1.5">
                Cookie & Privacy Consent
              </h3>
              <span className="text-[10px] text-slate-500 font-mono font-bold">KryonHost Infrastructure</span>
            </div>
          </div>

          <button
            onClick={handleEssentialOnly}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          We use essential cookies and Vercel telemetry analytics to enhance your experience and secure your pre-order sessions on our Mumbai VPS cloud infrastructure.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <button
            onClick={handleAcceptAll}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-mono font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Accept All</span>
          </button>

          <button
            onClick={handleEssentialOnly}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
          >
            Essential Only
          </button>
        </div>

        <div className="text-[10px] text-slate-400 font-mono text-center pt-1 border-t border-slate-100 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>GDPR & Privacy Compliant • </span>
          <button
            onClick={onOpenPrivacy}
            className="text-[#0096C7] underline font-bold hover:text-[#0284C7]"
          >
            Privacy Policy
          </button>
        </div>

      </div>
    </div>
  );
};
