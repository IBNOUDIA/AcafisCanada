/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { CiteJardinProject } from "./components/CiteJardinProject";
import { ActivitiesProgram } from "./components/ActivitiesProgram";
import { MediaBoutiqueSection } from "./components/MediaBoutiqueSection";
import { ServicesSection } from "./components/ServicesSection";
import { MentorAISecution } from "./components/MentorAISecution";
import { BureauSection } from "./components/BureauSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { MembershipCardGenerator } from "./components/MembershipCardGenerator";
import { ContactSection } from "./components/ContactSection";
import { PaymentDocumentsModal } from "./components/PaymentDocumentsModal";
import { AuthModal } from "./components/AuthModal";
import { Footer } from "./components/Footer";
import { pathForId } from "./routes";

// Resets scroll position whenever the route (page) changes.
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const handleNavigate = (sectionId: string) => {
    navigate(pathForId(sectionId));
  };

  const handleOpenCardModal = () => {
    handleNavigate("adhesion");
  };

  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  const handleOpenDocumentsModal = () => {
    setIsDocumentsModalOpen(true);
  };

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-sky-100/30 to-sky-50 font-sans text-slate-900 selection:bg-emerald-600 selection:text-white">
      <ScrollToTop />

      {/* Top Navbar with the flat, page-based menu */}
      <Navbar
        onNavigate={handleNavigate}
        onOpenCardModal={handleOpenCardModal}
        onOpenPaymentModal={handleOpenPaymentModal}
        onOpenAuthModal={handleOpenAuthModal}
      />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <Hero
                onNavigate={handleNavigate}
                onOpenCardModal={handleOpenCardModal}
                onOpenPaymentModal={handleOpenPaymentModal}
              />
            }
          />
          <Route
            path="/espace-jeune"
            element={
              <CiteJardinProject
                onOpenCardModal={handleOpenCardModal}
                onNavigateContact={() => handleNavigate("contact")}
              />
            }
          />
          <Route path="/programme" element={<ActivitiesProgram />} />
          <Route path="/media" element={<MediaBoutiqueSection />} />
          <Route
            path="/mission-service"
            element={
              <ServicesSection onNavigate={handleNavigate} onOpenCardModal={handleOpenCardModal} />
            }
          />
          <Route path="/acafis-mentor" element={<MentorAISecution />} />
          <Route
            path="/bureau"
            element={<BureauSection onContactSecretary={() => handleNavigate("contact")} />}
          />
          <Route path="/temoignages" element={<TestimonialsSection />} />
          <Route
            path="/adhesion"
            element={<MembershipCardGenerator onOpenPaymentModal={handleOpenPaymentModal} />}
          />
          <Route
            path="/contact"
            element={
              <ContactSection
                onOpenPaymentModal={handleOpenPaymentModal}
                onOpenDocumentsModal={handleOpenDocumentsModal}
              />
            }
          />
          {/* Unknown paths fall back to the home page */}
          <Route
            path="*"
            element={
              <Hero
                onNavigate={handleNavigate}
                onOpenCardModal={handleOpenCardModal}
                onOpenPaymentModal={handleOpenPaymentModal}
              />
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPaymentModal={handleOpenPaymentModal}
        onOpenDocumentsModal={handleOpenDocumentsModal}
        onOpenCardModal={handleOpenCardModal}
      />

      {/* Modals */}
      <PaymentDocumentsModal
        isOpen={isPaymentModalOpen}
        initialTab="payment"
        onClose={() => setIsPaymentModalOpen(false)}
      />

      <PaymentDocumentsModal
        isOpen={isDocumentsModalOpen}
        initialTab="documents"
        onClose={() => setIsDocumentsModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onOpenCardModal={() => {
          setIsAuthModalOpen(false);
          handleOpenCardModal();
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
