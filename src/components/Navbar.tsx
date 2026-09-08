import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Sparkles,
  UserCheck,
  CreditCard,
  Bot,
  LogIn,
  ExternalLink,
  Copy,
  Check,
  Clock,
} from "lucide-react";
import { AcafisLogo } from "./AcafisLogo";
import { SenegalFlagBadge, SenegalRibbon } from "./SenegalFlagBadge";
import { EXTERNAL_LINKS } from "../data/acafisData";

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenCardModal: () => void;
  onOpenPaymentModal: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenCardModal,
  onOpenPaymentModal,
  onOpenAuthModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [dakarTime, setDakarTime] = useState("");
  const [canadaTime, setCanadaTime] = useState("");

  // Live dual clock (Dakar & Montreal) for transatlantic connection
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      try {
        setDakarTime(
          now.toLocaleTimeString("fr-FR", {
            timeZone: "Africa/Dakar",
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setCanadaTime(
          now.toLocaleTimeString("fr-CA", {
            timeZone: "America/Montreal",
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      } catch (e) {
        // Fallback
        setDakarTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        setCanadaTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }
    };

    updateClocks();
    const timer = setInterval(updateClocks, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("finance@acafis.ca");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  // Structured menu items requested:
  // Accueil, Espace jeune, Programme, Boutique, Media, Mission et Service, Agent AI Mentor, Coop-ACAFIS
  const menuItems: Array<{
    id: string;
    label: string;
    isExternal?: boolean;
    url?: string;
  }> = [
    { id: "accueil", label: "Accueil" },
    { id: "espace-jeune", label: "Espace Jeune" },
    { id: "programme", label: "Programme" },
    {
      id: "boutique",
      label: "Boutique",
      isExternal: true,
      url: EXTERNAL_LINKS.boutique,
    },
    { id: "media", label: "Média" },
    { id: "mission-service", label: "Mission & Service" },
    { id: "acafis-mentor", label: "Agent AI Mentor" },
    {
      id: "coop-acafis",
      label: "Coop-ACAFIS",
      isExternal: true,
      url: EXTERNAL_LINKS.coopAcafis,
    },
  ];

  const handleLinkClick = (id: string, isExternal?: boolean, url?: string) => {
    if (isExternal && url) {
      window.open(url, "_blank", "noopener,noreferrer");
      setMobileMenuOpen(false);
      return;
    }
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-sky-50/95 backdrop-blur-md border-b border-sky-200/80 shadow-xs transition-colors">
      {/* 1. Official Senegal Tricolor Top Ribbon (Vert, Jaune/Or with Star, Rouge) */}
      <SenegalRibbon />

      {/* 2. Top Info & Dual-Clock Bar (Canada & Senegal) */}
      <div className="bg-gradient-to-r from-sky-950 via-emerald-950 to-teal-950 text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between gap-3 overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-2.5 mx-auto lg:mx-0">
          <SenegalFlagBadge size="sm" />
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-900/80 text-emerald-200 border border-emerald-500/40">
            🇸🇳 Sénégal • 🇨🇦 Canada
          </span>
          <span className="hidden sm:inline text-sky-200 font-light">
            Le cœur battant de la diaspora pour le développement solidaire
          </span>
          <span className="text-sky-400 hidden md:inline">•</span>
          <span className="text-amber-300 font-bold hidden md:inline">
            Carte membre : 25$ CAD
          </span>
        </div>

        {/* Live Clocks & Interac Copy Button */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          {dakarTime && (
            <div className="flex items-center gap-2 text-[11px] text-sky-200/90 font-mono bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
              <Clock className="w-3 h-3 text-amber-300" />
              <span>Dakar 🇸🇳 {dakarTime}</span>
              <span className="text-slate-400">|</span>
              <span>Mtl 🇨🇦 {canadaTime}</span>
            </div>
          )}

          <button
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-900/60 hover:bg-sky-800 text-sky-200 hover:text-white border border-sky-700/50 transition-colors text-[11px] cursor-pointer"
            title="Cliquer pour copier l'adresse Interac"
          >
            {copiedEmail ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300 font-bold">Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-sky-300" />
                <span>finance@acafis.ca</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenPaymentModal}
            className="hover:underline text-amber-300 font-bold cursor-pointer text-xs"
          >
            Paiement 25$
          </button>
        </div>
      </div>

      {/* 3. Main Navigation Bar with Sky-Blue & Senegal Accents */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo with Real Generated Identity */}
          <div
            id="brand-logo"
            onClick={() => handleLinkClick("accueil")}
            className="cursor-pointer group select-none transition-transform hover:scale-102 duration-150 flex items-center gap-3"
          >
            <AcafisLogo size="md" textColor="dark" />
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              if (item.isExternal) {
                return (
                  <a
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/70 border border-emerald-300/80 transition-colors"
                  >
                    <span>{item.label}</span>
                    <ExternalLink className="w-3 h-3 text-emerald-700" />
                  </a>
                );
              }

              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleLinkClick(item.id)}
                  className={`px-2.5 py-2 rounded-lg text-xs font-bold tracking-tight transition-all cursor-pointer ${
                    isActive
                      ? "text-emerald-950 bg-emerald-200/80 font-extrabold shadow-2xs border-b-2 border-[#00853F]"
                      : "text-slate-700 hover:text-emerald-900 hover:bg-sky-100/70"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              id="nav-btn-mentor"
              onClick={() => handleLinkClick("acafis-mentor")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-500 transition-all shadow-xs border border-amber-500/40 cursor-pointer"
              title="Acafis Mentor - Agent IA d'apprentissage"
            >
              <Bot className="w-4 h-4 text-emerald-950" />
              <span>Acafis Mentor</span>
            </button>

            <button
              id="nav-btn-membership"
              onClick={onOpenCardModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#00853F] to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-sm border border-emerald-600 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Adhésion (25$)</span>
            </button>

            <button
              id="nav-btn-login"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white/80 border border-sky-200 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-sky-700" />
              <span className="hidden md:inline">Espace Membre</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              id="nav-mobile-mentor-shortcut"
              onClick={() => handleLinkClick("acafis-mentor")}
              className="hidden sm:flex p-2 rounded-lg bg-amber-300 text-amber-950 text-xs font-bold items-center gap-1 cursor-pointer border border-amber-400"
            >
              <Bot className="w-4 h-4 text-emerald-950" />
              <span>Mentor</span>
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-700 hover:bg-sky-100 transition-colors cursor-pointer"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-sky-50 border-b border-sky-200 px-4 pt-2 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300 ease-out">
          <div className="grid grid-cols-2 gap-2 mb-4 pt-2">
            <button
              onClick={() => {
                onOpenCardModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#00853F] to-emerald-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <UserCheck className="w-4 h-4" />
              <span>Adhésion (25$)</span>
            </button>
            <button
              onClick={() => {
                onOpenPaymentModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-950 bg-amber-300 border border-amber-400 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Paiement Interac</span>
            </button>
          </div>

          <div className="space-y-1 divide-y divide-sky-200/50">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id, item.isExternal, item.url)}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                  activeSection === item.id
                    ? "text-emerald-900 bg-emerald-100 font-bold border-l-4 border-[#00853F]"
                    : "text-slate-700 hover:bg-sky-100/60"
                }`}
              >
                <span>{item.label}</span>
                {item.isExternal && <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />}
              </button>
            ))}
          </div>

          <div className="pt-4 mt-3 border-t border-sky-200 flex justify-between items-center text-xs text-slate-600">
            <button
              onClick={() => {
                onOpenAuthModal();
                setMobileMenuOpen(false);
              }}
              className="inline-flex items-center gap-1.5 font-semibold text-slate-800 hover:text-emerald-700 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-sky-700" />
              <span>Espace Membre / Connexion</span>
            </button>
            <SenegalFlagBadge size="sm" />
          </div>
        </div>
      )}
    </header>
  );
};
