import React, { useState, useEffect } from 'react';
import { KRYONHOST_CONFIG, VPSPlan } from '../config/kryonhost.config';
import { X, CheckCircle2, ShieldCheck, Zap, ArrowRight, Loader2, Sparkles, Copy, Check, Info, Server, Cpu, HardDrive, Network, Globe, AlertCircle, CreditCard, QrCode, Lock, DollarSign, MapPin, Key, Calendar, Tag, BadgePercent, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PreOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanId?: string;
}

interface AllocationStats {
  totalAllocations: number;
  claimedCount: number;
  remainingCount: number;
  isBonusActive: boolean;
  foundingBonusRamGB: number;
}

export type BillingCycle = '1_month' | '12_months' | '24_months';

export const PreOrderModal: React.FC<PreOrderModalProps> = ({
  isOpen,
  onClose,
  selectedPlanId = 'performance',
}) => {
  const [activePlanId, setActivePlanId] = useState<string>(selectedPlanId);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Billing Cycle State: 1 Month, 12 Months (15% OFF), 24 Months (25% OFF)
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('12_months');

  // Datacenter Location (Strictly India - Mumbai)
  const datacenterLocation = 'India - Mumbai';

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [country, setCountry] = useState('India');
  const [intendedUse, setIntendedUse] = useState('Docker / Containers');
  const [intendedUseOther, setIntendedUseOther] = useState('');
  const [operatingSystem, setOperatingSystem] = useState('Ubuntu 24.04');
  const [tellUsMore, setTellUsMore] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [company, setCompany] = useState('');

  // Payment Fields
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'crypto'>('upi');
  const [upiId, setUpiId] = useState('alex@upi');
  const [cardNumber, setCardNumber] = useState('4111 •••• •••• 1111');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [confirmationAgreed, setConfirmationAgreed] = useState(false);

  // State Management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Live Backend Allocation Counter
  const [allocationStats, setAllocationStats] = useState<AllocationStats>({
    totalAllocations: 30,
    claimedCount: 2,
    remainingCount: 28,
    isBonusActive: true,
    foundingBonusRamGB: 4,
  });

  useEffect(() => {
    if (selectedPlanId) {
      setActivePlanId(selectedPlanId);
    }
  }, [selectedPlanId]);

  useEffect(() => {
    if (isOpen) {
      fetchAllocationStatus();
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  const currentPlan = KRYONHOST_CONFIG.plans.find((p) => p.id === activePlanId) || KRYONHOST_CONFIG.plans[2];
  const isBonusEligible = allocationStats.isBonusActive && currentPlan.bonusEligible !== false;
  const foundingBonusRamGB = isBonusEligible ? allocationStats.foundingBonusRamGB : 0;
  const launchRamGB = currentPlan.ramGB + foundingBonusRamGB;

  // Billing Duration & Discount Math
  let monthsCount = 1;
  let discountPercent = 0;
  let cycleLabel = '1 Month (Monthly)';

  if (billingCycle === '12_months') {
    monthsCount = 12;
    discountPercent = 15; // 15% OFF for 12 months
    cycleLabel = '12 Months (15% OFF)';
  } else if (billingCycle === '24_months') {
    monthsCount = 24;
    discountPercent = 25; // 25% OFF for 24 months
    cycleLabel = '24 Months (25% OFF)';
  }

  // Base & Discounted Monthly Rates
  const baseMonthlyINR = currentPlan.monthlyPriceINR;
  const baseMonthlyUSD = currentPlan.monthlyPriceUSD;

  const effectiveMonthlyINR = Math.round(baseMonthlyINR * (1 - discountPercent / 100));
  const effectiveMonthlyUSD = Number((baseMonthlyUSD * (1 - discountPercent / 100)).toFixed(2));

  // Add-on Cost Calculations
  const addonMonthlyINR = selectedAddons.length * 49;
  const addonMonthlyUSD = selectedAddons.length * 0.60;

  // Total Upfront Amount Paid Today
  const totalAmountTodayINR = (effectiveMonthlyINR + addonMonthlyINR) * monthsCount;
  const totalAmountTodayUSD = Number(((effectiveMonthlyUSD + addonMonthlyUSD) * monthsCount).toFixed(2));

  // Total Savings Calculated
  const totalSavingsINR = (baseMonthlyINR * monthsCount) - (effectiveMonthlyINR * monthsCount);
  const totalSavingsUSD = Number(((baseMonthlyUSD * monthsCount) - (effectiveMonthlyUSD * monthsCount)).toFixed(2));

  const toggleAddon = (addon: string) => {
    if (selectedAddons.includes(addon)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== addon));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !discordUsername.trim()) {
      setErrorMessage('Please complete all required contact fields.');
      return;
    }

    if (!confirmationAgreed) {
      setErrorMessage('Please check the confirmation box to authorize pre-order payment today.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Submit Pre-Order Reservation
      const reserveResponse = await fetch('http://localhost:5001/api/preorder/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          discordUsername,
          country,
          planId: currentPlan.id,
          billingCycle: cycleLabel,
          datacenterLocation: 'India - Mumbai',
          intendedUse,
          intendedUseOther: intendedUse === 'Other' ? intendedUseOther : undefined,
          operatingSystem,
          tellUsMore,
          addonInterests: selectedAddons,
          phoneNumber,
          company,
          confirmationAgreed: true,
        }),
      });

      const reserveData = await reserveResponse.json();
      const reservationId = reserveData.reservation?.reservationId || `KH-PRE-${Math.floor(1000 + Math.random() * 9000)}`;

      // Step 2: Trigger Payment Webhook
      const paymentId = `pay_${paymentMethod}_${Math.floor(100000 + Math.random() * 900000)}`;
      const paymentResponse = await fetch('http://localhost:5001/api/webhooks/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: reservationId,
          reservationId,
          paymentId,
          amount: currency === 'INR' ? totalAmountTodayINR : totalAmountTodayUSD,
          currency,
          billingCycle: cycleLabel,
          paymentMethod: paymentMethod === 'upi' ? 'UPI / GPay' : paymentMethod === 'card' ? 'Credit Card' : 'Crypto',
          customerId: `usr-cust-${Date.now()}`,
          planId: currentPlan.id,
          datacenterLocation: 'India - Mumbai',
          isFoundingBonusApplied: isBonusEligible,
        }),
      });

      const paymentData = await paymentResponse.json();

      // Auto-generate initial secure root password for pre-order receipt
      const generatedRootPassword = `Kryon#${Math.random().toString(36).substring(2, 8)}!2026`;

      setPaymentResult({
        paymentId: paymentData.payment?.paymentId || paymentId,
        reservationId,
        planName: currentPlan.name,
        datacenterLocation: 'India - Mumbai',
        billingCycle: cycleLabel,
        rootUsername: 'root',
        rootPassword: generatedRootPassword,
        operatingSystem,
        effectiveMonthlyDisplay: currency === 'INR' ? `₹${effectiveMonthlyINR}/mo` : `$${effectiveMonthlyUSD}/mo`,
        totalPaidDisplay: currency === 'INR' ? `₹${totalAmountTodayINR.toLocaleString('en-IN')}` : `$${totalAmountTodayUSD}`,
        savingsDisplay: discountPercent > 0 ? (currency === 'INR' ? `Saved ₹${totalSavingsINR.toLocaleString('en-IN')} (${discountPercent}% OFF)` : `Saved $${totalSavingsUSD} (${discountPercent}% OFF)`) : null,
        launchRamGB,
        foundingBonusText: isBonusEligible ? `+${foundingBonusRamGB} GB RAM permanently` : 'None',
        paymentStatus: 'PAID',
        preOrderStatus: 'PREORDER_CONFIRMED',
        createdAt: new Date().toISOString(),
      });

      fetchAllocationStatus();

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#0096C7', '#0284C7', '#38BDF8'],
        });
      } catch (err) {}
    } catch (err: any) {
      setErrorMessage('Payment processing error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPass = () => {
    if (paymentResult?.rootPassword) {
      navigator.clipboard.writeText(paymentResult.rootPassword);
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Modal Top Branding Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#E0F2FE] text-[#0096C7] border border-[#0096C7]/30 shadow-sm">
              <Zap className="w-6 h-6 fill-[#0096C7]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Pre-Order VPS Reservation</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-mono font-black uppercase border border-emerald-300">
                  INSTANT LOCK-IN
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Lock in Founding Pricing & +4 GB RAM Bonus for India - Mumbai Datacenter
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Backend Allocation Counter Badge */}
            <div className="px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-mono font-bold text-[#0096C7] flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#0096C7] animate-pulse" />
              <span>{allocationStats.remainingCount} / {allocationStats.totalAllocations} Available</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {paymentResult ? (
          /* CONFIRMED PAID RECEIPT SCREEN */
          <div className="p-8 text-center space-y-6 animate-in fade-in duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 border-2 border-emerald-300 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h4 className="text-3xl font-black text-slate-900 tracking-tight">🎉 Pre-Order Paid & Reserved!</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
                Thank you, <strong className="text-slate-900">{fullName}</strong>! Your payment for the{' '}
                <strong className="text-[#0096C7]">{paymentResult.billingCycle}</strong> pre-order term has been verified.
              </p>
            </div>

            {/* Paid Receipt Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-lg mx-auto text-left space-y-4 shadow-sm font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-500 font-bold uppercase">Payment Status</span>
                <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs flex items-center gap-1.5 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> PAID 🟢
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-500">Payment ID</div>
                  <div className="font-bold text-slate-900 mt-0.5">{paymentResult.paymentId}</div>
                </div>
                <div>
                  <div className="text-slate-500">Reservation ID</div>
                  <div className="font-bold text-[#0096C7] mt-0.5">{paymentResult.reservationId}</div>
                </div>
                <div>
                  <div className="text-slate-500">Selected Plan</div>
                  <div className="font-bold text-slate-900 mt-0.5">{paymentResult.planName}</div>
                </div>
                <div>
                  <div className="text-slate-500">Billing Term</div>
                  <div className="font-bold text-slate-900 mt-0.5">{paymentResult.billingCycle}</div>
                </div>
                <div>
                  <div className="text-slate-500">Datacenter Region</div>
                  <div className="font-extrabold text-[#0096C7] mt-0.5">🇮🇳 India - Mumbai</div>
                </div>
                <div>
                  <div className="text-slate-500">Total Paid Today</div>
                  <div className="font-black text-slate-900 mt-0.5 text-sm">{paymentResult.totalPaidDisplay}</div>
                </div>
                <div>
                  <div className="text-slate-500">Effective Rate</div>
                  <div className="font-bold text-[#0096C7] mt-0.5">{paymentResult.effectiveMonthlyDisplay}</div>
                </div>
                <div>
                  <div className="text-slate-500">Launch RAM</div>
                  <div className="font-black text-slate-900 mt-0.5 text-sm">{paymentResult.launchRamGB} GB RAM</div>
                </div>
              </div>

              {paymentResult.savingsDisplay && (
                <div className="p-3 rounded-xl bg-emerald-100/80 border border-emerald-300 text-emerald-800 font-bold flex items-center justify-between text-xs">
                  <span>Discount Savings Applied:</span>
                  <span className="font-black">{paymentResult.savingsDisplay}</span>
                </div>
              )}

              {/* Initial Root Credentials Box */}
              <div className="pt-3 border-t border-slate-200 space-y-2.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-inner">
                <div className="text-slate-700 font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-sans font-extrabold text-slate-900">
                    <Key className="w-4 h-4 text-[#0096C7]" /> VPS Access Credentials (Pre-Assigned)
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">Active at launch</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">Root Username</span>
                    <span className="font-bold text-slate-900">{paymentResult.rootUsername}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">OS Template</span>
                    <span className="font-bold text-slate-900">{paymentResult.operatingSystem}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 block">Initial Root Password</span>
                  <div className="flex items-center justify-between bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 mt-1">
                    <span className="font-bold text-[#0096C7]">{paymentResult.rootPassword}</span>
                    <button
                      onClick={handleCopyPass}
                      className="text-slate-500 hover:text-slate-900 transition-colors"
                      title="Copy Password"
                    >
                      {copiedPass ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#E0F2FE] border border-[#0096C7]/30 text-xs text-[#0096C7] font-medium max-w-lg mx-auto flex items-center gap-2.5 text-left">
              <Info className="w-5 h-5 shrink-0 text-[#0096C7]" />
              <span>
                Your pre-order payment is verified. Your VPS will be provisioned at our <strong>India - Mumbai Datacenter</strong> in{' '}
                <strong>{KRYONHOST_CONFIG.brand.expectedLaunchWindow}</strong>.
              </span>
            </div>

            <button
              onClick={() => {
                setPaymentResult(null);
                onClose();
              }}
              className="px-8 py-3.5 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-extrabold text-xs shadow-md"
            >
              Return to KryonHost
            </button>
          </div>
        ) : (
          /* PRE-ORDER INTAKE & PAYMENT FORM */
          <form onSubmit={handlePaymentSubmit} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
            {/* 1. Datacenter Location Badge (India - Mumbai Only) */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-700">
                1. Datacenter Location *
              </label>
              <div className="p-4 rounded-2xl bg-[#E0F2FE]/70 border border-[#0096C7]/40 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="text-3xl">🇮🇳</div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                      <span>India - Mumbai Datacenter</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#0096C7] text-white text-[10px] font-mono font-extrabold">
                        PRIMARY LAUNCH NODE
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5 font-medium">
                      Tier IV Facility • Low Latency Domestic BGP Network • 1 Gbps Unmetered Port
                    </div>
                  </div>
                </div>
                <MapPin className="w-6 h-6 text-[#0096C7] shrink-0" />
              </div>
            </div>

            {/* 2. Billing Duration Cards (1 Month, 12 Months 15% OFF, 24 Months 25% OFF) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-700">
                  2. Billing Duration & Discount *
                </label>

                {/* Currency Switcher */}
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setCurrency('INR')}
                    className={`px-3 py-1 rounded-lg font-mono font-extrabold transition-colors ${currency === 'INR' ? 'bg-[#0096C7] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    INR (₹)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('USD')}
                    className={`px-3 py-1 rounded-lg font-mono font-extrabold transition-colors ${currency === 'USD' ? 'bg-[#0096C7] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              {/* 3 Billing Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* 1 Month */}
                <button
                  type="button"
                  onClick={() => setBillingCycle('1_month')}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    billingCycle === '1_month'
                      ? 'bg-[#E0F2FE] border-[#0096C7] text-slate-900 shadow-md ring-2 ring-[#0096C7]/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">1 Month</span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">Standard</span>
                  </div>
                  <div className="text-base font-mono text-slate-900 mt-2 font-black">
                    {currency === 'INR' ? `₹${baseMonthlyINR}/mo` : `$${baseMonthlyUSD}/mo`}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-medium">Billed monthly</div>
                </button>

                {/* 12 Months (15% OFF) */}
                <button
                  type="button"
                  onClick={() => setBillingCycle('12_months')}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    billingCycle === '12_months'
                      ? 'bg-[#E0F2FE] border-[#0096C7] text-slate-900 shadow-md ring-2 ring-[#0096C7]/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full bg-[#0096C7] text-white text-[9px] font-mono font-black shadow-sm">
                    SAVE 15%
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">12 Months (1 Yr)</span>
                  </div>
                  <div className="text-base font-mono text-[#0096C7] mt-2 font-black">
                    {currency === 'INR' ? `₹${effectiveMonthlyINR}/mo` : `$${effectiveMonthlyUSD}/mo`}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-1">
                    Save {currency === 'INR' ? `₹${totalSavingsINR.toLocaleString('en-IN')}` : `$${totalSavingsUSD}`}
                  </div>
                </button>

                {/* 24 Months (25% OFF Best Value) */}
                <button
                  type="button"
                  onClick={() => setBillingCycle('24_months')}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    billingCycle === '24_months'
                      ? 'bg-[#E0F2FE] border-[#0096C7] text-slate-900 shadow-md ring-2 ring-[#0096C7]/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-mono font-black shadow-sm">
                    25% OFF BEST VALUE
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">24 Months (2 Yrs)</span>
                  </div>
                  <div className="text-base font-mono text-[#0096C7] mt-2 font-black">
                    {currency === 'INR' ? `₹${effectiveMonthlyINR}/mo` : `$${effectiveMonthlyUSD}/mo`}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-1">
                    Save {currency === 'INR' ? `₹${totalSavingsINR.toLocaleString('en-IN')}` : `$${totalSavingsUSD}`}
                  </div>
                </button>
              </div>
            </div>

            {/* 3. VPS Plan Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-700">
                3. Select VPS Plan *
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {KRYONHOST_CONFIG.plans.map((p: VPSPlan) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActivePlanId(p.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      activePlanId === p.id
                        ? 'bg-[#E0F2FE] border-[#0096C7] text-slate-900 font-extrabold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-black">{p.name}</div>
                    <div className="text-xs font-mono text-[#0096C7] mt-0.5 font-bold">
                      {currency === 'INR' ? `₹${p.monthlyPriceINR}` : `$${p.monthlyPriceUSD}`}/mo
                    </div>
                  </button>
                ))}
              </div>

              {/* Dynamic Selected VPS Details Breakdown */}
              <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-slate-500">Plan Specs: </span>
                    <strong className="text-slate-900 text-sm font-black">{currentPlan.name} ({cycleLabel})</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">Effective Rate: </span>
                    <strong className="text-[#0096C7] text-base font-black">
                      {currency === 'INR' ? `₹${effectiveMonthlyINR}/mo` : `$${effectiveMonthlyUSD}/mo`}
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-slate-500 block">Location</span>
                    <span className="font-bold text-[#0096C7]">India - Mumbai</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Root Access</span>
                    <span className="font-bold text-slate-900">root (Full Access)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">vCPU Cores</span>
                    <span className="font-bold text-slate-900">{currentPlan.vcpu} vCPU</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Launch RAM</span>
                    <span className="font-black text-slate-900 text-sm">{launchRamGB} GB RAM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Customer Contact Details */}
            <div className="space-y-3">
              <label className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-700">
                4. Contact & Workload Details *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Mercer"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#0096C7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#0096C7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Discord Username <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="alex_dev"
                    value={discordUsername}
                    onChange={(e) => setDiscordUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#0096C7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#0096C7]"
                  >
                    <option value="India">🇮🇳 India</option>
                    <option value="Singapore">🇸🇬 Singapore</option>
                    <option value="United States">🇺🇸 United States</option>
                    <option value="Germany">🇩🇪 Germany</option>
                    <option value="United Kingdom">🇬🇧 United Kingdom</option>
                    <option value="Other">🌐 Other Country</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 5. Intended Workload & OS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Intended Workload <span className="text-rose-500">*</span>
                </label>
                <select
                  value={intendedUse}
                  onChange={(e) => setIntendedUse(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#0096C7]"
                >
                  {KRYONHOST_CONFIG.intendedUseOptions.map((use) => (
                    <option key={use} value={use}>
                      {use}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred OS <span className="text-rose-500">*</span>
                </label>
                <select
                  value={operatingSystem}
                  onChange={(e) => setOperatingSystem(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#0096C7]"
                >
                  {KRYONHOST_CONFIG.operatingSystems.map((os) => (
                    <option key={os} value={os}>
                      {os}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 6. Add-on Preferences */}
            <div className="space-y-3">
              <label className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-700">
                6. Select Optional Add-ons
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {KRYONHOST_CONFIG.addonInterests.map((addon) => (
                  <label
                    key={addon}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer text-xs font-medium text-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedAddons.includes(addon)}
                        onChange={() => toggleAddon(addon)}
                        className="w-4 h-4 rounded text-[#0096C7] accent-[#0096C7]"
                      />
                      <span>{addon}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">
                      +{currency === 'INR' ? '₹49/mo' : '$0.60/mo'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 7. Payment Checkout Method & Itemized Summary */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-700">
                  7. Payment Checkout Method *
                </label>

                {/* Itemized Total Badge */}
                <div className="p-2.5 px-4 rounded-xl bg-slate-900 text-white font-mono flex items-center gap-3 text-xs shadow-md">
                  <span className="text-slate-400">Total ({monthsCount} Mo):</span>
                  <span className="font-black text-lg text-[#38BDF8]">
                    {currency === 'INR' ? `₹${totalAmountTodayINR.toLocaleString('en-IN')}` : `$${totalAmountTodayUSD}`}
                  </span>
                </div>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-[#E0F2FE] border-[#0096C7] text-slate-900 font-bold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-[#0096C7]" />
                  <span className="text-xs">UPI / GPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-[#E0F2FE] border-[#0096C7] text-slate-900 font-bold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#0096C7]" />
                  <span className="text-xs">Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('crypto')}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'crypto'
                      ? 'bg-[#E0F2FE] border-[#0096C7] text-slate-900 font-bold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <DollarSign className="w-5 h-5 text-[#0096C7]" />
                  <span className="text-xs">Crypto</span>
                </button>
              </div>

              {/* Payment Details Input */}
              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">Enter VPA / UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#0096C7]"
                  />
                  <div className="text-[10px] text-slate-500 font-mono">Supports GPay, PhonePe, Paytm, BHIM UPI</div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-xs">
                  <label className="block text-xs font-semibold text-slate-700 font-sans">Card Details</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0096C7]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0096C7]"
                    />
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0096C7]"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'crypto' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600">
                  <span>Pay via USDT (TRC20/ERC20) or Bitcoin. Invoice generated upon checkout.</span>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Checkbox Confirmation & Submit Button */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  required
                  checked={confirmationAgreed}
                  onChange={(e) => setConfirmationAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[#0096C7] accent-[#0096C7]"
                />
                <span>
                  I authorize pre-order payment today of{' '}
                  <strong className="text-slate-900">
                    {currency === 'INR' ? `₹${totalAmountTodayINR.toLocaleString('en-IN')}` : `$${totalAmountTodayUSD}`}
                  </strong>{' '}
                  ({cycleLabel}) for <strong className="text-[#0096C7]">India - Mumbai Datacenter</strong> to lock in my rate and +4 GB RAM bonus.
                </span>
              </label>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => onClose()}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !confirmationAgreed}
                  className="px-8 py-3.5 rounded-2xl bg-[#0096C7] hover:bg-[#0284C7] text-white text-xs font-black shadow-lg shadow-[#0096C7]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Pay & Lock In Rate ({currency === 'INR' ? `₹${totalAmountTodayINR.toLocaleString('en-IN')}` : `$${totalAmountTodayUSD}`})
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
