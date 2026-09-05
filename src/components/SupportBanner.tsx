import React, { useState } from 'react';
import { Phone, Mail, Clock, MessageSquare, ShieldCheck, Copy, Check, ExternalLink, Server } from 'lucide-react';

export const SupportBanner: React.FC = () => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const phone = '8750287172';
  const displayPhone = '+91 8750287172';
  const email = 'support@kryonhost.com';
  const hours = '9:00 AM – 5:00 PM IST (Mon – Sat)';

  const handleCopy = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <section id="contact-support" className="py-20 bg-[#070A0F] text-slate-100 relative overflow-hidden font-sans border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#0B0F17] border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[#0096C7] text-xs font-mono font-bold uppercase tracking-wider">
                <Server className="w-3.5 h-3.5" />
                <span>Dedicated Infrastructure Support</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Need Server Assistance?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed font-normal">
                Our infrastructure engineering desk provides direct support for VPS deployment, routing, reverse DNS (PTR), and billing inquiries.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-900 px-4 py-3 rounded-2xl border border-slate-800 shrink-0 font-mono text-xs">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Desk Hours</div>
                <div className="font-bold text-slate-200 text-xs mt-0.5">{hours}</div>
              </div>
            </div>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            
            {/* Phone & WhatsApp Card */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-[#0096C7]/60 transition-all space-y-4 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-xl bg-[#0096C7] text-white shadow-md shadow-[#0096C7]/20 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#0096C7] uppercase font-bold tracking-wider">Phone & WhatsApp Hotline</span>
                    <h3 className="text-xl font-mono font-black text-white mt-0.5">{displayPhone}</h3>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(phone, 'phone')}
                  className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Copy Phone Number"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-xs text-slate-400">
                Direct hotline available <strong className="text-slate-200">9 AM to 5 PM IST</strong> (Mon–Sat) for phone calls and WhatsApp chat.
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href={`tel:${phone}`}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-mono font-bold text-xs text-center transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Desk</span>
                </a>
                <a
                  href={`https://wa.me/91${phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs text-center transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Email Support Card */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-[#0096C7]/60 transition-all space-y-4 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-xl bg-slate-800 text-[#0096C7] border border-slate-700 shadow-sm group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#0096C7] uppercase font-bold tracking-wider">Official Email Desk</span>
                    <h3 className="text-lg font-mono font-black text-white mt-0.5">{email}</h3>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(email, 'email')}
                  className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Copy Email Address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-xs text-slate-400">
                Submit tickets for hardware provisioning, custom BGP sessions, or billing invoice inquiries anytime.
              </div>

              <div className="pt-2">
                <a
                  href={`mailto:${email}`}
                  className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs text-center transition-all flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-[#0096C7]" />
                  <span>Send Email (support@kryonhost.com)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 ml-1" />
                </a>
              </div>
            </div>

          </div>

          {/* SLA Footer */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono relative z-10">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official KryonHost Engineering Support • Dedicated Hardware Monitoring</span>
            </div>
            <span className="text-[#0096C7] font-bold">Average Response: Under 2 Hours</span>
          </div>

        </div>
      </div>
    </section>
  );
};
