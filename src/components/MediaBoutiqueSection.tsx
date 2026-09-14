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
  const [activeTab, setActiveTab] = useState<"media" | "partenaires">("media");
  const [orderedItem, setOrderedItem] = useState<string | null>(null);

  const mediaGallery = [
    {
      title: "Grand BBQ Familial de l'Été",
      location: "Parc communautaire, Québec",
      image: mediaBbqEte,
      caption: "Retrouvailles fraternelles des familles de la diaspora autour des grillades et de la Teranga.",
    },
    {
      title: "Rassemblement Communautaire",
      location: "Pique-nique en plein air",
      image: mediaRassemblement,
      caption: "Moment de détente et de fraternité entre membres autour d'un pique-nique estival.",
    },
    {
      title: "Journée Familiale au Parc",
      location: "Parc, Québec",
      image: mediaJeunesseCalypso,
      caption: "Familles réunies pour une journée de détente, de partage et de complicité en plein air.",
    },
    {
      title: "Rencontre du Bureau & Aînés",
      location: "Salle communautaire",
      image: mediaBureauAines,
      caption: "Échanges entre membres du Bureau et aînés de la communauté lors d'une rencontre officielle.",
    },
    {
      title: "Soirée Ndogou Communautaire",
      location: "Salle communautaire",
      image: mediaNdogou,
      caption: "Les jeunes de la diaspora réunis pour rompre le jeûne ensemble dans la convivialité.",
    },
    {
      title: "Soirée Festive en Groupe",
      location: "Sortie communautaire",
      image: mediaExcursion,
      caption: "Petits et grands réunis pour une soirée festive, drapeau sénégalais fièrement porté.",
    },
    {
      title: "Rencontre Amicale entre Membres",
      location: "Salle St-Édouard",
      image: mediaSouvenir1,
      caption: "Deux membres de la communauté réunis avant une activité ACAFIS.",
    },
    {
      title: "Gala de Solidarité",
      location: "Soirée de gala",
      image: mediaSouvenir2,
      caption: "Ambiance de fête et de fraternité lors d'un gala annuel de solidarité ACAFIS.",
    },
    {
      title: "Rassemblement Amical en Plein Air",
      location: "Parc, Québec",
      image: mediaSouvenir3,
      caption: "Membres et familles réunis pour un moment convivial en pleine nature.",
    },
    {
      title: "Complicité Entre Amies",
      location: "Parc, Québec",
      image: mediaSouvenir4,
      caption: "Trois membres de la communauté partagent un moment de fraternité et de bonne humeur.",
    },
    {
      title: "Moment en Famille au Bord de l'Eau",
      location: "Parc, Québec",
      image: mediaSouvenir5,
      caption: "Familles et enfants réunis pour une belle journée ensoleillée entre amis.",
    },
    {
      title: "Élégance et Fraternité Féminine",
      location: "Parc, Québec",
      image: mediaSouvenir6,
      caption: "Les femmes de la diaspora célèbrent leur culture et leur amitié en tenues traditionnelles.",
    },
    {
      title: "Un Couple de la Communauté",
      location: "Salle communautaire",
      image: mediaSouvenir8,
      caption: "Portrait chaleureux d'un couple de membres lors d'un événement ACAFIS.",
    },
    {
      title: "Cinq Femmes, Une Même Fierté",
      location: "Salle communautaire",
      image: mediaSouvenir9,
      caption: "Un moment de complicité et d'élégance partagée entre membres de la communauté.",
    },
    {
      title: "Diplôme d'Honneur — Graduation de Kine",
      location: "Montréal, Juin 2012",
      image: mediaKineGraduation,
      caption: "ACAFIS célèbre la réussite académique d'une jeune de la diaspora avec un diplôme d'honneur.",
    },
    {
      title: "Célébration en Famille",
      location: "Montréal, Juin 2012",
      image: mediaKineGroupe,
      caption: "Famille et amis réunis pour célébrer ensemble cette belle réussite scolaire.",
    },
    {
      title: "Sortie à Drummondville",
      location: "Drummondville, QC",
      image: mediaDrummondville,
      caption: "Défilé haut en couleur lors d'une sortie communautaire à Drummondville.",
    },
    {
      title: "BBQ d'Équipe à Drummondville",
      location: "Drummondville, QC",
      image: mediaBbqDrummondville,
      caption: "Grillades entre membres malgré la pluie — la bonne humeur reste au rendez-vous !",
    },
  ];

  const communityVideos = ACAFIS_VIDEOS.filter((v) => v.category === "communaute");

  return (
    <section id="media" className="py-20 bg-gradient-to-b from-white via-sky-50/70 to-sky-100/50 border-b border-sky-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <Reveal className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Vie Communautaire & Culture Sénégalaise 🇸🇳</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Média, Boutique Solidaire & Partenaires
          </h2>

          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Retrouvez les moments forts de notre communauté, notre galerie photos officielle et notre boutique de solidarité.
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
              Média & Galerie Photo
            </button>

            <button
              onClick={() => setActiveTab("partenaires")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "partenaires"
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Partenaires
            </button>
          </div>
        </Reveal>

        {/* External Boutique Link Banner */}
        <div className="max-w-4xl mx-auto mb-10 p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-500/20">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Boutique Officielle en Ligne
              </span>
            </div>
            <h4 className="text-base font-bold font-display">
              Accédez directement à boutique-acafis.vercel.app
            </h4>
            <p className="text-xs text-slate-300">
              Commandez vos articles aux couleurs de l'association pour financer les projets d'éducation et la Cité Jardin.
            </p>
          </div>

          <a
            href={EXTERNAL_LINKS.boutique}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center gap-2 shrink-0 shadow-sm"
          >
            <span>Ouvrir la Boutique en Ligne</span>
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
              Vidéos de la Communauté
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
                      {partner.role}
                    </span>
                  </div>
                  <Handshake className="w-5 h-5 text-slate-400" />
                </div>
              ))}
            </div>
          </Reveal>
        )}

      </div>
    </section>
  );
};
