import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { HeaderAnnouncement } from './components/HeaderAnnouncement';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustStrip } from './components/TrustStrip';
import { Pricing } from './components/Pricing';
import { ServerCalculator } from './components/ServerCalculator';
import { GameHosting } from './components/GameHosting';
import { OSCatalog } from './components/OSCatalog';
import { HardwareSpecs } from './components/HardwareSpecs';
import { LatencyMatrix } from './components/LatencyMatrix';
import { ComparisonTable } from './components/ComparisonTable';
import { SecuritySection } from './components/SecuritySection';
import { NetworkSection } from './components/NetworkSection';
import { SupportBanner } from './components/SupportBanner';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { CheckoutPage } from './components/CheckoutPage';
import { CustomerAccount } from './components/CustomerAccount';
import { StatusPage } from './components/StatusPage';
import { NetworkPage } from './components/NetworkPage';
import { DocsPage } from './components/DocsPage';
import { APIDocsPage } from './components/APIDocsPage';
import { AuthModal } from './components/AuthModal';
import { AIChatBot } from './components/AIChatBot';
import { CookieConsent } from './components/CookieConsent';
import { LegalModal } from './components/Modals';
import { Analytics } from '@vercel/analytics/react';

export type AppView = 'home' | 'checkout' | 'account' | 'status' | 'network' | 'docs' | 'api-docs';

export function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('performance-16gb');
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<'monthly' | 'quarterly'>('monthly');

  // Modals & Panels
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState<'terms' | 'privacy' | 'refund' | 'aup'>('terms');

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPlan = (planId: string, billingCycle: 'monthly' | 'quarterly' = 'monthly') => {
    setSelectedPlanId(planId);
    setSelectedBillingCycle(billingCycle);
    handleNavigate('checkout');
  };

  const handleSelectGamePlan = (gameId: string, planDetails: any) => {
    setSelectedPlanId('performance-8gb'); // Base high-clock node for game hosting
    handleNavigate('checkout');
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenLegal = (doc: 'terms' | 'privacy' | 'refund' | 'aup') => {
    setActiveLegalTab(doc);
    setLegalModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[#0096C7]/20 selection:text-[#0096C7] overflow-x-hidden font-sans">
      
      {/* Top Header Announcement Ticker */}
      <HeaderAnnouncement onExplore={() => {
        handleNavigate('home');
        setTimeout(() => {
          document.getElementById('vps-hosting')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }} />

      {/* Sticky Dark Navigation Bar */}
      <Navbar
        onNavigate={handleNavigate}
        onOpenLogin={(mode) => handleOpenAuth(mode || 'signin')}
        onSelectPlan={handleSelectPlan}
      />

      {/* Main View Router */}
      <main>
        {currentView === 'checkout' ? (
          <CheckoutPage
            selectedPlanId={selectedPlanId}
            initialBillingCycle={selectedBillingCycle}
            onBackToHome={() => handleNavigate('home')}
            onOpenAccount={() => handleNavigate('account')}
          />
        ) : currentView === 'account' ? (
          <CustomerAccount
            onBackToHome={() => handleNavigate('home')}
            onDeployNew={() => handleNavigate('home')}
          />
        ) : currentView === 'status' ? (
          <StatusPage onBackToHome={() => handleNavigate('home')} />
        ) : currentView === 'network' ? (
          <NetworkPage onBackToHome={() => handleNavigate('home')} />
        ) : currentView === 'docs' ? (
          <DocsPage onBackToHome={() => handleNavigate('home')} />
        ) : currentView === 'api-docs' ? (
          <APIDocsPage onBackToHome={() => handleNavigate('home')} />
        ) : (
          /* HOME LANDING PAGE - 13 RICH TECHNICAL SECTIONS */
          <div>
            {/* 1. Hero Section */}
            <Hero
              onExploreVPS={() => {
                document.getElementById('vps-hosting')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreGame={() => {
                document.getElementById('game-hosting')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 2. Trust Strip */}
            <TrustStrip />

            {/* 3. VPS Hosting Pricing Section (Budget, Standard, Performance, Power) */}
            <Pricing onSelectPlan={handleSelectPlan} />

            {/* 4. Interactive Custom Server Calculator */}
            <ServerCalculator onSelectPlan={handleSelectPlan} />

            {/* 5. Game Server Hosting Section (Minecraft + Supported Games) */}
            <GameHosting onSelectGamePlan={handleSelectGamePlan} />

            {/* 6. OS & 1-Click App Catalog */}
            <OSCatalog />

            {/* 7. Enterprise Hardware Node Specifications */}
            <HardwareSpecs />

            {/* 8. Regional India Latency Matrix & Looking Glass */}
            <LatencyMatrix />

            {/* 9. KryonHost vs Legacy Providers Comparison Table */}
            <ComparisonTable onExplore={() => handleNavigate('checkout')} />

            {/* 10. Security & DDoS Filtering Shield */}
            <SecuritySection />

            {/* 11. Packet Backbone Network Section */}
            <NetworkSection />

            {/* 12. Official Support Desk Banner */}
            <SupportBanner />

            {/* 13. Technical FAQ */}
            <FAQ onOpenRefundPolicy={() => handleOpenLegal('refund')} />
          </div>
        )}
      </main>

      {/* Dark Premium Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenLegal={handleOpenLegal}
      />

      {/* Floating Support Chatbot */}
      <AIChatBot onOpenPreOrder={() => handleNavigate('checkout')} />

      {/* First-Time Visitor Cookie Consent */}
      <CookieConsent onOpenPrivacy={() => handleOpenLegal('privacy')} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Legal Documents Modal (Terms, Privacy, Refund, AUP) */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        activeDoc={activeLegalTab}
      />

    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Analytics />
    </AuthProvider>
  );
}

export default App;
