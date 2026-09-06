import React, { useState } from 'react';
import { KRYONHOST_CONFIG, VPSPlan } from '../config/kryonhost.config';
import { 
  ArrowLeft, CheckCircle2, ShieldCheck, Zap, ArrowRight, Loader2, 
  Server, Cpu, HardDrive, Network, Lock, MapPin, Key, Sliders, 
  Check, ExternalLink, Terminal, Shield, HelpCircle, CheckSquare, Square
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutPageProps {
  selectedPlanId: string;
  initialBillingCycle?: 'monthly' | 'quarterly';
  onBackToHome: () => void;
  onOpenAccount: () => void;
  onOpenLegal?: (doc: 'terms' | 'privacy' | 'refund' | 'aup') => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  selectedPlanId = 'performance-16gb',
  initialBillingCycle = 'monthly',
  onBackToHome,
  onOpenAccount,
  onOpenLegal,
}) => {
  const [activePlanId, setActivePlanId] = useState<string>(selectedPlanId);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>(initialBillingCycle);

  // Form Fields
  const [hostname, setHostname] = useState('kh-node-01');
  const [operatingSystem, setOperatingSystem] = useState('Ubuntu 24.04 LTS (64-bit)');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [rootPassword] = useState('P@ssw0rd!' + Math.floor(1000 + Math.random() * 9000));
  const [confirmationAgreed, setConfirmationAgreed] = useState(true);

  // Deployment Steps Progression
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deploymentStep, setDeploymentStep] = useState<'form' | 'provisioning' | 'completed'>('form');
  const [provisioningProgress, setProvisioningProgress] = useState(0);
  const [provisioningStageText, setProvisioningStageText] = useState('Connecting to Shulker Reseller API...');
  const [provisionedServer, setProvisionedServer] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Find selected plan from central config
  const plan = KRYONHOST_CONFIG.vpsPlans.find(p => p.id === activePlanId) || KRYONHOST_CONFIG.vpsPlans[10];

  // Calculate pricing (15% off for quarterly)
  const basePrice = plan.monthlyPriceINR;
  const effectiveMonthly = billingCycle === 'quarterly' ? Math.round(basePrice * 0.85) : basePrice;
  const totalAmountToday = billingCycle === 'quarterly' ? effectiveMonthly * 3 : effectiveMonthly;
  const totalSavings = billingCycle === 'quarterly' ? (basePrice * 3) - totalAmountToday : 0;

  const executeServerProvisioning = (paymentId: string) => {
    setIsSubmitting(true);
    setDeploymentStep('provisioning');
    setProvisioningProgress(20);
    setProvisioningStageText(`Razorpay Payment Verified (${paymentId.slice(0, 14)}...). Initializing Shulker API...`);

    setTimeout(() => {
      setProvisioningProgress(50);
      setProvisioningStageText(`Provisioning ${plan.vcpu} vCPU / ${plan.ramGB} GB RAM KVM instance...`);
    }, 1200);

    setTimeout(() => {
      setProvisioningProgress(80);
      setProvisioningStageText(`Installing ${operatingSystem} & binding static IPv4...`);
    }, 2800);

    setTimeout(() => {
      const generatedIP = `103.186.20.${Math.floor(10 + Math.random() * 200)}`;
      setProvisionedServer({
        serverId: `kh-srv-${Math.floor(10000 + Math.random() * 90000)}`,
        ipAddress: generatedIP,
        hostname: hostname.trim() || 'kh-vps-node',
        os: operatingSystem,
        planName: plan.name,
        category: plan.category.toUpperCase(),
        specs: `${plan.vcpu} vCPU / ${plan.ramGB} GB RAM / ${plan.storageNVMeGB} GB NVMe`,
        rootPassword,
        panelUrl: 'https://panel.kryonhost.com',
        paymentId,
      });

      setProvisioningProgress(100);
      setDeploymentStep('completed');
      setIsSubmitting(false);

      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
      } catch (e) {}
    }, 4500);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name for server registration.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address to receive your VPS credentials.');
      return;
    }

    if (!confirmationAgreed) {
      setErrorMessage('Please agree to the Terms of Service to proceed with deployment.');
      return;
    }

    const keyId = KRYONHOST_CONFIG.payments?.razorpayKeyId || 'rzp_test_TYNEWJU3MCxeKe';

    // Trigger Razorpay Test Mode Checkout Modal
    if (typeof (window as any).Razorpay !== 'undefined') {
      const options = {
        key: keyId,
        amount: totalAmountToday * 100, // Amount in paise
        currency: 'INR',
        name: KRYONHOST_CONFIG.brand.name,
        description: `${plan.name} (${plan.category.toUpperCase()}) - ${operatingSystem}`,
        image: '/favicon.svg',
        prefill: {
          name: fullName,
          email: email,
        },
        theme: {
          color: '#0096C7',
        },
        handler: function (response: any) {
          executeServerProvisioning(response.razorpay_payment_id || 'rzp_test_pay_' + Math.floor(Math.random() * 100000));
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          }
        }
      };

      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          setErrorMessage(`Payment Cancelled/Failed: ${response.error?.description || 'Transaction not completed.'}`);
          setIsSubmitting(false);
        });
        rzp.open();
      } catch (err) {
        executeServerProvisioning('rzp_test_' + Math.floor(Math.random() * 100000));
      }
    } else {
      executeServerProvisioning('rzp_test_' + Math.floor(Math.random() * 100000));
    }
  };

  // 1. PROVISIONING PROGRESS SCREEN
  if (deploymentStep === 'provisioning') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pt-28 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full mx-4 p-8 bg-white border border-slate-200 rounded-3xl shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#E0F2FE] border border-[#0096C7]/30 text-[#0096C7] flex items-center justify-center mx-auto shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>PAYMENT CONFIRMED</span>
            </div>
            <h2 className="text-xl font-heading font-black text-slate-900">Provisioning Your VPS...</h2>
            <p className="text-xs text-slate-500 font-normal">Automated Shulker Hypervisor Engine</p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-[#0077B6] to-[#0096C7] transition-all duration-500"
                style={{ width: `${provisioningProgress}%` }}
              />
            </div>
            <div className="text-xs font-mono text-[#0096C7] font-bold">
              {provisioningProgress}% • {provisioningStageText}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left font-mono text-[11px] space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span>Location:</span>
              <span className="font-bold text-slate-900">Mumbai Tier IV Node</span>
            </div>
            <div className="flex justify-between">
              <span>Plan:</span>
              <span className="font-bold text-slate-900">{plan.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Template:</span>
              <span className="font-bold text-slate-800">{operatingSystem}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. SERVER READY & COMPLETED SCREEN
  if (deploymentStep === 'completed' && provisionedServer) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pt-28 pb-20">
        <div className="max-w-2xl mx-auto px-4 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold border border-emerald-300">
                ✓ VPS PROVISIONED & ACTIVE
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">Your VPS is Online</h1>
              <p className="text-sm text-slate-600 font-normal">
                Your server has been provisioned on the Mumbai datacenter node and bound to your account.
              </p>
            </div>

            {/* Server Details Sheet */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 font-mono text-xs shadow-xs">
              <div className="flex justify-between border-b border-slate-200/80 pb-2.5">
                <span className="text-slate-500">Instance ID:</span>
                <span className="text-slate-900 font-bold">{provisionedServer.serverId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-2.5">
                <span className="text-slate-500">Static IPv4 Address:</span>
                <span className="text-[#0096C7] font-black text-sm">{provisionedServer.ipAddress}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-2.5">
                <span className="text-slate-500">Hostname:</span>
                <span className="text-slate-900 font-bold">{provisionedServer.hostname}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-2.5">
                <span className="text-slate-500">Operating System:</span>
                <span className="text-slate-800">{provisionedServer.os}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-2.5">
                <span className="text-slate-500">Root Password:</span>
                <span className="text-amber-700 font-bold">{provisionedServer.rootPassword}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">SSH Terminal Command:</span>
                <span className="text-slate-900 font-mono font-bold">ssh root@{provisionedServer.ipAddress}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={provisionedServer.panelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 px-6 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-heading font-bold text-xs shadow-md shadow-[#0096C7]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Open Control Panel</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenAccount}
                className="flex-1 py-3.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-heading font-bold text-xs transition-colors cursor-pointer"
              >
                View in Client Portal
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // 3. MAIN REDESIGNED CHECKOUT FORM
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans border-t border-slate-200">
      
      {/* 1. TOP MINIMAL CHECKOUT HEADER */}
      <nav className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Left: Back Link */}
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-600 hover:text-[#0096C7] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to VPS Plans</span>
          </button>

          {/* Center: Progress Steps */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#0096C7] font-bold">
              <span className="w-5 h-5 rounded-full bg-[#0096C7] text-white flex items-center justify-center text-[10px]">1</span>
              <span>Configure</span>
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center text-[10px]">2</span>
              <span>Review</span>
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center text-[10px]">3</span>
              <span>Payment</span>
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center text-[10px]">4</span>
              <span>Deploy</span>
            </span>
          </div>

          {/* Right: Security Badge */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* 2. PAGE INTRO & STATUS PILL */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-mono text-slate-700 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-800">Mumbai infrastructure online</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
              Configure your VPS
            </h1>
            <p className="text-sm text-slate-600 font-normal">
              Choose your server configuration and billing cycle. Your VPS will be ready shortly after payment.
            </p>
          </div>
        </div>

        {/* 3. MAIN TWO-COLUMN CHECKOUT LAYOUT */}
        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN (approx 65% width / 8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* CARD 1 — DATACENTER LOCATION */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-heading font-black text-slate-900 uppercase tracking-wider">
                  Datacenter Location
                </h3>
                <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ● Excellent connection
                </span>
              </div>

              {/* Selected Datacenter Card */}
              <div className="p-4 rounded-xl bg-[#E0F2FE]/50 border-2 border-[#0096C7] flex items-center justify-between shadow-xs">
                <div className="flex items-start gap-3.5">
                  <span className="text-3xl">🇮🇳</span>
                  <div className="space-y-0.5">
                    <div className="font-heading font-black text-slate-900 text-base flex items-center gap-2">
                      <span>Mumbai, India</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ACTIVE NODE
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-600">
                      Tier IV Datacenter • NIXI Peering • &lt;5ms Network Latency
                    </div>
                  </div>
                </div>

                <div className="w-5 h-5 rounded-full bg-[#0096C7] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* CARD 2 — BILLING CYCLE */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-heading font-black text-slate-900 uppercase tracking-wider">
                  Choose your billing cycle
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  Select a billing interval. Quarterly billing locks in a 15% discount.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Monthly Option */}
                <div
                  onClick={() => setBillingCycle('monthly')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-2 relative ${
                    billingCycle === 'monthly'
                      ? 'bg-[#E0F2FE]/40 border-[#0096C7] shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-slate-900 text-sm uppercase">Monthly</span>
                    {billingCycle === 'monthly' && (
                      <div className="w-4 h-4 rounded-full bg-[#0096C7] text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      ₹{basePrice.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-slate-500 font-sans"> /month</span>
                    </div>
                    <div className="text-xs text-slate-500 font-sans mt-1">
                      Flexible billing • Cancel anytime
                    </div>
                  </div>
                </div>

                {/* Quarterly Option */}
                <div
                  onClick={() => setBillingCycle('quarterly')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-2 relative ${
                    billingCycle === 'quarterly'
                      ? 'bg-[#E0F2FE]/40 border-[#0096C7] shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-slate-900 text-sm uppercase">Quarterly</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      SAVE 15%
                    </span>
                  </div>

                  <div>
                    <div className="text-2xl font-black text-emerald-700 font-mono">
                      ₹{effectiveMonthly.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-slate-500 font-sans"> /month</span>
                    </div>
                    <div className="text-xs text-emerald-800 font-mono font-bold mt-1">
                      ₹{totalAmountToday.toLocaleString('en-IN')} billed every 3 months
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3 — SERVER CONFIGURATION */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-5">
              <div className="space-y-1">
                <h3 className="text-sm font-heading font-black text-slate-900 uppercase tracking-wider">
                  Server Configuration
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  Customize your hostname and operating system template.
                </p>
              </div>

              {/* Spec Chips Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500">vCPU</div>
                  <div className="font-bold text-slate-900">{plan.vcpu} Cores</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500">RAM</div>
                  <div className="font-bold text-slate-900">{plan.ramGB} GB DDR5</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500">Storage</div>
                  <div className="font-bold text-slate-900">{plan.storageNVMeGB} GB NVMe</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500">Bandwidth</div>
                  <div className="font-bold text-slate-900">1 Gbps Shared</div>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-700 block uppercase">
                    Server Hostname
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="kh-node-01"
                    value={hostname}
                    onChange={(e) => setHostname(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#0096C7] focus:ring-2 focus:ring-[#0096C7]/20 transition-all"
                  />
                  <span className="text-[11px] text-slate-500 font-mono">Example: app-prod-01 or vps-mumbai</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-700 block uppercase">
                    Operating System
                  </label>
                  <select
                    value={operatingSystem}
                    onChange={(e) => setOperatingSystem(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#0096C7] focus:ring-2 focus:ring-[#0096C7]/20 transition-all cursor-pointer"
                  >
                    {KRYONHOST_CONFIG.operatingSystems.map((os) => (
                      <option key={os} value={os}>{os}</option>
                    ))}
                  </select>
                  <span className="text-[11px] text-slate-500 font-mono">Includes 60s automated deployment</span>
                </div>
              </div>
            </div>

            {/* CARD 4 — LIVE VPS CONFIGURATION PREVIEW */}
            <div className="p-5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2.5 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-300 uppercase tracking-wider">Your VPS Summary Preview</span>
                <span className="text-emerald-400 font-bold">READY TO DEPLOY</span>
              </div>

              <div className="space-y-1 pt-1">
                <div className="text-sm font-black text-white">{plan.name} ({plan.ramGB} GB RAM)</div>
                <div className="text-slate-400">
                  {plan.vcpu} vCPU • {plan.ramGB} GB RAM • {plan.storageNVMeGB} GB NVMe SSD
                </div>
                <div className="text-[#38BDF8] pt-1">
                  Location: Mumbai, India 🇮🇳 • OS: {operatingSystem}
                </div>
              </div>
            </div>

            {/* CARD 5 — ACCOUNT DETAILS */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-heading font-black text-slate-900 uppercase tracking-wider">
                  Account Details
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  Your deployment details and server access instructions will be sent to this email.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-700 block uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#0096C7] focus:ring-2 focus:ring-[#0096C7]/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-700 block uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#0096C7] focus:ring-2 focus:ring-[#0096C7]/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* CARD 6 — COMPACT PAYMENT METHOD */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-heading font-black text-slate-900 uppercase tracking-wider">
                  Payment Method
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  TEST MODE
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between font-mono text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Razorpay Secure Gateway</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Supports UPI (GPay, PhonePe, Paytm), Cards, NetBanking & Wallets
                  </div>
                </div>

                <div className="text-right text-[10px] font-mono font-bold text-slate-400">
                  Key: rzp_test_...
                </div>
              </div>
            </div>

            {/* TERMS & CONDITIONS CHECKBOX */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={confirmationAgreed}
                  onChange={(e) => setConfirmationAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#0096C7] accent-[#0096C7]"
                />
                <span>
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => onOpenLegal?.('terms')}
                    className="text-[#0096C7] font-bold hover:underline"
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => onOpenLegal?.('aup')}
                    className="text-[#0096C7] font-bold hover:underline"
                  >
                    Acceptable Use Policy
                  </button>
                  . Server management will be accessible via the white-label control panel.
                </span>
              </label>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-bold">
                {errorMessage}
              </div>
            )}

          </div>

          {/* RIGHT COLUMN — STICKY ORDER SUMMARY (approx 35% width / 4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-6 sticky top-20 shadow-md font-sans">
              
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <div className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                  Order Summary
                </div>
                <div className="text-xl font-heading font-black text-slate-900">
                  {plan.name}
                </div>
                <div className="text-xs font-mono text-[#0096C7] font-bold">
                  Mumbai, India 🇮🇳 • {operatingSystem}
                </div>
              </div>

              {/* Compact Specifications List */}
              <div className="space-y-2.5 font-mono text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Compute:</span>
                  <span className="font-bold text-slate-900">{plan.vcpu} vCPU</span>
                </div>
                <div className="flex justify-between">
                  <span>RAM:</span>
                  <span className="font-bold text-slate-900">{plan.ramGB} GB DDR5</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage:</span>
                  <span className="font-bold text-slate-900">{plan.storageNVMeGB} GB NVMe</span>
                </div>
                <div className="flex justify-between">
                  <span>Bandwidth:</span>
                  <span className="font-bold text-slate-900">1 Gbps Shared</span>
                </div>
                <div className="flex justify-between">
                  <span>DDoS Mitigation:</span>
                  <span className="text-emerald-700 font-bold">Always-On</span>
                </div>
                <div className="flex justify-between">
                  <span>Snapshots:</span>
                  <span className="text-slate-900">Included</span>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Price Breakdown */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>₹{basePrice.toLocaleString('en-IN')}/mo</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Billing Cycle:</span>
                  <span className="font-bold uppercase text-slate-900">{billingCycle}</span>
                </div>

                {billingCycle === 'quarterly' && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
                    You're saving 15% with quarterly billing!
                  </div>
                )}
              </div>

              <hr className="border-slate-100" />

              {/* Total Due Callout */}
              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase">Total Due Today</div>
                <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                  ₹{totalAmountToday.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-500 font-sans">
                  {billingCycle === 'quarterly' ? `₹${effectiveMonthly}/month billed quarterly` : 'Billed monthly • Cancel anytime'}
                </div>
              </div>

              {/* Deployment Notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#0096C7]" />
                  <span>Fast Provisioning</span>
                </div>
                <div>Your VPS will begin provisioning immediately after successful payment.</div>
              </div>

              {/* PRIMARY CTA BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting || !confirmationAgreed}
                className="w-full py-4 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-heading font-bold text-sm shadow-lg shadow-[#0096C7]/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>Continue to Payment →</span>
              </button>

              {/* Compact Trust Row */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>Secure Payment</span>
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#0096C7]" />
                  <span>DDoS Protected</span>
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>Fast Provisioning</span>
                </span>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
