import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Users, CreditCard, Video, ArrowRight } from "lucide-react";
import { useTranslation } from "../i18n/translations";
import { useLanguage } from "../i18n/LanguageContext";
import {
  ACTIVITY_CATEGORY_BADGE_CLASSES,
  ACTIVITY_CATEGORY_LABEL_KEYS,
  GENDER_RESTRICTION_LABEL_KEYS,
  formatAgeRange,
} from "../lib/activity";
import type { WorkshopCategory } from "../types";

interface PublicActivity {
  id: string;
  title: string;
  description: string | null;
  startsAt: string;
  location: string | null;
  isOnline: boolean;
  category: WorkshopCategory;
  minAge: number | null;
  maxAge: number | null;
  genderRestriction: "feminin" | "masculin" | null;
  feeAmount: number | null;
  requiresPaidMembership: boolean;
  registrationsOpen: boolean;
  spotsLeft: number;
}

// Public "Prochaines activités" showcase: lets visitors see what ACAFIS
// organizes and nudges them toward membership (registration itself happens
// in the Espace Membre). Renders nothing when no public activity is coming.
export const UpcomingActivities: React.FC<{ onBecomeMember: () => void }> = ({ onBecomeMember }) => {
  const { t, lang } = useTranslation();
  const { localizePath } = useLanguage();
  const [activities, setActivities] = useState<PublicActivity[]>([]);

  useEffect(() => {
    fetch("/api/members/workshops/public")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setActivities(data.activities || []))
      .catch(() => setActivities([]));
  }, []);

  if (activities.length === 0) return null;

  const locale = lang === "en" ? "en-CA" : "fr-CA";

  return (
    <section aria-labelledby="upcoming-activities-title" className="py-14 sm:py-16 bg-white border-y border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{t("upcoming.eyebrow")}</p>
            <h2 id="upcoming-activities-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display text-balance">
              {t("upcoming.title")}
            </h2>
            <p className="text-sm text-slate-600">{t("upcoming.subtitle")}</p>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((a) => {
            const date = new Date(a.startsAt);
            const ageRange = formatAgeRange(a.minAge, a.maxAge, t);
            const status = !a.registrationsOpen
              ? { label: t("upcoming.closed"), className: "bg-slate-200 text-slate-700" }
              : a.spotsLeft <= 0
                ? { label: t("upcoming.full"), className: "bg-amber-100 text-amber-900" }
                : { label: `${a.spotsLeft} ${t("upcoming.spotsLeft")}`, className: "bg-emerald-100 text-emerald-800" };
            return (
              <li key={a.id} className="flex gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div
                  className="shrink-0 w-16 rounded-xl bg-emerald-800 text-white flex flex-col items-center justify-center py-2.5"
                  aria-hidden="true"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                    {date.toLocaleDateString(locale, { month: "short" }).replace(".", "")}
                  </span>
                  <span className="text-2xl font-extrabold leading-none tabular-nums">{date.getDate()}</span>
                  <span className="text-[10px] text-emerald-200 mt-0.5">
                    {date.toLocaleDateString(locale, { weekday: "short" }).replace(".", "")}
                  </span>
                </div>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ACTIVITY_CATEGORY_BADGE_CLASSES[a.category]}`}>
                      {t(ACTIVITY_CATEGORY_LABEL_KEYS[a.category])}
                    </span>
                    {a.genderRestriction && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                        {t(GENDER_RESTRICTION_LABEL_KEYS[a.genderRestriction])}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${status.className}`}>{status.label}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{a.title}</h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                    {date.toLocaleString(locale, { dateStyle: "full", timeStyle: "short" })}
                  </p>
                  {(a.location || a.isOnline) && (
                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      {a.isOnline ? (
                        <Video className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                      )}
                      <span className="break-words">{a.isOnline ? t("upcoming.online") : a.location}</span>
                    </p>
                  )}
                  {ageRange && (
                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                      {ageRange}
                    </p>
                  )}
                  {a.feeAmount !== null && (
                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                      {t("upcoming.fee").replace("{amount}", String(a.feeAmount))}
                    </p>
                  )}
                  {a.description && <p className="text-xs text-slate-500 leading-relaxed">{a.description}</p>}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-emerald-950 text-white">
          <p className="text-sm text-emerald-50 max-w-2xl">{t("upcoming.membersOnly")}</p>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={onBecomeMember}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer"
            >
              {t("upcoming.becomeMember")}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <Link
              to={localizePath("/espace-membre")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border border-white/40 hover:bg-white/10 text-white"
            >
              {t("upcoming.memberRegister")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
