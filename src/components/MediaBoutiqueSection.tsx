import React, { useState } from "react";
import {
  ShoppingBag,
  Image as ImageIcon,
  Heart,
  Handshake,
  Check,
  Sparkles,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { PARTNERS_LIST, EXTERNAL_LINKS, ACAFIS_VIDEOS } from "../data/acafisData";
import { Reveal, RevealGroup } from "./Reveal";
import { VideoGrid } from "./VideoGrid";
import { useTranslation, TranslationKey } from "../i18n/translations";
import mediaBbqEte from "../assets/images/media-bbq-ete.jpg";
import mediaRassemblement from "../assets/images/media-rassemblement.jpg";
import mediaJeunesseCalypso from "../assets/images/media-jeunesse-calypso.jpg";
import mediaBureauAines from "../assets/images/media-bureau-aines.jpg";
import mediaNdogou from "../assets/images/media-ndogou.jpg";
import mediaExcursion from "../assets/images/media-excursion.jpg";
import mediaSouvenir1 from "../assets/images/media-souvenir1.jpg";
import mediaSouvenir2 from "../assets/images/media-souvenir2.jpg";
import mediaSouvenir3 from "../assets/images/media-souvenir3.jpg";
import mediaSouvenir4 from "../assets/images/media-souvenir4.jpg";
import mediaSouvenir5 from "../assets/images/media-souvenir5.jpg";
import mediaSouvenir6 from "../assets/images/media-souvenir6.jpg";
import mediaSouvenir8 from "../assets/images/media-souvenir8.jpg";
import mediaSouvenir9 from "../assets/images/media-souvenir9.jpg";
import mediaKineGraduation from "../assets/images/media-kine-graduation.jpg";
import mediaKineGroupe from "../assets/images/media-kine-groupe.jpg";
import mediaDrummondville from "../assets/images/media-drummondville.jpg";
import mediaBbqDrummondville from "../assets/images/media-bbq-drummondville.jpg";

export const MediaBoutiqueSection: React.FC = () => {
  const { t, lang } = useTranslation();
  const [activeTab, setActiveTab] = useState<"media" | "partenaires">("media");
  const [orderedItem, setOrderedItem] = useState<string | null>(null);

  const g = (n: number) => t(`media.gallery.title${n}` as TranslationKey);
  const c = (n: number) => t(`media.gallery.caption${n}` as TranslationKey);

  const mediaGallery = [
    { title: g(1), location: t("media.loc.parcCommunautaire"), image: mediaBbqEte, caption: c(1) },
    { title: g(2), location: t("media.loc.piqueNique"), image: mediaRassemblement, caption: c(2) },
    { title: g(3), location: t("media.loc.parc"), image: mediaJeunesseCalypso, caption: c(3) },
    { title: g(4), location: t("media.loc.salleCommunautaire"), image: mediaBureauAines, caption: c(4) },
    { title: g(5), location: t("media.loc.salleCommunautaire"), image: mediaNdogou, caption: c(5) },
    { title: g(6), location: t("media.loc.sortieCommunautaire"), image: mediaExcursion, caption: c(6) },
    { title: g(7), location: t("media.loc.salleStEdouard"), image: mediaSouvenir1, caption: c(7) },
    { title: g(8), location: t("media.loc.soireeGala"), image: mediaSouvenir2, caption: c(8) },
    { title: g(9), location: t("media.loc.parc"), image: mediaSouvenir3, caption: c(9) },
    { title: g(10), location: t("media.loc.parc"), image: mediaSouvenir4, caption: c(10) },
    { title: g(11), location: t("media.loc.parc"), image: mediaSouvenir5, caption: c(11) },
    { title: g(12), location: t("media.loc.parc"), image: mediaSouvenir6, caption: c(12) },
    { title: g(13), location: t("media.loc.salleCommunautaire"), image: mediaSouvenir8, caption: c(13) },
    { title: g(14), location: t("media.loc.salleCommunautaire"), image: mediaSouvenir9, caption: c(14) },
    { title: g(15), location: "Montréal, Juin 2012", image: mediaKineGraduation, caption: c(15) },
    { title: g(16), location: "Montréal, Juin 2012", image: mediaKineGroupe, caption: c(16) },
    { title: g(17), location: "Drummondville, QC", image: mediaDrummondville, caption: c(17) },
    { title: g(18), location: "Drummondville, QC", image: mediaBbqDrummondville, caption: c(18) },
  ];

  const communityVideos = ACAFIS_VIDEOS.filter((v) => v.category === "communaute");

  return (
    <section id="media" className="py-20 bg-gradient-to-b from-white via-sky-50/70 to-sky-100/50 border-b border-sky-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <Reveal className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t("media.badge")}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            {t("media.title")}
          </h2>

          <p className="text-base text-slate-600 max-w-xl mx-auto">
            {t("media.intro")}
          </p>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab("media")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "media"
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {t("media.tabGallery")}
            </button>

            <button
              onClick={() => setActiveTab("partenaires")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "partenaires"
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {t("media.tabPartners")}
            </button>
          </div>
        </Reveal>

        {/* External Boutique Link Banner */}
        <div className="max-w-4xl mx-auto mb-10 p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-500/20">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                {t("media.boutiqueLabel")}
              </span>
            </div>
            <h4 className="text-base font-bold font-display">
              {t("media.boutiqueTitle")}
            </h4>
            <p className="text-xs text-slate-300">
              {t("media.boutiqueDesc")}
            </p>
          </div>

          <a
            href={EXTERNAL_LINKS.boutique}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center gap-2 shrink-0 shadow-sm"
          >
            <span>{t("media.boutiqueCta")}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 1. Tab: Média & Galerie */}
        {activeTab === "media" && (
          <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {mediaGallery.map((med, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={med.image}
                    alt={med.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                    <span className="text-[11px] font-bold text-white">
                      {med.location}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 font-display mb-1">
                    {med.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {med.caption}
                  </p>
                </div>
              </div>
            ))}
          </RevealGroup>
        )}

        {activeTab === "media" && communityVideos.length > 0 && (
          <div className="mt-14 max-w-6xl mx-auto">
            <h3 className="text-center text-lg font-bold text-slate-900 font-display mb-8">
              {t("media.communityVideosTitle")}
            </h3>
            <VideoGrid videos={communityVideos} />
          </div>
        )}

        {/* 2. Tab: Partenaires */}
        {activeTab === "partenaires" && (
          <Reveal className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PARTNERS_LIST.map((partner, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-slate-900">
                      {partner.name}
                    </h4>
                    <span className="text-xs text-emerald-800 font-medium">
                      {partner.role[lang]}
                    </span>
                  </div>
                  <Handshake className="w-5 h-5 text-slate-400" />
                </div>
              ))}
            </div>

            <div className="mt-4 p-5 rounded-2xl bg-sky-50 border border-sky-200 border-dashed text-center">
              <p className="text-xs text-sky-900">
                {t("media.partnersComingSoon")}
              </p>
            </div>
          </Reveal>
        )}

      </div>
    </section>
  );
};
