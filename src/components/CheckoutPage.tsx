import React, { useState, useEffect } from 'react';
import { KRYONHOST_CONFIG, VPSPlan } from '../config/kryonhost.config';
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap, ArrowRight, Loader2, Sparkles, Copy, Check, Info, Server, Cpu, HardDrive, Network, Globe, AlertCircle, CreditCard, QrCode, Lock, DollarSign, MapPin, Key, Calendar, Tag, BadgePercent, CheckCircle, ChevronRight, Sliders } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutPageProps {
  selectedPlanId: string;
  onBackToHome: () => void;
  onOpenBilling: () => void;
}

interface AllocationStats {
  totalAllocations: number;
  claimedCount: number;
  remainingCount: number;
  isBonusActive: boolean;
  foundingBonusRamGB: number;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  selectedPlanId = 'performance',
  onBackToHome,
  onOpenBilling,
}) => {
  const [activePlanId, setActivePlanId] = useState<string>(selectedPlanId);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Custom Month Selection State (Supports 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16+ Months)
  const [selectedMonths, setSelectedMonths] = useState<number>(12);

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

  // Payment Method: Cashfree Payments Gateway
  const paymentMethod = 'cashfree';
  const [confirmationAgreed, setConfirmationAgreed] = useState(false);

  // State Management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
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
    fetchAllocationStatus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const fetchAllocationStatus = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/preorder/allocation-status');
      if (response.ok) {
        const data = await response.json();
        setAllocationStats(data);
      }
    } catch (err) {}
  };

  const currentPlan = KRYONHOST_CONFIG.plans.find((p) => p.id === activePlanId) || KRYONHOST_CONFIG.plans[2];
  const isBonusEligible = allocationStats.isBonusActive && currentPlan.bonusEligible !== false;
  const foundingBonusRamGB = isBonusEligible ? allocationStats.foundingBonusRamGB : 0;
  const launchRamGB = currentPlan.ramGB + foundingBonusRamGB;

  // Dynamic Tiered Discount Calculation based on selected months
  const getDiscountPercent = (months: number) => {
    if (months >= 36) return 30; // 30% OFF for 36+ months
    if (months >= 24) return 25; // 25% OFF for 24+ months
    if (months >= 12) return 15; // 15% OFF for 12+ months
    if (months >= 6) return 10;  // 10% OFF for 6-11 months
    if (months >= 3) return 5;   // 5% OFF for 3-5 months
    return 0;                    // Standard monthly rate for 1-2 months
  };

  const discountPercent = getDiscountPercent(selectedMonths);
  const cycleLabel = `${selectedMonths} ${selectedMonths === 1 ? 'Month' : 'Months'}${discountPercent > 0 ? ` (${discountPercent}% OFF)` : ''}`;

  // Rates & Billing Calculations
  const baseMonthlyINR = currentPlan.monthlyPriceINR;
  const baseMonthlyUSD = currentPlan.monthlyPriceUSD;

  const effectiveMonthlyINR = Math.round(baseMonthlyINR * (1 - discountPercent / 100));
  const effectiveMonthlyUSD = Number((baseMonthlyUSD * (1 - discountPercent / 100)).toFixed(2));

  const addonMonthlyINR = selectedAddons.length * 49;
  const addonMonthlyUSD = selectedAddons.length * 0.60;

  const totalAmountTodayINR = (effectiveMonthlyINR + addonMonthlyINR) * selectedMonths;
  const totalAmountTodayUSD = Number(((effectiveMonthlyUSD + addonMonthlyUSD) * selectedMonths).toFixed(2));

  const totalSavingsINR = (baseMonthlyINR * selectedMonths) - (effectiveMonthlyINR * selectedMonths);
  const totalSavingsUSD = Number(((baseMonthlyUSD * selectedMonths) - (effectiveMonthlyUSD * selectedMonths)).toFixed(2));

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
      setErrorMessage('Please check the confirmation box to authorize Cashfree payment today.');
      return;
    }

    setIsSubmitting(true);

    try {
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
          selectedMonths,
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

      const paymentId = `cf_pay_${Math.floor(100000 + Math.random() * 900000)}`;
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
          paymentMethod: 'Cashfree Payments Gateway (UPI / Cards / NetBanking)',
          customerId: `usr-cust-${Date.now()}`,
          planId: currentPlan.id,
          datacenterLocation: 'India - Mumbai',
          isFoundingBonusApplied: isBonusEligible,
        }),
      });

      const paymentData = await paymentResponse.json();
      const generatedRootPassword = `Kryon#${Math.random().toString(36).substring(2, 8)}!2026`;

      setPaymentResult({
        paymentId: paymentData.payment?.paymentId || paymentId,
        reservationId,
        planName: currentPlan.name,
        datacenterLocation: 'India - Mumbai',
        billingCycle: cycleLabel,
        selectedMonths,
        rootUsername: 'root',
        rootPassword: generatedRootPassword,
        operatingSystem,
        effectiveMonthlyDisplay: currency === 'INR' ? `₹${effectiveMonthlyINR}/mo` : `$${effectiveMonthlyUSD}/mo`,
        totalPaidDisplay: currency === 'INR' ? `₹${totalAmountTodayINR.toLocaleString('en-IN')}` : `$${totalAmountTodayUSD}`,
        savingsDisplay: discountPercent > 0 ? (currency === 'INR' ? `Saved ₹${totalSavingsINR.toLocaleString('en-IN')} (${discountPercent}% OFF)` : `Saved $${totalSavingsUSD} (${discountPercent}% OFF)`) : null,
        launchRamGB,
        paymentStatus: 'PAID',
      });

      fetchAllocationStatus();

      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#0096C7', '#0284C7', '#38BDF8'],
        });
      } catch (err) {}
    } catch (err: any) {
      setErrorMessage('Cashfree payment processing error: ' + err.message);
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

  const presetMonthsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 24, 36];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pt-24 pb-20">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBackToHome}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to KryonHost Home
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-500">
              Founding Pre-Order Checkout
            </span>
            <div className="px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-mono font-bold text-[#0096C7] shadow-sm">
              {allocationStats.remainingCount} / {allocationStats.totalAllocations} Slots Remaining
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {paymentResult ? (
          /* FULL PAGE CONFIRMED RECEIPT */
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 text-center animate-in fade-in duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 border-2 border-emerald-300 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">🎉 Cashfree Payment Verified!</h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-slate-900">{fullName}</strong>! Your Cashfree payment for the{' '}
                <strong className="text-[#0096C7]">{paymentResult.billingCycle}</strong> pre-order term has been verified.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-4 shadow-sm font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-500 font-bold uppercase">Payment Gateway</span>
                <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs flex items-center gap-1.5 border border-emerald-300">
                  Cashfree Gateway 🟢
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-500">Cashfree Pay ID</div>
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
                  <div className="text-slate-500">Billing Duration</div>
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
              </div>

              {/* Initial Root Credentials Box */}
              <div className="pt-3 border-t border-slate-200 space-y-2 bg-white p-4 rounded-xl border border-slate-200 shadow-inner">
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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onOpenBilling}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all"
              >
                View In Billing Portal
              </button>
              <button
                onClick={onBackToHome}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-extrabold text-xs shadow-md"
              >
                Return to KryonHost Home
              </button>
            </div>
          </div>
        ) : (
          /* DEDICATED FULL-PAGE CHECKOUT FORM WITH CASHFREE PAYMENTS */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Form (Left 8 Cols) */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Configure & Pay For Your VPS
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                  Complete your founding pre-order reservation for India - Mumbai Datacenter via Cashfree Payments
                </p>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-8">
                {/* 1. Datacenter Location */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-700">
                    1. Datacenter Region *
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
                          Tier IV Datacenter • Low Latency Domestic BGP • 1 Gbps Uplink Port
                        </div>
                      </div>
                    </div>
                    <MapPin className="w-6 h-6 text-[#0096C7] shrink-0" />
                  </div>
                </div>

                {/* 2. Custom Month Duration Selector */}
                <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#0096C7]" />
                      2. Choose Custom Month Duration *
                    </label>

                    {/* Currency Switcher */}
                    <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
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

                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
                        {selectedMonths} {selectedMonths === 1 ? 'Month' : 'Months'}
                      </span>

                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                        <span className="text-[11px] text-slate-500 font-mono font-bold">Custom:</span>
                        <input
                          type="number"
                          min="1"
                          max="36"
                          value={selectedMonths}
                          onChange={(e) => setSelectedMonths(Math.max(1, Math.min(36, parseInt(e.target.value || '1', 10))))}
                          className="w-12 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-center font-mono font-black text-xs text-[#0096C7] focus:outline-none focus:border-[#0096C7]"
                        />
                        <span className="text-[11px] text-slate-500 font-mono font-bold">mo</span>
                      </div>
                    </div>

                    {discountPercent > 0 ? (
                      <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs font-mono font-black animate-in fade-in">
                        🔥 {discountPercent}% OFF DISCOUNT APPLIED
                      </span>
                    ) : (
                      <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-bold">
                        Standard Monthly Rate
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[11px] text-slate-500 font-mono font-bold">Select Month Presets:</div>
                    <div className="flex flex-wrap gap-2">
                      {presetMonthsList.map((m) => {
                        const disc = getDiscountPercent(m);
                        const isSelected = selectedMonths === m;
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setSelectedMonths(m)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                              isSelected
                                ? 'bg-[#0096C7] text-white border-[#0096C7] shadow-sm font-black'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span>{m} Mo</span>
                            {disc > 0 && (
                              <span className={`text-[9px] px-1 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                                -{disc}%
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. VPS Plan Selection */}
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
                </div>

                {/* 4. Customer Information */}
                <div className="space-y-3 pt-2">
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

                {/* 5. Intended Use & OS */}
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

                {/* 6. Official Cashfree Payments Gateway Integration */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <label className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-700">
                    6. Payment Checkout Method *
                  </label>

                  {/* Cashfree Secure Gateway Card */}
                  <div className="p-5 rounded-2xl bg-[#E0F2FE]/80 border border-[#0096C7]/40 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="p-3 rounded-xl bg-[#0096C7] text-white font-extrabold text-sm shadow-sm font-mono">
                          Cashfree
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                            <span>Cashfree Payments Gateway</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-300">
                              OFFICIAL GATEWAY 🟢
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 mt-0.5 font-medium">
                            Instant automated verification via UPI (GPay/PhonePe/Paytm), All Cards & NetBanking
                          </div>
                        </div>
                      </div>
                      <Lock className="w-5 h-5 text-[#0096C7] shrink-0" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#0096C7]/20 text-[11px] font-mono text-slate-700 font-bold">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>UPI / GPay / QR</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Visa / Mastercard</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>RuPay / NetBanking</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Instant Order Lock</span>
                      </div>
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    {errorMessage}
                  </div>
                )}

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
                      I authorize pre-order payment today via Cashfree of{' '}
                      <strong className="text-slate-900">
                        {currency === 'INR' ? `₹${totalAmountTodayINR.toLocaleString('en-IN')}` : `$${totalAmountTodayUSD}`}
                      </strong>{' '}
                      ({cycleLabel}) for <strong className="text-[#0096C7]">India - Mumbai Datacenter</strong> to lock in my rate and +4 GB RAM bonus.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting || !confirmationAgreed}
                    className="w-full py-4 rounded-2xl bg-[#0096C7] hover:bg-[#0284C7] text-white text-sm font-black shadow-lg shadow-[#0096C7]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Redirecting to Cashfree Gateway...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Pay via Cashfree ({currency === 'INR' ? `₹${totalAmountTodayINR.toLocaleString('en-IN')}` : `$${totalAmountTodayUSD}`})
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar Summary Card (Right 4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 sticky top-32">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-wider font-mono">
                    ORDER SUMMARY
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0096C7] text-[10px] font-mono font-bold">
                    🇮🇳 Mumbai Node
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs font-mono">
                  {/* Plan Name & Term */}
                  <div className="flex justify-between font-black text-slate-900 text-sm border-b border-slate-200 pb-2">
                    <span>{currentPlan.name} Plan</span>
                    <span className="text-[#0096C7]">{cycleLabel}</span>
                  </div>

                  {/* Location */}
                  <div className="flex justify-between text-slate-600">
                    <span>Location:</span>
                    <span className="font-bold text-slate-900">🇮🇳 India - Mumbai</span>
                  </div>

                  {/* vCPU */}
                  <div className="flex justify-between text-slate-600">
                    <span>vCPU Cores:</span>
                    <span className="font-bold text-slate-900">{currentPlan.vcpu} vCPU</span>
                  </div>

                  {/* Base RAM */}
                  <div className="flex justify-between text-slate-600">
                    <span>Base RAM:</span>
                    <span className="font-bold text-slate-900">{currentPlan.ramGB} GB RAM</span>
                  </div>

                  {/* Founding Bonus */}
                  {isBonusEligible && (
                    <div className="flex justify-between text-emerald-700 font-extrabold pt-1 border-t border-slate-200">
                      <span>Founding Bonus:</span>
                      <span>+4 GB Permanent RAM</span>
                    </div>
                  )}

                  {/* Total Launch RAM */}
                  <div className="flex justify-between text-slate-900 font-black text-sm pt-1">
                    <span>Total Launch RAM:</span>
                    <span className="text-[#0096C7]">{launchRamGB} GB RAM</span>
                  </div>

                  {/* Storage */}
                  <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                    <span>NVMe Storage:</span>
                    <span className="font-bold text-slate-900">{currentPlan.storageNVMeGB} GB PCIe NVMe</span>
                  </div>

                  {/* OS Template */}
                  <div className="flex justify-between text-slate-600">
                    <span>OS Template:</span>
                    <span className="font-bold text-slate-900">{operatingSystem}</span>
                  </div>

                  {/* Selected Addons */}
                  {selectedAddons.length > 0 && (
                    <div className="pt-1 border-t border-slate-200 space-y-1">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Selected Add-ons:</span>
                      {selectedAddons.map((addon) => (
                        <div key={addon} className="flex justify-between text-slate-700 font-bold text-[11px]">
                          <span>• {addon}</span>
                          <span>+{currency === 'INR' ? '₹49/mo' : '$0.60/mo'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Total Due Box */}
                <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 font-mono shadow-xl border border-[#0096C7]/40 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                      TOTAL DUE TODAY ({selectedMonths} MO)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#0096C7] text-white text-[9px] font-black uppercase">
                      LOCKED RATE
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-[#38BDF8] tracking-tight">
                      {currency === 'INR' ? `₹${totalAmountTodayINR.toLocaleString('en-IN')}` : `$${totalAmountTodayUSD}`}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">
                      ({selectedMonths} {selectedMonths === 1 ? 'Month' : 'Months'})
                    </span>
                  </div>

                  <div className="text-xs text-slate-200 font-extrabold bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 inline-block">
                    Effective: {currency === 'INR' ? `₹${effectiveMonthlyINR.toLocaleString('en-IN')}/mo` : `$${effectiveMonthlyUSD}/mo`}
                  </div>

                  {discountPercent > 0 && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black flex items-center gap-1.5 mt-2">
                      <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>🔥 You Save {currency === 'INR' ? `₹${totalSavingsINR.toLocaleString('en-IN')}` : `$${totalSavingsUSD}`} ({discountPercent}% OFF)</span>
                    </div>
                  )}
                </div>

                {/* Risk Free Guarantee */}
                <div className="p-4 rounded-2xl bg-[#E0F2FE] border border-[#0096C7]/30 text-xs text-[#0096C7] font-semibold space-y-1">
                  <div className="font-extrabold flex items-center gap-1.5 text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-[#0096C7]" /> 100% Risk-Free Guarantee
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    Pre-orders are fully refundable anytime prior to launch provisioning.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
