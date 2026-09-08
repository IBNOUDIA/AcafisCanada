import React from "react";
import {
  Users,
  Award,
  ShieldCheck,
  Mail,
  Building,
  UserCheck,
  HeartHandshake,
  CheckCircle,
} from "lucide-react";
import { BUREAU_MEMBERS } from "../data/acafisData";

interface BureauSectionProps {
  onContactSecretary: () => void;
}

export const BureauSection: React.FC<BureauSectionProps> = ({ onContactSecretary }) => {
  const presidence = BUREAU_MEMBERS.filter((m) => m.category === "presidence");
  const adminFinances = BUREAU_MEMBERS.filter((m) => m.category === "admin_finances");
  const commissionsAndCom = BUREAU_MEMBERS.filter(
    (m) => m.category === "commissions" || m.category === "communication"
  );

  return (
    <section id="bureau" className="py-20 bg-gradient-to-b from-sky-50 via-white to-sky-100/40 border-b border-sky-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            <span>Gouvernance Démocratique • Canada 🇨🇦 & Sénégal 🇸🇳</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Bureau Exécutif ACAFIS Canada
          </h2>

          <p className="text-base sm:text-lg text-slate-600">
            Une équipe engagée et démocratiquement élue de <strong className="text-slate-900">11 Membres du Bureau</strong>, dévouée au renforcement des liens entre le Canada et le Sénégal.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Total : 11 Membres du Bureau en exercice</span>
          </div>
        </div>

        {/* 1. Présidence Branch */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
              01
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Présidence & Vice-Présidence
              </h3>
              <p className="text-xs text-slate-500">
                Direction exécutive et représentation officielle
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {presidence.map((member) => (
              <div
                key={member.id}
                id={`member-card-${member.id}`}
                className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-emerald-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white shadow-xs">
                      {member.role}
                    </span>
                    <span className="text-xs font-semibold text-emerald-800">
                      ACAFIS Canada
                    </span>
                  </div>

                  <h4 className="text-xl font-extrabold text-slate-900 font-display mb-2">
                    {member.name}
                  </h4>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {member.bio}
                  </p>
                </div>

                {member.email && (
                  <div className="pt-3 border-t border-emerald-100/80 flex items-center gap-2 text-xs text-emerald-800 font-medium">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{member.email}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Administration, Finances & Contrôle Branch */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
              02
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Administration, Finances & Contrôle
              </h3>
              <p className="text-xs text-slate-500">
                Secrétariat, Trésorerie générale et Contrôle de conformité
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminFinances.map((member) => (
              <div
                key={member.id}
                id={`member-card-${member.id}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      {member.subCategory}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-emerald-700 mb-1">
                    {member.role}
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 font-display mb-2">
                    {member.name}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {member.email && (
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-teal-600" />
                    <span>{member.email}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Commissions Spécialisées & Communication */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
              03
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Commissions Opérationnelles & Communication
              </h3>
              <p className="text-xs text-slate-500">
                Organisation d'événements, action féminine & diffusion
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commissionsAndCom.map((member) => (
              <div
                key={member.id}
                id={`member-card-${member.id}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200 mb-2">
                    {member.subCategory}
                  </span>

                  <div className="text-xs font-semibold text-amber-800 mb-1">
                    {member.role}
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 font-display mb-2">
                    {member.name}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {member.email && (
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-600" />
                    <span>{member.email}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Bureau Bar */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-slate-900">
              Vous souhaitez soumettre un projet ou échanger avec le Bureau ?
            </h4>
            <p className="text-xs text-slate-600">
              Le secrétariat général et les présidents de commissions sont à votre écoute.
            </p>
          </div>
          <button
            onClick={onContactSecretary}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs shrink-0 cursor-pointer"
          >
            Écrire au Secrétariat Général
          </button>
        </div>

      </div>
    </section>
  );
};
