/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from "react";
import { MotionConfig } from "motion/react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { pathForId, idForPath, SITE_ORIGIN } from "./routes";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";
import { translations, TranslationKey } from "./i18n/translations";

// Every page (and the on-demand modals/widget) is its own chunk, fetched
// only when actually needed — otherwise a visitor landing on any single
// page downloads the admin dashboard, the AI mentor chat, etc. upfront.
// Bundled up front, unlike the other pages: the homepage's banner photo is
// its largest element, and lazy-loading Hero made that photo wait for an
// extra script download before it could even start loading.
import { Hero } from "./components/Hero";
const CiteJardinProject = lazy(() => import("./components/CiteJardinProject").then((m) => ({ default: m.CiteJardinProject })));
const ActivitiesProgram = lazy(() => import("./components/ActivitiesProgram").then((m) => ({ default: m.ActivitiesProgram })));
const MediaBoutiqueSection = lazy(() => import("./components/MediaBoutiqueSection").then((m) => ({ default: m.MediaBoutiqueSection })));
const ServicesSection = lazy(() => import("./components/ServicesSection").then((m) => ({ default: m.ServicesSection })));
const MajorProjectsSection = lazy(() => import("./components/MajorProjectsSection").then((m) => ({ default: m.MajorProjectsSection })));
const MentorAISecution = lazy(() => import("./components/MentorAISecution").then((m) => ({ default: m.MentorAISecution })));
const BureauSection = lazy(() => import("./components/BureauSection").then((m) => ({ default: m.BureauSection })));
const TestimonialsSection = lazy(() => import("./components/TestimonialsSection").then((m) => ({ default: m.TestimonialsSection })));
const MembershipCardGenerator = lazy(() => import("./components/MembershipCardGenerator").then((m) => ({ default: m.MembershipCardGenerator })));
const ContactSection = lazy(() => import("./components/ContactSection").then((m) => ({ default: m.ContactSection })));
const MemberDashboard = lazy(() => import("./components/MemberDashboard").then((m) => ({ default: m.MemberDashboard })));
const EspaceMembreInfo = lazy(() => import("./components/EspaceMembreInfo").then((m) => ({ default: m.EspaceMembreInfo })));
const PrivacyPolicyPage = lazy(() => import("./components/PrivacyPolicyPage").then((m) => ({ default: m.PrivacyPolicyPage })));
const LegalNoticePage = lazy(() => import("./components/LegalNoticePage").then((m) => ({ default: m.LegalNoticePage })));
const ClaimProfilePage = lazy(() => import("./components/ClaimProfilePage").then((m) => ({ default: m.ClaimProfilePage })));
const AdminLoginPage = lazy(() => import("./components/AdminLoginPage").then((m) => ({ default: m.AdminLoginPage })));
const AdminDashboard = lazy(() => import("./components/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const PaymentDocumentsModal = lazy(() => import("./components/PaymentDocumentsModal").then((m) => ({ default: m.PaymentDocumentsModal })));
const AuthModal = lazy(() => import("./components/AuthModal").then((m) => ({ default: m.AuthModal })));
const KoccBarmaWidget = lazy(() => import("./components/KoccBarmaWidget").then((m) => ({ default: m.KoccBarmaWidget })));

// Simple centered spinner shown only while a page chunk is fetching —
// usually invisible in practice on a warm connection.
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

// Description ids for public pages that aren't in PAGE_ROUTES (French path).
const EXTRA_PAGE_DESCRIPTIONS: Record<string, string> = {
  "/espace-membre": "espace-membre",
  "/politique-confidentialite": "politique",
  "/mentions-legales": "mentions",
};

// Gives each page its own browser tab title (better UX, bookmarks and SEO
// than a single static title shared across every route), keeps the
// <html lang> attribute in sync, declares the page's own canonical URL, and
// points search engines to its French/English versions via hreflang links.
// URLs always use SITE_ORIGIN (www.acafis.ca), whatever host served the page.
const PageTitle: React.FC = () => {
  const { pathname } = useLocation();
  const { lang, localizePath } = useLanguage();
  useEffect(() => {
    const id = idForPath(pathname);
    const key = `page.title.${id}` as TranslationKey;
    document.title = translations[lang][key] ?? translations.fr[key] ?? "ACAFIS Canada";
    document.documentElement.lang = lang;

    // Each page's own search-result snippet (index.html only carries the
    // homepage's). Pages outside the main menu are matched by path.
    const frPath = localizePath(pathname, "fr");
    const descriptionId = EXTRA_PAGE_DESCRIPTIONS[frPath] ?? id;
    const descriptionKey = `page.description.${descriptionId}` as TranslationKey;
    const description = translations[lang][descriptionKey] ?? translations.fr[descriptionKey];
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute("content", description);
      document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    }
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", `${SITE_ORIGIN}${localizePath(pathname, lang)}`);

    const links: Array<{ rel: string; hreflang?: string; href: string }> = [
      { rel: "canonical", href: `${SITE_ORIGIN}${localizePath(pathname, lang)}` },
      { rel: "alternate", hreflang: "fr", href: `${SITE_ORIGIN}${localizePath(pathname, "fr")}` },
      { rel: "alternate", hreflang: "en", href: `${SITE_ORIGIN}${localizePath(pathname, "en")}` },
      { rel: "alternate", hreflang: "x-default", href: `${SITE_ORIGIN}${localizePath(pathname, "fr")}` },
    ];
    const created: HTMLLinkElement[] = [];
    links.forEach(({ rel, hreflang, href }) => {
      const link = document.createElement("link");
      link.rel = rel;
      if (hreflang) link.hreflang = hreflang;
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
  const { lang, localizePath } = useLanguage();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [showMentorWidget, setShowMentorWidget] = useState(false);

  useEffect(() => {
    // After the window's load event, plus the browser's next idle moment.
    const show = () => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
      if (idle) idle(() => setShowMentorWidget(true));
      else setTimeout(() => setShowMentorWidget(true), 200);
    };
    if (document.readyState === "complete") show();
    else window.addEventListener("load", show, { once: true });
    return () => window.removeEventListener("load", show);
  }, []);

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

      {/* Skip link: hidden until focused, lets keyboard and screen-reader
          users jump past the navigation straight to the page content. */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:rounded-xl focus:bg-emerald-800 focus:text-white focus:text-sm focus:font-bold focus:shadow-lg"
      >
        {translations[lang]["common.skipToContent"]}
      </a>

      {/* Top Navbar with the flat, page-based menu */}
      <Navbar
        onNavigate={handleNavigate}
        onOpenCardModal={handleOpenCardModal}
        onOpenPaymentModal={handleOpenPaymentModal}
      />

      <main id="contenu" tabIndex={-1} className="flex-1 focus:outline-hidden">
        <Suspense fallback={<PageLoadingFallback />}>
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
                {/* Public "Espace Membre" showcase page — what the navbar button links to */}
                <Route
                  path="/espace-membre"
                  element={<EspaceMembreInfo onOpenAuthModal={handleOpenAuthModal} onOpenCardModal={handleOpenCardModal} />}
                />
                <Route
                  path="/en/espace-membre"
                  element={<EspaceMembreInfo onOpenAuthModal={handleOpenAuthModal} onOpenCardModal={handleOpenCardModal} />}
                />
                {/* Authenticated member dashboard — reached only after logging in via the modal */}
                <Route path="/mon-espace-membre" element={<MemberDashboard />} />
                <Route path="/en/mon-espace-membre" element={<MemberDashboard />} />
                {/* Privacy policy — linked from the footer and the membership form, not in the navbar */}
                <Route path="/politique-confidentialite" element={<PrivacyPolicyPage />} />
                <Route path="/en/politique-confidentialite" element={<PrivacyPolicyPage />} />
                {/* Legal notice — linked from the footer, not in the navbar */}
                <Route path="/mentions-legales" element={<LegalNoticePage />} />
                <Route path="/en/mentions-legales" element={<LegalNoticePage />} />
                {/* Profile claim — personal, unguessable link sent to a historically
                    imported member so they can attach their real email themselves */}
                <Route path="/reclamer/:token" element={<ClaimProfilePage />} />
                <Route path="/en/reclamer/:token" element={<ClaimProfilePage />} />
                {/* Admin dashboard — Bureau Exécutif only, reached by direct URL, not in the navbar */}
                <Route path="/admin/connexion" element={<AdminLoginPage />} />
                <Route path="/en/admin/connexion" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/en/admin" element={<AdminDashboard />} />
                {/* Unknown paths fall back to the home page, in whichever language prefix was used */}
                <Route path="*" element={heroEl} />
                <Route path="/en/*" element={heroEl} />
              </>
            );
          })()}
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

      {/* Modals — only mounted (and their chunk fetched) once actually opened */}
      <Suspense fallback={null}>
        {isPaymentModalOpen && (
          <PaymentDocumentsModal
            isOpen={isPaymentModalOpen}
            initialTab="payment"
            onClose={() => setIsPaymentModalOpen(false)}
          />
        )}

        {isDocumentsModalOpen && (
          <PaymentDocumentsModal
            isOpen={isDocumentsModalOpen}
            initialTab="documents"
            onClose={() => setIsDocumentsModalOpen(false)}
          />
        )}

        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onOpenCardModal={() => {
              setIsAuthModalOpen(false);
              handleOpenCardModal();
            }}
          />
        )}
      </Suspense>

      {/* Kocc Barma floats above every page except its own dedicated page.
          Mounted once the page has finished loading, so its code and avatar
          never compete with the page's own content for bandwidth. */}
      {showMentorWidget && (
        <Suspense fallback={null}>
          <KoccBarmaWidget />
        </Suspense>
      )}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        {/* "user": respects the visitor's reduced-motion system setting —
            fade-ins keep their opacity change but drop the slide. */}
        <MotionConfig reducedMotion="user">
          <AppShell />
        </MotionConfig>
      </LanguageProvider>
    </BrowserRouter>
  );
}
