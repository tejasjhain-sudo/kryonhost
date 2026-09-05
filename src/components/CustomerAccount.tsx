import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Server, CreditCard, Receipt, Shield, ExternalLink, RefreshCw, 
  CheckCircle2, ArrowLeft, Key, User, Lock, Mail, MessageSquare, 
  HelpCircle, Clock, Globe, ArrowRight 
} from 'lucide-react';
import { KRYONHOST_CONFIG } from '../config/kryonhost.config';

interface CustomerAccountProps {
  onBackToHome: () => void;
  onDeployNew: () => void;
}

export const CustomerAccount: React.FC<CustomerAccountProps> = ({ onBackToHome, onDeployNew }) => {
  const { user, userProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'orders' | 'billing' | 'support' | 'security'>('services');

  const displayName = userProfile?.fullName || (user as any)?.fullName || user?.email?.split('@')[0] || 'Customer';
  const userEmail = user?.email || 'customer@kryonhost.com';

  // Sample active services for this customer account
  const [services] = useState([
    {
      id: 'vps-srv-90812',
      name: 'Performance VPS (16 GB)',
      category: 'Performance Tier',
      planId: 'performance-16gb',
      ipAddress: '103.186.20.48',
      location: 'India - Mumbai Datacenter',
      status: 'Active',
      billingCycle: 'Monthly',
      monthlyPriceINR: 2019,
      nextRenewal: 'Oct 05, 2026',
      panelUrl: 'https://panel.kryonhost.com',
    },
  ]);

  // Sample order history
  const [orders] = useState([
    {
      orderId: 'KH-ORD-74921',
      date: 'Sep 05, 2026',
      service: 'Performance VPS (16 GB)',
      amount: '₹2,019',
      paymentMethod: 'Cashfree (UPI)',
      status: 'Completed',
    },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Return to Website"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">Client Portal</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300">
                  ACTIVE ACCOUNT
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Logged in as <strong>{displayName}</strong> ({userEmail})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onDeployNew}
              className="px-4 py-2 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>+ Deploy New Service</span>
            </button>

            <a
              href="https://panel.kryonhost.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>White-Label Control Panel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Portal Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Nav (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 space-y-1 font-mono text-xs shadow-sm">
              {[
                { id: 'services', label: 'My Services', icon: Server, badge: `${services.length}` },
                { id: 'orders', label: 'Orders & History', icon: Receipt },
                { id: 'billing', label: 'Billing & Invoices', icon: CreditCard },
                { id: 'support', label: 'Support Tickets', icon: MessageSquare },
                { id: 'security', label: 'Security & Access', icon: Shield },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full p-2.5 rounded-xl transition-all flex items-center justify-between text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#0096C7] text-white font-bold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Provider Panel Direct Redirection Box */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 font-mono text-xs shadow-sm">
              <div className="text-slate-900 font-bold flex items-center gap-2">
                <Server className="w-4 h-4 text-[#0096C7]" />
                <span>VPS Management Notice</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                VPS instances are managed through the white-label control panel with direct power actions, console, and snapshot access.
              </p>
              <a
                href="https://panel.kryonhost.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
              >
                <span>Open Control Panel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Main Content Area (9 Cols) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-slate-900">Active VPS & Services</h2>
                  <span className="text-xs font-mono text-slate-500">{services.length} Instance Running</span>
                </div>

                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 hover:border-[#0096C7] transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{srv.name}</h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300">
                            {srv.status}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-slate-500 mt-0.5">Service ID: {srv.id}</div>
                      </div>

                      {/* Manage Button redirecting to white-label panel */}
                      <a
                        href={srv.panelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <span>Manage VPS</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Static IPv4</span>
                        <span className="font-bold text-[#0096C7] text-xs mt-0.5 block">{srv.ipAddress}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Datacenter</span>
                        <span className="font-bold text-slate-800 text-xs mt-0.5 block">{srv.location}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Billing Term</span>
                        <span className="font-bold text-slate-800 text-xs mt-0.5 block">₹{srv.monthlyPriceINR}/mo ({srv.billingCycle})</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Next Renewal</span>
                        <span className="font-bold text-slate-800 text-xs mt-0.5 block">{srv.nextRenewal}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-black text-slate-900">Order History</h2>
                <div className="space-y-3 font-mono text-xs">
                  {orders.map((ord) => (
                    <div key={ord.orderId} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{ord.service}</div>
                        <div className="text-slate-500 mt-0.5">Order ID: {ord.orderId} • {ord.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-slate-900">{ord.amount}</div>
                        <div className="text-emerald-700 text-[10px] font-bold">{ord.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <h2 className="text-lg font-black text-slate-900">Billing & Invoices</h2>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
                  <div className="text-slate-800 font-bold">Payment Gateway: Cashfree (Automated)</div>
                  <p className="text-slate-600 font-sans text-xs">
                    Invoices are automatically settled through your linked payment method. Subscriptions can be upgraded, downgraded, or cancelled anytime.
                  </p>
                </div>
              </div>
            )}

            {/* Support Tab */}
            {activeTab === 'support' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-black text-slate-900">Technical Support Desk</h2>
                <p className="text-xs text-slate-600">
                  Need assistance with your VPS routing, reverse DNS (PTR), or hardware configuration?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-slate-500 text-[10px]">Email Desk</div>
                    <div className="font-bold text-slate-900">support@kryonhost.com</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-slate-500 text-[10px]">Hotline & WhatsApp</div>
                    <div className="font-bold text-emerald-700">+91 8750287172 (9am-5pm IST)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-black text-slate-900">Account Security & Access</h2>
                <p className="text-xs text-slate-600 font-sans">
                  Manage your account credentials, password updates, and session tokens.
                </p>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Account Password</div>
                    <div className="text-slate-500">Last updated: 2026</div>
                  </div>
                  <button className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs font-bold border border-slate-200">
                    Update
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
