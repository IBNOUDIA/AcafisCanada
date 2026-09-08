/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
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

export default function App() {
  const [activeSection, setActiveSection] = useState<string>("accueil");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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

  // Scroll listener to update active section in navbar according to the new menu
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "accueil",
        "espace-jeune",
        "programme",
        "media",
        "mission-service",
        "acafis-mentor",
        "bureau",
        "temoignages",
        "adhesion",
        "contact",
      ];

      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-sky-100/30 to-sky-50 font-sans text-slate-900 selection:bg-emerald-600 selection:text-white">
      {/* Top Navbar with the structured menu */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenCardModal={handleOpenCardModal}
        onOpenPaymentModal={handleOpenPaymentModal}
        onOpenAuthModal={handleOpenAuthModal}
      />

      <main className="flex-1">
        {/* 1. Accueil (Hero with diaspora mission, 25$ fee, quick links) */}
        <Hero
          onNavigate={handleNavigate}
          onOpenCardModal={handleOpenCardModal}
          onOpenPaymentModal={handleOpenPaymentModal}
        />

        {/* 2. Espace Jeune (Colonie 2027 Racines & Avenir, Cité Jardin Ndianda & Coop-ACAFIS) */}
        <CiteJardinProject
          onOpenCardModal={handleOpenCardModal}
          onNavigateContact={() => handleNavigate("contact")}
        />

        {/* 3. Programme (4 Saisons : Hiver, Printemps, Été, Automne) */}
        <ActivitiesProgram />

        {/* 4. Média (Galerie Photos, Boutique Officielle & Partenaires) */}
        <MediaBoutiqueSection />

        {/* 5. Mission & Service (Les 6 pôles majeurs d'ACAFIS Canada) */}
        <ServicesSection
          onNavigate={handleNavigate}
          onOpenCardModal={handleOpenCardModal}
        />

        {/* 6. Agent AI Mentor (Acafis Mentor - L'unique agent IA éducatif officiel) */}
        <MentorAISecution />

        {/* 7. Bureau Exécutif Élu (Les 11 membres de gouvernance) */}
        <BureauSection
          onContactSecretary={() => handleNavigate("contact")}
        />

        {/* 8. Témoignages (Retours d'expérience authentiques des membres) */}
        <TestimonialsSection />

        {/* 9. Adhésion & Carte Officielle d'Adhérent (Cotisation 25$ canadien) */}
        <MembershipCardGenerator
          onOpenPaymentModal={handleOpenPaymentModal}
        />

        {/* 10. Formulaire de Contact Intuitif */}
        <ContactSection
          onOpenPaymentModal={handleOpenPaymentModal}
          onOpenDocumentsModal={handleOpenDocumentsModal}
        />
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
        onOpenPaymentModal={() => {
          setIsAuthModalOpen(false);
          setIsPaymentModalOpen(true);
        }}
      />
    </div>
  );
}
