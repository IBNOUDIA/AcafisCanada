import React, { useState } from "react";
import {
  Calendar,
  Snowflake,
  Sun,
  Flame,
  Leaf,
  MapPin,
  Clock,
  CheckCircle2,
  Bell,
  ArrowRight,
} from "lucide-react";
import { ANNUAL_PROGRAM } from "../data/acafisData";
import { Activity } from "../types";

export const ActivitiesProgram: React.FC = () => {
  const [activeSeasonId, setActiveSeasonId] = useState<string>("ete");

  const seasonIcons: Record<string, React.ReactNode> = {
    hiver: <Snowflake className="w-5 h-5 text-sky-500" />,
    printemps: <Leaf className="w-5 h-5 text-emerald-500" />,
    ete: <Sun className="w-5 h-5 text-amber-500" />,
    automne: <Flame className="w-5 h-5 text-orange-500" />,
  };

  const currentActivity =
    ANNUAL_PROGRAM.find((a) => a.id === activeSeasonId) || ANNUAL_PROGRAM[0];

  return (
    <section id="programme" className="py-20 bg-gradient-to-b from-sky-100/60 via-sky-50 to-white border-b border-sky-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            <span>Calendrier Diaspora & Sénégal 🇸🇳 2026</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Programme d'Activités Annuelles
          </h2>

          <p className="text-base sm:text-lg text-slate-600">
            Quatre grands temps forts tout au long de l'année pour célébrer notre culture, débattre des investissements et rassembler la grande famille ACAFIS.
          </p>

          {/* 4 Season Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 max-w-2xl mx-auto">
            {ANNUAL_PROGRAM.map((act) => {
              const isSelected = activeSeasonId === act.id;
              return (
                <button
                  key={act.id}
                  id={`program-tab-${act.id}`}
                  onClick={() => setActiveSeasonId(act.id)}
                  className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-800 text-white shadow-md ring-2 ring-emerald-600"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {seasonIcons[act.id]}
                    <span>{act.season.split(" ")[0]}</span>
                  </div>
                  <span className={`text-[10px] font-medium ${isSelected ? "text-emerald-200" : "text-slate-400"}`}>
                    {act.season.split(" ")[1]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Activity Spotlight */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {currentActivity.season}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Événement Officiel ACAFIS
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                {currentActivity.title}
              </h3>
              <p className="text-sm font-medium text-emerald-700">
                {currentActivity.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{currentActivity.location}</span>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-base text-slate-700 leading-relaxed">
              {currentActivity.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                Thématiques :
              </span>
              {currentActivity.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Seasonal Highlights Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/60 border border-emerald-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Accès Membre :</strong>
                  <span className="text-slate-600">Gratuit ou tarif réduit avec carte de membre</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Format :</strong>
                  <span className="text-slate-600">Présentiel & retransmission hybride</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Encadrement :</strong>
                  <span className="text-slate-600">Com. Organisation & Bénévoles</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Cards Summary Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {ANNUAL_PROGRAM.map((act) => (
            <div
              key={act.id}
              onClick={() => setActiveSeasonId(act.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                activeSeasonId === act.id
                  ? "bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500"
                  : "bg-white/80 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {act.season}
                </span>
                {seasonIcons[act.id]}
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-display mb-1">
                {act.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2">
                {act.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
