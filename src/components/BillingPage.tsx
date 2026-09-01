import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, CreditCard, Receipt, ShieldCheck, Download, Zap, CheckCircle2, ArrowRight, Clock, MapPin, Key, DollarSign, QrCode, Lock, RefreshCw, FileText, Search, Filter, Plus, ExternalLink, Printer, Sparkles, AlertCircle, ChevronRight, Check, Copy } from 'lucide-react';

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

  if (!isOpen) return null;

  const displayName = userProfile?.fullName || (user as any)?.fullName || user?.email?.split('@')[0] || 'Founding Customer';
  const userEmail = user?.email || 'customer@kryonhost.com';

  // User verified pre-order invoices (starts clean for real account orders)
  const [userInvoices, setUserInvoices] = useState<any[]>([]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Top Header & Branding Bar */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#E0F2FE] text-[#0096C7] border border-[#0096C7]/30 shadow-sm">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Billing & Invoice Management</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-mono font-extrabold border border-emerald-300">
                  VERIFIED ACCOUNT 🟢
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                View Past Receipts, Manage Active VPS Subscriptions, and Download Tax Invoices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenPreOrder()}
              className="px-4 py-2 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-extrabold text-xs shadow-md shadow-[#0096C7]/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Order VPS</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
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
            <div className="font-extrabold text-[#0096C7] text-xs truncate">🇮🇳 India - Mumbai</div>
            <div className="text-slate-500 text-[11px]">Tier IV Facility</div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm space-y-0.5">
            <div className="text-slate-400 text-[10px] font-bold uppercase">Founding Perks</div>
            <div className="font-extrabold text-emerald-700 text-xs truncate">+4 GB Permanent RAM</div>
            <div className="text-slate-500 text-[11px]">Lock-In Rate Guaranteed</div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-[10px] font-bold uppercase">Total Pre-Orders</div>
              <div className="font-black text-slate-900 text-sm">2 Paid Services</div>
            </div>
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${currency === 'INR' ? 'bg-[#0096C7] text-white' : 'text-slate-600'}`}
              >
                INR (₹)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${currency === 'USD' ? 'bg-[#0096C7] text-white' : 'text-slate-600'}`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 px-6 font-mono text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-3.5 px-5 font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'invoices'
                ? 'border-[#0096C7] text-[#0096C7] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4" />
            Tax Invoices & Receipts (2)
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`py-3.5 px-5 font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'subscriptions'
                ? 'border-[#0096C7] text-[#0096C7] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-[#0096C7]" />
            Active VPS Subscriptions
          </button>
          <button
            onClick={() => setActiveTab('methods')}
            className={`py-3.5 px-5 font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'methods'
                ? 'border-[#0096C7] text-[#0096C7] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Payment Methods
          </button>
          <button
            onClick={() => setActiveTab('perks')}
            className={`py-3.5 px-5 font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'perks'
                ? 'border-[#0096C7] text-[#0096C7] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Founding Perks & Rewards
          </button>
        </div>

        {/* Body Content Container */}
        <div className="p-6 space-y-6 max-h-[68vh] overflow-y-auto">
          {/* TAB 1: Invoices & Tax Receipts */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              {/* Search & Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search invoices by ID or plan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0096C7]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert('Downloading complete PDF statements archive...')}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold font-mono transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#0096C7]" />
                    <span>Export Statement</span>
                  </button>
                </div>
              </div>

              {/* Invoices List */}
              <div className="space-y-3">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((inv) => (
                    <div
                      key={inv.invoiceId}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-[#0096C7]/50 transition-all shadow-sm space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#0096C7]" />
                          <span className="font-black text-slate-900">{inv.invoiceId}</span>
                          <button
                            onClick={() => handleCopyInvoice(inv.invoiceId)}
                            className="text-slate-400 hover:text-slate-800"
                          >
                            {copiedInvoiceId === inv.invoiceId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <span className="text-slate-300">|</span>
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
                          <span className="font-bold text-slate-900">{inv.billingCycle}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Payment Method</span>
                          <span className="font-bold text-slate-700">{inv.paymentMethod}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Datacenter</span>
                          <span className="font-extrabold text-[#0096C7]">🇮🇳 India - Mumbai</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400">{inv.taxINR}</span>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors"
                          >
                            View Receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 rounded-2xl border border-slate-200 bg-slate-50 text-center space-y-3 font-mono">
                    <Receipt className="w-8 h-8 text-[#0096C7] mx-auto" />
                    <div className="text-sm font-bold text-slate-900">No Tax Invoices Found</div>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Pre-order a VPS instance to generate your verified payment receipts and tax invoices here.
                    </p>
                    <button
                      onClick={() => onOpenPreOrder()}
                      className="px-5 py-2.5 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white text-xs font-black shadow-md inline-flex items-center gap-1.5 cursor-pointer mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Pre-Order VPS</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Active VPS Subscriptions */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Active VPS Subscriptions & Reservations
                </h4>
                <button
                  onClick={onOpenPreOrder}
                  className="px-4 py-2 rounded-xl bg-[#0096C7] text-white font-extrabold text-xs shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Pre-Order Another VPS</span>
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-slate-900">Performance VPS Instance</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0096C7] text-[10px] font-bold">
                      🇮🇳 India - Mumbai Datacenter
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs border border-emerald-300">
                    PREORDER_CONFIRMED 🟢
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">vCPU Cores</span>
                    <span className="font-bold text-slate-900">4 vCPU Cores</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Memory (RAM)</span>
                    <span className="font-black text-slate-900 text-sm">12 GB RAM (8GB + 4GB Bonus)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Storage</span>
                    <span className="font-bold text-slate-900">100 GB PCIe NVMe</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Effective Rate</span>
                    <span className="font-extrabold text-[#0096C7]">₹509/mo (12 Months Term)</span>
                  </div>
                </div>

                {/* Auto-Renew Control */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Auto-Renewal Status</div>
                    <div className="text-[11px] text-slate-500">Locks in founding price rate at end of billing cycle</div>
                  </div>

                  <button
                    onClick={() => setAutoRenewEnabled(!autoRenewEnabled)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      autoRenewEnabled
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {autoRenewEnabled ? 'AUTO-RENEW ON 🟢' : 'AUTO-RENEW OFF'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Payment Methods */}
          {activeTab === 'methods' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Saved Payment Methods & Default Checkout
                </h4>
                <button
                  onClick={() => alert('Add Payment Method dialog')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-[#0096C7]" />
                  <span>Add New Payment Method</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-[#E0F2FE] text-[#0096C7]">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">UPI / GPay / PhonePe</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">alex@upi (Default)</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-[10px]">
                    DEFAULT
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-slate-100 text-slate-700">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Visa ending in 4111</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Expires 12/28</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                    SAVED
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Founding Perks */}
          {activeTab === 'perks' && (
            <div className="space-y-4 font-mono text-xs">
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Founding Customer Rewards & Benefits
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="font-black text-amber-900 text-sm flex items-center gap-1.5">
                    <Zap className="w-4 h-4 fill-amber-500 text-amber-500" /> +4 GB Permanent RAM
                  </div>
                  <div className="text-slate-600 text-xs">
                    Your account holds founding status. +4 GB RAM is applied permanently to your VPS instance.
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="font-black text-emerald-900 text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Lifetime Rate Lock
                  </div>
                  <div className="text-slate-600 text-xs">
                    Your pre-order price is locked forever and will never increase upon future renewals.
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <div className="font-black text-blue-900 text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#0096C7]" /> Priority Node Queue
                  </div>
                  <div className="text-slate-600 text-xs">
                    Guaranteed first allocation at India - Mumbai Datacenter at launch.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selected Invoice Receipt Detail Modal Overlay */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-black text-slate-900 text-sm">Receipt #{selectedInvoice.invoiceId}</h4>
                <button onClick={() => setSelectedInvoice(null)} className="p-1 rounded text-slate-400 hover:text-slate-900">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan:</span>
                  <span className="font-bold text-slate-900">{selectedInvoice.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-bold text-slate-900">{selectedInvoice.billingCycle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Paid Today:</span>
                  <span className="font-black text-[#0096C7] text-sm">{currency === 'INR' ? selectedInvoice.amountPaidINR : selectedInvoice.amountPaidUSD}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment ID:</span>
                  <span className="font-bold text-slate-900">{selectedInvoice.paymentId}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => {
                    alert(`Printing Tax Invoice ${selectedInvoice.invoiceId}`);
                    setSelectedInvoice(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#0096C7] text-white font-extrabold shadow"
                >
                  Print PDF Receipt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <span className="text-slate-500">KryonHost Enterprise Billing Portal • SSL 256-Bit Encrypted</span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Billing Portal
          </button>
        </div>
      </div>
    </div>
  );
};
