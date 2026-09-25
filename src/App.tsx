/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { CiteJardinProject } from "./components/CiteJardinProject";
import { ActivitiesProgram } from "./components/ActivitiesProgram";
import { MediaBoutiqueSection } from "./components/MediaBoutiqueSection";
import { ServicesSection } from "./components/ServicesSection";
import { MajorProjectsSection } from "./components/MajorProjectsSection";
import { MentorAISecution } from "./components/MentorAISecution";
import { BureauSection } from "./components/BureauSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { MembershipCardGenerator } from "./components/MembershipCardGenerator";
import { ContactSection } from "./components/ContactSection";
import { PaymentDocumentsModal } from "./components/PaymentDocumentsModal";
import { AuthModal } from "./components/AuthModal";
import { MemberDashboard } from "./components/MemberDashboard";
import { PrivacyPolicyPage } from "./components/PrivacyPolicyPage";
import { Footer } from "./components/Footer";
import { KoccBarmaWidget } from "./components/KoccBarmaWidget";
import { pathForId, idForPath } from "./routes";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";
import { translations, TranslationKey } from "./i18n/translations";

// Resets scroll position whenever the route (page) changes.
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Gives each page its own browser tab title (better UX, bookmarks and SEO
// than a single static title shared across every route), keeps the
// <html lang> attribute in sync, and points search engines to the French/
// English versions of the current page via <link rel="alternate" hreflang>.
const PageTitle: React.FC = () => {
  const { pathname } = useLocation();
  const { lang, localizePath } = useLanguage();
  useEffect(() => {
    const id = idForPath(pathname);
    const key = `page.title.${id}` as TranslationKey;
    document.title = translations[lang][key] ?? translations.fr[key] ?? "ACAFIS Canada";
    document.documentElement.lang = lang;

    const origin = window.location.origin;
    const altLinks: Array<{ hreflang: string; href: string }> = [
      { hreflang: "fr", href: `${origin}${localizePath(pathname, "fr")}` },
      { hreflang: "en", href: `${origin}${localizePath(pathname, "en")}` },
      { hreflang: "x-default", href: `${origin}${localizePath(pathname, "fr")}` },
    ];
    const created: HTMLLinkElement[] = [];
    altLinks.forEach(({ hreflang, href }) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = hreflang;
      link.href = href;
      document.head.appendChild(link);
      created.push(link);
    });
    return () => created.forEach((link) => link.remove());
  }, [pathname, lang, localizePath]);
  return null;
};

const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const { localizePath } = useLanguage();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const handleNavigate = (sectionId: string) => {
    navigate(localizePath(pathForId(sectionId)));
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
        <Routes>
          {(() => {
            // Each page is defined once and rendered at both its French path
            // and its "/en" mirror — the page's own content picks the right
            // language via useLanguage()/useTranslation(), so the exact same
            // element works under either URL.
            const heroEl = (
              <Hero
                onNavigate={handleNavigate}
                onOpenCardModal={handleOpenCardModal}
                onOpenPaymentModal={handleOpenPaymentModal}
              />
            );
            const espaceJeuneEl = (
              <CiteJardinProject
                onOpenCardModal={handleOpenCardModal}
                onNavigateContact={() => handleNavigate("adhesion")}
              />
            );
            const programmeEl = <ActivitiesProgram />;
            const mediaEl = <MediaBoutiqueSection />;
            const servicesEl = (
              <ServicesSection onNavigate={handleNavigate} onOpenCardModal={handleOpenCardModal} />
            );
            const projetsEl = (
              <MajorProjectsSection
                onNavigate={handleNavigate}
                onNavigateContact={() => handleNavigate("adhesion")}
              />
            );
            const mentorEl = <MentorAISecution />;
            const bureauEl = <BureauSection onContactSecretary={() => handleNavigate("adhesion")} />;
            const temoignagesEl = <TestimonialsSection />;
            const adhesionEl = (
              <>
                <MembershipCardGenerator onOpenPaymentModal={handleOpenPaymentModal} />
                <ContactSection
                  onOpenPaymentModal={handleOpenPaymentModal}
                  onOpenDocumentsModal={handleOpenDocumentsModal}
                />
              </>
            );

            const pages: Array<{ path: string; element: React.ReactNode }> = [
              { path: "/", element: heroEl },
              { path: "/espace-jeune", element: espaceJeuneEl },
              { path: "/programme", element: programmeEl },
              { path: "/media", element: mediaEl },
              { path: "/mission-service", element: servicesEl },
              { path: "/projets", element: projetsEl },
              { path: "/acafis-mentor", element: mentorEl },
              { path: "/bureau", element: bureauEl },
              { path: "/temoignages", element: temoignagesEl },
              { path: "/adhesion", element: adhesionEl },
            ];

            return (
              <>
                {pages.map(({ path, element }) => (
                  <React.Fragment key={path}>
                    <Route path={path} element={element} />
                    <Route path={path === "/" ? "/en" : `/en${path}`} element={element} />
                  </React.Fragment>
                ))}
                {/* Contact is now merged into the Adhésion page — keep old links working */}
                <Route path="/contact" element={<Navigate to="/adhesion" replace />} />
                <Route path="/en/contact" element={<Navigate to="/en/adhesion" replace />} />
                {/* Member dashboard — reached only via the login modal, not listed in the navbar */}
                <Route path="/espace-membre" element={<MemberDashboard />} />
                <Route path="/en/espace-membre" element={<MemberDashboard />} />
                {/* Privacy policy — linked from the footer and the membership form, not in the navbar */}
                <Route path="/politique-confidentialite" element={<PrivacyPolicyPage />} />
                <Route path="/en/politique-confidentialite" element={<PrivacyPolicyPage />} />
                {/* Unknown paths fall back to the home page, in whichever language prefix was used */}
                <Route path="*" element={heroEl} />
                <Route path="/en/*" element={heroEl} />
              </>
            );
          })()}
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

      {/* Kocc Barma floats above every page except its own dedicated page */}
      <KoccBarmaWidget />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AppShell />
      </LanguageProvider>
    </BrowserRouter>
  );
}
