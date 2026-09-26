import React, { useEffect } from "react";
import {
  ShieldCheck,
  CreditCard,
  FileText,
  Users,
  IdCard,
  Sparkles,
  ArrowRight,
  LogIn,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "../i18n/translations";
import { useLanguage } from "../i18n/LanguageContext";
import { Reveal } from "./Reveal";
import adhesionHeroPhoto from "../assets/images/adhesion-hero.jpg";

interface EspaceMembreInfoProps {
  onOpenAuthModal: () => void;
  onOpenCardModal: () => void;
}

export const EspaceMembreInfo: React.FC<EspaceMembreInfoProps> = ({
  onOpenAuthModal,
  onOpenCardModal,
}) => {
  const { t } = useTranslation();
  const { localizePath } = useLanguage();

  useEffect(() => {
    document.title = `${t("espaceMembreInfo.heroTitle")} — ACAFIS Canada`;
  }, [t]);

  const benefits = [
    { icon: <CreditCard className="w-5 h-5" />, title: t("espaceMembreInfo.benefit1Title"), desc: t("espaceMembreInfo.benefit1Desc") },
    { icon: <FileText className="w-5 h-5" />, title: t("espaceMembreInfo.benefit2Title"), desc: t("espaceMembreInfo.benefit2Desc") },
    { icon: <Users className="w-5 h-5" />, title: t("espaceMembreInfo.benefit3Title"), desc: t("espaceMembreInfo.benefit3Desc") },
    { icon: <IdCard className="w-5 h-5" />, title: t("espaceMembreInfo.benefit4Title"), desc: t("espaceMembreInfo.benefit4Desc") },
  ];

  return (
    <div>
      {/* Hero */}
      <Reveal className="relative h-72 sm:h-96 overflow-hidden">
        <img
          src={adhesionHeroPhoto}
          alt="Membres de la communauté ACAFIS réunis"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/20" />
        <div className="relative z-10 h-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col justify-end pb-10 text-white">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20 backdrop-blur-sm w-fit mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t("espaceMembreInfo.badge")}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-2">
            {t("espaceMembreInfo.heroTitle")}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl">
            {t("espaceMembreInfo.heroDesc")}
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 shadow-md transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{t("espaceMembreInfo.loginBtn")}</span>
            </button>
            <button
              onClick={onOpenCardModal}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-600 shadow-md transition-all cursor-pointer"
            >
              <span>{t("espaceMembreInfo.joinBtn")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Reveal>

      {/* Benefits grid */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-sky-50 via-white to-sky-100/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display text-center mb-10">
            {t("espaceMembreInfo.benefitsTitle")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0">
                  {b.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display mb-1">{b.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Coming soon */}
          <div className="mt-6 p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-900">{t("espaceMembreInfo.comingSoonTitle")}</p>
              <p className="text-xs text-amber-800">{t("espaceMembreInfo.comingSoonDesc")}</p>
            </div>
          </div>

          {/* Not a member CTA */}
          <div className="mt-10 p-8 rounded-3xl bg-gradient-to-tr from-slate-950 via-emerald-950 to-teal-900 text-white text-center space-y-3">
            <h3 className="text-lg sm:text-xl font-bold font-display">{t("espaceMembreInfo.notMemberYet")}</h3>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">{t("espaceMembreInfo.notMemberDesc")}</p>
            <button
              onClick={onOpenCardModal}
              className="inline-flex items-center gap-2 mt-2 px-5 py-3 rounded-xl text-sm font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all cursor-pointer"
            >
              <span>{t("espaceMembreInfo.joinBtn")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Discreet admin entry point for the Bureau Exécutif */}
          <div className="mt-10 pt-6 border-t border-slate-200 text-center">
            <Link
              to={localizePath("/admin/connexion")}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-800 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t("espaceMembreInfo.adminLogin")}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
