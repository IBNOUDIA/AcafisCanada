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
import { BOUTIQUE_ITEMS, PARTNERS_LIST, EXTERNAL_LINKS } from "../data/acafisData";

export const MediaBoutiqueSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"media" | "boutique" | "partenaires">("media");
  const [orderedItem, setOrderedItem] = useState<string | null>(null);

  const mediaGallery = [
    {
      title: "Grand BBQ Familial de l'Été",
      location: "Parc Angrignon, Montréal",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&auto=format&fit=crop&q=80",
      caption: "Retrouvailles fraternelles des familles de la diaspora autour des grillades et de la musique sénégalaise.",
    },
    {
      title: "Cité Jardin • Ndianda",
      location: "Région de Thiès, Sénégal",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80",
      caption: "Vue sur le site de la Cité Jardin dédié à l'agro-écologie et à la future colonie 2027.",
    },
    {
      title: "Conférence Coop-ACAFIS & Investissement",
      location: "Ottawa / Hybride",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80",
      caption: "Séance d'information avec nos experts sur la sécurisation foncière et les statuts de la coopérative.",
    },
    {
      title: "Ateliers Jeunesse & Code",
      location: "Montréal, QC",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80",
      caption: "Initiation de nos enfants à l'algorithmique et à la programmation avec Acafis Mentor.",
    },
  ];

  return (
    <section id="media" className="py-20 bg-gradient-to-b from-white via-sky-50/70 to-sky-100/50 border-b border-sky-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
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
              onClick={() => setActiveTab("boutique")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "boutique"
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Boutique ACAFIS
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
        </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto animate-in fade-in duration-200">
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
          </div>
        )}

        {/* 2. Tab: Boutique Solidaire */}
        {activeTab === "boutique" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="max-w-xl mx-auto text-center text-xs text-slate-500 mb-4">
              100% des bénéfices des articles officiels ACAFIS financent les bourses jeunesse et la colonie 2027.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {BOUTIQUE_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-xs">
                        {item.badge}
                      </span>
                    )}
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-slate-950/80 backdrop-blur-md text-white border border-white/20">
                      {item.priceCAD}$ CAD
                    </span>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-emerald-800 mb-1">
                        {item.category}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 font-display mb-1.5">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <a
                        href={EXTERNAL_LINKS.boutique}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Commander sur boutique-acafis</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Tab: Partenaires */}
        {activeTab === "partenaires" && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-200">
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
          </div>
        )}

      </div>
    </section>
  );
};
