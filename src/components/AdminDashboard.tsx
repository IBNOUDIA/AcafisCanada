import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LogOut,
  Users,
  FileText,
  Settings,
  Baby,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Laptop,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { useTranslation } from "../i18n/translations";
import { useLanguage } from "../i18n/LanguageContext";
import { ADMIN_SESSION_KEY, AdminSession } from "../lib/adminSession";

interface AdminMember {
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  membershipYear: number;
  paymentStatus: "pending" | "paid";
  coopInterest: boolean;
}

interface FamilyStats {
  total: number;
  byGender: Record<string, number>;
  ageBrackets: Record<string, number>;
}

interface AdminDocument {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  publishedAt: string;
}

interface AdminWorkshop {
  id: string;
  title: string;
  description: string | null;
  startsAt: string;
  location: string;
  capacity: number;
  registrations: Array<{
    id: string;
    memberName: string;
    memberEmail: string;
    child: { firstName: string | null; age: number } | null;
  }>;
}

type Tab = "members" | "family" | "workshops" | "documents" | "settings";

export const AdminDashboard: React.FC = () => {
  const { t, lang } = useTranslation();
  const { localizePath } = useLanguage();
  const navigate = useNavigate();
  const [session, setSession] = useState<AdminSession | null | undefined>(undefined);
  const [tab, setTab] = useState<Tab>("members");

  const [members, setMembers] = useState<AdminMember[]>([]);
  const [familyStats, setFamilyStats] = useState<FamilyStats | null>(null);
  const [documents, setDocuments] = useState<AdminDocument[]>([]);

  const [docTitle, setDocTitle] = useState("");
  const [docDesc, setDocDesc] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [docDate, setDocDate] = useState("");
  const [docError, setDocError] = useState("");

  const [workshops, setWorkshops] = useState<AdminWorkshop[]>([]);
  const [wsTitle, setWsTitle] = useState("");
  const [wsDesc, setWsDesc] = useState("");
  const [wsStartsAt, setWsStartsAt] = useState("");
  const [wsLocation, setWsLocation] = useState("");
  const [wsCapacity, setWsCapacity] = useState("");
  const [wsError, setWsError] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    document.title = `${t("admin.loginTitle")} — ACAFIS Canada`;
    try {
      const raw = localStorage.getItem(ADMIN_SESSION_KEY);
      setSession(raw ? (JSON.parse(raw) as AdminSession) : null);
    } catch {
      setSession(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (session === null) {
      navigate(localizePath("/admin/connexion"), { replace: true });
    }
  }, [session, navigate, localizePath]);

  useEffect(() => {
    if (!session) return;
    const token = session.token;

    fetch("/api/admin/members-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setMembers(data.members || []))
      .catch(() => {});

    fetch("/api/admin/family-stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setFamilyStats(data.stats || null))
      .catch(() => {});

    fetch("/api/admin/documents-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setDocuments(data.documents || []))
      .catch(() => {});

    fetch("/api/admin/workshops-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setWorkshops(data.workshops || []))
      .catch(() => {});
  }, [session]);

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    navigate(localizePath("/"));
  };

  const togglePaymentStatus = async (member: AdminMember) => {
    if (!session) return;
    const newStatus = member.paymentStatus === "paid" ? "pending" : "paid";
    setMembers((prev) =>
      prev.map((m) => (m.memberId === member.memberId ? { ...m, paymentStatus: newStatus } : m))
    );
    await fetch("/api/admin/members-set-payment-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: session.token, memberId: member.memberId, paymentStatus: newStatus }),
    }).catch(() => {});
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setDocError("");
    try {
      const response = await fetch("/api/admin/documents-add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: session.token,
          title: docTitle,
          description: docDesc,
          fileUrl: docUrl,
          publishedAt: docDate || undefined,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setDocuments((prev) => [data.document, ...prev]);
        setDocTitle("");
        setDocDesc("");
        setDocUrl("");
        setDocDate("");
      } else {
        setDocError(data.error || t("admin.errorGeneric"));
      }
    } catch {
      setDocError(t("admin.errorGeneric"));
    }
  };

  const handleRemoveDocument = async (id: string) => {
    if (!session) return;
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    await fetch("/api/admin/documents-remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: session.token, id }),
    }).catch(() => {});
  };

  const handleAddWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setWsError("");
    try {
      const response = await fetch("/api/admin/workshops-add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: session.token,
          title: wsTitle,
          description: wsDesc,
          // datetime-local has no timezone — convert here so it's read as
          // the admin's local time, not the server's (UTC on Vercel).
          startsAt: new Date(wsStartsAt).toISOString(),
          location: wsLocation,
          capacity: Number(wsCapacity),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setWorkshops((prev) =>
          [data.workshop, ...prev].sort((a, b) => b.startsAt.localeCompare(a.startsAt))
        );
        setWsTitle("");
        setWsDesc("");
        setWsStartsAt("");
        setWsLocation("");
        setWsCapacity("");
      } else {
        setWsError(data.error || t("admin.errorGeneric"));
      }
    } catch {
      setWsError(t("admin.errorGeneric"));
    }
  };

  const handleRemoveWorkshop = async (id: string) => {
    if (!session || !window.confirm(t("admin.workshopRemoveConfirm"))) return;
    setWorkshops((prev) => prev.filter((w) => w.id !== id));
    await fetch("/api/admin/workshops-remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: session.token, id }),
    }).catch(() => {});
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setPasswordMsg("");
    setPasswordError("");
    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: session.token, oldPassword, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setPasswordMsg(t("admin.passwordChanged"));
        setOldPassword("");
        setNewPassword("");
      } else {
        setPasswordError(data.error || t("admin.errorGeneric"));
      }
    } catch {
      setPasswordError(t("admin.errorGeneric"));
    }
  };

  if (session === undefined) return null;
  if (session === null) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center text-slate-600 text-sm">
        {t("admin.notLoggedIn")}
      </div>
    );
  }

  const TABS: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
    { id: "members", label: t("admin.tabMembers"), icon: <Users className="w-4 h-4" /> },
    { id: "family", label: t("admin.tabFamily"), icon: <Baby className="w-4 h-4" /> },
    { id: "workshops", label: t("admin.tabWorkshops"), icon: <Laptop className="w-4 h-4" /> },
    { id: "documents", label: t("admin.tabDocuments"), icon: <FileText className="w-4 h-4" /> },
    { id: "settings", label: t("admin.tabSettings"), icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-slate-100 via-white to-slate-100 min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">{t("admin.loginTitle")}</p>
              <h1 className="text-lg font-extrabold text-slate-900 font-display">
                {t("admin.welcomeBack")} {session.name}
              </h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t("admin.logoutBtn")}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {TABS.map((tabDef) => (
            <button
              key={tabDef.id}
              onClick={() => setTab(tabDef.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                tab === tabDef.id
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tabDef.icon}
              <span>{tabDef.label}</span>
            </button>
          ))}
        </div>

        {tab === "members" && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 overflow-x-auto">
            <h2 className="text-sm font-bold text-slate-900 font-display mb-4">{t("admin.membersTitle")}</h2>
            <table className="w-full text-xs min-w-[640px]">
              <thead>
                <tr className="text-left text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-2 pr-3 font-bold">{t("admin.colName")}</th>
                  <th className="py-2 pr-3 font-bold">{t("admin.colEmail")}</th>
                  <th className="py-2 pr-3 font-bold">{t("admin.colCity")}</th>
                  <th className="py-2 pr-3 font-bold">{t("admin.colYear")}</th>
                  <th className="py-2 pr-3 font-bold">{t("admin.colCoop")}</th>
                  <th className="py-2 pr-3 font-bold">{t("admin.colStatus")}</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.memberId} className="border-b border-slate-50">
                    <td className="py-2.5 pr-3 font-semibold text-slate-900">
                      {m.firstName} {m.lastName}
                    </td>
                    <td className="py-2.5 pr-3 text-slate-600">{m.email}</td>
                    <td className="py-2.5 pr-3 text-slate-600">{m.city}</td>
                    <td className="py-2.5 pr-3 text-slate-600">{m.membershipYear}</td>
                    <td className="py-2.5 pr-3 text-slate-600">{m.coopInterest ? "✓" : "—"}</td>
                    <td className="py-2.5 pr-3">
                      <button
                        onClick={() => togglePaymentStatus(m)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold cursor-pointer ${
                          m.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-900"
                        }`}
                        title={m.paymentStatus === "paid" ? t("admin.markPending") : t("admin.markPaid")}
                      >
                        {m.paymentStatus === "paid" ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        <span>{m.paymentStatus === "paid" ? t("admin.statusPaid") : t("admin.statusPending")}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "family" && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-display">{t("admin.familyStatsTitle")}</h2>
              <p className="text-xs text-slate-500">{t("admin.familyStatsDesc")}</p>
            </div>

            {familyStats && (
              <>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 inline-block">
                  <span className="block text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                    {t("admin.totalChildren")}
                  </span>
                  <span className="text-2xl font-extrabold text-slate-900">{familyStats.total}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {t("admin.byGenderTitle")}
                    </h3>
                    <div className="space-y-1.5">
                      {Object.entries(familyStats.byGender).map(([gender, count]) => (
                        <div key={gender} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                          <span className="capitalize text-slate-700">{gender}</span>
                          <span className="font-bold text-slate-900">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {t("admin.byAgeTitle")}
                    </h3>
                    <div className="space-y-1.5">
                      {Object.entries(familyStats.ageBrackets).map(([bracket, count]) => (
                        <div key={bracket} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                          <span className="text-slate-700">{bracket} ans</span>
                          <span className="font-bold text-slate-900">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab === "workshops" && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 font-display">{t("admin.workshopsTitle")}</h2>

            {workshops.length === 0 ? (
              <p className="text-xs text-slate-500">{t("admin.workshopsEmpty")}</p>
            ) : (
              <ul className="space-y-3">
                {workshops.map((w) => {
                  const isPast = new Date(w.startsAt).getTime() < Date.now();
                  return (
                    <li key={w.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                            {w.title}
                            {isPast && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                                {t("admin.workshopPast")}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                            <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                            {new Date(w.startsAt).toLocaleString(lang === "en" ? "en-CA" : "fr-CA", {
                              dateStyle: "full",
                              timeStyle: "short",
                            })}
                          </p>
                          <p className="text-xs text-slate-600 flex items-center gap-1.5 break-all">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            {w.location}
                          </p>
                          {w.description && <p className="text-xs text-slate-500 mt-1">{w.description}</p>}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              w.registrations.length >= w.capacity
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {w.registrations.length}/{w.capacity} {t("admin.workshopSeats")}
                          </span>
                          <button
                            onClick={() => handleRemoveWorkshop(w.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {w.registrations.length === 0 ? (
                        <p className="text-[11px] text-slate-400">{t("admin.workshopNoRegistrations")}</p>
                      ) : (
                        <ul className="divide-y divide-slate-200 border-t border-slate-200 text-xs">
                          {w.registrations.map((r) => (
                            <li key={r.id} className="py-1.5 flex flex-wrap justify-between gap-2">
                              <span className="font-semibold text-slate-800">
                                {r.child
                                  ? `${r.child.firstName || t("memberDashboard.childUnnamed")} (${r.child.age} ${t("memberDashboard.childAgeSuffix")})`
                                  : r.memberName}
                              </span>
                              <span className="text-slate-500">
                                {r.child ? `${r.memberName} · ` : `${t("admin.workshopSelf")} · `}
                                {r.memberEmail}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            <form onSubmit={handleAddWorkshop} className="pt-3 border-t border-slate-100 space-y-3">
              <input
                type="text"
                required
                value={wsTitle}
                onChange={(e) => setWsTitle(e.target.value)}
                placeholder={t("admin.workshopTitleLabel")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
              />
              <input
                type="text"
                value={wsDesc}
                onChange={(e) => setWsDesc(e.target.value)}
                placeholder={t("admin.workshopDescLabel")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="datetime-local"
                  required
                  value={wsStartsAt}
                  onChange={(e) => setWsStartsAt(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
                />
                <input
                  type="text"
                  required
                  value={wsLocation}
                  onChange={(e) => setWsLocation(e.target.value)}
                  placeholder={t("admin.workshopLocationLabel")}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
                />
                <input
                  type="number"
                  required
                  min={1}
                  value={wsCapacity}
                  onChange={(e) => setWsCapacity(e.target.value)}
                  placeholder={t("admin.workshopCapacityLabel")}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
                />
              </div>
              {wsError && (
                <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                  {wsError}
                </p>
              )}
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t("admin.addWorkshopBtn")}</span>
              </button>
            </form>
          </div>
        )}

        {tab === "documents" && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 font-display">{t("admin.documentsTitle")}</h2>

            <ul className="space-y-2">
              {documents.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{doc.title}</p>
                    {doc.description && <p className="text-xs text-slate-500">{doc.description}</p>}
                    <p className="text-[11px] text-slate-400">{doc.publishedAt}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveDocument(doc.id)}
                    className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>

            <form onSubmit={handleAddDocument} className="pt-3 border-t border-slate-100 space-y-3">
              <input
                type="text"
                required
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder={t("admin.documentTitleLabel")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
              />
              <input
                type="text"
                value={docDesc}
                onChange={(e) => setDocDesc(e.target.value)}
                placeholder={t("admin.documentDescLabel")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="url"
                  required
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  placeholder={t("admin.documentUrlLabel")}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
                />
                <input
                  type="date"
                  value={docDate}
                  onChange={(e) => setDocDate(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
                />
              </div>
              {docError && (
                <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                  {docError}
                </p>
              )}
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t("admin.addDocumentBtn")}</span>
              </button>
            </form>
          </div>
        )}

        {tab === "settings" && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4 max-w-md">
            <h2 className="text-sm font-bold text-slate-900 font-display">{t("admin.settingsTitle")}</h2>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder={t("admin.oldPasswordLabel")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
              />
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("admin.newPasswordLabel")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
              />
              {passwordMsg && (
                <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5">
                  {passwordMsg}
                </p>
              )}
              {passwordError && (
                <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                  {passwordError}
                </p>
              )}
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t("admin.changePasswordBtn")}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
