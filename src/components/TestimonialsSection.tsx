import React from "react";
import { MessageSquareHeart } from "lucide-react";
import { ACAFIS_VIDEOS } from "../data/acafisData";
import { Reveal } from "./Reveal";
import { VideoGrid } from "./VideoGrid";
import testimonialsHeroPhoto from "../assets/images/temoignages-hero.jpg";

export const TestimonialsSection: React.FC = () => {
  const videos = ACAFIS_VIDEOS.filter((v) => v.category === "temoignage");

  return (
    <section id="temoignages" className="py-20 bg-gradient-to-b from-sky-100/50 via-sky-50 to-white border-b border-sky-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <Reveal className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <MessageSquareHeart className="w-3.5 h-3.5 text-amber-700" />
            <span>Voix de la Communauté • Teranga Sénégalaise 🇸🇳</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Ce que nos membres disent d'ACAFIS Canada
          </h2>

          <p className="text-base sm:text-lg text-slate-600">
            Retours d'expérience de familles, jeunes apprenants et investisseurs solidaires de Montréal, Ottawa, Québec et au-delà.
          </p>
        </Reveal>

        {/* Real photo banner */}
        <Reveal className="relative rounded-3xl overflow-hidden mb-16 h-64 sm:h-80 shadow-lg max-w-5xl mx-auto">
          <img
            src={testimonialsHeroPhoto}
            alt="Membres de la communauté ACAFIS réunis en toute convivialité"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <span className="text-sm sm:text-base font-bold text-white font-display">
              La Teranga au quotidien — nos membres réunis en toute convivialité
            </span>
          </div>
        </Reveal>

        {/* Video Testimonials */}
        {videos.length > 0 && (
          <div>
            <Reveal className="max-w-3xl mx-auto text-center space-y-3 mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                <MessageSquareHeart className="w-3.5 h-3.5 text-emerald-700" />
                <span>En Vidéo</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                Témoignages Vidéo de Nos Membres
              </h3>
            </Reveal>

            <VideoGrid videos={videos} />
          </div>
        )}

      </div>
    </section>
  );
};
