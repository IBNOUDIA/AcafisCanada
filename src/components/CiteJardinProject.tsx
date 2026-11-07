import React from "react";
import {
  TreePine,
  Sparkles,
  Gift,
  Mic2,
  Quote,
} from "lucide-react";
import { RECIPIENDAIRES, ACAFIS_VIDEOS } from "../data/acafisData";
import { Reveal, RevealGroup } from "./Reveal";
import { VideoGrid } from "./VideoGrid";
import { useTranslation } from "../i18n/translations";
import espaceJeunePhoto from "../assets/images/media-excursion.webp";
import recipiendaireDiscours from "../assets/images/recipiendaire-discours.webp";
import recipiendaireRemise from "../assets/images/recipiendaire-remise.webp";
import recipiendairesGroupe from "../assets/images/recipiendaires-groupe.webp";

interface CiteJardinProjectProps {
  onNavigateContact: () => void;
}

export const CiteJardinProject: React.FC<CiteJardinProjectProps> = ({
  onNavigateContact,
}) => {
  const { t, lang } = useTranslation();
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

        {/* Real photo of ACAFIS children and youth at a festive evening */}
        <Reveal className="relative rounded-3xl overflow-hidden h-72 sm:h-[30rem] shadow-lg">
          <img
            fetchPriority="high"
            src={espaceJeunePhoto}
            alt="Enfants et jeunes de la diaspora ACAFIS réunis sous le drapeau du Sénégal lors d'une soirée festive"
            className="absolute inset-0 w-full h-full object-cover object-[center_12%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
            <span className="text-sm sm:text-base font-bold text-white font-display">
              {t("espaceJeune.outingCaption")}
            </span>
          </div>
        </Reveal>

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
              <img loading="lazy" decoding="async" src={recipiendaireDiscours} alt="Un récipiendaire prononce son discours au nom des enfants" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white text-xs font-bold">
                <Mic2 className="w-3.5 h-3.5" />
                <span>{t("espaceJeune.photoCaption1")}</span>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-56 shadow-md">
              <img loading="lazy" decoding="async" src={recipiendaireRemise} alt="Remise du cadeau à un récipiendaire" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white text-xs font-bold">
                <Gift className="w-3.5 h-3.5" />
                <span>{t("espaceJeune.photoCaption2")}</span>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-56 shadow-md">
              <img loading="lazy" decoding="async" src={recipiendairesGroupe} alt="Les enfants d'ACAFIS réunis pour la fête du 31 décembre" className="absolute inset-0 w-full h-full object-cover" />
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
