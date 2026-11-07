import React, { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Calendar,
  Building2,
  Copy,
  Check,
  Heart,
  Globe2,
  ExternalLink,
} from "lucide-react";
import { SenegalFlagBadge, SenegalRibbon } from "./SenegalFlagBadge";
import { Reveal } from "./Reveal";
import { PAYMENT_INTERAC_INFO, HERO_PARTNERS } from "../data/acafisData";
import { useTranslation } from "../i18n/translations";
import heroCommunityPhoto from "../assets/images/hero-communaute-bbq.webp";

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  onOpenCardModal: () => void;
  onOpenPaymentModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onNavigate,
  onOpenCardModal,
  onOpenPaymentModal,
}) => {
  const { t, lang } = useTranslation();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PAYMENT_INTERAC_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };


  return (
    <section id="accueil" className="relative overflow-hidden text-white">

      {/* Community Photo Banner — full width, unobstructed */}
      <div className="relative h-[280px] sm:h-[380px] lg:h-[460px]">
        <img
          src={heroCommunityPhoto}
          alt="Rassemblement communautaire de la diaspora ACAFIS lors d'un grand pique-nique estival"
          // The homepage's largest element: fetch it before other images.
          fetchPriority="high"
          width={960}
          height={640}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Photo caption for authenticity */}
        <span className="absolute bottom-3 right-4 text-[10px] sm:text-[11px] text-white/80 font-medium tracking-wide bg-slate-950/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
          {t("hero.photoCaption")}
        </span>
      </div>

      {/* Slim tricolor seam marking the transition, instead of a color wash over the photo */}
      <SenegalRibbon />

      {/* Content — on a lighter sky-blue gradient below the photo, nothing hides the image above */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-700 via-sky-600 to-emerald-800 pt-10 pb-20 lg:pt-14 lg:pb-28">

        {/* Decorative Sky Blue & Sunlit Ambient Lighting */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-1/4 w-80 h-80 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* Main Hero Column */}
          <Reveal className="lg:col-span-7 text-left space-y-6" y={16}>

            {/* Senegal Colors & Fraternal Connection Tag */}
            <div className="inline-flex flex-wrap items-center gap-2 p-1 pl-2 pr-3.5 rounded-full text-xs font-semibold bg-sky-950/70 border border-sky-400/40 backdrop-blur-md shadow-sm">
              <SenegalFlagBadge size="sm" />
              <span className="text-sky-200 font-bold">
                🇨🇦 Canada & 🇸🇳 Sénégal
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-300 font-medium hidden sm:inline">
                {t("hero.tag")}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.12]">
              {t("hero.headline1")}{" "}
              <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-emerald-300 bg-clip-text text-transparent">
                {t("hero.headlineHighlight")}
              </span>{" "}
              {t("hero.headline2")}
            </h1>

            {/* Subhead with Senegal colors mention */}
            <p className="text-base sm:text-lg lg:text-xl text-sky-100 max-w-2xl font-light leading-relaxed">
              {t("hero.subhead1")} <strong className="text-amber-300 font-bold">{t("hero.subheadTeranga")}</strong> {t("hero.subhead2")} <strong className="text-emerald-300 font-bold">{t("hero.subheadCite")}</strong> {t("hero.subhead3")} <strong className="text-yellow-300 font-bold">{t("hero.subheadMentor")}</strong>{t("hero.subhead4")}
            </p>

            {/* Senegal Tricolor Decorative Accent Bar */}
            <div className="w-36 h-1 rounded-full overflow-hidden flex shadow-sm">
              <div className="w-1/3 bg-[#00853F]" />
              <div className="w-1/3 bg-[#FDEF42] flex items-center justify-center text-[7px] text-[#00853F] font-bold">★</div>
              <div className="w-1/3 bg-[#E31B23]" />
            </div>

            {/* Key Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm text-sky-100">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{t("hero.highlight1")} <strong>Coop-ACAFIS</strong></span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{t("hero.highlight2")} <strong>{t("hero.highlight2Strong")}</strong></span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{t("hero.highlight3")} <strong>Acafis Mentor</strong></span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Cotisation solidaire : <strong className="text-amber-300">25$ CAD / an</strong></span>
              </div>
            </div>

            {/* CTA Group */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="hero-cta-membership"
                onClick={onOpenCardModal}
                className="px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer border border-amber-300"
              >
                <span>{t("hero.ctaMembership")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-cta-services"
                onClick={() => onNavigate("mission-service")}
                className="px-5 py-3.5 rounded-xl text-sm font-semibold text-white bg-sky-950/70 hover:bg-sky-900/80 border border-sky-600/50 hover:border-sky-400 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>{t("hero.ctaServices")}</span>
              </button>

              <button
                id="hero-cta-mentor"
                onClick={() => onNavigate("acafis-mentor")}
                className="px-4 py-3.5 rounded-xl text-sm font-bold text-amber-300 hover:text-amber-200 bg-amber-950/70 hover:bg-amber-900/60 border border-amber-500/40 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>{t("hero.ctaMentor")}</span>
              </button>
            </div>

            {/* Interac reminder pill with quick copy */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5 text-xs text-sky-200">
              <span className="font-semibold text-white">{t("hero.interacLabel")}</span>
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-950/90 hover:bg-sky-900 text-emerald-300 font-mono border border-sky-600/60 cursor-pointer transition-colors shadow-xs"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">{t("hero.interacCopied")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-sky-400" />
                    <span>{PAYMENT_INTERAC_INFO.email}</span>
                  </>
                )}
              </button>
              <button
                onClick={onOpenPaymentModal}
                className="text-amber-300 hover:text-amber-200 underline cursor-pointer font-medium"
              >
                {t("hero.interacModalities")}
              </button>
            </div>

          </Reveal>

          {/* Right card: our partners */}
          <Reveal className="lg:col-span-5" y={16} delay={0.15}>
            <div className="relative rounded-3xl bg-gradient-to-b from-sky-950/90 to-slate-900/95 p-6 border border-sky-500/30 shadow-2xl">
              <div className="border-b border-sky-800/60 pb-4 mb-4">
                <h2 className="text-lg font-bold text-white font-display">{t("hero.partnersTitle")}</h2>
                <p className="text-xs text-emerald-300 font-medium">{t("hero.partnersSubtitle")}</p>
              </div>

              <ul className="space-y-3">
                {HERO_PARTNERS.map((partner) => (
                  <li
                    key={partner.name}
                    className="flex items-center gap-3.5 p-3 rounded-2xl bg-sky-900/40 border border-sky-700/50"
                  >
                    <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shrink-0 overflow-hidden">
                      {partner.logo ? (
                        <img loading="lazy" decoding="async" src={partner.logo} alt="" className="w-full h-full object-contain p-1" />
                      ) : (
                        <Building2 className="w-7 h-7 text-emerald-700" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white">{partner.name}</p>
                      <p className="text-xs text-sky-200/90 leading-snug">{partner.description[lang]}</p>
                      {partner.url && (
                        <a
                          href={partner.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:underline"
                        >
                          <span>{partner.urlLabel}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

        </div>
      </div>

      </div>
    </section>
  );
};
