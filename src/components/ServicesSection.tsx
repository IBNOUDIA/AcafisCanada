import React, { useState } from "react";
import {
  Globe2,
  Home,
  GraduationCap,
  Users2,
  Sparkles,
  Check,
  ArrowRight,
  ShieldCheck,
  Building,
  Heart,
  Laptop,
} from "lucide-react";
import { SERVICES_MISSIONS, PAYMENT_INTERAC_INFO, ACAFIS_VIDEOS } from "../data/acafisData";
import { Reveal, RevealGroup } from "./Reveal";
import { VideoGrid } from "./VideoGrid";
import { useTranslation } from "../i18n/translations";
import servicesHeroPhoto from "../assets/images/services-hero.jpg";

interface ServicesSectionProps {
  onNavigate: (sectionId: string) => void;
  onOpenCardModal: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onNavigate,
  onOpenCardModal,
}) => {
  const { t, lang } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const educationVideos = ACAFIS_VIDEOS.filter((v) => v.category === "education");

  const iconMap: Record<string, React.ReactNode> = {
    Globe2: <Globe2 className="w-6 h-6 text-emerald-600" />,
    Home: <Home className="w-6 h-6 text-teal-600" />,
    GraduationCap: <GraduationCap className="w-6 h-6 text-amber-600" />,
    Users2: <Users2 className="w-6 h-6 text-indigo-600" />,
    Sparkles: <Sparkles className="w-6 h-6 text-rose-600" />,
    Building: <Building className="w-6 h-6 text-sky-600" />,
  };

  const filteredServices = activeCategory === "all"
    ? SERVICES_MISSIONS
    : SERVICES_MISSIONS.filter(s => s.category === activeCategory);

  return (
    <section id="mission-service" className="py-20 bg-gradient-to-b from-sky-100/50 via-sky-50 to-white border-b border-sky-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero photo — solidarity in action */}
        <Reveal className="relative rounded-3xl overflow-hidden mb-14 h-64 sm:h-80 shadow-lg">
          <img
            src={servicesHeroPhoto}
            alt="Familles de la diaspora ACAFIS réunies en pique-nique communautaire"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <span className="text-sm sm:text-base font-bold text-white font-display">
              {t("services.bannerCaption")}
            </span>
          </div>
        </Reveal>

        {/* Section Header */}
        <Reveal className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-900 border border-sky-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t("services.badge")}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            {t("services.title")}
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {t("services.intro")}
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: "all", label: t("services.tab.all") },
              { id: "habitat", label: t("services.tab.habitat") },
              { id: "education", label: t("services.tab.education") },
              { id: "diaspora", label: t("services.tab.diaspora") },
              { id: "solidarity", label: t("services.tab.solidarity") },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Services & Missions Grid */}
        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300/80 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-13 h-13 rounded-xl bg-slate-100/90 border border-slate-200 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200">
                  {iconMap[service.iconName] || <Globe2 className="w-6 h-6 text-emerald-600" />}
                </div>

                <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display mb-2">
                  {service.title[lang]}
                </h3>

                <p className="text-sm font-medium text-emerald-800 mb-3 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100/60">
                  {service.shortDesc[lang]}
                </p>

                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  {service.description[lang]}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {t("services.commitments")}
                  </p>
                  {service.deliverables[lang].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                {service.id === "cite-jardin-coop" ? (
                  <button
                    onClick={() => onNavigate("espace-jeune")}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{t("services.cta.citeJardin")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : service.id === "education-ntic" ? (
                  <button
                    onClick={() => onNavigate("acafis-mentor")}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{t("services.cta.mentor")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={onOpenCardModal}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-800 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{t("services.cta.member")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </RevealGroup>

        {/* Vidéos : Conférences & Panels Éducation */}
        {educationVideos.length > 0 && (
          <div className="mt-16">
            <Reveal className="max-w-3xl mx-auto text-center space-y-3 mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                <span>{t("common.videoSection")}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                {t("services.videosTitle")}
              </h3>
            </Reveal>
            <VideoGrid videos={educationVideos} />
          </div>
        )}

        {/* Membership Value Proposition Bar */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-lg flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
              {t("services.membershipBarTitle")}
            </h3>
            <p className="text-sm text-emerald-200/90 max-w-2xl">
              {t("services.membershipBarDesc1")} <strong>{PAYMENT_INTERAC_INFO.annualFeeCAD}$ CAD</strong> {t("services.membershipBarDesc2")}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenCardModal}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md transition-transform hover:scale-105 cursor-pointer"
            >
              {t("services.membershipBarCta")}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
