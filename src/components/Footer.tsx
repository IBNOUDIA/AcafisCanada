import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Mail,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { PAYMENT_INTERAC_INFO, EXTERNAL_LINKS, ORGANIZATION_NEQ } from "../data/acafisData";
import { AcafisLogo } from "./AcafisLogo";
import { SenegalRibbon } from "./SenegalFlagBadge";
import { useTranslation, TranslationKey } from "../i18n/translations";
import { useLanguage } from "../i18n/LanguageContext";

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

// Just the essentials — the full sitemap already lives in the main menu.
const QUICK_LINKS: Array<{ id: string }> = [
  { id: "accueil" },
  { id: "mission-service" },
  { id: "bureau" },
  { id: "adhesion" },
];

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPaymentModal,
  onOpenDocumentsModal,
  onOpenCardModal,
}) => {
  const { t } = useTranslation();
  const { localizePath } = useLanguage();
  return (
    <footer className="bg-gradient-to-b from-sky-950 via-slate-950 to-slate-950 text-slate-300 border-t border-sky-900/60 relative">
      <SenegalRibbon />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-800">

          {/* Brand & Contact */}
          <div className="lg:col-span-2 space-y-3">
            <AcafisLogo size="md" textColor="light" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {t("footer.tagline")}
            </p>
            <div className="text-xs text-slate-400 space-y-1.5 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>4845, avenue de Courtrai, suite 101, Montréal, QC H3W 0A2, Canada</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="mailto:secretariat@acafis.ca" className="hover:text-emerald-400 transition-colors">
                  secretariat@acafis.ca
                </a>
              </div>
              <p className="text-[11px] text-slate-500 pt-0.5">
                {t("footer.neqLabel")} : {ORGANIZATION_NEQ}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {QUICK_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    {t(`nav.${link.id}` as TranslationKey)}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={onOpenDocumentsModal}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  {t("footer.statutes")}
                </button>
              </li>
              <li>
                <a
                  href={EXTERNAL_LINKS.coopAcafis}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 text-emerald-300"
                >
                  <span>{t("nav.coop-acafis")}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Membership & Social */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t("footer.joinUs")}</h4>
            <button
              onClick={onOpenCardModal}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              {t("footer.membershipCard")} ({PAYMENT_INTERAC_INFO.annualFeeCAD}$ CAD)
            </button>
            <div className="space-y-2">
              <a
                href="https://www.facebook.com/share/1Cm2zyQF7x/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-blue-900/60 border border-slate-800 hover:border-blue-700/80 text-slate-200 hover:text-white transition-all text-xs font-semibold cursor-pointer"
              >
                <Facebook className="w-4 h-4 text-blue-400" />
                <span>Facebook</span>
              </a>
              <a
                href="https://chat.whatsapp.com/DxFqZEdlinuAbQAMEho01"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-emerald-900/60 border border-slate-800 hover:border-emerald-600/80 text-slate-200 hover:text-white transition-all text-xs font-semibold cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span>{t("footer.copyright")}</span>
            <span>•</span>
            <button onClick={onOpenPaymentModal} className="hover:text-slate-300 transition-colors cursor-pointer">
              {t("footer.paymentInterac")}
            </button>
            <span>•</span>
            <button onClick={() => onNavigate("adhesion")} className="hover:text-slate-300 transition-colors cursor-pointer">
              {t("footer.contact")}
            </button>
            <span>•</span>
            <Link to={localizePath("/politique-confidentialite")} className="hover:text-slate-300 transition-colors">
              {t("footer.privacyPolicy")}
            </Link>
          </div>
          <a
            href="https://www.amardia.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors"
          >
            {t("footer.developedBy")}
          </a>
        </div>

      </div>
    </footer>
  );
};
