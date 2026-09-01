import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ArrowRight, Terminal, User as UserIcon, LogOut, ShieldCheck, CheckCircle2, ChevronDown, CreditCard } from 'lucide-react';

import { HeaderAnnouncement } from './HeaderAnnouncement';

interface NavbarProps {
  onOpenPreOrder: (planId?: string) => void;
  onOpenLogin: (mode?: 'signin' | 'signup') => void;
  onOpenDocs: () => void;
  onOpenBilling: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPreOrder, onOpenLogin, onOpenDocs, onOpenBilling, onOpenAdmin }) => {
  const { user, userProfile, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const userEmail = (user as any)?.email || 'user@kryonhost.com';
  const displayName = userProfile?.fullName || (user as any)?.fullName || userEmail.split('@')[0];

  const navLinks = [
    { name: 'Compute VPS', href: '#vps-plans' },
    { name: 'Pricing Plans', href: '#vps-plans' },
    { name: 'Features', href: '#features' },
    { name: 'Datacenters', href: '#locations' },
    { name: 'Control Panel', href: '#control-panel' },
    { name: 'Status', href: '#status' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-200">
      {/* Top Header Announcement */}
      <HeaderAnnouncement onOpenPreOrder={() => onOpenPreOrder('performance')} />

      {/* Main Navbar Bar */}
      <div
        className={`w-full transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm'
            : 'bg-white py-4 border-b border-slate-200/80'
        }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="focus:outline-none">
          <Logo size="md" />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={onOpenDocs}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5 text-[#0096C7]" />
            Docs
          </button>
        </nav>

        {/* Actions Section */}
        <div className="hidden sm:flex items-center space-x-3">
          {user ? (
            /* PROMINENT LOGGED-IN ACCOUNT INDICATOR BADGE (Replaces Log In / Create Account buttons) */
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="px-3.5 py-2 rounded-xl bg-[#E0F2FE] border border-[#0096C7]/30 text-xs font-extrabold text-slate-900 flex items-center gap-2 hover:bg-[#0096C7]/15 transition-all shadow-sm"
              >
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>

                <div className="w-5 h-5 rounded-full bg-[#0096C7] text-white flex items-center justify-center text-[10px] font-black uppercase">
                  {displayName.charAt(0)}
                </div>

                <div className="text-left font-mono leading-none">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase block">Logged In</span>
                  <span className="text-xs font-black text-slate-900 max-w-[110px] truncate block">
                    {displayName}
                  </span>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-[#0096C7]" />
              </button>

              {/* User Account Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-slate-200 shadow-2xl py-2 z-50 text-xs animate-in fade-in duration-100">
                  <div className="px-4 py-3 border-b border-slate-100 font-mono space-y-1">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account Profile</div>
                    <div className="font-extrabold text-slate-900 truncate text-xs">{displayName}</div>
                    <div className="text-[11px] text-slate-500 truncate">{userEmail}</div>
                    <div className="pt-1">
                      <span className="px-2 py-0.5 rounded bg-[#E0F2FE] text-[#0096C7] text-[10px] font-extrabold">
                        🟢 Verified {userProfile?.role || 'Customer'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenPreOrder();
                    }}
                    className="w-full px-4 py-2.5 text-left text-slate-700 hover:bg-slate-50 font-bold flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#0096C7]" />
                    My Pre-Orders & VPS
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenBilling();
                    }}
                    className="w-full px-4 py-2.5 text-left text-slate-700 hover:bg-slate-50 font-bold flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4 text-[#0096C7]" />
                    Billing & Tax Invoices
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full px-4 py-2.5 text-left text-purple-700 hover:bg-purple-50 font-black flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    Admin Control Panel 👑
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full px-4 py-2.5 text-left text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Sign Out (Restores Log In)
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out Buttons */
            <>
              <button
                onClick={() => onOpenLogin('signin')}
                className="px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenLogin('signup')}
                className="px-4 py-2 text-xs font-bold text-[#0096C7] bg-[#E0F2FE] hover:bg-[#0096C7] hover:text-white rounded-xl border border-[#0096C7]/30 transition-all cursor-pointer"
              >
                Create Account
              </button>
            </>
          )}

          <button
            onClick={() => onOpenPreOrder()}
            className="px-5 py-2 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-extrabold text-xs shadow-md shadow-[#0096C7]/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Pre-Order VPS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex lg:hidden items-center space-x-2">
          <button
            onClick={() => onOpenPreOrder()}
            className="px-3 py-1.5 rounded-lg bg-[#0096C7] text-white text-xs font-extrabold"
          >
            Pre-Order
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col space-y-2">
            {user ? (
              <div className="p-3 rounded-xl bg-[#E0F2FE] border border-[#0096C7]/30 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-extrabold text-slate-900">Logged in as {displayName}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="w-full py-2 rounded-lg bg-rose-600 text-white font-extrabold text-xs"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin('signin');
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-center text-xs font-bold text-slate-800 bg-slate-50"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin('signup');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#E0F2FE] border border-[#0096C7]/30 text-center text-xs font-bold text-[#0096C7]"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      )}
      </div>
    </header>
  );
};
