import React, { useState } from 'react';
import { Phone, Mail, Clock, Headphones, MessageSquare, ShieldCheck, Copy, Check, ExternalLink, Sparkles, Cloud, Server, Cpu } from 'lucide-react';

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
    <section className="py-16 sm:py-24 bg-[#080B12] relative overflow-hidden selection:bg-[#0096C7]/30 selection:text-blue-200">
      {/* Cloud Ambient Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#0096C7]/15 via-blue-600/10 to-[#38BDF8]/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-slate-950/80 border border-[#0096C7]/30 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-2xl space-y-8 relative overflow-hidden">
          
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0096C7]/15 border border-[#0096C7]/40 text-[#38BDF8] text-xs font-mono font-black uppercase tracking-wider shadow-sm">
                <Cloud className="w-4 h-4 text-[#38BDF8]" />
                <span>Cloud Infrastructure Support Node</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Need Cloud Server Assistance?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed font-medium">
                Our Cloud Infrastructure team provides direct engineering support for pre-orders, Mumbai datacenter routing, custom term discounts, and Cashfree payments.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-3 rounded-2xl border border-slate-800 shrink-0 font-mono text-xs shadow-md">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Cloud Support Hours</div>
                <div className="font-extrabold text-white text-xs mt-0.5">{hours}</div>
              </div>
            </div>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            
            {/* Phone & WhatsApp Card */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-[#0096C7]/60 transition-all space-y-4 group backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-3.5 rounded-2xl bg-[#0096C7] text-white shadow-lg shadow-[#0096C7]/20 group-hover:scale-105 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#38BDF8] uppercase font-black tracking-wider">Direct Phone & WhatsApp</span>
                    <h3 className="text-xl font-mono font-black text-white mt-0.5">{displayPhone}</h3>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(phone, 'phone')}
                  className="p-2.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Copy Phone Number"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-xs text-slate-400 font-medium">
                Direct hotline available <strong className="text-slate-200">9 AM to 5 PM IST</strong> for instant phone calls or WhatsApp chat.
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href={`tel:${phone}`}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-mono font-extrabold text-xs text-center transition-all shadow-lg shadow-[#0096C7]/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Cloud Team</span>
                </a>
                <a
                  href={`https://wa.me/91${phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-extrabold text-xs text-center transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Email Support Card */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-[#0096C7]/60 transition-all space-y-4 group backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-3.5 rounded-2xl bg-slate-800 text-[#38BDF8] border border-slate-700 shadow-lg group-hover:scale-105 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#38BDF8] uppercase font-black tracking-wider">Official Email Desk</span>
                    <h3 className="text-lg font-mono font-black text-white mt-0.5">{email}</h3>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(email, 'email')}
                  className="p-2.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Copy Email Address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-xs text-slate-400 font-medium">
                Submit technical tickets, enterprise queries, or billing invoice inquiries anytime.
              </div>

              <div className="pt-2">
                <a
                  href={`mailto:${email}`}
                  className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-extrabold text-xs text-center transition-all shadow-md flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Email Support Desk (support@kryonhost.com)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 ml-1" />
                </a>
              </div>
            </div>

          </div>

          {/* Cloud Security Guarantee Footer */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono relative z-10">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
              <span>Official KryonHost Cloud Engineering Support • SLA Guaranteed Resolution</span>
            </div>
            <span className="text-[#38BDF8] font-bold">Average Response: Under 2 Hours</span>
          </div>

        </div>
      </div>
    </section>
  );
};
