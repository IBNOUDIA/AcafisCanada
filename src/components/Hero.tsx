import React, { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  TreePine,
  CheckCircle2,
  Calendar,
  Building2,
  Copy,
  Check,
  Heart,
  TrendingUp,
  Globe2,
} from "lucide-react";
import { SenegalFlagBadge, SenegalRibbon } from "./SenegalFlagBadge";
import { Reveal } from "./Reveal";
import heroCommunityPhoto from "../assets/images/hero-communaute-bbq.jpg";

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  onOpenCardModal: () => void;
  onOpenPaymentModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onNavigate,
  onOpenCardModal,
  onOpenPaymentModal,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeImpactTab, setActiveImpactTab] = useState<number>(0);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("finance@acafis.ca");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Dynamic impact metrics of 25$ CAD (~11,250 FCFA)
  const impactExamples = [
    {
      title: "1 Kit Scolaire & Pédagogique",
      desc: "Fournitures et manuels distribués aux écoliers des zones partenaires à Ndianda.",
      icon: "📚",
      category: "Éducation & Jeunesse",
      highlightColor: "text-amber-300",
    },
    {
      title: "Atelier Code & IA pour un Jeune",
      desc: "Prise en charge d'un mois de tutorat numérique et accès aux sessions Acafis Mentor.",
      icon: "💻",
      category: "Technologies & Avenir",
      highlightColor: "text-emerald-300",
    },
    {
      title: "3 Arbres Fruitiers • Cité Jardin",
      desc: "Plantation et irrigation agro-écologique sur le domaine foncier de Ndianda.",
      icon: "🌱",
      category: "Environnement & Teranga",
      highlightColor: "text-sky-300",
    },
  ];

  return (
    <section id="accueil" className="relative overflow-hidden text-white">

      {/* Community Photo Banner — full width, unobstructed */}
      <div className="relative h-[280px] sm:h-[380px] lg:h-[460px]">
        <img
          src={heroCommunityPhoto}
          alt="Rassemblement communautaire de la diaspora ACAFIS lors d'un grand pique-nique estival"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Photo caption for authenticity */}
        <span className="absolute bottom-3 right-4 text-[10px] sm:text-[11px] text-white/80 font-medium tracking-wide bg-slate-950/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
          📸 Grand rassemblement communautaire ACAFIS
        </span>
      </div>

      {/* Slim tricolor seam marking the transition, instead of a color wash over the photo */}
      <SenegalRibbon />

      {/* Content — on a lighter sky-blue gradient below the photo, nothing hides the image above */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-700 via-sky-600 to-emerald-800 pt-10 pb-20 lg:pt-14 lg:pb-28">

        {/* Decorative Sky Blue & Sunlit Ambient Lighting */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-1/4 w-80 h-80 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* Main Hero Column */}
          <Reveal className="lg:col-span-7 text-left space-y-6" y={16}>

            {/* Senegal Colors & Fraternal Connection Tag */}
            <div className="inline-flex flex-wrap items-center gap-2 p-1 pl-2 pr-3.5 rounded-full text-xs font-semibold bg-sky-950/70 border border-sky-400/40 backdrop-blur-md shadow-sm">
              <SenegalFlagBadge size="sm" />
              <span className="text-sky-200 font-bold">
                🇨🇦 Canada & 🇸🇳 Sénégal
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-300 font-medium hidden sm:inline">
                Le Cœur Battant de la Diaspora
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.12]">
              L'alliance de la diaspora pour un{" "}
              <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-emerald-300 bg-clip-text text-transparent">
                développement solidaire
              </span>{" "}
              et durable.
            </h1>

            {/* Subhead with Senegal colors mention */}
            <p className="text-base sm:text-lg lg:text-xl text-sky-100 max-w-2xl font-light leading-relaxed">
              Fiers des valeurs de la <strong className="text-amber-300 font-bold">Teranga</strong> et engagés pour l'avenir : de l'habitat durable à la <strong className="text-emerald-300 font-bold">Cité Jardin Ndianda</strong> au soutien scolaire avec notre <strong className="text-yellow-300 font-bold">Mentor IA</strong>.
            </p>

            {/* Senegal Tricolor Decorative Accent Bar */}
            <div className="w-36 h-1 rounded-full overflow-hidden flex shadow-sm">
              <div className="w-1/3 bg-[#00853F]" />
              <div className="w-1/3 bg-[#FDEF42] flex items-center justify-center text-[7px] text-[#00853F] font-bold">★</div>
              <div className="w-1/3 bg-[#E31B23]" />
            </div>

            {/* Key Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm text-sky-100">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Habitat sécurisé avec <strong>Coop-ACAFIS</strong></span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Colonie 2027 à la <strong>Cité Jardin Ndianda</strong></span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Soutien scolaire & code avec <strong>Acafis Mentor</strong></span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Cotisation solidaire : <strong className="text-amber-300">25$ CAD / an</strong></span>
              </div>
            </div>

            {/* CTA Group */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="hero-cta-membership"
                onClick={onOpenCardModal}
                className="px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer border border-amber-300"
              >
                <span>Devenir Membre (25$ CAD)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-cta-services"
                onClick={() => onNavigate("mission-service")}
                className="px-5 py-3.5 rounded-xl text-sm font-semibold text-white bg-sky-950/70 hover:bg-sky-900/80 border border-sky-600/50 hover:border-sky-400 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Nos Missions & Services</span>
              </button>

              <button
                id="hero-cta-mentor"
                onClick={() => onNavigate("acafis-mentor")}
                className="px-4 py-3.5 rounded-xl text-sm font-bold text-amber-300 hover:text-amber-200 bg-amber-950/70 hover:bg-amber-900/60 border border-amber-500/40 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Acafis Mentor 🎓</span>
              </button>
            </div>

            {/* Interac reminder pill with quick copy */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5 text-xs text-sky-200">
              <span className="font-semibold text-white">Virement Interac (Canada) :</span>
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-950/90 hover:bg-sky-900 text-emerald-300 font-mono border border-sky-600/60 cursor-pointer transition-colors shadow-xs"
                title="Cliquer pour copier l'adresse"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">Copié dans le presse-papier !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-sky-400" />
                    <span>finance@acafis.ca</span>
                  </>
                )}
              </button>
              <button
                onClick={onOpenPaymentModal}
                className="text-amber-300 hover:text-amber-200 underline cursor-pointer font-medium"
              >
                Modalités 25$ CAD
              </button>
            </div>

          </Reveal>

          {/* Right Spotlight Card: Dynamic Interactive Hub */}
          <Reveal className="lg:col-span-5" y={16} delay={0.15}>
            <div className="relative rounded-3xl bg-gradient-to-b from-sky-950/90 to-slate-900/95 p-6 border border-sky-500/30 shadow-2xl backdrop-blur-xl">
              
              {/* Senegal & Canada Header Strip */}
              <div className="flex items-center justify-between border-b border-sky-800/60 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md">
                    <TreePine className="w-5 h-5 text-emerald-200" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                      <span>Cité Jardin • Ndianda</span>
                      <SenegalFlagBadge size="sm" />
                    </h2>
                    <p className="text-xs text-emerald-300 font-medium">
                      Colonie 2027 « Racines & Avenir »
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  10 - 17 Ans
                </span>
              </div>

              {/* Dynamic Interactive Solidarity Converter */}
              <div className="space-y-3.5 text-xs text-sky-100">
                <div className="p-3.5 rounded-2xl bg-sky-900/40 border border-sky-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
                      <span>Impact Concret d'une Adhésion</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-400 text-slate-950">
                      25$ CAD = 11 250 FCFA
                    </span>
                  </div>

                  {/* Impact Selector Tabs */}
                  <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                    {impactExamples.map((ex, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImpactTab(idx)}
                        className={`p-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center flex flex-col items-center gap-1 ${
                          activeImpactTab === idx
                            ? "bg-amber-400 text-slate-950 shadow-xs ring-1 ring-white/30"
                            : "bg-sky-950/60 text-sky-200 hover:bg-sky-800/60"
                        }`}
                      >
                        <span className="text-sm leading-none">{ex.icon}</span>
                        <span className="truncate w-full">{ex.category.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>

                  {/* Active Impact Details */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-sky-800/50">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{impactExamples[activeImpactTab].icon}</span>
                      <h4 className={`text-xs font-bold ${impactExamples[activeImpactTab].highlightColor}`}>
                        {impactExamples[activeImpactTab].title}
                      </h4>
                    </div>
                    <p className="mt-1 text-[11px] text-sky-200/90 leading-relaxed">
                      {impactExamples[activeImpactTab].desc}
                    </p>
                  </div>
                </div>

                {/* Key Highlights */}
                <div className="p-3 rounded-xl bg-slate-950/50 border border-sky-800/50 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">🏛️</span>
                    <span className="text-slate-200">
                      <strong>Tourisme Mémoriel :</strong> Gorée & Musée des Civilisations Noires.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">💻</span>
                    <span className="text-slate-200">
                      <strong>Tech & Agro-Écologie :</strong> Ateliers IA et maraîchage durable.
                    </span>
                  </div>
                </div>

                {/* Road map button */}
                <div className="pt-1">
                  <button
                    onClick={() => onNavigate("espace-jeune")}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 hover:from-emerald-300 hover:to-amber-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Découvrir l'Espace Jeune & Cité Jardin</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                  </button>
                </div>
              </div>

              {/* Dynamic Quick Barometer */}
              <div className="mt-4 pt-3 border-t border-sky-800/60 grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="p-2 rounded-xl bg-sky-900/30 border border-sky-800/40">
                  <span className="block text-emerald-400 font-bold text-sm">11</span>
                  <span className="text-sky-300">Membres Élus</span>
                </div>
                <div className="p-2 rounded-xl bg-sky-900/30 border border-sky-800/40">
                  <span className="block text-amber-300 font-bold text-sm">25$ CAD</span>
                  <span className="text-sky-300">Cotisation / An</span>
                </div>
                <div className="p-2 rounded-xl bg-sky-900/30 border border-sky-800/40">
                  <span className="block text-sky-400 font-bold text-sm">4 Saisons</span>
                  <span className="text-sky-300">D'Activités</span>
                </div>
              </div>

            </div>
          </Reveal>

        </div>
      </div>

      </div>
    </section>
  );
};
