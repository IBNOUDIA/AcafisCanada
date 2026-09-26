import React, { useEffect } from "react";
import { Scale } from "lucide-react";
import { useTranslation } from "../i18n/translations";
import { LEGAL_NOTICE_SECTIONS, LEGAL_NOTICE_LAST_UPDATED } from "../data/legalNotice";

export const LegalNoticePage: React.FC = () => {
  const { t, lang } = useTranslation();

  useEffect(() => {
    document.title = `${t("legalNotice.title")} — ACAFIS Canada`;
  }, [t]);

  const formattedDate = new Date(LEGAL_NOTICE_LAST_UPDATED).toLocaleDateString(
    lang === "fr" ? "fr-CA" : "en-CA",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-sky-50 via-white to-sky-100/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto">
            <Scale className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            {t("legalNotice.title")}
          </h1>
          <p className="text-xs text-slate-500">
            {t("legalNotice.lastUpdated")} {formattedDate}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10 space-y-8">
          {LEGAL_NOTICE_SECTIONS.map((section) => (
            <div key={section.id}>
              <h2 className="text-base font-bold text-slate-900 font-display mb-2.5">
                {section.title[lang]}
              </h2>
              <div className="space-y-1.5">
                {section.paragraphs[lang].map((paragraph, idx) => (
                  <p key={idx} className="text-sm text-slate-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
