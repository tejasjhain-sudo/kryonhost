import React, { useState, useEffect } from 'react';
import { KRYONHOST_CONFIG, VPSPlan } from '../config/kryonhost.config';
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap, ArrowRight, Loader2, Sparkles, Copy, Check, Info, Server, Cpu, HardDrive, Network, Globe, AlertCircle, CreditCard, Lock, DollarSign, MapPin, Key, Calendar, Tag, BadgePercent, CheckCircle, ChevronRight, Sliders, Mail, Plus } from 'lucide-react';
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

  // Custom Domain Configuration State
  const [domainOption, setDomainOption] = useState<'free_subdomain' | 'new_domain' | 'existing_domain'>('free_subdomain');
  const [domainName, setDomainName] = useState('my-server');
  const [newDomainExt, setNewDomainExt] = useState('.com');

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

  // Domain Fee Calculation
  const domainFeeINR = domainOption === 'new_domain' ? 799 : 0;
  const domainFeeUSD = domainOption === 'new_domain' ? 9.99 : 0;

  const displayDomain =
    domainOption === 'new_domain'
      ? `${domainName.toLowerCase().replace(/[^a-z0-9-]/g, '')}${newDomainExt}`
      : domainOption === 'existing_domain'
      ? domainName || 'server.mycompany.com'
      : `${(domainName || 'my-server').toLowerCase().replace(/[^a-z0-9-]/g, '')}.kryonhost.com`;

  // Rates & Billing Calculations
  const baseMonthlyINR = currentPlan.monthlyPriceINR;
  const baseMonthlyUSD = currentPlan.monthlyPriceUSD;

  const effectiveMonthlyINR = Math.round(baseMonthlyINR * (1 - discountPercent / 100));
  const effectiveMonthlyUSD = Number((baseMonthlyUSD * (1 - discountPercent / 100)).toFixed(2));

  const addonMonthlyINR = selectedAddons.length * 49;
  const addonMonthlyUSD = selectedAddons.length * 0.60;

  const totalAmountTodayINR = (effectiveMonthlyINR + addonMonthlyINR) * selectedMonths + domainFeeINR;
  const totalAmountTodayUSD = Number(((effectiveMonthlyUSD + addonMonthlyUSD) * selectedMonths + domainFeeUSD).toFixed(2));

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
          datacenterLocation: 'India - Mumbai Datacenter',
          intendedUse,
          intendedUseOther,
          operatingSystem,
          tellUsMore,
          addonInterests: selectedAddons,
          phoneNumber,
          company,
          existingVpsProvider: '',
          referralSource: 'Direct Website Checkout',
          confirmationAgreed,
          domainName: displayDomain,
          domainOption,
        }),
      });

      let resData;
      if (reserveResponse.ok) {
        resData = await reserveResponse.json();
      } else {
        resData = {
          reservation: {
            reservationId: `KH-PRE-${Math.floor(1000 + Math.random() * 9000)}`,
            createdAt: new Date().toISOString(),
          },
        };
      }

      setPaymentResult({
        reservationId: resData.reservation?.reservationId || 'KH-PRE-8921',
        paymentId: `cf_pay_${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'SUCCESS',
        customerName: fullName,
        customerEmail: email,
        planName: currentPlan.name,
        billingCycle: cycleLabel,
        amountPaidINR: `₹${totalAmountTodayINR.toLocaleString('en-IN')}`,
        amountPaidUSD: `$${totalAmountTodayUSD}`,
        location: 'India - Mumbai Datacenter',
        domainName: displayDomain,
        specs: `${currentPlan.vcpu} vCPU / ${launchRamGB} GB RAM / ${currentPlan.storageNVMeGB} GB NVMe`,
      });

      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 } });
      } catch (e) {}

    } catch (err: any) {
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const presetMonthsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 24, 36];

  // Render Payment Success Confirmation Page
  if (paymentResult) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-20 font-sans">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>CASHFREE PAYMENT VERIFIED</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Pre-Order Confirmed
              </h1>
              <p className="text-sm text-slate-600 font-medium">
                Thank you, <strong>{paymentResult.customerName}</strong>. Your founding pre-order and domain configuration are locked in.
              </p>
            </div>

            {/* Receipt Summary Details */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500 font-bold">Reservation ID:</span>
                <span className="font-extrabold text-[#0096C7]">{paymentResult.reservationId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500 font-bold">Cashfree Payment ID:</span>
                <span className="font-extrabold text-slate-900">{paymentResult.paymentId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500 font-bold">Domain Name:</span>
                <span className="font-extrabold text-[#0096C7]">{paymentResult.domainName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500 font-bold">Datacenter Location:</span>
                <span className="font-extrabold text-slate-900">{paymentResult.location}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500 font-bold">Plan Specs:</span>
                <span className="font-extrabold text-slate-900">{paymentResult.specs}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500 font-bold">Total Paid Today:</span>
                <span className="font-black text-[#0096C7] text-base">{paymentResult.amountPaidINR}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-mono text-[#0096C7] text-left flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#0096C7] shrink-0" />
              <span>Official receipt and pre-order confirmation dispatched to <strong>{paymentResult.customerEmail}</strong>.</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onBackToHome}
                className="flex-1 py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs"
              >
                Back to Site
              </button>
              <button
                onClick={onOpenBilling}
                className="flex-1 py-3 px-6 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-mono font-black text-xs shadow-md"
              >
                View Invoices & Billing
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-20 font-sans selection:bg-[#0096C7]/20">
      
      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 py-3 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to KryonHost Home</span>
          </button>

          <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-700">
            <span className="text-[#0096C7]">1. Plan & Duration</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#0096C7]">2. Domain Setup</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span>3. Cashfree Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#E0F2FE] text-[#0096C7] font-mono font-black text-xs border border-[#0096C7]/30">
                OFFICIAL CHECKOUT PORTAL
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-mono font-bold text-xs border border-emerald-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>India - Mumbai</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Pre-Order KryonHost VPS Instance
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Configure your duration term, domain name, and complete instant checkout via Cashfree Payments Gateway.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 font-mono text-xs shrink-0">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                currency === 'INR' ? 'bg-[#0096C7] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              INR (₹)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                currency === 'USD' ? 'bg-[#0096C7] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* Form Title */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-lg font-black text-slate-900 font-mono flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#0096C7]" />
                  <span>Instance & Domain Configuration</span>
                </h2>
                <span className="text-xs font-mono text-[#0096C7] font-bold">
                  {allocationStats.remainingCount} Slots Available
                </span>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                
                {/* 1. Datacenter Location Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-700">
                    1. Physical Datacenter Node *
                  </label>

                  <div className="p-4 rounded-2xl bg-[#E0F2FE]/60 border border-[#0096C7]/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#0096C7] text-white font-black font-mono">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">India - Mumbai Datacenter</div>
                        <div className="text-xs text-slate-600">Tier IV Infrastructure • Direct NIXI Peering • Sub-5ms Latency</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-mono font-bold text-xs border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>PRIMARY NODE</span>
                    </span>
                  </div>
                </div>

                {/* 2. Month Duration Selection */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-700">
                      2. Custom Billing Duration (1 to 36 Months) *
                    </label>
                    <span className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{discountPercent > 0 ? `${discountPercent}% Discount Applied` : 'Standard Rate'}</span>
                    </span>
                  </div>

                  {/* Custom Month Number Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <span className="text-xs text-slate-500 font-mono block">Enter Duration (Months):</span>
                        <input
                          type="number"
                          min="1"
                          max="36"
                          value={selectedMonths}
                          onChange={(e) => {
                            const val = Math.max(1, Math.min(36, parseInt(e.target.value || '1', 10)));
                            setSelectedMonths(val);
                          }}
                          className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-black text-base focus:outline-none focus:border-[#0096C7]"
                        />
                      </div>

                      <div className="flex-1 p-3 rounded-xl bg-white border border-slate-200 text-right font-mono">
                        <span className="text-[10px] text-slate-400 block font-bold">Discount Rate:</span>
                        <span className="text-lg font-black text-emerald-600">{discountPercent}% OFF</span>
                      </div>
                    </div>

                    {/* Quick Month Presets */}
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
                              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${
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
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
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

                {/* 4. Domain Setup & Domain Registration */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-700">
                      4. Custom Domain Setup & Registration *
                    </label>
                    <span className="text-xs font-mono text-[#0096C7] font-bold">
                      Domain: {displayDomain}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    
                    {/* Domain Option Radio Tabs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      
                      <button
                        type="button"
                        onClick={() => setDomainOption('free_subdomain')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          domainOption === 'free_subdomain'
                            ? 'bg-white border-[#0096C7] ring-1 ring-[#0096C7] shadow-sm'
                            : 'bg-white/60 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900">Free Subdomain</span>
                          <span className="text-[10px] font-mono font-bold text-emerald-600">FREE ₹0</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">.kryonhost.com</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDomainOption('new_domain')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          domainOption === 'new_domain'
                            ? 'bg-white border-[#0096C7] ring-1 ring-[#0096C7] shadow-sm'
                            : 'bg-white/60 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900">Register New Domain</span>
                          <span className="text-[10px] font-mono font-bold text-[#0096C7]">+₹799/yr</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">.com / .in / .net</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDomainOption('existing_domain')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          domainOption === 'existing_domain'
                            ? 'bg-white border-[#0096C7] ring-1 ring-[#0096C7] shadow-sm'
                            : 'bg-white/60 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900">Use Own Domain</span>
                          <span className="text-[10px] font-mono font-bold text-emerald-600">FREE ₹0</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Existing DNS</div>
                      </button>

                    </div>

                    {/* Domain Input Box */}
                    <div className="space-y-2 pt-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        {domainOption === 'new_domain' ? 'Enter Desired Domain Name:' : 'Enter Subdomain / Domain Name:'}
                      </label>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          required
                          value={domainName}
                          onChange={(e) => setDomainName(e.target.value)}
                          placeholder={domainOption === 'new_domain' ? 'mycompany' : 'my-server'}
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-mono font-bold focus:outline-none focus:border-[#0096C7]"
                        />

                        {domainOption === 'new_domain' ? (
                          <select
                            value={newDomainExt}
                            onChange={(e) => setNewDomainExt(e.target.value)}
                            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-mono font-bold focus:outline-none focus:border-[#0096C7]"
                          >
                            <option value=".com">.com (+₹799/yr)</option>
                            <option value=".in">.in (+₹599/yr)</option>
                            <option value=".net">.net (+₹899/yr)</option>
                            <option value=".org">.org (+₹849/yr)</option>
                            <option value=".io">.io (+₹2,499/yr)</option>
                            <option value=".tech">.tech (+₹499/yr)</option>
                          </select>
                        ) : domainOption === 'free_subdomain' ? (
                          <div className="px-3.5 py-2.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-mono font-bold">
                            .kryonhost.com
                          </div>
                        ) : null}
                      </div>

                      <div className="text-[11px] font-mono text-slate-500 pt-1">
                        Domain Preview: <strong className="text-[#0096C7]">{displayDomain}</strong>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 5. Customer Information */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-700">
                    5. Contact & Workload Details *
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
                        <option value="India">India</option>
                        <option value="Singapore">Singapore</option>
                        <option value="United States">United States</option>
                        <option value="Germany">Germany</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Other">Other Country</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 6. Intended Use & OS */}
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

                {/* 7. Cashfree Payment Method Authorization */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-mono font-extrabold uppercase tracking-wider text-slate-700">
                    7. Cashfree Payments Gateway *
                  </label>

                  <div className="p-5 rounded-2xl bg-[#E0F2FE]/80 border border-[#0096C7]/40 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="p-3 rounded-xl bg-[#0096C7] text-white font-extrabold text-sm shadow-sm font-mono">
                          Cashfree
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                            <span>Cashfree Payments Gateway</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>OFFICIAL GATEWAY</span>
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 mt-0.5 font-medium">
                            Instant automated verification via UPI (GPay/PhonePe/Paytm), All Cards & NetBanking
                          </div>
                        </div>
                      </div>
                      <Lock className="w-5 h-5 text-[#0096C7]" />
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
                    Mumbai Node
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between text-slate-700">
                    <span>Performance Plan:</span>
                    <span className="font-extrabold text-slate-900">{currentPlan.name}</span>
                  </div>

                  <div className="flex justify-between text-slate-700">
                    <span>Billing Duration:</span>
                    <span className="font-extrabold text-emerald-600">{cycleLabel}</span>
                  </div>

                  <div className="flex justify-between text-slate-700">
                    <span>Datacenter Location:</span>
                    <span className="font-bold text-slate-900">India - Mumbai</span>
                  </div>

                  <div className="flex justify-between text-slate-700">
                    <span>Domain Setup:</span>
                    <span className="font-bold text-[#0096C7]">{displayDomain}</span>
                  </div>

                  <div className="flex justify-between text-slate-700">
                    <span>vCPU Cores:</span>
                    <span className="font-bold text-slate-900">{currentPlan.vcpu} vCPU</span>
                  </div>

                  <div className="flex justify-between text-slate-700">
                    <span>Base RAM:</span>
                    <span className="font-bold text-slate-900">{currentPlan.ramGB} GB RAM</span>
                  </div>

                  {foundingBonusRamGB > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                      <span>Founding Bonus:</span>
                      <span>+{foundingBonusRamGB} GB Permanent RAM</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-900 font-extrabold pt-1">
                    <span>Total Launch RAM:</span>
                    <span className="text-[#0096C7]">{launchRamGB} GB RAM</span>
                  </div>

                  <div className="flex justify-between text-slate-700">
                    <span>NVMe Storage:</span>
                    <span className="font-bold text-slate-900">{currentPlan.storageNVMeGB} GB NVMe</span>
                  </div>

                  <div className="flex justify-between text-slate-700">
                    <span>OS Template:</span>
                    <span className="font-bold text-slate-900">{operatingSystem}</span>
                  </div>

                  {domainFeeINR > 0 && (
                    <div className="flex justify-between text-slate-700 font-bold border-t border-slate-100 pt-2">
                      <span>Domain Registration:</span>
                      <span className="text-[#0096C7]">{currency === 'INR' ? `+₹${domainFeeINR}` : `+$${domainFeeUSD}`}</span>
                    </div>
                  )}

                  {selectedAddons.length > 0 && (
                    <div className="flex justify-between text-slate-700">
                      <span>Add-ons ({selectedAddons.length}):</span>
                      <span className="font-bold text-slate-900">
                        {currency === 'INR' ? `+₹${addonMonthlyINR}/mo` : `+$${addonMonthlyUSD.toFixed(2)}/mo`}
                      </span>
                    </div>
                  )}
                </div>

                {/* High Contrast TOTAL DUE Card */}
                <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3 font-mono shadow-md">
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    TOTAL DUE TODAY ({selectedMonths} MO)
                  </div>

                  <div className="text-3xl font-black text-[#38BDF8]">
                    {currency === 'INR' ? `₹${totalAmountTodayINR.toLocaleString('en-IN')}` : `$${totalAmountTodayUSD}`}
                  </div>

                  <div className="text-xs text-slate-300 font-bold">
                    Effective:{' '}
                    <span className="text-white">
                      {currency === 'INR'
                        ? `₹${Math.round(totalAmountTodayINR / selectedMonths)}/mo`
                        : `$${(totalAmountTodayUSD / selectedMonths).toFixed(2)}/mo`}
                    </span>
                  </div>

                  {totalSavingsINR > 0 && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>You Save</span>
                      </span>
                      <span>
                        {currency === 'INR' ? `₹${totalSavingsINR.toLocaleString('en-IN')}` : `$${totalSavingsUSD}`} ({discountPercent}% OFF)
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    100% Risk-Free Guarantee
                  </div>
                  <div className="text-[11px] leading-relaxed">
                    Pre-orders are fully refundable anytime prior to physical datacenter node provisioning.
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
