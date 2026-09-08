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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-800">
          
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
                  <span>Espace Jeune (Colonie 2027)</span>
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

            <div className="pt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-blue-900/60 border border-slate-800 hover:border-blue-700/80 text-slate-200 hover:text-white transition-all text-xs font-semibold cursor-pointer w-full justify-center"
              >
                <Facebook className="w-4 h-4 text-blue-400" />
                <span>Facebook ACAFIS</span>
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
