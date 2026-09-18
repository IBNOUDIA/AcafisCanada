import React, { useState } from "react";
import {
  TreePine,
  MapPin,
  Calendar,
  Compass,
  Cpu,
  Landmark,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Gift,
  Mic2,
  Quote,
} from "lucide-react";
import { COLONIE_ROADMAP, RECIPIENDAIRES, ACAFIS_VIDEOS } from "../data/acafisData";
import { Reveal, RevealGroup } from "./Reveal";
import { VideoGrid } from "./VideoGrid";
import { useTranslation } from "../i18n/translations";
import colonieOutingPhoto from "../assets/images/espace-jeune-colonie.jpg";
import recipiendaireDiscours from "../assets/images/recipiendaire-discours.jpg";
import recipiendaireRemise from "../assets/images/recipiendaire-remise.jpg";
import recipiendairesGroupe from "../assets/images/recipiendaires-groupe.jpg";

interface CiteJardinProjectProps {
  onOpenCardModal: () => void;
  onNavigateContact: () => void;
}

export const CiteJardinProject: React.FC<CiteJardinProjectProps> = ({
  onOpenCardModal,
  onNavigateContact,
}) => {
  const { t, lang } = useTranslation();
  const [showFullRoadmap, setShowFullRoadmap] = useState(false);
  const jeunesseVideos = ACAFIS_VIDEOS.filter((v) => v.category === "jeunesse");

  return (
    <section id="espace-jeune" className="py-20 bg-gradient-to-b from-sky-50 via-white to-sky-100/40 border-b border-sky-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <Reveal className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
            <TreePine className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t("espaceJeune.badge")}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            {t("espaceJeune.title")}
          </h2>

          <p className="text-base sm:text-lg text-slate-600">
            {t("espaceJeune.intro")}
          </p>
        </Reveal>

        {/* Real photo from a past ACAFIS youth outing — sets the tone before the 2030 project banner */}
        <Reveal className="relative rounded-3xl overflow-hidden mb-10 h-64 sm:h-80 shadow-lg">
          <img
            src={colonieOutingPhoto}
            alt="Jeunes de la diaspora ACAFIS lors d'une sortie de groupe"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
            <span className="text-sm sm:text-base font-bold text-white font-display">
              {t("espaceJeune.outingCaption")}
            </span>
          </div>
        </Reveal>

        {/* Hero Banner for Colonie 2030 */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-emerald-500/20 mb-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-5">
              
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-sm">
                  {t("espaceJeune.bannerBadge1")}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-200 border border-emerald-600/40">
                  {t("espaceJeune.bannerBadge2")}
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t("espaceJeune.bannerLocation")}</span>
                </div>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black tracking-tight font-display text-white">
                {t("espaceJeune.bannerTitle")}
              </h3>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                {t("espaceJeune.bannerDesc")}
              </p>

              {/* Two Main Pillars from the document */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <Landmark className="w-4 h-4" />
                    <span>{t("espaceJeune.pillar1Title")}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("espaceJeune.pillar1Desc")}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <Cpu className="w-4 h-4" />
                    <span>{t("espaceJeune.pillar2Title")}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("espaceJeune.pillar2Desc")}
                  </p>
                </div>
              </div>

              {/* Status Notice */}
              <div className="flex items-center gap-3 pt-2 text-xs text-emerald-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-semibold text-white">{t("espaceJeune.statusCurrent")}</span>
              </div>
            </div>

            {/* Quick Action Side */}
            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl p-6 border border-slate-700/80 shadow-inner space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                {t("espaceJeune.joinProjectTitle")}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t("espaceJeune.joinProjectDesc")}
              </p>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setShowFullRoadmap(!showFullRoadmap)}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>{showFullRoadmap ? t("espaceJeune.hideRoadmapBtn") : t("espaceJeune.showRoadmapBtn")}</span>
                  {showFullRoadmap ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <button
                  onClick={onNavigateContact}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{t("espaceJeune.contactYouthCommittee")}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Roadmap Display (Toggled or Expanded) */}
        <div id="projet2030" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              {t("espaceJeune.roadmapTitle")}
            </h3>
            <button
              onClick={() => setShowFullRoadmap(!showFullRoadmap)}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{showFullRoadmap ? t("espaceJeune.collapseBtn") : t("espaceJeune.expandBtn")}</span>
              {showFullRoadmap ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLONIE_ROADMAP.map((step, idx) => {
              const isCurrent = step.status === "in_progress";
              return (
                <div
                  key={step.phase.fr}
                  className={`rounded-2xl p-6 border transition-all ${
                    isCurrent
                      ? "bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-md"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        isCurrent
                          ? "bg-emerald-700 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {step.phase[lang]}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {step.period[lang]}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 font-display mb-3">
                    {step.title[lang]}
                  </h4>

                  <ul className="space-y-2 text-xs text-slate-600">
                    {step.details[lang].map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            isCurrent ? "text-emerald-600" : "text-slate-400"
                          }`}
                        />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </RevealGroup>
        </div>

        {/* Coop-ACAFIS Habitat Integration */}
        <div id="coop" className="mt-16 p-8 rounded-3xl bg-slate-900 text-white border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>{t("espaceJeune.coopBadge")}</span>
              </div>

              <h3 className="text-2xl font-bold font-display text-white">
                {t("espaceJeune.coopTitle")}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                {t("espaceJeune.coopDesc")}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href="https://coop-acafis.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>{t("espaceJeune.coopCtaVisit")}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={onOpenCardModal}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-emerald-200 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t("espaceJeune.coopCtaJoin")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Récipiendaires — la tradition du 31 décembre */}
        <div className="mt-16">
          <Reveal className="max-w-3xl mx-auto text-center space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <Gift className="w-3.5 h-3.5 text-amber-700" />
              <span>{t("espaceJeune.recipiendaires.badge")}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {t("espaceJeune.recipiendaires.title")}
            </h3>
            <p className="text-base text-slate-600">
              {t("espaceJeune.recipiendaires.intro")}
            </p>
          </Reveal>

          {/* Real photos from past celebrations */}
          <RevealGroup className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            <div className="relative rounded-2xl overflow-hidden h-56 shadow-md">
              <img src={recipiendaireDiscours} alt="Un récipiendaire prononce son discours au nom des enfants" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white text-xs font-bold">
                <Mic2 className="w-3.5 h-3.5" />
                <span>{t("espaceJeune.photoCaption1")}</span>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-56 shadow-md">
              <img src={recipiendaireRemise} alt="Remise du cadeau à un récipiendaire" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white text-xs font-bold">
                <Gift className="w-3.5 h-3.5" />
                <span>{t("espaceJeune.photoCaption2")}</span>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-56 shadow-md">
              <img src={recipiendairesGroupe} alt="Les enfants d'ACAFIS réunis pour la fête du 31 décembre" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t("espaceJeune.photoCaption3")}</span>
              </div>
            </div>
          </RevealGroup>

          {/* Real testimonials from past récipiendaires, added over time */}
          {RECIPIENDAIRES.length > 0 ? (
            <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {RECIPIENDAIRES.map((r) => (
                <div key={r.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <Quote className="w-5 h-5 text-amber-500" />
                  <p className="text-sm text-slate-700 italic leading-relaxed">« {r.quote[lang]} »</p>
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-sm font-bold text-slate-900">{r.name}</span>
                    <span className="text-xs text-slate-500 ml-2">{t("espaceJeune.recipiendaireLabel")} {r.year}</span>
                  </div>
                </div>
              ))}
            </RevealGroup>
          ) : (
            <Reveal className="max-w-xl mx-auto text-center p-6 rounded-2xl bg-amber-50 border border-amber-200">
              <p className="text-sm text-amber-900">
                {t("espaceJeune.emptyMessage")}
              </p>
              <button
                onClick={onNavigateContact}
                className="mt-3 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors cursor-pointer"
              >
                {t("espaceJeune.shareTestimonial")}
              </button>
            </Reveal>
          )}
        </div>

        {/* Vidéos Jeunesse */}
        {jeunesseVideos.length > 0 && (
          <div className="mt-16">
            <Reveal className="max-w-3xl mx-auto text-center space-y-3 mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
                <TreePine className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t("common.videoSection")}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                {t("espaceJeune.videosTitle")}
              </h3>
            </Reveal>
            <VideoGrid videos={jeunesseVideos} />
          </div>
        )}

      </div>
    </section>
  );
};
