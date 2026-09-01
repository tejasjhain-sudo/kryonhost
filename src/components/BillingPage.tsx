import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, CreditCard, Receipt, ShieldCheck, Download, Zap, CheckCircle2, ArrowRight, Clock, MapPin, Key, DollarSign, QrCode, Lock, RefreshCw, FileText, Search, Filter, Plus, ExternalLink, Printer, Sparkles, AlertCircle, ChevronRight, Check, Copy, ArrowLeft } from 'lucide-react';

interface BillingPageProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPreOrder: () => void;
}

export const BillingPage: React.FC<BillingPageProps> = ({ isOpen, onClose, onOpenPreOrder }) => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'invoices' | 'subscriptions' | 'methods' | 'perks'>('invoices');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [copiedInvoiceId, setCopiedInvoiceId] = useState<string | null>(null);

  // Auto-renew toggle state for sample active subscription
  const [autoRenewEnabled, setAutoRenewEnabled] = useState(true);

  // ESC Key listener to close modal easily
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayName = userProfile?.fullName || (user as any)?.fullName || user?.email?.split('@')[0] || 'Founding Customer';
  const userEmail = user?.email || 'customer@kryonhost.com';

  // User verified pre-order invoices (starts clean for real account orders)
  const userInvoices: any[] = [];

  const filteredInvoices = userInvoices.filter(inv =>
    inv.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.planName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyInvoice = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedInvoiceId(id);
    setTimeout(() => setCopiedInvoiceId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150 font-sans">
      
      {/* Backdrop Click to Exit */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-6 z-10">
        
        {/* Top Header & Back Button Bar */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Billing & Invoices</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-mono font-extrabold border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>VERIFIED ACCOUNT</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                View Past Receipts, Manage Active VPS Subscriptions, and Download Tax Invoices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenPreOrder();
              }}
              className="px-4 py-2 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-extrabold text-xs shadow-md shadow-[#0096C7]/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Order VPS</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close Billing Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Customer Account Summary Bar */}
        <div className="p-5 bg-slate-50/80 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm space-y-0.5">
            <div className="text-slate-400 text-[10px] font-bold uppercase">Billed Customer</div>
            <div className="font-extrabold text-slate-900 text-xs truncate">{displayName}</div>
            <div className="text-slate-500 text-[11px] truncate">{userEmail}</div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm space-y-0.5">
            <div className="text-slate-400 text-[10px] font-bold uppercase">Primary Datacenter</div>
            <div className="font-extrabold text-[#0096C7] text-xs truncate">India - Mumbai Node</div>
            <div className="text-slate-500 text-[11px]">Tier IV Facility</div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm space-y-0.5">
            <div className="text-slate-400 text-[10px] font-bold uppercase">Founding Perks</div>
            <div className="font-extrabold text-emerald-700 text-xs truncate">+4 GB Permanent RAM</div>
            <div className="text-slate-500 text-[11px]">Lock-In Rate Guaranteed</div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-[10px] font-bold uppercase">Display Currency</div>
              <div className="font-extrabold text-slate-900 text-xs">{currency}</div>
            </div>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2 py-1 rounded text-[10px] font-bold ${currency === 'INR' ? 'bg-[#0096C7] text-white' : 'text-slate-600'}`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-1 rounded text-[10px] font-bold ${currency === 'USD' ? 'bg-[#0096C7] text-white' : 'text-slate-600'}`}
              >
                $ USD
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 font-mono text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-4 px-4 font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'invoices'
                ? 'border-[#0096C7] text-[#0096C7] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Tax Invoices ({filteredInvoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`py-4 px-4 font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'subscriptions'
                ? 'border-[#0096C7] text-[#0096C7] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Active Subscriptions</span>
          </button>

          <button
            onClick={() => setActiveTab('methods')}
            className={`py-4 px-4 font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'methods'
                ? 'border-[#0096C7] text-[#0096C7] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Cashfree Payment Gateways</span>
          </button>

          <button
            onClick={() => setActiveTab('perks')}
            className={`py-4 px-4 font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'perks'
                ? 'border-[#0096C7] text-[#0096C7] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Founding Perks & Credits</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          
          {activeTab === 'invoices' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by Invoice ID or Plan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0096C7] font-mono"
                  />
                </div>

                <div className="text-xs font-mono text-slate-500">
                  Showing <strong>{filteredInvoices.length}</strong> Tax Invoices
                </div>
              </div>

              {filteredInvoices.length > 0 ? (
                <div className="space-y-4">
                  {filteredInvoices.map((inv) => (
                    <div
                      key={inv.invoiceId}
                      className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#0096C7]/50 transition-all shadow-sm space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#0096C7]">{inv.invoiceId}</span>
                          <button
                            onClick={() => handleCopyInvoice(inv.invoiceId)}
                            className="p-1 text-slate-400 hover:text-slate-700"
                            title="Copy Invoice ID"
                          >
                            {copiedInvoiceId === inv.invoiceId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <span className="text-slate-400">|</span>
                          <span className="text-slate-500">Issued: {inv.date}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-black text-[10px] border border-emerald-300">
                            {inv.status}
                          </span>
                          <span className="font-black text-slate-900 text-sm">
                            {currency === 'INR' ? inv.amountPaidINR : inv.amountPaidUSD}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px]">VPS Service Plan</span>
                          <span className="font-bold text-slate-900">{inv.planName}</span>
                          <span className="text-[10px] text-slate-500 block">{inv.specs}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Billing Term</span>
                          <span className="font-bold text-emerald-700">{inv.billingCycle}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Gateway Reference</span>
                          <span className="font-bold text-slate-700">{inv.paymentId}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Datacenter Node</span>
                          <span className="font-bold text-slate-900">{inv.location}</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => window.print()}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Tax Receipt</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3 font-mono">
                  <div className="w-12 h-12 rounded-2xl bg-white text-slate-400 border border-slate-200 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">No Tax Invoices Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    You have not completed any pre-orders on this account yet. Pre-orders placed via Cashfree Gateway will automatically generate official tax invoices here.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPreOrder();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-black text-xs shadow-md cursor-pointer"
                  >
                    + Pre-Order VPS Instance
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="space-y-4 font-mono">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-[#E0F2FE] text-[#0096C7]">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Founding VPS Reservation Status</h4>
                      <p className="text-xs text-slate-500">Tier IV Mumbai Datacenter Node</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-300">
                    SLOT GUARANTEED
                  </span>
                </div>

                <div className="text-xs text-slate-600 leading-relaxed font-sans">
                  Upon physical datacenter node provisioning in Mumbai, your instance will immediately go live with <strong>+4 GB Permanent Bonus RAM</strong>.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'methods' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900">Supported Cashfree Payment Options</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                    OFFICIAL GATEWAY
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="font-bold text-slate-900">UPI Instant</div>
                    <div className="text-[11px] text-slate-500">GPay, PhonePe, Paytm, BHIM</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="font-bold text-slate-900">Cards & NetBanking</div>
                    <div className="text-[11px] text-slate-500">Visa, Mastercard, RuPay</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="font-bold text-slate-900">Instant Verification</div>
                    <div className="text-[11px] text-slate-500">Automated Order Lock</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'perks' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-6 rounded-2xl bg-[#E0F2FE]/60 border border-[#0096C7]/30 space-y-3">
                <div className="flex items-center gap-2 text-[#0096C7] font-black text-sm">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Founding Perks Summary</span>
                </div>
                <ul className="space-y-2 text-slate-700 text-xs">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>+4 GB Permanent Launch RAM Bonus added to your instance for life.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Locked-in pre-order rate guarantee upon physical datacenter node provisioning.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>100% Risk-Free: Fully refundable anytime prior to server provisioning.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Footer Bar with Back to Home Action */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 font-mono font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Billing & Return to Website</span>
          </button>

          <span className="text-[11px] font-mono text-slate-400">
            Press ESC key to exit
          </span>
        </div>

      </div>
    </div>
  );
};
