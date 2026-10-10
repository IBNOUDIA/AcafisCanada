import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import { useTranslation } from "../i18n/translations";
import { useLanguage } from "../i18n/LanguageContext";

// Shown for any unknown address. The server still answers 200 (single-page
// app), so the page tells search engines not to index it — otherwise every
// mistyped link would show up in Google as a copy of the homepage.
export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const { localizePath } = useLanguage();

  useEffect(() => {
    document.title = `${t("notFound.title")} — ACAFIS Canada`;
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.appendChild(robots);
    return () => robots.remove();
  }, [t]);

  return (
    <section className="py-24 px-4">
      <div className="max-w-lg mx-auto text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
          <SearchX className="w-7 h-7" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-display">{t("notFound.title")}</h1>
        <p className="text-sm text-slate-600">{t("notFound.desc")}</p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <Link
            to={localizePath("/")}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800"
          >
            {t("notFound.home")}
          </Link>
          <Link
            to={localizePath("/adhesion")}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50"
          >
            {t("notFound.contact")}
          </Link>
        </div>
      </div>
    </section>
  );
};
