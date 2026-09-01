import React, { useState } from 'react';
import { KRYONHOST_CONFIG } from '../config/kryonhost.config';
import { ChevronDown, ShieldCheck } from 'lucide-react';

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
    <section id="faq" className="py-20 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-semibold text-[#0096C7] mb-3">
            CLEAR TECHNICAL ANSWERS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600">
            Everything you need to know about KryonHost pre-orders, server specs, and founding customer benefits.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden light-card-shadow"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-base hover:text-[#0096C7] transition-colors focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <div className={`p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[#0096C7] transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#E0F2FE]' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    <p>{faq.answer}</p>
                    {faq.question.includes('refunds') && (
                      <button
                        onClick={onOpenRefundPolicy}
                        className="mt-2 inline-flex items-center gap-1 text-[#0096C7] font-bold hover:underline"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> View Refund & Cancellation Terms
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
