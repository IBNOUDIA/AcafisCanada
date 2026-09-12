import React from "react";
import {
  Facebook,
  FileText,
  CreditCard,
  Mail,
  ShieldCheck,
  Heart,
  ExternalLink,
  MapPin,
  Globe2,
  Bot,
  ShoppingBag,
} from "lucide-react";
import { PAYMENT_INTERAC_INFO, EXTERNAL_LINKS } from "../data/acafisData";
import { AcafisLogo } from "./AcafisLogo";
import { SenegalFlagBadge, SenegalRibbon } from "./SenegalFlagBadge";

// lucide-react has no WhatsApp glyph — small inline brand icon instead.
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.38 1.26 4.8L2 22l5.42-1.36a9.87 9.87 0 0 0 4.62 1.17h.01c5.46 0 9.9-4.45 9.9-9.9 0-2.64-1.03-5.13-2.9-7C17.17 3.03 14.68 2 12.04 2zm5.77 14.13c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.06.11-1.71-.11-.4-.13-.9-.3-1.55-.58-2.73-1.18-4.51-3.94-4.65-4.13-.14-.19-1.11-1.48-1.11-2.82 0-1.34.7-2 .96-2.27.24-.26.53-.32.7-.32.18 0 .35 0 .5.01.16.01.37-.06.58.44.24.57.8 1.97.87 2.11.07.14.11.31.02.5-.08.19-.13.31-.26.48-.13.16-.27.36-.39.48-.13.13-.26.27-.11.53.14.26.63 1.04 1.36 1.68.94.83 1.72 1.09 1.98 1.22.26.13.41.11.56-.07.16-.18.66-.77.84-1.04.18-.26.35-.22.59-.13.24.09 1.53.72 1.79.85.26.13.44.19.5.3.06.11.06.63-.18 1.3z" />
  </svg>
);

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenPaymentModal: () => void;
  onOpenDocumentsModal: () => void;
  onOpenCardModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPaymentModal,
  onOpenDocumentsModal,
  onOpenCardModal,
}) => {
  return (
    <footer className="bg-gradient-to-b from-sky-950 via-slate-950 to-slate-950 text-slate-300 border-t border-sky-900/60 relative">
      {/* Senegal Tricolor Top Ribbon */}
      <SenegalRibbon />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-4 space-y-4">
            <AcafisLogo size="md" textColor="light" />

            <p className="text-xs text-slate-400 leading-relaxed">
              Le cœur battant de la diaspora pour le développement solidaire. Un pont entre le Canada et le Sénégal axé sur la réussite éducative, l'habitat éco-responsable et l'entraide communautaire.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Agrément officiel OBNL</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/90 border border-slate-800 text-slate-200">
                <span>🇨🇦 Canada & Sénégal</span>
                <SenegalFlagBadge size="sm" />
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/80 border border-amber-800 text-amber-300">
                Carte : 25$ CAD
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Rapide */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              <span>Rubriques du Site</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate("accueil")}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Accueil</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("espace-jeune")}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Espace Jeune (Colonie 2030)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("programme")}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Programme d'activités</span>
                </button>
              </li>
              <li>
                <a
                  href={EXTERNAL_LINKS.boutique}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-left text-amber-300 font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Boutique en ligne (boutique-acafis)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("media")}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Média & Événements</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("mission-service")}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Missions & Services</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("bureau")}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Bureau Exécutif</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("temoignages")}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Témoignages</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("adhesion")}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Adhésion & Carte Membre</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("acafis-mentor")}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left text-amber-300 font-semibold"
                >
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                  <span>Agent AI : Acafis Mentor</span>
                </button>
              </li>
              <li>
                <a
                  href={EXTERNAL_LINKS.coopAcafis}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-left text-emerald-300 font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Coopérative (coop-acafis.com)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Documents & Gouvernance */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Transparence & Statuts</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={onOpenDocumentsModal}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Statuts ACAFIS Canada</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDocumentsModal}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Règlement Intérieur</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("bureau")}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Bureau Élu (11 Membres)</span>
                </button>
              </li>
            </ul>

            <div className="pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                <div className="text-[11px] text-slate-400">
                  Virement Interac :
                </div>
                <div className="font-mono text-emerald-400 font-bold">
                  {PAYMENT_INTERAC_INFO.email}
                </div>
                <div className="text-[11px] text-slate-300">
                  Cotisation annuelle : <strong className="text-amber-300">25$ CAD</strong>
                </div>
                <button
                  onClick={onOpenPaymentModal}
                  className="w-full mt-1 py-1.5 px-2 rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 text-[11px] font-semibold transition-colors cursor-pointer text-center block"
                >
                  Détails du virement & Reçu
                </button>
              </div>
            </div>
          </div>

          {/* Col 4: Adhésion */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Communauté
            </h4>
            <p className="text-xs text-slate-400">
              Rejoignez les compatriotes engagés pour la solidarité.
            </p>

            <div className="pt-1">
              <button
                onClick={onOpenCardModal}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center block"
              >
                Carte de Membre (25$)
              </button>
            </div>

            <div className="pt-1 space-y-2">
              <a
                href="https://www.facebook.com/share/1Cm2zyQF7x/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-blue-900/60 border border-slate-800 hover:border-blue-700/80 text-slate-200 hover:text-white transition-all text-xs font-semibold cursor-pointer w-full justify-center"
              >
                <Facebook className="w-4 h-4 text-blue-400" />
                <span>Facebook ACAFIS</span>
              </a>

              <a
                href="https://chat.whatsapp.com/DxFqZEdlinuAbQAMEho01"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-emerald-900/60 border border-slate-800 hover:border-emerald-600/80 text-slate-200 hover:text-white transition-all text-xs font-semibold cursor-pointer w-full justify-center"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                <span>Groupe WhatsApp ACAFIS</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 ACAFIS Canada. Tous droits réservés.
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={onOpenDocumentsModal}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Mentions Légales & Statuts
            </button>
            <span>|</span>
            <button
              onClick={() => onNavigate("contact")}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Contact
            </button>
            <span>|</span>
            <span className="text-emerald-400 font-semibold">
              Organisation OBNL Enregistrée
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
