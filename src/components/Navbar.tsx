import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { 
  Server, Gamepad2, FileText, Activity, Network, BookOpen, 
  HelpCircle, ChevronDown, User, LogOut, ArrowRight, Menu, X, 
  ShieldCheck, Terminal, ExternalLink 
} from 'lucide-react';
import { KRYONHOST_CONFIG } from '../config/kryonhost.config';

interface NavbarProps {
  onNavigate: (view: 'home' | 'checkout' | 'account' | 'status' | 'network' | 'docs' | 'api-docs') => void;
  onOpenLogin: (mode?: 'signin' | 'signup') => void;
  onSelectPlan?: (planId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onOpenLogin, onSelectPlan }) => {
  const { user, userProfile, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userEmail = (user as any)?.email || '';
  const displayName = userProfile?.fullName || (user as any)?.fullName || userEmail.split('@')[0] || 'Account';
  const isOwnerAdmin = userEmail.toLowerCase() === 'tejasjha.in@gmail.com';

  const scrollToSection = (id: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    onNavigate('home');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-200">
      <div
        className={`w-full transition-all duration-200 ${
          scrolled
            ? 'bg-[#070A0F]/95 backdrop-blur-md border-b border-slate-800 py-3.5 shadow-xl shadow-black/40'
            : 'bg-[#070A0F]/80 backdrop-blur-sm border-b border-slate-800/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between" ref={dropdownRef}>
          
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 focus:outline-none cursor-pointer"
          >
            <Logo size="md" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 font-sans">
            
            {/* Products Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'products' ? null : 'products')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeDropdown === 'products' ? 'text-white bg-slate-900' : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span>Products</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'products' ? 'rotate-180 text-[#0096C7]' : 'text-slate-500'}`} />
              </button>

              {activeDropdown === 'products' && (
                <div className="absolute left-0 mt-2 w-72 bg-[#0B0F17] border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => scrollToSection('vps-hosting')}
                    className="w-full p-3 rounded-xl hover:bg-slate-900/80 transition-colors flex items-start gap-3 text-left cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[#0096C7] group-hover:border-[#0096C7]/40 shrink-0">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-100 group-hover:text-[#0096C7] transition-colors">VPS Hosting</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Budget, Standard, Performance & Power tiers</div>
                    </div>
                  </button>

                  <button
                    onClick={() => scrollToSection('game-hosting')}
                    className="w-full p-3 rounded-xl hover:bg-slate-900/80 transition-colors flex items-start gap-3 text-left cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-purple-400 group-hover:border-purple-500/40 shrink-0">
                      <Gamepad2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-100 group-hover:text-purple-400 transition-colors">Game Server Hosting</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Minecraft, Palworld, Rust & high-tickrate nodes</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'resources' ? null : 'resources')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeDropdown === 'resources' ? 'text-white bg-slate-900' : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span>Resources</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180 text-[#0096C7]' : 'text-slate-500'}`} />
              </button>

              {activeDropdown === 'resources' && (
                <div className="absolute left-0 mt-2 w-64 bg-[#0B0F17] border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      onNavigate('docs');
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-900/80 transition-colors flex items-center gap-3 text-left cursor-pointer group"
                  >
                    <FileText className="w-4 h-4 text-[#0096C7]" />
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white">Documentation</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      onNavigate('status');
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-900/80 transition-colors flex items-center gap-3 text-left cursor-pointer group"
                  >
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white">System Status</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      onNavigate('network');
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-900/80 transition-colors flex items-center gap-3 text-left cursor-pointer group"
                  >
                    <Network className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white">Network & Latency</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      onNavigate('api-docs');
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-900/80 transition-colors flex items-center gap-3 text-left cursor-pointer group"
                  >
                    <Terminal className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white">API Reference</span>
                  </button>
                </div>
              )}
            </div>

            {/* Company Link */}
            <button
              onClick={() => scrollToSection('contact-support')}
              className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900/60 rounded-lg transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right Action Section */}
          <div className="hidden sm:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2 hover:border-[#0096C7]/50 transition-all cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="max-w-[120px] truncate">{displayName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#0B0F17] border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in duration-100 font-sans">
                    <div className="px-3 py-2.5 border-b border-slate-800 text-xs">
                      <div className="font-bold text-slate-100 truncate">{displayName}</div>
                      <div className="text-[11px] font-mono text-slate-400 truncate">{userEmail}</div>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('account');
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-slate-900 transition-colors flex items-center gap-2.5 text-left text-xs font-bold text-slate-200 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#0096C7]" />
                      <span>Client Portal</span>
                    </button>

                    <a
                      href="https://panel.kryonhost.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-2.5 rounded-xl hover:bg-slate-900 transition-colors flex items-center justify-between text-left text-xs font-bold text-purple-400 cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <Server className="w-4 h-4 text-purple-400" />
                        <span>VPS Control Panel</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <div className="border-t border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-rose-950/40 text-rose-400 transition-colors flex items-center gap-2.5 text-left text-xs font-bold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenLogin('signin')}
                className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
              >
                Log In
              </button>
            )}

            <button
              onClick={() => scrollToSection('vps-hosting')}
              className="px-4 py-2 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white font-bold text-xs shadow-lg shadow-[#0096C7]/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Deploy Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => scrollToSection('vps-hosting')}
              className="px-3 py-1.5 rounded-lg bg-[#0096C7] text-white text-xs font-bold"
            >
              Deploy
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070A0F] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 font-sans">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => scrollToSection('vps-hosting')}
              className="px-3 py-2 text-sm font-semibold text-slate-200 text-left hover:bg-slate-900 rounded-lg"
            >
              VPS Hosting
            </button>
            <button
              onClick={() => scrollToSection('game-hosting')}
              className="px-3 py-2 text-sm font-semibold text-slate-200 text-left hover:bg-slate-900 rounded-lg"
            >
              Game Server Hosting
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('docs');
              }}
              className="px-3 py-2 text-sm font-semibold text-slate-200 text-left hover:bg-slate-900 rounded-lg"
            >
              Documentation
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('status');
              }}
              className="px-3 py-2 text-sm font-semibold text-slate-200 text-left hover:bg-slate-900 rounded-lg"
            >
              Status Page
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('network');
              }}
              className="px-3 py-2 text-sm font-semibold text-slate-200 text-left hover:bg-slate-900 rounded-lg"
            >
              Network & Latency
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('account');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Open Client Portal
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin('signin');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
