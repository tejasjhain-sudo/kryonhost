import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { HeaderAnnouncement } from './components/HeaderAnnouncement';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PreOrderBanner } from './components/PreOrderBanner';
import { Pricing } from './components/Pricing';
import { Features } from './components/Features';
import { InfrastructureSpecs } from './components/InfrastructureSpecs';
import { Locations } from './components/Locations';
import { NetworkSection } from './components/NetworkSection';
import { SupportBanner } from './components/SupportBanner';
import { CustomerExperience } from './components/CustomerExperience';
import { StatusWidget } from './components/StatusWidget';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { CheckoutPage } from './components/CheckoutPage';
import { AuthModal } from './components/AuthModal';
import { BillingPage } from './components/BillingPage';
import { AdminPage } from './components/AdminPage';
import { AIChatBot } from './components/AIChatBot';
import { LegalModal, DocsModal } from './components/Modals';
import { Analytics } from '@vercel/analytics/react';

export function AppContent() {
  // Main Navigation View State: 'home' | 'checkout' | 'admin'
  const [currentView, setCurrentView] = useState<'home' | 'checkout' | 'admin'>('home');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('performance');

  // Modals & Panels
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [billingOpen, setBillingOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState<'terms' | 'privacy' | 'aup' | 'refund'>('terms');

  const handleOpenCheckout = (planId?: string) => {
    if (planId) {
      setSelectedPlanId(planId);
    }
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenLegal = (doc: 'terms' | 'privacy' | 'aup' | 'refund') => {
    setActiveLegalTab(doc);
    setLegalModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080B12] text-[#F8FAFC] selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden">
      {/* Navbar with Header Announcement */}
      <Navbar
        onOpenPreOrder={handleOpenCheckout}
        onOpenLogin={(mode) => handleOpenAuth(mode || 'signin')}
        onOpenDocs={() => setDocsOpen(true)}
        onOpenBilling={() => setBillingOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main View Routing */}
      {currentView === 'checkout' ? (
        /* DEDICATED FULL STANDALONE CHECKOUT PAGE */
        <CheckoutPage
          selectedPlanId={selectedPlanId}
          onBackToHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenBilling={() => setBillingOpen(true)}
        />
      ) : currentView === 'admin' ? (
        /* DEDICATED FULL STANDALONE ADMIN PORTAL PAGE */
        <AdminPage
          onBackToHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        /* HOME LANDING PAGE */
        <main>
          <Hero onOpenPreOrder={() => handleOpenCheckout('performance')} />

          {/* Founding Pre-Order Banner */}
          <PreOrderBanner onOpenPreOrder={() => handleOpenCheckout('performance')} />

          {/* VPS Pricing Plans */}
          <Pricing onSelectPlan={(planId) => handleOpenCheckout(planId)} />

          {/* Why KryonHost (Features) */}
          <Features />

          {/* Technical Infrastructure Specification Dashboard */}
          <InfrastructureSpecs />

          {/* Datacenter Locations */}
          <Locations />

          {/* Network Section */}
          <NetworkSection />

          {/* Official Support & Contact Banner */}
          <SupportBanner />

          {/* Customer Experience Grid */}
          <CustomerExperience />

          {/* Infrastructure Live Status Widget */}
          <StatusWidget />

          {/* FAQ Accordion */}
          <FAQ onOpenRefundPolicy={() => handleOpenLegal('refund')} />
        </main>
      )}

      {/* Footer */}
      <Footer
        onOpenPreOrder={() => handleOpenCheckout('performance')}
        onOpenLegal={handleOpenLegal}
        onOpenDocs={() => setDocsOpen(true)}
      />

      {/* AI Customer Support & VPS Guide Chatbot Floating Widget */}
      <AIChatBot onOpenPreOrder={handleOpenCheckout} />

      {/* Modals & Billing Portal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      <BillingPage
        isOpen={billingOpen}
        onClose={() => setBillingOpen(false)}
        onOpenPreOrder={() => handleOpenCheckout('performance')}
      />

      <DocsModal isOpen={docsOpen} onClose={() => setDocsOpen(false)} />

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
