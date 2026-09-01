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
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden font-sans border-b border-slate-200">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-lg space-y-8 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-[#0096C7] text-xs font-mono font-black uppercase tracking-wider shadow-sm">
                <Cloud className="w-4 h-4 text-[#0096C7]" />
                <span>Cloud Infrastructure Support Node</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Need Cloud Server Assistance?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed font-medium">
                Our Cloud Infrastructure team provides direct engineering support for pre-orders, Mumbai datacenter routing, custom term discounts, and Cashfree payments.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200 shrink-0 font-mono text-xs shadow-sm">
              <Clock className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Cloud Support Hours</div>
                <div className="font-extrabold text-slate-900 text-xs mt-0.5">{hours}</div>
              </div>
            </div>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            
            {/* Phone & WhatsApp Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#0096C7]/60 transition-all space-y-4 group shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-3.5 rounded-2xl bg-[#0096C7] text-white shadow-md shadow-[#0096C7]/20 group-hover:scale-105 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#0096C7] uppercase font-black tracking-wider">Direct Phone & WhatsApp</span>
                    <h3 className="text-xl font-mono font-black text-slate-900 mt-0.5">{displayPhone}</h3>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(phone, 'phone')}
                  className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                  title="Copy Phone Number"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-xs text-slate-600 font-medium">
                Direct hotline available <strong className="text-slate-900">9 AM to 5 PM IST</strong> for instant phone calls or WhatsApp chat.
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href={`tel:${phone}`}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-mono font-extrabold text-xs text-center transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Support</span>
                </a>
                <a
                  href={`https://wa.me/91${phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-extrabold text-xs text-center transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Email Support Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#0096C7]/60 transition-all space-y-4 group shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-3.5 rounded-2xl bg-slate-100 text-[#0096C7] border border-slate-200 shadow-sm group-hover:scale-105 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#0096C7] uppercase font-black tracking-wider">Official Email Desk</span>
                    <h3 className="text-lg font-mono font-black text-slate-900 mt-0.5">{email}</h3>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(email, 'email')}
                  className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                  title="Copy Email Address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-xs text-slate-600 font-medium">
                Submit technical tickets, enterprise queries, or billing invoice inquiries anytime.
              </div>

              <div className="pt-2">
                <a
                  href={`mailto:${email}`}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-mono font-extrabold text-xs text-center transition-all shadow-sm flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-[#0096C7]" />
                  <span>Email Support (support@kryonhost.com)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 ml-1" />
                </a>
              </div>
            </div>

          </div>

          {/* Cloud Security Guarantee Footer */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-sm relative z-10">
            <div className="flex items-center gap-2 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-[#0096C7]" />
              <span>Official KryonHost Cloud Engineering Support • SLA Guaranteed Resolution</span>
            </div>
            <span className="text-[#0096C7] font-bold">Average Response: Under 2 Hours</span>
          </div>

        </div>
      </div>
    </section>
  );
};
