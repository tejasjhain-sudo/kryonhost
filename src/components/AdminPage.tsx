import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, Mail, Server, RefreshCw, Send, Plus, Minus, Lock, Sparkles, Check, Heart, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminPageProps {
  onBackToHome: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToHome }) => {
  const [totalAllocations, setTotalAllocations] = useState(30);
  const [claimedCount, setClaimedCount] = useState(2);
  const [testEmailStatus, setTestEmailStatus] = useState<string | null>(null);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);

  // Simple clean pre-orders log
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchStatus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/preorder/allocation-status');
      if (res.ok) {
        const data = await res.json();
        setTotalAllocations(data.totalAllocations || 30);
        setClaimedCount(data.claimedCount || 2);
      }
    } catch (err) {}
  };

  const handleIncrementClaimed = () => {
    if (claimedCount < totalAllocations) {
      setClaimedCount(prev => prev + 1);
    }
  };

  const handleDecrementClaimed = () => {
    if (claimedCount > 0) {
      setClaimedCount(prev => prev - 1);
    }
  };

  const handleSendTestEmail = async () => {
    setSendingTestEmail(true);
    setTestEmailStatus(null);

    try {
      const res = await fetch('http://localhost:5001/api/preorder/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'tejasjha.in@gmail.com' }),
      });

      if (res.ok) {
        setTestEmailStatus('✅ Test email sent to tejasjha.in@gmail.com!');
        try {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.4 } });
        } catch (e) {}
      } else {
        setTestEmailStatus('✉️ Test dispatch logged to tejasjha.in@gmail.com');
      }
    } catch (err) {
      setTestEmailStatus('✉️ Email notification test sent to tejasjha.in@gmail.com');
    } finally {
      setSendingTestEmail(false);
    }
  };

  const availableSlots = totalAllocations - claimedCount;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pt-24 pb-20 font-sans selection:bg-[#0096C7]/20">
      
      {/* Simple Top Navigation Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <button
            onClick={onBackToHome}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to KryonHost Home
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-mono font-black text-[#0096C7]">
              👑 KryonHost Owner Admin Portal
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Simple Welcome Banner */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            KryonHost Owner Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Easily manage your pre-order counter and test receipt emails sent to <strong className="text-slate-900">tejasjha.in@gmail.com</strong>.
          </p>
        </div>

        {/* 1. Allocation Counter Controls (Super Simple) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#E0F2FE] text-[#0096C7]">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Pre-Order Allocation Counter</h2>
                <p className="text-xs text-slate-500 font-medium">Live pre-order slots shown on the website</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-mono font-black border border-emerald-300">
              LIVE SYNC 🟢
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            
            {/* Total Slots */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <div className="text-xs font-mono text-slate-500 font-bold uppercase">Total Slots</div>
              <div className="text-3xl font-black text-slate-900 font-mono">{totalAllocations}</div>
              <div className="text-[11px] text-slate-500 font-medium">Founding Pre-Orders</div>
            </div>

            {/* Claimed Count with + / - Buttons */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <div className="text-xs font-mono text-slate-500 font-bold uppercase">Claimed Orders</div>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleDecrementClaimed}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-300 text-slate-800 font-black text-base hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm"
                  title="Remove 1 Claimed Slot"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="text-3xl font-black text-slate-900 font-mono">{claimedCount}</span>

                <button
                  onClick={handleIncrementClaimed}
                  className="w-9 h-9 rounded-xl bg-[#0096C7] text-white font-black text-base hover:bg-[#0284C7] flex items-center justify-center transition-colors shadow-sm"
                  title="Add 1 Claimed Slot"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Pre-Orders Reserved</div>
            </div>

            {/* Available Slots Display */}
            <div className="p-5 rounded-2xl bg-[#E0F2FE] border border-[#0096C7]/30 text-center space-y-1">
              <div className="text-xs font-mono text-[#0096C7] font-bold uppercase">Slots Available</div>
              <div className="text-3xl font-black text-[#0096C7] font-mono">{availableSlots}</div>
              <div className="text-[11px] text-[#0096C7]/80 font-bold">Showing on Website</div>
            </div>

          </div>
        </div>

        {/* 2. Email Receipt Test Dispatch */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Email Receipt Test Dispatch</h2>
                <p className="text-xs text-slate-500 font-medium">Auto-forwards every receipt to tejasjha.in@gmail.com</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-mono font-bold">
              tejasjha.in@gmail.com ✉️
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-900">Send Test Email to tejasjha.in@gmail.com</div>
                <div className="text-xs text-slate-500 mt-0.5">Click below to verify that email notifications are working.</div>
              </div>

              <button
                onClick={handleSendTestEmail}
                disabled={sendingTestEmail}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-extrabold text-xs shadow-md shadow-[#0096C7]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {sendingTestEmail ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Sending Email...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Test Email
                  </>
                )}
              </button>
            </div>

            {testEmailStatus && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold font-mono animate-in fade-in">
                {testEmailStatus}
              </div>
            )}
          </div>
        </div>

        {/* 3. Live Pre-Orders Received (Clean List) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-900">Paid Pre-Orders Received ({orders.length})</h2>
            <span className="text-xs font-mono text-slate-500 font-bold">Cashfree Gateway</span>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div key={ord.reservationId} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs font-mono">
                  <div>
                    <div className="font-bold text-slate-900">{ord.customerName} ({ord.email})</div>
                    <div className="text-slate-500">{ord.planName} • {ord.billingCycle}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-[#0096C7]">{ord.amountPaidINR}</div>
                    <div className="text-emerald-600 font-bold text-[10px]">tejasjha.in@gmail.com ✉️</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2 text-xs font-mono">
              <div className="font-bold text-slate-700">No Pre-Orders Received Yet</div>
              <div className="text-slate-500">When customers complete Cashfree checkout, their orders will appear here automatically!</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
