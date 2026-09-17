import React, { useState } from "react";
import {
  Building,
  Home,
  TreePine,
  CheckCircle2,
  Clock,
  Circle,
  ArrowRight,
  ExternalLink,
  HeartHandshake,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { MAJOR_PROJECTS } from "../data/acafisData";
import { Reveal, RevealGroup } from "./Reveal";

interface MajorProjectsSectionProps {
  onNavigate: (sectionId: string) => void;
  onNavigateContact: () => void;
}

const PROJECT_ICONS: Record<string, React.ReactNode> = {
  "centre-communautaire": <Building className="w-5 h-5" />,
  "cite-jardin-coop": <Home className="w-5 h-5" />,
  "colonie-vacances": <TreePine className="w-5 h-5" />,
};

const STATUS_STYLES: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
  completed: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    label: "Terminé",
    className: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  in_progress: {
    icon: <Clock className="w-3.5 h-3.5" />,
    label: "En cours",
    className: "bg-amber-100 text-amber-900 border-amber-300",
  },
  upcoming: {
    icon: <Circle className="w-3.5 h-3.5" />,
    label: "À venir",
    className: "bg-slate-100 text-slate-600 border-slate-300",
  },
};

export const MajorProjectsSection: React.FC<MajorProjectsSectionProps> = ({
  onNavigate,
  onNavigateContact,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(MAJOR_PROJECTS[0]?.id ?? null);

  return (
    <section id="projets" className="py-20 bg-gradient-to-b from-white via-sky-50/60 to-sky-100/40 border-b border-sky-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <Reveal className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
            <span>Bâtir ensemble, étape par étape</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Nos Grands Projets
          </h2>

          <p className="text-base sm:text-lg text-slate-600">
            Au-delà de nos activités récurrentes, ACAFIS porte plusieurs grands chantiers de longue haleine.
            Voici où ils en sont, et comment vous pouvez concrètement aider à les faire avancer.
          </p>
        </Reveal>

        {/* Projects */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {MAJOR_PROJECTS.map((project) => {
            const isExpanded = expandedId === project.id;
            return (
              <Reveal key={project.id} className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                {/* Header — always visible, click to expand */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : project.id)}
                  className="w-full text-left p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5 cursor-pointer hover:bg-slate-50/60 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
                    {PROJECT_ICONS[project.id] ?? <Building className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">
                      {project.title}
                    </h3>
                    <p className="text-sm text-emerald-700 font-medium">{project.tagline}</p>
                  </div>
                  <div className="shrink-0 self-start sm:self-center">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 sm:px-8 pb-8 space-y-8 border-t border-slate-100 pt-6">
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Roadmap */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Feuille de route
                      </h4>
                      <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {project.roadmap.map((step) => {
                          const statusStyle = STATUS_STYLES[step.status];
                          return (
                            <div
                              key={step.phase}
                              className={`rounded-2xl p-5 border ${
                                step.status === "in_progress"
                                  ? "bg-amber-50/50 border-amber-300 ring-1 ring-amber-400/30"
                                  : "bg-slate-50 border-slate-200"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-700">{step.phase}</span>
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${statusStyle.className}`}
                                >
                                  {statusStyle.icon}
                                  {statusStyle.label}
                                </span>
                              </div>
                              <h5 className="text-sm font-bold text-slate-900 font-display mb-1">
                                {step.title}
                              </h5>
                              <p className="text-[11px] text-slate-500 font-medium mb-2">{step.period}</p>
                              <ul className="space-y-1.5 text-xs text-slate-600">
                                {step.details.map((d, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="text-emerald-600 mt-0.5">•</span>
                                    <span>{d}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </RevealGroup>
                    </div>

                    {/* How to help + CTA */}
                    <div className="flex flex-col sm:flex-row gap-6 sm:items-center justify-between p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                      <div>
                        <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                          Comment aider
                        </h4>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {project.howToHelp.map((h, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 mt-0.5">✓</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => {
                          if (project.cta.type === "internal") onNavigate(project.cta.target);
                          else if (project.cta.type === "contact") onNavigateContact();
                          else window.open(project.cta.target, "_blank", "noopener,noreferrer");
                        }}
                        className="shrink-0 px-5 py-3 rounded-xl text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <span>{project.cta.label}</span>
                        {project.cta.type === "external" ? (
                          <ExternalLink className="w-4 h-4" />
                        ) : (
                          <ArrowRight className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
