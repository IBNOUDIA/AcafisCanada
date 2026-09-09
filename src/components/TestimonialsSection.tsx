import React, { useState } from "react";
import {
  Quote,
  Star,
  MessageSquareHeart,
  UserCheck,
  Building,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TESTIMONIALS } from "../data/acafisData";
import { Reveal, RevealGroup } from "./Reveal";

export const TestimonialsSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const nextTestimonial = () => {
    setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[activeIdx];

  return (
    <section id="temoignages" className="py-20 bg-gradient-to-b from-sky-100/50 via-sky-50 to-white border-b border-sky-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <Reveal className="max-w-3xl mx-auto text-center space-y-4 mb-14">
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

        {/* Featured Testimonial Carousel Banner */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden mb-12">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={current.avatar}
              alt={current.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md shrink-0"
            />

            <div className="space-y-3 flex-1 text-center sm:text-left">
              
              <div className="flex items-center justify-center sm:justify-start gap-1">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <blockquote className="text-lg sm:text-xl font-medium text-slate-800 italic leading-relaxed">
                « {current.quote} »
              </blockquote>

              <div>
                <h4 className="text-base font-bold text-slate-900 font-display">
                  {current.name}
                </h4>
                <div className="text-xs text-slate-500 flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                  <span className="font-semibold text-emerald-800">{current.role}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {current.city}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Carousel controls */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeIdx === idx ? "w-6 bg-emerald-700" : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Aller au témoignage ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                aria-label="Témoignage précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                aria-label="Témoignage suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* 4 Cards Grid */}
        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveIdx(idx)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                activeIdx === idx
                  ? "bg-white border-emerald-600 shadow-md ring-1 ring-emerald-600"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 leading-tight">
                      {item.name}
                    </h5>
                    <span className="text-[10px] text-slate-500">{item.city}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic line-clamp-3 mb-2">
                  « {item.quote} »
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-emerald-800">
                {item.highlight}
              </div>
            </div>
          ))}
        </RevealGroup>

      </div>
    </section>
  );
};
