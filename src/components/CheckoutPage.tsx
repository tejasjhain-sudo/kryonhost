import React, { useState, useEffect } from 'react';
import { KRYONHOST_CONFIG, VPSPlan } from '../config/kryonhost.config';
import { 
  ArrowLeft, CheckCircle2, ShieldCheck, Zap, ArrowRight, Loader2, 
  Server, Cpu, HardDrive, Network, Lock, MapPin, Key, Sliders, 
  Check, ExternalLink, Terminal, Shield 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutPageProps {
  selectedPlanId: string;
  initialBillingCycle?: 'monthly' | 'quarterly';
  onBackToHome: () => void;
  onOpenAccount: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  selectedPlanId = 'performance-16gb',
  initialBillingCycle = 'monthly',
  onBackToHome,
  onOpenAccount,
}) => {
  const [activePlanId, setActivePlanId] = useState<string>(selectedPlanId);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>(initialBillingCycle);

  // Form Fields
  const [hostname, setHostname] = useState('kh-node-01');
  const [operatingSystem, setOperatingSystem] = useState('Ubuntu 24.04 LTS (64-bit)');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [rootPassword, setRootPassword] = useState('P@ssw0rd!' + Math.floor(1000 + Math.random() * 9000));
  const [confirmationAgreed, setConfirmationAgreed] = useState(false);

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

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim()) {
      setErrorMessage('Please provide your name and email address for server delivery.');
      return;
    }

    if (!confirmationAgreed) {
      setErrorMessage('Please acknowledge the service terms to proceed.');
      return;
    }

    setIsSubmitting(true);
    setDeploymentStep('provisioning');
    setProvisioningProgress(15);
    setProvisioningStageText('Processing payment via Cashfree Gateway...');

    // Simulate realistic provisioning workflow
    setTimeout(() => {
      setProvisioningProgress(35);
      setProvisioningStageText('Payment confirmed. Calling Shulker VPS API...');
    }, 1200);

    setTimeout(() => {
      setProvisioningProgress(65);
      setProvisioningStageText(`Provisioning ${plan.vcpu} vCPU / ${plan.ramGB} GB RAM KVM instance...`);
    }, 2400);

    setTimeout(() => {
      setProvisioningProgress(85);
      setProvisioningStageText(`Installing ${operatingSystem} & configuring static IP...`);
    }, 3800);

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
      });

      setProvisioningProgress(100);
      setDeploymentStep('completed');
      setIsSubmitting(false);

      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
      } catch (e) {}
    }, 5200);
  };

  // 1. Provisioning Screen
  if (deploymentStep === 'provisioning') {
    return (
      <div className="min-h-screen bg-[#070A0F] text-slate-100 font-sans pt-28 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full mx-4 p-8 bg-[#0B0F17] border border-slate-800 rounded-3xl shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0096C7]/10 border border-[#0096C7]/30 text-[#0096C7] flex items-center justify-center mx-auto shadow-lg">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">Deploying Your VPS Instance</h2>
            <p className="text-xs font-mono text-slate-400">Automated Shulker Provisioning Engine</p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-[#0096C7] transition-all duration-500"
                style={{ width: `${provisioningProgress}%` }}
              />
            </div>
            <div className="text-xs font-mono text-[#0096C7] font-bold">
              {provisioningProgress}% • {provisioningStageText}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-left font-mono text-[11px] space-y-1 text-slate-400">
            <div>Target: India - Mumbai Tier IV Node</div>
            <div>Plan: {plan.name} ({plan.category.toUpperCase()})</div>
            <div>OS: {operatingSystem}</div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Server Ready Screen
  if (deploymentStep === 'completed' && provisionedServer) {
    return (
      <div className="min-h-screen bg-[#070A0F] text-slate-100 font-sans pt-28 pb-20">
        <div className="max-w-2xl mx-auto px-4 space-y-6">
          
          <div className="bg-[#0B0F17] border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
                PROVISIONING COMPLETE • SERVICE ACTIVE
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Your Server is Ready</h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Your instance has been deployed to the Mumbai datacenter and bound to your account.
              </p>
            </div>

            {/* Server Connection Information Card */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-500">Service ID:</span>
                <span className="text-white font-bold">{provisionedServer.serverId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-500">Static IPv4 Address:</span>
                <span className="text-[#0096C7] font-bold text-sm">{provisionedServer.ipAddress}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-500">Server Hostname:</span>
                <span className="text-white font-bold">{provisionedServer.hostname}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-500">Operating System:</span>
                <span className="text-white">{provisionedServer.os}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-500">Initial Root Password:</span>
                <span className="text-amber-400 font-bold">{provisionedServer.rootPassword}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">SSH Connect Command:</span>
                <span className="text-slate-300 font-mono">ssh root@{provisionedServer.ipAddress}</span>
              </div>
            </div>

            {/* Direct White-Label Panel & Client Portal CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={provisionedServer.panelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-6 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-bold text-xs shadow-lg shadow-[#0096C7]/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>Open VPS Control Panel</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenAccount}
                className="flex-1 py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs transition-colors"
              >
                View in Client Portal
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // 3. Checkout Form
  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 font-sans pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            onClick={onBackToHome}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Plans</span>
          </button>

          <div className="text-xs font-mono text-slate-400">
            Deploying: <strong className="text-white">{plan.name}</strong> ({plan.category.toUpperCase()})
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Configuration Form (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#0B0F17] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-black text-white">Configure Your VPS</h2>
                <p className="text-xs text-slate-400 mt-1 font-mono">Select hostname, OS template, and review billing term.</p>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                
                {/* 1. Datacenter Region */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase text-slate-400">
                    1. Datacenter Location
                  </label>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🇮🇳</span>
                      <div>
                        <div className="text-xs font-bold text-white">Mumbai, India</div>
                        <div className="text-[11px] font-mono text-slate-400">Tier IV Datacenter • NIXI Peering (&lt;5ms)</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ACTIVE NODE
                    </span>
                  </div>
                </div>

                {/* 2. Billing Cycle */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase text-slate-400">
                    2. Billing Term
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBillingCycle('monthly')}
                      className={`p-4 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                        billingCycle === 'monthly'
                          ? 'bg-[#0096C7]/10 border-[#0096C7] text-white'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">Monthly Billing</div>
                      <div className="text-sm font-black text-[#0096C7] mt-1">₹{basePrice}/mo</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBillingCycle('quarterly')}
                      className={`p-4 rounded-xl border text-left font-mono transition-all cursor-pointer relative ${
                        billingCycle === 'quarterly'
                          ? 'bg-[#0096C7]/10 border-[#0096C7] text-white'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        SAVE 15%
                      </div>
                      <div className="font-bold text-xs text-white">Quarterly Billing</div>
                      <div className="text-sm font-black text-emerald-400 mt-1">₹{effectiveMonthly}/mo</div>
                    </button>
                  </div>
                </div>

                {/* 3. Server Hostname & OS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
                      3. Server Hostname
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="kh-node-01"
                      value={hostname}
                      onChange={(e) => setHostname(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-[#0096C7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
                      4. Operating System
                    </label>
                    <select
                      value={operatingSystem}
                      onChange={(e) => setOperatingSystem(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-[#0096C7] cursor-pointer"
                    >
                      {KRYONHOST_CONFIG.operatingSystems.map((os) => (
                        <option key={os} value={os}>{os}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 5. Customer Contact Info */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <label className="block text-xs font-mono font-bold uppercase text-slate-400">
                    5. Delivery & Account Information
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-[#0096C7]"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-[#0096C7]"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Notice */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-300 font-bold">
                    <span className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Cashfree Automated Payment Gateway</span>
                    </span>
                    <span className="text-emerald-400 text-[10px]">Instant Provisioning</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Supports UPI (GPay, PhonePe, Paytm), Cards, and NetBanking. VPS is provisioned upon payment confirmation.
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-mono">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={confirmationAgreed}
                      onChange={(e) => setConfirmationAgreed(e.target.checked)}
                      className="mt-0.5 rounded bg-slate-900 border-slate-800 text-[#0096C7] accent-[#0096C7]"
                    />
                    <span>
                      I agree to the Terms of Service. Server management will be accessible via the white-label control panel.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting || !confirmationAgreed}
                    className="w-full py-4 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white text-xs font-mono font-bold shadow-lg shadow-[#0096C7]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{totalAmountToday.toLocaleString('en-IN')} & Deploy VPS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* Order Summary Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0B0F17] border border-slate-800 rounded-2xl p-6 space-y-5 sticky top-28 shadow-xl">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-mono font-bold uppercase text-slate-200">Order Summary</h3>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Selected Tier:</span>
                  <span className="text-white font-bold">{plan.name}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Performance Class:</span>
                  <span className="text-[#0096C7] font-bold uppercase">{plan.category}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Compute Core:</span>
                  <span className="text-white">{plan.vcpu} vCPU ({plan.cpuArchitecture})</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Memory Pool:</span>
                  <span className="text-white font-bold">{plan.ramGB} GB RAM</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Storage Volume:</span>
                  <span className="text-white">{plan.storageNVMeGB} GB NVMe</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Network Port:</span>
                  <span className="text-white">{plan.bandwidth}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>DDoS Mitigation:</span>
                  <span className="text-emerald-400">Always-On</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Snapshots:</span>
                  <span className="text-slate-200">Included</span>
                </div>
              </div>

              {/* Total Due Card */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono">
                <div className="text-[10px] text-slate-500 uppercase font-bold">
                  TOTAL DUE TODAY ({billingCycle.toUpperCase()})
                </div>
                <div className="text-2xl font-black text-white">
                  ₹{totalAmountToday.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400">
                  Effective: <span className="text-[#0096C7] font-bold">₹{effectiveMonthly}/month</span>
                </div>

                {totalSavings > 0 && (
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                    Saved ₹{totalSavings.toLocaleString('en-IN')} with quarterly term
                  </div>
                )}
              </div>

              <div className="text-[11px] font-mono text-slate-500 space-y-1">
                <div>• Provisioning initiated immediately upon payment</div>
                <div>• Zero long-term lock-in contract</div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
