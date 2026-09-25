import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useTranslation } from "../i18n/translations";
import { useLanguage } from "../i18n/LanguageContext";
import { MemberRecord, MemberDocument } from "../types";
import { MEMBER_STORAGE_KEY } from "../lib/memberSession";
import { PAYMENT_INTERAC_INFO } from "../data/acafisData";

export const MemberDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { localizePath } = useLanguage();
  const navigate = useNavigate();
  const [member, setMember] = useState<MemberRecord | null | undefined>(undefined);
  const [documents, setDocuments] = useState<MemberDocument[]>([]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      </div>
    </section>
  );
};
