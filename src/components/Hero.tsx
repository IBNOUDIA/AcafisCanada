import React, { useState } from "react";
import {
  ArrowRight,
  GraduationCap,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { SenegalFlagBadge, SenegalRibbon, WovenBand } from "./SenegalFlagBadge";
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
      <WovenBand />

      {/* Content on a flat forest green: one accent colour, nothing competing with the text */}
      <div className="bg-forest motif-texture text-cream pt-12 pb-20 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Main Hero Column */}
            <Reveal className="lg:col-span-7 text-left space-y-7" y={16}>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-sun">
                <SenegalFlagBadge size="sm" />
                <span>Canada & Sénégal</span>
                <span aria-hidden="true" className="hidden sm:inline text-cream/40">•</span>
                <span className="font-display text-xl">{t("hero.tag")}</span>
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-cream font-display leading-[1.28]">
                {t("hero.headline1")} <span className="text-sun">{t("hero.headlineHighlight")}</span> {t("hero.headline2")}
              </h1>

              <p className="text-base sm:text-lg text-cream/85 max-w-2xl leading-relaxed">
                {t("hero.subhead1")} <strong className="font-semibold text-cream">{t("hero.subheadTeranga")}</strong> {t("hero.subhead2")} <strong className="font-semibold text-cream">{t("hero.subheadCite")}</strong> {t("hero.subhead3")} <strong className="font-semibold text-cream">{t("hero.subheadMentor")}</strong>{t("hero.subhead4")}
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-[15px] text-cream/90 border-t border-cream/15 pt-6">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-sun shrink-0 mt-1" />
                  <span>{t("hero.highlight1")} <strong className="font-semibold text-cream">Coop-ACAFIS</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-sun shrink-0 mt-1" />
                  <span>{t("hero.highlight2")} <strong className="font-semibold text-cream">{t("hero.highlight2Strong")}</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-sun shrink-0 mt-1" />
                  <span>{t("hero.highlight3")} <strong className="font-semibold text-cream">Acafis Mentor</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-sun shrink-0 mt-1" />
                  <span>Cotisation solidaire : <strong className="font-semibold text-cream">25$ CAD / an</strong></span>
                </li>
              </ul>

              {/* CTA Group */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  id="hero-cta-membership"
                  onClick={onOpenCardModal}
                  className="px-6 py-3.5 rounded-lg text-sm font-bold text-forest bg-sun hover:bg-sun/90 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span>{t("hero.ctaMembership")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-cta-services"
                  onClick={() => onNavigate("mission-service")}
                  className="px-5 py-3.5 rounded-lg text-sm font-semibold text-cream border border-cream/40 hover:bg-cream/10 transition-colors cursor-pointer"
                >
                  {t("hero.ctaServices")}
                </button>

                <button
                  id="hero-cta-mentor"
                  onClick={() => onNavigate("acafis-mentor")}
                  className="px-3 py-3.5 rounded-lg text-sm font-semibold text-sun hover:underline cursor-pointer flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{t("hero.ctaMentor")}</span>
                </button>
              </div>

              {/* Interac reminder with quick copy */}
              <div className="flex flex-wrap items-center gap-2.5 text-sm text-cream/80">
                <span>{t("hero.interacLabel")}</span>
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 text-cream font-semibold hover:underline cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-sun" />
                      <span>{t("hero.interacCopied")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-sun" />
                      <span>{PAYMENT_INTERAC_INFO.email}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={onOpenPaymentModal}
                  className="text-sun underline hover:no-underline cursor-pointer font-medium"
                >
                  {t("hero.interacModalities")}
                </button>
              </div>
            </Reveal>

            {/* Right card: our partners */}
            <Reveal className="lg:col-span-5" y={16} delay={0.15}>
              <div className="rounded-2xl bg-cream text-forest p-7">
                <h2 className="text-2xl font-semibold font-display">{t("hero.partnersTitle")}</h2>
                <p className="text-sm text-forest/70 mt-1">{t("hero.partnersSubtitle")}</p>

                <ul className="mt-5 divide-y divide-forest/15">
                  {HERO_PARTNERS.map((partner) => (
                    <li key={partner.name} className="flex items-center gap-4 py-4 last:pb-0">
                      <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center shrink-0 overflow-hidden">
                        <img loading="lazy" decoding="async" src={partner.logo} alt="" className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-bold">{partner.name}</p>
                        <p className="text-sm text-forest/75 leading-snug">{partner.description[lang]}</p>
                        <a
                          href={partner.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-emerald-800 underline hover:no-underline"
                        >
                          <span>{partner.urlLabel}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
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
