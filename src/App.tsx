/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { PaymentDocumentsModal } from "./components/PaymentDocumentsModal";
import { AuthModal } from "./components/AuthModal";
import { Footer } from "./components/Footer";
import { pathForId, idForPath, PAGE_ROUTES } from "./routes";

// Each page is code-split into its own chunk, loaded on demand as the user
// navigates there instead of all being bundled into one large upfront file.
const Hero = lazy(() => import("./components/Hero").then((m) => ({ default: m.Hero })));
const CiteJardinProject = lazy(() => import("./components/CiteJardinProject").then((m) => ({ default: m.CiteJardinProject })));
const ActivitiesProgram = lazy(() => import("./components/ActivitiesProgram").then((m) => ({ default: m.ActivitiesProgram })));
const MediaBoutiqueSection = lazy(() => import("./components/MediaBoutiqueSection").then((m) => ({ default: m.MediaBoutiqueSection })));
const ServicesSection = lazy(() => import("./components/ServicesSection").then((m) => ({ default: m.ServicesSection })));
const MentorAISecution = lazy(() => import("./components/MentorAISecution").then((m) => ({ default: m.MentorAISecution })));
const BureauSection = lazy(() => import("./components/BureauSection").then((m) => ({ default: m.BureauSection })));
const TestimonialsSection = lazy(() => import("./components/TestimonialsSection").then((m) => ({ default: m.TestimonialsSection })));
const MembershipCardGenerator = lazy(() => import("./components/MembershipCardGenerator").then((m) => ({ default: m.MembershipCardGenerator })));
const ContactSection = lazy(() => import("./components/ContactSection").then((m) => ({ default: m.ContactSection })));

// Simple, unobtrusive fallback shown for the brief moment a page chunk loads.
const PageLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center py-32">
    <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
  </div>
);

// Resets scroll position whenever the route (page) changes.
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Gives each page its own browser tab title (better UX, bookmarks and SEO
// than a single static title shared across every route).
const PageTitle: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const id = idForPath(pathname);
    const route = PAGE_ROUTES.find((r) => r.id === id);
    document.title =
      id === "accueil" || !route
        ? "ACAFIS Canada"
        : `${route.label} — ACAFIS Canada`;
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
      <PageTitle />

      {/* Top Navbar with the flat, page-based menu */}
      <Navbar
        onNavigate={handleNavigate}
        onOpenCardModal={handleOpenCardModal}
        onOpenPaymentModal={handleOpenPaymentModal}
        onOpenAuthModal={handleOpenAuthModal}
      />

      <main className="flex-1">
        <Suspense fallback={<PageLoadingFallback />}>
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
        </Suspense>
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
