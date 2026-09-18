import React from "react";
import { Users, Mail, Phone, Award } from "lucide-react";
import { BUREAU_MEMBERS, FORMER_PRESIDENTS } from "../data/acafisData";
import { Reveal, RevealGroup } from "./Reveal";
import { useTranslation } from "../i18n/translations";
import bureauHeroPhoto from "../assets/images/bureau-hero.jpg";

interface BureauSectionProps {
  onContactSecretary: () => void;
}

export const BureauSection: React.FC<BureauSectionProps> = ({ onContactSecretary }) => {
  const { t, lang } = useTranslation();
  const presidence = BUREAU_MEMBERS.filter((m) => m.category === "presidence");
  const adminFinances = BUREAU_MEMBERS.filter((m) => m.category === "admin_finances");
  const commissionsAndCom = BUREAU_MEMBERS.filter(
    (m) => m.category === "commissions" || m.category === "communication"
  );
  const formerAcafisPresidents = FORMER_PRESIDENTS.filter((p) => p.organization === "ACAFIS");
  const formerCoopPresidents = FORMER_PRESIDENTS.filter((p) => p.organization === "Coop-ACAFIS");

  return (
    <section id="bureau" className="py-20 bg-gradient-to-b from-sky-50 via-white to-sky-100/40 border-b border-sky-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero photo — a real team gathering to open the page */}
        <Reveal className="relative rounded-3xl overflow-hidden mb-14 h-64 sm:h-80 shadow-lg">
          <img
            src={bureauHeroPhoto}
            alt="L'équipe du Bureau Exécutif ACAFIS réunie"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <span className="text-sm sm:text-base font-bold text-white font-display">
              {t("bureau.photoCaption")}
            </span>
          </div>
        </Reveal>

        {/* Section Heading */}
        <Reveal className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t("bureau.badge")}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            {t("bureau.title")}
          </h2>

          <p className="text-base sm:text-lg text-slate-600">
            {t("bureau.introPart1")} <strong className="text-slate-900">{t("bureau.introStrong")}</strong>{t("bureau.introPart2")}
          </p>

          <div className="grid grid-cols-3 gap-2 max-w-md mx-auto pt-2 text-center text-[11px]">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="block text-emerald-700 font-bold text-base">11</span>
              <span className="text-slate-500">{t("bureau.statMembers")}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="block text-amber-600 font-bold text-base">3</span>
              <span className="text-slate-500">{t("bureau.statPoles")}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="block text-sky-700 font-bold text-base">2</span>
              <span className="text-slate-500">{t("bureau.statCountries")}</span>
            </div>
          </div>
        </Reveal>

        {/* Organigramme ACAFIS : Bureau -> Commissions -> AG */}
        <Reveal className="mb-16 max-w-4xl mx-auto">
          <h3 className="text-center text-lg font-bold text-slate-900 font-display mb-8">
            {t("bureau.orgChartTitle")}
          </h3>

          <div className="flex flex-col items-center">
            {/* Bureau */}
            <div className="px-6 py-3 rounded-xl bg-emerald-800 text-white font-bold text-sm shadow-md">
              {t("bureau.executiveBureau")}
            </div>
            <div className="w-px h-8 bg-slate-300" />

            {/* Commissions row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                t("bureau.commission.organisation"),
                t("bureau.commission.scientifique"),
                t("bureau.commission.jeunesse"),
                t("bureau.commission.feminine"),
              ].map((label) => (
                <div
                  key={label}
                  className="px-4 py-2.5 rounded-xl bg-teal-700 text-white font-semibold text-xs shadow-sm text-center"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="w-px h-8 bg-slate-300" />

            {/* AG */}
            <div className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow-md text-center">
              {t("bureau.generalAssembly")}
              <div className="text-[11px] font-medium">{t("bureau.viaWhatsapp")}</div>
            </div>
          </div>
        </Reveal>

        {/* Pyramide hiérarchique du Bureau */}
        <Reveal className="mb-16 max-w-3xl mx-auto">
          <h3 className="text-center text-lg font-bold text-slate-900 font-display mb-8">
            {t("bureau.hierarchyTitle")}
          </h3>
          <div className="flex flex-col items-center gap-3">
            <div className="px-5 py-2 rounded-lg bg-amber-400 text-slate-950 font-bold text-sm shadow-sm">
              {presidence.find((m) => m.role.fr === "Président")?.name || "Président"}
            </div>
            <div className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold text-sm shadow-sm">
              {presidence.find((m) => m.role.fr !== "Président")?.name || "Vice-Président"}
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
              {[...adminFinances, ...commissionsAndCom].map((m) => (
                <span key={m.id} className="px-3 py-1.5 rounded-lg bg-sky-100 text-sky-900 border border-sky-200 text-xs font-medium">
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* 1. Présidence Branch */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
              01
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {t("bureau.branch1.title")}
              </h3>
              <p className="text-xs text-slate-500">
                {t("bureau.branch1.subtitle")}
              </p>
            </div>
          </div>

          <RevealGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {presidence.map((member) => (
              <div
                key={member.id}
                id={`member-card-${member.id}`}
                className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-emerald-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white shadow-xs">
                      {member.role[lang]}
                    </span>
                    <span className="text-xs font-semibold text-emerald-800">
                      ACAFIS Canada
                    </span>
                  </div>

                  <h4 className="text-xl font-extrabold text-slate-900 font-display mb-2">
                    {member.name}
                  </h4>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {member.bio?.[lang]}
                  </p>
                </div>

                {(member.email || member.phone) && (
                  <div className="pt-3 border-t border-emerald-100/80 space-y-1.5">
                    {member.email && (
                      <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </RevealGroup>
        </div>

        {/* 2. Administration, Finances & Contrôle Branch */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
              02
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {t("bureau.branch2.title")}
              </h3>
              <p className="text-xs text-slate-500">
                {t("bureau.branch2.subtitle")}
              </p>
            </div>
          </div>

          <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminFinances.map((member) => (
              <div
                key={member.id}
                id={`member-card-${member.id}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      {member.subCategory?.[lang]}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-emerald-700 mb-1">
                    {member.role[lang]}
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 font-display mb-2">
                    {member.name}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {member.bio?.[lang]}
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
          </RevealGroup>
        </div>

        {/* 3. Commissions Spécialisées & Communication */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
              03
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {t("bureau.branch3.title")}
              </h3>
              <p className="text-xs text-slate-500">
                {t("bureau.branch3.subtitle")}
              </p>
            </div>
          </div>

          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commissionsAndCom.map((member) => (
              <div
                key={member.id}
                id={`member-card-${member.id}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200 mb-2">
                    {member.subCategory?.[lang]}
                  </span>

                  <div className="text-xs font-semibold text-amber-800 mb-1">
                    {member.role[lang]}
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 font-display mb-2">
                    {member.name}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {member.bio?.[lang]}
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
          </RevealGroup>
        </div>

        {/* Hommage à Nos Présidents */}
        <div className="mt-16">
          <Reveal className="max-w-3xl mx-auto text-center space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>{t("bureau.tribute.badge")}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {t("bureau.tribute.title")}
            </h3>
            <p className="text-base text-slate-600">
              {t("bureau.tribute.intro")}
            </p>
          </Reveal>

          {FORMER_PRESIDENTS.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
              <div>
                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4 text-center lg:text-left">
                  {t("bureau.tribute.acafisColumn")}
                </h4>
                <RevealGroup className="space-y-3">
                  {formerAcafisPresidents.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">{p.name}</span>
                      <span className="text-xs text-slate-500">{p.years[lang]}</span>
                    </div>
                  ))}
                </RevealGroup>
              </div>
              <div>
                <h4 className="text-sm font-bold text-teal-800 uppercase tracking-wider mb-4 text-center lg:text-left">
                  {t("bureau.tribute.coopColumn")}
                </h4>
                <RevealGroup className="space-y-3">
                  {formerCoopPresidents.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">{p.name}</span>
                      <span className="text-xs text-slate-500">{p.years[lang]}</span>
                    </div>
                  ))}
                </RevealGroup>
              </div>
            </div>
          ) : (
            <Reveal className="max-w-xl mx-auto text-center p-6 rounded-2xl bg-amber-50 border border-amber-200">
              <p className="text-sm text-amber-900">
                {t("bureau.tribute.emptyMessage")}
              </p>
              <button
                onClick={onContactSecretary}
                className="mt-3 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors cursor-pointer"
              >
                {t("bureau.tribute.shareNames")}
              </button>
            </Reveal>
          )}
        </div>

        {/* Contact Bureau Bar */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-slate-900">
              {t("bureau.contactBar.title")}
            </h4>
            <p className="text-xs text-slate-600">
              {t("bureau.contactBar.subtitle")}
            </p>
          </div>
          <button
            onClick={onContactSecretary}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs shrink-0 cursor-pointer"
          >
            {t("bureau.contactBar.cta")}
          </button>
        </div>

      </div>
    </section>
  );
};
