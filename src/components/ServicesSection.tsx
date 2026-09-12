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
import { SERVICES_MISSIONS, PAYMENT_INTERAC_INFO } from "../data/acafisData";
import { Reveal, RevealGroup } from "./Reveal";

interface ServicesSectionProps {
  onNavigate: (sectionId: string) => void;
  onOpenCardModal: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onNavigate,
  onOpenCardModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const iconMap: Record<string, React.ReactNode> = {
    Globe2: <Globe2 className="w-6 h-6 text-emerald-600" />,
    Home: <Home className="w-6 h-6 text-teal-600" />,
    GraduationCap: <GraduationCap className="w-6 h-6 text-amber-600" />,
    Users2: <Users2 className="w-6 h-6 text-indigo-600" />,
    Sparkles: <Sparkles className="w-6 h-6 text-rose-600" />,
  };

  const filteredServices = activeCategory === "all"
    ? SERVICES_MISSIONS
    : SERVICES_MISSIONS.filter(s => s.category === activeCategory);

  return (
    <section id="mission-service" className="py-20 bg-gradient-to-b from-sky-100/50 via-sky-50 to-white border-b border-sky-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <Reveal className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-900 border border-sky-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Missions Fondatrices • Canada & Sénégal 🇸🇳</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Missions & Services d'ACAFIS Canada
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            ACAFIS Canada structure la solidarité de la diaspora pour offrir des solutions concrètes : de l'accès sécurisé à l'habitat au Sénégal à l'accompagnement éducatif de nos enfants au Canada.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: "all", label: "Toutes les Missions" },
              { id: "habitat", label: "Cité Jardin & Habitat" },
              { id: "education", label: "Éducation & nTIC" },
              { id: "diaspora", label: "Développement & Culture" },
              { id: "solidarity", label: "Intégration & Entraide" },
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
                  {service.title}
                </h3>

                <p className="text-sm font-medium text-emerald-800 mb-3 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100/60">
                  {service.shortDesc}
                </p>

                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  {service.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Engagements & Services :
                  </p>
                  {service.deliverables.map((item, idx) => (
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
                    <span>Explorer Cité Jardin & Coop</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : service.id === "education-ntic" ? (
                  <button
                    onClick={() => onNavigate("acafis-mentor")}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Lancer Le Mentor ACAFIS IA</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={onOpenCardModal}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-800 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Participer en tant que membre</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </RevealGroup>

        {/* Membership Value Proposition Bar */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-lg flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
              Bénéficiez de tous les services ACAFIS avec la carte de membre 2026
            </h3>
            <p className="text-sm text-emerald-200/90 max-w-2xl">
              Pour seulement <strong>{PAYMENT_INTERAC_INFO.annualFeeCAD}$ CAD par an</strong>, accédez aux projets Coop-ACAFIS, soutenez la colonie de vacances 2030, offrez le tutorat IA à vos enfants et participez aux assemblées avec droit de vote.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenCardModal}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md transition-transform hover:scale-105 cursor-pointer"
            >
              Générer ma Carte de Membre
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
