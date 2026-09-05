import React, { useState } from 'react';
import { KRYONHOST_CONFIG } from '../config/kryonhost.config';
import { ChevronDown, ShieldCheck, HelpCircle } from 'lucide-react';

interface FAQProps {
  onOpenRefundPolicy: () => void;
}

export const FAQ: React.FC<FAQProps> = ({ onOpenRefundPolicy }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = KRYONHOST_CONFIG.faqs;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#070A0F] text-slate-100 font-sans border-b border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-[#0096C7]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>TRANSPARENT TECHNICAL ANSWERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-400 font-normal">
            Common questions regarding instance provisioning, KVM virtualization, billing cycles, and network routing.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl bg-[#0B0F17] border border-slate-800 overflow-hidden shadow-lg transition-colors hover:border-slate-700"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-200 text-sm sm:text-base hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <div className={`p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[#0096C7] transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#0096C7]/20 border-[#0096C7]/40' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs font-mono text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                    <p className="font-sans text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
                    {faq.question.toLowerCase().includes('refund') && (
                      <button
                        onClick={onOpenRefundPolicy}
                        className="mt-3 inline-flex items-center gap-1.5 text-[#0096C7] font-bold hover:underline cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>View Official Refund & Cancellation Terms</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
