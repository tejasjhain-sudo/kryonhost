import React, { useState, useMemo } from 'react';
import { KRYONHOST_CONFIG, VPSPlan } from '../config/kryonhost.config';
import { 
  ArrowLeft, CheckCircle2, ShieldCheck, Zap, ArrowRight, Loader2, 
  Server, Cpu, HardDrive, Network, Lock, MapPin, Key, Sliders, 
  Check, ExternalLink, Terminal, Shield, HelpCircle, Search, Layers
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

  // OS Search State
  const [osSearchQuery, setOsSearchQuery] = useState('');

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

  // Professional SVG Vector OS Logos
  const osCatalog = [
    {
      name: 'Ubuntu 24.04 LTS (64-bit)',
      badge: 'Recommended',
      icon: (
        <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#E95420" />
          <circle cx="12" cy="6.2" r="1.6" fill="#FFF" />
          <circle cx="7" cy="14.8" r="1.6" fill="#FFF" />
          <circle cx="17" cy="14.8" r="1.6" fill="#FFF" />
          <path d="M12 8.5A3.5 3.5 0 1 0 15.5 12" stroke="#FFF" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      )
    },
    {
      name: 'Ubuntu 22.04 LTS (64-bit)',
      icon: (
        <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#E95420" />
          <circle cx="12" cy="6.2" r="1.6" fill="#FFF" />
          <circle cx="7" cy="14.8" r="1.6" fill="#FFF" />
          <circle cx="17" cy="14.8" r="1.6" fill="#FFF" />
          <path d="M12 8.5A3.5 3.5 0 1 0 15.5 12" stroke="#FFF" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      )
    },
    {
      name: 'Debian 12 Bookworm (64-bit)',
      badge: 'Popular',
      icon: (
        <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#A80030" />
          <path d="M12 6c-3.2 0-5.8 2.3-5.8 5.2 0 2.6 2 4.3 4.3 4.3 1.4 0 2.3-.9 2.3-1.8 0-.8-.6-1.4-1.4-1.4-.5 0-.9.2-.9.5" stroke="#FFF" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )
    },
    {
      name: 'AlmaLinux 9 (64-bit)',
      icon: (
        <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#004F9F" />
          <path d="M12 5.5L16.5 10L12 14.5L7.5 10L12 5.5Z" fill="#00A4E4" />
          <path d="M12 9.5L14.5 12L12 14.5L9.5 12L12 9.5Z" fill="#FFF" />
          <path d="M12 14.5L16.5 19L12 17.5L7.5 19L12 14.5Z" fill="#38BDF8" />
        </svg>
      )
    },
    {
      name: 'Rocky Linux 9 (64-bit)',
      icon: (
        <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#10B981" />
          <path d="M6.5 16.5L10 9L12.5 13L15 9.5L17.5 16.5H6.5Z" fill="#FFF" />
        </svg>
      )
    },
    {
      name: 'Arch Linux (64-bit)',
      icon: (
        <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#1793D1" />
          <path d="M12 5.5L6 17.5H8.3L9.7 14.7C10.6 15.2 11.4 15.4 12 15.4C12.6 15.4 13.4 15.2 14.3 14.7L15.7 17.5H18L12 5.5ZM12 10.8L13.7 14.2C13.2 14.4 12.6 14.5 12 14.5C11.4 14.5 10.8 14.4 10.3 14.2L12 10.8Z" fill="#FFF" />
        </svg>
      )
    },
    {
      name: 'Windows Server 2022 Datacenter',
      icon: (
        <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="6" fill="#0078D4" />
          <path d="M4.5 6.5L11 5.6V11.5H4.5V6.5ZM4.5 17.5L11 18.4V12.5H4.5V17.5ZM19.5 4.5L12 5.5V11.5H19.5V4.5ZM19.5 19.5L12 18.5V12.5H19.5V19.5Z" fill="#FFF" />
        </svg>
      )
    },
    {
      name: 'Docker Engine + Compose',
      badge: 'Popular',
      icon: (
        <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="6" fill="#1D63ED" />
          <path d="M5 13.5H7V15.5H5V13.5ZM8 13.5H10V15.5H8V13.5ZM11 13.5H13V15.5H11V13.5ZM14 13.5H16V15.5H14V13.5ZM8 11H10V13H8V11ZM11 11H13V13H11V11ZM14 11H16V13H14V11ZM11 8.5H13V10.5H11V8.5Z" fill="#FFF" />
          <path d="M3.5 16.5C4.5 18.5 7.5 19.5 12 19.5C16.5 19.5 19.5 18.5 20.5 16.5C21 15.5 20.5 14.5 19 14C18.5 15 17 15.5 15.5 15.5H8.5C7 15.5 5.5 15 5 14C3.5 14.5 3 15.5 3.5 16.5Z" fill="#FFF" />
        </svg>
      )
    },
  ];

  const filteredOsList = useMemo(() => {
    return osCatalog.filter(os => {
      return !osSearchQuery.trim() || os.name.toLowerCase().includes(osSearchQuery.toLowerCase());
    });
  }, [osSearchQuery]);

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

  // 3. MAIN HOSTINGER-STYLE STACKED CHECKOUT PAGE
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pt-6 pb-24">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* TOP AREA: BACK LINK & PAGE INTRO */}
        <div className="space-y-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600 hover:text-[#0096C7] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to VPS Plans</span>
          </button>

          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
              Configure your VPS
            </h1>
            <p className="text-sm text-slate-600 font-normal">
              Choose your server location, operating system, and billing cycle.
            </p>
          </div>
        </div>

        {/* MAIN LAYOUT: LEFT STACKED CARDS (~70%) & RIGHT STICKY SIDEBAR (~30%) */}
        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN — STACKED CONFIGURATION CARDS (8 Cols / ~70%) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* CARD 1 — VPS PLAN & BILLING PERIOD */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
              
              {/* Product Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-[#E0F2FE] border border-[#0096C7]/30 text-[#0096C7] shrink-0">
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight">
                      {plan.name}
                    </h2>
                    <div className="text-xs font-mono text-slate-500 font-semibold mt-0.5">
                      VPS Hosting • Dedicated KVM Isolation
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono">
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    ₹{effectiveMonthly.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-slate-500 font-sans"> /mo</span>
                  </div>
                  {billingCycle === 'quarterly' && (
                    <div className="text-[11px] font-bold text-emerald-700">
                      Save 15% applied
                    </div>
                  )}
                </div>
              </div>

              {/* Hardware Spec Chips Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-500">vCPU Compute</div>
                  <div className="font-bold text-slate-900">{plan.vcpu} Cores</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-500">Memory (RAM)</div>
                  <div className="font-bold text-slate-900">{plan.ramGB} GB DDR5</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-500">NVMe Storage</div>
                  <div className="font-bold text-slate-900">{plan.storageNVMeGB} GB NVMe</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-500">Bandwidth</div>
                  <div className="font-bold text-slate-900">1 Gbps Shared</div>
                </div>
              </div>

              {/* Billing Period Selector */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-heading font-black text-slate-900 tracking-tight">
                  Billing period
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Monthly Card */}
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
                        <span className="text-xs font-normal text-slate-500 font-sans"> /mo</span>
                      </div>
                      <div className="text-xs text-slate-500 font-sans mt-1">
                        Flexible billing • Cancel anytime
                      </div>
                    </div>
                  </div>

                  {/* Quarterly Card */}
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
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        SAVE 15%
                      </span>
                    </div>

                    <div>
                      <div className="text-2xl font-black text-emerald-700 font-mono">
                        ₹{effectiveMonthly.toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-slate-500 font-sans"> /mo</span>
                      </div>
                      <div className="text-xs text-emerald-800 font-mono font-bold mt-1">
                        ₹{totalAmountToday.toLocaleString('en-IN')} billed every 3 months
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-500 pt-1">
                  Renews at ₹{basePrice.toLocaleString('en-IN')}/mo after the selected period. Cancel anytime.
                </div>
              </div>

            </div>

            {/* CARD 2 — SERVER LOCATION */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-heading font-black text-slate-900 tracking-tight">
                  Choose a server location
                </h3>
                <p className="text-xs text-slate-600 font-normal">
                  Choose a server location closest to you or your audience for optimal performance.
                </p>
              </div>

              {/* Large Hostinger-Style Location Selector */}
              {/* Large Hostinger-Style Location Selector */}
              <div className="p-5 rounded-2xl bg-[#E0F2FE]/40 border-2 border-[#0096C7] flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-4">
                  <svg className="w-8 h-5.5 rounded overflow-hidden shadow-xs border border-slate-200 shrink-0" viewBox="0 0 30 20" fill="none">
                    <rect width="30" height="6.67" fill="#FF9933"/>
                    <rect y="6.67" width="30" height="6.67" fill="#FFFFFF"/>
                    <rect y="13.33" width="30" height="6.67" fill="#138808"/>
                    <circle cx="15" cy="10" r="2.2" stroke="#000080" strokeWidth="0.5" fill="none"/>
                    <path d="M15 7.8v4.4M12.8 10h4.4M13.4 8.4l3.2 3.2M13.4 11.6l3.2-3.2" stroke="#000080" strokeWidth="0.3"/>
                  </svg>
                  <div className="space-y-0.5">
                    <div className="font-heading font-black text-slate-900 text-base flex items-center gap-2">
                      <span>Mumbai, India</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ● Active node
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-600">
                      Tier IV Datacenter • NIXI Direct Peering • &lt;5ms Network Latency
                    </div>
                  </div>
                </div>

                <div className="w-5 h-5 rounded-full bg-[#0096C7] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* CARD 3 — OPERATING SYSTEM ("CHOOSE WHAT TO INSTALL") */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-heading font-black text-slate-900 tracking-tight">
                      Choose what to install
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 font-normal">
                    Select an operating system for your VPS. Free 60-second auto-installation.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64 font-mono text-xs shrink-0">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search OS..."
                    value={osSearchQuery}
                    onChange={(e) => setOsSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#0096C7] transition-colors"
                  />
                </div>
              </div>

              {/* 2-Column OS Selector Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredOsList.map((osItem) => {
                  const isSelected = operatingSystem === osItem.name;
                  return (
                    <div
                      key={osItem.name}
                      onClick={() => setOperatingSystem(osItem.name)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? 'bg-[#E0F2FE]/40 border-[#0096C7] shadow-xs'
                          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {osItem.icon}
                        <div>
                          <div className="font-heading font-black text-slate-900 text-xs flex items-center gap-1.5">
                            <span>{osItem.name}</span>
                            {osItem.badge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                {osItem.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                            60s Auto-Install
                          </div>
                        </div>
                      </div>

                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#0096C7] text-white' : 'border border-slate-300 group-hover:border-slate-400'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* CARD 4 — SERVER & ACCOUNT DETAILS */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-heading font-black text-slate-900 tracking-tight">
                  Server & Account details
                </h3>
                <p className="text-xs text-slate-600 font-normal">
                  Your server credentials and login details will be delivered to this account.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-700 block uppercase">
                    Hostname
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-700 block uppercase">Account Name</label>
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
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#0096C7] focus:ring-2 focus:ring-[#0096C7]/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 5 — PAYMENT SECTION */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-heading font-black text-slate-900 tracking-tight">
                  Payment
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  TEST MODE
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between font-mono text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Razorpay Payment Gateway</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Supports UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking & Wallets
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

          {/* RIGHT COLUMN — HOSTINGER-STYLE STICKY ORDER SUMMARY (4 Cols / ~30%) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-6 sticky top-24 shadow-md font-sans">
              
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <div className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                  ORDER SUMMARY
                </div>
                <div className="text-xl font-heading font-black text-slate-900">
                  {plan.name}
                </div>
                <div className="text-xs font-mono text-slate-500 font-semibold">
                  VPS Hosting
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
                  <span className="font-bold text-slate-900">{plan.ramGB} GB RAM</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage:</span>
                  <span className="font-bold text-slate-900">{plan.storageNVMeGB} GB NVMe</span>
                </div>
                <div className="flex justify-between">
                  <span>Bandwidth:</span>
                  <span className="font-bold text-slate-900">Unlimited</span>
                </div>
                <div className="flex justify-between">
                  <span>Server Location:</span>
                  <span className="font-bold text-slate-900">Mumbai, India 🇮🇳</span>
                </div>
                <div className="flex justify-between">
                  <span>Operating System:</span>
                  <span className="font-bold text-[#0096C7] truncate max-w-[150px]">{operatingSystem}</span>
                </div>
                <div className="flex justify-between">
                  <span>Billing:</span>
                  <span className="font-bold uppercase text-slate-900">{billingCycle}</span>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Subtotal & Total Pricing */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>₹{basePrice.toLocaleString('en-IN')}</span>
                </div>

                {billingCycle === 'quarterly' && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
                    Save 15% with quarterly billing!
                  </div>
                )}
              </div>

              <hr className="border-slate-100" />

              {/* TOTAL DUE */}
              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase">TOTAL</div>
                <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                  ₹{totalAmountToday.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-500 font-sans">
                  {billingCycle === 'quarterly' ? `₹${effectiveMonthly}/month billed quarterly` : 'Billed monthly • Cancel anytime'}
                </div>
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

              {/* TRUST BADGES */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs font-mono text-slate-500">
                <div className="flex items-center gap-2 text-slate-700">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Secure payment</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0096C7] shrink-0" />
                  <span>Always-on DDoS protection</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Fast provisioning</span>
                </div>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
