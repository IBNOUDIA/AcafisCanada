import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserCircle2,
  LogOut,
  Sparkles,
  Mail,
  MapPin,
  IdCard,
  CalendarDays,
  CreditCard,
  CheckCircle2,
  Clock,
  FileText,
  ExternalLink,
  Users,
  Trash2,
  Plus,
  Laptop,
  X,
} from "lucide-react";
import { useTranslation } from "../i18n/translations";
import { useLanguage } from "../i18n/LanguageContext";
import { MemberRecord, MemberDocument, MemberChild, MemberWorkshop } from "../types";
import { MEMBER_STORAGE_KEY } from "../lib/memberSession";
import { PAYMENT_INTERAC_INFO } from "../data/acafisData";

const CHILD_GENDERS: Array<{ value: MemberChild["gender"]; labelKey: "memberDashboard.genderFeminin" | "memberDashboard.genderMasculin" | "memberDashboard.genderAutre" }> = [
  { value: "feminin", labelKey: "memberDashboard.genderFeminin" },
  { value: "masculin", labelKey: "memberDashboard.genderMasculin" },
  { value: "autre", labelKey: "memberDashboard.genderAutre" },
];

export const MemberDashboard: React.FC = () => {
  const { t, lang } = useTranslation();
  const { localizePath } = useLanguage();
  const navigate = useNavigate();
  const [member, setMember] = useState<MemberRecord | null | undefined>(undefined);
  const [documents, setDocuments] = useState<MemberDocument[]>([]);
  const [children, setChildren] = useState<MemberChild[]>([]);
  const [childFirstName, setChildFirstName] = useState("");
  const [childBirthYear, setChildBirthYear] = useState("");
  const [childGender, setChildGender] = useState<MemberChild["gender"]>("feminin");
  const [childError, setChildError] = useState("");
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [workshops, setWorkshops] = useState<MemberWorkshop[]>([]);
  // Per-workshop dropdown choice: "self" or a child id.
  const [workshopPick, setWorkshopPick] = useState<Record<string, string>>({});
  const [workshopError, setWorkshopError] = useState<Record<string, string>>({});
  const [busyWorkshopId, setBusyWorkshopId] = useState<string | null>(null);

  useEffect(() => {
    document.title = `${t("memberDashboard.title")} — ACAFIS Canada`;

    let cached: MemberRecord | null = null;
    try {
      const raw = localStorage.getItem(MEMBER_STORAGE_KEY);
      cached = raw ? (JSON.parse(raw) as MemberRecord) : null;
    } catch {
      cached = null;
    }
    setMember(cached);
    if (!cached) return;

    // Re-verify against Supabase on every visit so dues status stays current
    // even if the treasury marked it paid after the member last logged in.
    const credentials = { email: cached.email, memberId: cached.memberId };
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        setMember(data.member);
        localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(data.member));
      })
      .catch(() => {
        localStorage.removeItem(MEMBER_STORAGE_KEY);
        setMember(null);
      });

    fetch("/api/members/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setDocuments(data.documents || []))
      .catch(() => setDocuments([]));

    fetch("/api/members/children/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setChildren(data.children || []))
      .catch(() => setChildren([]));

    loadWorkshops(credentials);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadWorkshops = (credentials: { email: string; memberId: string }) => {
    fetch("/api/members/workshops/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setWorkshops(data.workshops || []))
      .catch(() => setWorkshops([]));
  };

  const handleWorkshopRegister = async (workshopId: string, pick: string) => {
    if (!member) return;
    setWorkshopError((prev) => ({ ...prev, [workshopId]: "" }));
    setBusyWorkshopId(workshopId);
    try {
      const response = await fetch("/api/members/workshops/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: member.email,
          memberId: member.memberId,
          workshopId,
          childId: pick === "self" ? null : pick,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setWorkshops((prev) =>
          prev.map((w) =>
            w.id === workshopId
              ? { ...w, spotsLeft: w.spotsLeft - 1, myRegistrations: [...w.myRegistrations, data.registration] }
              : w
          )
        );
        setWorkshopPick((prev) => ({ ...prev, [workshopId]: "" }));
      } else {
        setWorkshopError((prev) => ({ ...prev, [workshopId]: data.error || t("memberDashboard.workshopError") }));
        // Seat counts may be stale (e.g. someone else just took the last spot).
        loadWorkshops({ email: member.email, memberId: member.memberId });
      }
    } catch {
      setWorkshopError((prev) => ({ ...prev, [workshopId]: t("memberDashboard.workshopError") }));
    } finally {
      setBusyWorkshopId(null);
    }
  };

  const handleWorkshopUnregister = async (workshopId: string, registrationId: string) => {
    if (!member) return;
    setWorkshops((prev) =>
      prev.map((w) =>
        w.id === workshopId
          ? { ...w, spotsLeft: w.spotsLeft + 1, myRegistrations: w.myRegistrations.filter((r) => r.id !== registrationId) }
          : w
      )
    );
    try {
      await fetch("/api/members/workshops/unregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: member.email, memberId: member.memberId, registrationId }),
      });
    } catch {
      // Best-effort — worst case the seat reappears on the next visit's refetch.
    }
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    setChildError("");
    setIsAddingChild(true);
    try {
      const response = await fetch("/api/members/children/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: member.email,
          memberId: member.memberId,
          firstName: childFirstName.trim() || undefined,
          birthYear: Number(childBirthYear),
          gender: childGender,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setChildren((prev) => [data.child, ...prev]);
        setChildFirstName("");
        setChildBirthYear("");
        setChildGender("feminin");
      } else {
        setChildError(data.error || t("memberDashboard.childAddError"));
      }
    } catch {
      setChildError(t("memberDashboard.childAddError"));
    } finally {
      setIsAddingChild(false);
    }
  };

  const handleRemoveChild = async (childId: string) => {
    if (!member) return;
    setChildren((prev) => prev.filter((c) => c.id !== childId));
    // The child's workshop seats are freed server-side too (on delete cascade).
    setWorkshops((prev) =>
      prev.map((w) => {
        const kept = w.myRegistrations.filter((r) => r.childId !== childId);
        return { ...w, spotsLeft: w.spotsLeft + (w.myRegistrations.length - kept.length), myRegistrations: kept };
      })
    );
    try {
      await fetch("/api/members/children/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: member.email, memberId: member.memberId, childId }),
      });
    } catch {
      // Best-effort — worst case the child reappears on the next visit's refetch.
    }
  };

  useEffect(() => {
    if (member === null) {
      const timeout = setTimeout(() => navigate(localizePath("/"), { replace: true }), 1500);
      return () => clearTimeout(timeout);
    }
  }, [member, navigate, localizePath]);

  const handleLogout = () => {
    localStorage.removeItem(MEMBER_STORAGE_KEY);
    navigate(localizePath("/"));
  };

  if (member === undefined) return null;

  if (member === null) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center text-slate-600 text-sm">
        {t("memberDashboard.notLoggedIn")}
      </div>
    );
  }

  const isPaid = member.paymentStatus === "paid";

  const infoRows: Array<{ icon: React.ReactNode; label: string; value: string }> = [
    { icon: <IdCard className="w-4 h-4" />, label: t("memberDashboard.memberIdLabel"), value: member.memberId },
    { icon: <CalendarDays className="w-4 h-4" />, label: t("memberDashboard.yearLabel"), value: String(member.membershipYear) },
    { icon: <CreditCard className="w-4 h-4" />, label: t("memberDashboard.feeLabel"), value: member.annualFee },
    { icon: <Mail className="w-4 h-4" />, label: t("memberDashboard.emailLabel"), value: member.email },
    { icon: <MapPin className="w-4 h-4" />, label: t("memberDashboard.cityLabel"), value: member.city },
    { icon: <CalendarDays className="w-4 h-4" />, label: t("memberDashboard.issuedAtLabel"), value: member.issuedAt },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-sky-50 via-white to-sky-100/50 min-h-[70vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-tr from-slate-950 via-emerald-950 to-teal-900 text-white p-6 sm:p-8 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <UserCircle2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-emerald-300 font-bold">{t("memberDashboard.title")}</p>
              <h1 className="text-xl sm:text-2xl font-extrabold font-display">
                {t("memberDashboard.subtitle")} {member.firstName} {member.lastName}
              </h1>
            </div>
          </div>

          {/* Live dues status */}
          <div className="p-6 sm:p-8 pb-0">
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                isPaid ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"
              }`}
            >
              {isPaid ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
              ) : (
                <Clock className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              )}
              <div>
                <p className={`text-sm font-bold ${isPaid ? "text-emerald-900" : "text-amber-900"}`}>
                  {isPaid ? t("memberDashboard.paidTitle") : t("memberDashboard.pendingTitle")}
                </p>
                <p className={`text-xs ${isPaid ? "text-emerald-800" : "text-amber-800"}`}>
                  {isPaid ? (
                    t("memberDashboard.paidDesc")
                  ) : (
                    <>
                      {t("memberDashboard.pendingDesc")}{" "}
                      <span className="font-mono font-semibold">{PAYMENT_INTERAC_INFO.email}</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {infoRows.map((row) => (
              <div key={row.label} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-emerald-700 mt-0.5">{row.icon}</span>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">{row.label}</span>
                  <span className="block text-sm font-semibold text-slate-900 break-all">{row.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mx-6 sm:mx-8 mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">{t("memberDashboard.comingSoonTitle")}</p>
              <p className="text-xs text-amber-800">{t("memberDashboard.comingSoonDesc")}</p>
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-6 sm:pb-8">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t("memberDashboard.logoutBtn")}</span>
            </button>
          </div>
        </div>

        {/* Members-only documents */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-700" />
            {t("memberDashboard.documentsTitle")}
          </h2>

          {documents.length === 0 ? (
            <p className="text-xs text-slate-500">{t("memberDashboard.documentsEmpty")}</p>
          ) : (
            <ul className="space-y-2">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{doc.title}</p>
                    {doc.description && <p className="text-xs text-slate-500">{doc.description}</p>}
                    <p className="text-[11px] text-slate-400">
                      {t("memberDashboard.documentsPublished")} {doc.publishedAt}
                    </p>
                  </div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{t("memberDashboard.documentsOpen")}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Family census */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-700" />
            {t("memberDashboard.familyTitle")}
          </h2>
          <p className="text-xs text-slate-500">{t("memberDashboard.familyDesc")}</p>
          <p className="text-[11px] text-slate-400">
            {t("privacyPolicy.familyNote")}{" "}
            <Link to={localizePath("/politique-confidentialite")} target="_blank" className="text-emerald-700 hover:underline font-semibold">
              {t("privacyPolicy.consentLinkLabel")}
            </Link>
            .
          </p>

          {children.length === 0 ? (
            <p className="text-xs text-slate-500">{t("memberDashboard.familyEmpty")}</p>
          ) : (
            <ul className="space-y-2">
              {children.map((child) => {
                const age = new Date().getFullYear() - child.birthYear;
                const genderLabel = t(CHILD_GENDERS.find((g) => g.value === child.gender)?.labelKey || "memberDashboard.genderAutre");
                return (
                  <li
                    key={child.id}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {child.firstName || t("memberDashboard.childUnnamed")}
                      </p>
                      <p className="text-xs text-slate-500">
                        {age} {t("memberDashboard.childAgeSuffix")} · {genderLabel}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveChild(child.id)}
                      aria-label={t("memberDashboard.removeChildBtn")}
                      className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <form onSubmit={handleAddChild} className="pt-2 border-t border-slate-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={childFirstName}
                onChange={(e) => setChildFirstName(e.target.value)}
                placeholder={t("memberDashboard.childFirstNamePlaceholder")}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
              <input
                type="number"
                required
                min={new Date().getFullYear() - 17}
                max={new Date().getFullYear()}
                value={childBirthYear}
                onChange={(e) => setChildBirthYear(e.target.value)}
                placeholder={t("memberDashboard.childBirthYearLabel")}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
              <select
                value={childGender}
                onChange={(e) => setChildGender(e.target.value as MemberChild["gender"])}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              >
                {CHILD_GENDERS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {t(g.labelKey)}
                  </option>
                ))}
              </select>
            </div>

            {childError && (
              <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                {childError}
              </p>
            )}

            <button
              type="submit"
              disabled={isAddingChild}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors cursor-pointer disabled:opacity-60"
            >
              <Plus className="w-4 h-4" />
              <span>{t("memberDashboard.addChildBtn")}</span>
            </button>
          </form>
        </div>

        {/* nTIC workshops */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
            <Laptop className="w-4 h-4 text-emerald-700" />
            {t("memberDashboard.workshopsTitle")}
          </h2>
          <p className="text-xs text-slate-500">{t("memberDashboard.workshopsDesc")}</p>

          {workshops.length === 0 ? (
            <p className="text-xs text-slate-500">{t("memberDashboard.workshopsEmpty")}</p>
          ) : (
            <ul className="space-y-3">
              {workshops.map((w) => {
                const personLabel = (childId: string | null) => {
                  if (!childId) return t("memberDashboard.workshopMyself");
                  const child = children.find((c) => c.id === childId);
                  return child?.firstName || t("memberDashboard.childUnnamed");
                };
                const registeredIds = new Set(w.myRegistrations.map((r) => r.childId ?? "self"));
                const candidates = [
                  { value: "self", label: t("memberDashboard.workshopMyself") },
                  ...children.map((c) => ({
                    value: c.id,
                    label: `${c.firstName || t("memberDashboard.childUnnamed")} (${new Date().getFullYear() - c.birthYear} ${t("memberDashboard.childAgeSuffix")})`,
                  })),
                ].filter((c) => !registeredIds.has(c.value));
                const pick = candidates.some((c) => c.value === workshopPick[w.id])
                  ? workshopPick[w.id]
                  : candidates[0]?.value || "";
                const isFull = w.spotsLeft <= 0;

                return (
                  <li key={w.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{w.title}</p>
                        <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                          <CalendarDays className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          {new Date(w.startsAt).toLocaleString(lang === "en" ? "en-CA" : "fr-CA", {
                            dateStyle: "full",
                            timeStyle: "short",
                          })}
                        </p>
                        <p className="text-xs text-slate-600 flex items-center gap-1.5 break-all">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          {w.location}
                        </p>
                        {w.description && <p className="text-xs text-slate-500 mt-1.5">{w.description}</p>}
                      </div>
                      <span
                        className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isFull ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {isFull ? t("memberDashboard.workshopFull") : `${w.spotsLeft} ${t("memberDashboard.workshopSpotsLeft")}`}
                      </span>
                    </div>

                    {w.myRegistrations.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          {t("memberDashboard.workshopRegistered")}
                        </span>
                        {w.myRegistrations.map((r) => (
                          <span
                            key={r.id}
                            className="inline-flex items-center gap-1 pl-2.5 pr-1 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200"
                          >
                            {personLabel(r.childId)}
                            <button
                              onClick={() => handleWorkshopUnregister(w.id, r.id)}
                              aria-label={t("memberDashboard.workshopUnregister")}
                              title={t("memberDashboard.workshopUnregister")}
                              className="p-0.5 rounded-full text-emerald-700 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {candidates.length === 0 ? (
                      <p className="text-[11px] text-slate-500">{t("memberDashboard.workshopAllRegistered")}</p>
                    ) : (
                      !isFull && (
                        <div className="flex flex-wrap gap-2">
                          <select
                            value={pick}
                            onChange={(e) => setWorkshopPick((prev) => ({ ...prev, [w.id]: e.target.value }))}
                            className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                          >
                            {candidates.map((c) => (
                              <option key={c.value} value={c.value}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleWorkshopRegister(w.id, pick)}
                            disabled={busyWorkshopId === w.id}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors cursor-pointer disabled:opacity-60"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{t("memberDashboard.workshopRegisterBtn")}</span>
                          </button>
                        </div>
                      )
                    )}

                    {workshopError[w.id] && (
                      <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                        {workshopError[w.id]}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};
