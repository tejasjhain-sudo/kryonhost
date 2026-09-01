import React, { useState, useEffect } from 'react';
import { KRYONHOST_CONFIG } from '../config/kryonhost.config';
import { Zap, ArrowRight, ShieldCheck, Lock, Calendar, Mail } from 'lucide-react';

interface PreOrderBannerProps {
  onOpenPreOrder: () => void;
}

export const PreOrderBanner: React.FC<PreOrderBannerProps> = ({ onOpenPreOrder }) => {
  const [allocationStats, setAllocationStats] = useState({
    totalAllocations: KRYONHOST_CONFIG.brand.totalFoundingAllocations,
    claimedCount: KRYONHOST_CONFIG.brand.totalFoundingAllocations - KRYONHOST_CONFIG.brand.remainingFoundingAllocations,
    remainingCount: KRYONHOST_CONFIG.brand.remainingFoundingAllocations,
  });

  useEffect(() => {
    fetchAllocationStatus();
  }, []);

  const fetchAllocationStatus = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/preorder/allocation-status');
      if (response.ok) {
        const data = await response.json();
        setAllocationStats(data);
      }
    } catch (err) {
      // Fallback
    }
  };

  const progressPercent = Math.round((allocationStats.claimedCount / allocationStats.totalAllocations) * 100);

  return (
    <section className="py-8 bg-[#F1F5F9] border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-3 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-mono font-bold text-[#0096C7]">
                FOUNDING PRE-ORDER OFFER
              </span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-100 border border-emerald-300 text-xs font-mono font-bold text-emerald-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Datacenter Live: Oct 1–10</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Founding Pre-Orders Are Live
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-medium leading-relaxed">
              We are going live between <strong>October 1 and October 10, 2026</strong>. You will receive an instant email notification when the pre-order period ends and physical server provisioning begins!
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs sm:text-sm text-slate-900 font-semibold">
              <Zap className="w-4 h-4 text-[#0096C7] fill-[#0096C7] shrink-0" />
              <span>
                <strong>First 30 pre-orders receive</strong>{' '}
                <span className="text-[#0096C7] font-extrabold underline decoration-[#0096C7]/30 underline-offset-4">
                  +{KRYONHOST_CONFIG.brand.foundingBonusRamGB} GB RAM permanently
                </span>{' '}
                at launch.
              </span>
            </div>
          </div>

          <div className="w-full lg:w-80 space-y-4 shrink-0 bg-slate-50 p-5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0096C7]" /> Allocation Counter
              </span>
              <span className="text-slate-900 font-bold">
                {allocationStats.remainingCount} of {allocationStats.totalAllocations} available
              </span>
            </div>

            <div className="space-y-1">
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-[#0096C7] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-[11px] text-right text-slate-500 font-mono">
                {allocationStats.claimedCount} claimed ({progressPercent}%)
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#E0F2FE] border border-[#0096C7]/20 text-[11px] font-mono text-[#0096C7] flex items-center gap-1.5 font-bold">
              <Mail className="w-3.5 h-3.5 text-[#0096C7] shrink-0" />
              <span>Email notification sent at launch</span>
            </div>

            <button
              onClick={onOpenPreOrder}
              className="w-full py-3 px-4 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-black text-xs shadow transition-colors flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Pre-Order & Pay Today</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
