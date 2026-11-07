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
  OPEN_TO_ALL_ACTIVITY_IDS,
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

const GUEST_INPUT_CLASSES = "w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900";

// Sign-up for an activity open to everyone. It reaches the secretariat by email,
// so the visitor only sees a confirmation once the email has really been sent.
const GuestSignupForm: React.FC<{ activity: PublicActivity }> = ({ activity }) => {
  const { t, lang } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [people, setPeople] = useState("1");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject: `Inscription — ${activity.title}`,
          message: `Inscription à : ${activity.title}\nNombre de personnes : ${people}\nLangue : ${lang}`,
        }),
      });
      if (!res.ok) throw new Error("send failed");
      setSent(true);
    } catch {
      setError(t("upcoming.guestError"));
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <p role="status" className="p-3 rounded-lg bg-emerald-100 text-sm font-semibold text-emerald-900">
        {t("upcoming.guestSuccess")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 pt-1">
      <input required aria-label={t("upcoming.guestName")} placeholder={t("upcoming.guestName")} value={name} onChange={(e) => setName(e.target.value)} className={GUEST_INPUT_CLASSES} />
      <input required type="email" aria-label={t("upcoming.guestEmail")} placeholder={t("upcoming.guestEmail")} value={email} onChange={(e) => setEmail(e.target.value)} className={GUEST_INPUT_CLASSES} />
      <input type="tel" aria-label={t("upcoming.guestPhone")} placeholder={t("upcoming.guestPhone")} value={phone} onChange={(e) => setPhone(e.target.value)} className={GUEST_INPUT_CLASSES} />
      <label className="flex items-center justify-between gap-3 text-sm text-slate-700">
        <span>{t("upcoming.guestPeople")}</span>
        <input required type="number" min={1} max={20} value={people} onChange={(e) => setPeople(e.target.value)} className="w-20 px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900" />
      </label>
      <p className="text-xs text-slate-500">{t("upcoming.guestPrivacy")}</p>
      {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="w-full px-4 py-2.5 rounded-lg text-sm font-bold bg-sun hover:bg-amber-300 disabled:opacity-60 text-forest cursor-pointer"
      >
        {sending ? t("upcoming.guestSending") : t("upcoming.guestSubmit")}
      </button>
    </form>
  );
};

// Public "Prochaines activités" showcase: lets visitors see what ACAFIS
// organizes. Registration happens in the Espace Membre, except for activities
// open to everyone, which have their own form. Renders nothing when no public
// activity is coming.
export const UpcomingActivities: React.FC<{ onBecomeMember: () => void }> = ({ onBecomeMember }) => {
  const { t, lang } = useTranslation();
  const { localizePath } = useLanguage();
  const [activities, setActivities] = useState<PublicActivity[]>([]);
  const [openFormId, setOpenFormId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/members/workshops/public")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setActivities(data.activities || []))
      .catch(() => setActivities([]));
  }, []);

  if (activities.length === 0) return null;

  const locale = lang === "en" ? "en-CA" : "fr-CA";
  const isOpenToAll = (a: PublicActivity) => OPEN_TO_ALL_ACTIVITY_IDS.includes(a.id);

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
                    {isOpenToAll(a) && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sun text-forest">{t("upcoming.openBadge")}</span>
                    )}
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
                  {isOpenToAll(a) && a.registrationsOpen && (
                    openFormId === a.id ? (
                      <GuestSignupForm activity={a} />
                    ) : (
                      <button
                        onClick={() => setOpenFormId(a.id)}
                        className="mt-1 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-sun hover:bg-amber-300 text-forest cursor-pointer"
                      >
                        {t("upcoming.guestOpen")}
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    )
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-emerald-950 text-white">
          <p className="text-sm text-emerald-50 max-w-2xl">{t(activities.some(isOpenToAll) ? "upcoming.mixedAccess" : "upcoming.membersOnly")}</p>
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
