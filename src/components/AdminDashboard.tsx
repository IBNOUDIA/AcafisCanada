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
  Pencil,
  CheckCircle2,
  Clock,
  Laptop,
  CalendarDays,
  MapPin,
  Lock,
  LockOpen,
  Download,
} from "lucide-react";
import { useTranslation } from "../i18n/translations";
import { useLanguage } from "../i18n/LanguageContext";
import { ADMIN_SESSION_KEY, AdminSession } from "../lib/adminSession";
import {
  ACTIVITY_CATEGORIES,
  ACTIVITY_CATEGORY_LABEL_KEYS,
  GENDER_RESTRICTION_LABEL_KEYS,
  formatAgeRange,
} from "../lib/activity";
import type { WorkshopCategory } from "../types";
import {
  ActivityOptionsFields,
  ActivityOptionsForm,
  AdminRegistration,
  AdminRegistrationRow,
  EMPTY_ACTIVITY_OPTIONS,
  activityOptionsFrom,
  activityOptionsPayload,
  toDateTimeLocal,
} from "./AdminActivityParts";

interface AdminMember {
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
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
  registrationsOpen: boolean;
  category: WorkshopCategory;
  minAge: number | null;
  maxAge: number | null;
  genderRestriction: "feminin" | "masculin" | null;
  registrationDeadline: string | null;
  requiresPaidMembership: boolean;
  feeAmount: number | null;
  // Confirmed seats first, then the waitlist in promotion order (server-sorted).
  registrations: AdminRegistration[];
}

type Tab = "members" | "family" | "workshops" | "documents" | "settings";

// Empty age field = no limit.
function ageLimit(value: string): number | null {
  return value === "" ? null : Number(value);
}

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export const AdminDashboard: React.FC = () => {
  const { t, lang } = useTranslation();
  const { localizePath } = useLanguage();
  const navigate = useNavigate();
  const [session, setSession] = useState<AdminSession | null | undefined>(undefined);
  const [tab, setTab] = useState<Tab>("members");

  const [members, setMembers] = useState<AdminMember[]>([]);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCity, setEditCity] = useState("");
  const [memberActionError, setMemberActionError] = useState("");
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
  const [wsCategory, setWsCategory] = useState<WorkshopCategory>("ntic");
  const [wsMinAge, setWsMinAge] = useState("");
  const [wsMaxAge, setWsMaxAge] = useState("");
  const [wsOptions, setWsOptions] = useState<ActivityOptionsForm>(EMPTY_ACTIVITY_OPTIONS);
  const [wsError, setWsError] = useState("");
  const [editingWorkshopId, setEditingWorkshopId] = useState<string | null>(null);
  const [editWs, setEditWs] = useState({
    title: "",
    description: "",
    startsAt: "",
    location: "",
    capacity: "",
    category: "ntic" as WorkshopCategory,
    minAge: "",
    maxAge: "",
    options: EMPTY_ACTIVITY_OPTIONS,
  });
  const [wsActionError, setWsActionError] = useState<Record<string, string>>({});

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

    loadWorkshops(token);
  }, [session]);

  // Also re-run after actions that can move the waitlist (removing a seat,
  // raising capacity), since promotions happen server-side.
  const loadWorkshops = (token: string) => {
    fetch("/api/admin/workshops-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setWorkshops(data.workshops || []))
      .catch(() => {});
  };

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

  const startEditMember = (member: AdminMember) => {
    setEditingMemberId(member.memberId);
    setEditEmail(member.email);
    setEditPhone(member.phone || "");
    setEditCity(member.city || "");
    setMemberActionError("");
  };

  const cancelEditMember = () => {
    setEditingMemberId(null);
    setMemberActionError("");
  };

  const saveEditMember = async () => {
    if (!session || !editingMemberId) return;
    setMemberActionError("");
    try {
      const response = await fetch("/api/admin/members-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: session.token,
          memberId: editingMemberId,
          email: editEmail,
          phone: editPhone,
          city: editCity,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMemberActionError(data.error || t("admin.errorGeneric"));
        return;
      }
      setMembers((prev) =>
        prev.map((m) =>
          m.memberId === editingMemberId
            ? { ...m, email: editEmail.toLowerCase().trim(), phone: editPhone || null, city: editCity }
            : m
        )
      );
      setEditingMemberId(null);
    } catch {
      setMemberActionError(t("admin.errorGeneric"));
    }
  };

  const deleteMember = async (memberId: string) => {
    if (!session || !window.confirm(t("admin.memberDeleteConfirm"))) return;
    setMembers((prev) => prev.filter((m) => m.memberId !== memberId));
    await fetch("/api/admin/members-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: session.token, memberId }),
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
          category: wsCategory,
          minAge: ageLimit(wsMinAge),
          maxAge: ageLimit(wsMaxAge),
          ...activityOptionsPayload(wsOptions),
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
        setWsMinAge("");
        setWsMaxAge("");
        setWsOptions(EMPTY_ACTIVITY_OPTIONS);
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

  const updateWorkshop = async (id: string, fields: Record<string, unknown>): Promise<boolean> => {
    if (!session) return false;
    setWsActionError((prev) => ({ ...prev, [id]: "" }));
    try {
      const response = await fetch("/api/admin/workshops-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: session.token, id, ...fields }),
      });
      const data = await response.json();
      if (!response.ok) {
        setWsActionError((prev) => ({ ...prev, [id]: data.error || t("admin.errorGeneric") }));
        return false;
      }
      return true;
    } catch {
      setWsActionError((prev) => ({ ...prev, [id]: t("admin.errorGeneric") }));
      return false;
    }
  };

  const startEditWorkshop = (w: AdminWorkshop) => {
    setEditingWorkshopId(w.id);
    setEditWs({
      title: w.title,
      description: w.description || "",
      startsAt: toDateTimeLocal(w.startsAt),
      location: w.location,
      capacity: String(w.capacity),
      category: w.category,
      minAge: w.minAge === null ? "" : String(w.minAge),
      maxAge: w.maxAge === null ? "" : String(w.maxAge),
      options: activityOptionsFrom(w),
    });
    setWsActionError((prev) => ({ ...prev, [w.id]: "" }));
  };

  const saveEditWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkshopId) return;
    const id = editingWorkshopId;
    // Same local-time conversion as handleAddWorkshop.
    const startsAt = new Date(editWs.startsAt).toISOString();
    const capacity = Number(editWs.capacity);
    const minAge = ageLimit(editWs.minAge);
    const maxAge = ageLimit(editWs.maxAge);
    const options = activityOptionsPayload(editWs.options);
    const ok = await updateWorkshop(id, {
      title: editWs.title,
      description: editWs.description,
      startsAt,
      location: editWs.location,
      capacity,
      category: editWs.category,
      minAge,
      maxAge,
      ...options,
    });
    if (!ok) return;
    setEditingWorkshopId(null);
    // Refetch rather than patch locally: a capacity increase may have
    // promoted waitlisted families server-side.
    if (session) loadWorkshops(session.token);
  };

  const updateRegistration = async (
    workshopId: string,
    registrationId: string,
    fields: { feePaid?: boolean; attended?: boolean | null }
  ) => {
    if (!session) return;
    setWorkshops((prev) =>
      prev.map((w) =>
        w.id === workshopId
          ? { ...w, registrations: w.registrations.map((r) => (r.id === registrationId ? { ...r, ...fields } : r)) }
          : w
      )
    );
    await fetch("/api/admin/workshops-registration-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: session.token, id: registrationId, ...fields }),
    }).catch(() => {});
  };

  const toggleWorkshopRegistrations = async (w: AdminWorkshop) => {
    const registrationsOpen = !w.registrationsOpen;
    if (await updateWorkshop(w.id, { registrationsOpen })) {
      setWorkshops((prev) => prev.map((x) => (x.id === w.id ? { ...x, registrationsOpen } : x)));
    }
  };

  const handleRemoveRegistration = async (workshopId: string, registrationId: string) => {
    if (!session || !window.confirm(t("admin.workshopRegistrationRemoveConfirm"))) return;
    setWorkshops((prev) =>
      prev.map((w) =>
        w.id === workshopId ? { ...w, registrations: w.registrations.filter((r) => r.id !== registrationId) } : w
      )
    );
    await fetch("/api/admin/workshops-registration-remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: session.token, id: registrationId }),
    }).catch(() => {});
    // The freed seat may have gone to the first family on the waitlist.
    loadWorkshops(session.token);
  };

  const exportWorkshopCsv = (w: AdminWorkshop) => {
    const yesNo = (value: boolean | null) =>
      value === null ? "" : value ? t("admin.csvYes") : t("admin.csvNo");
    const header = [
      t("admin.csvParticipant"),
      t("admin.csvAge"),
      t("admin.csvStatus"),
      t("admin.csvMember"),
      t("admin.colEmail"),
      t("admin.colPhone"),
      t("admin.csvEmergency"),
      t("admin.csvHealth"),
      t("admin.csvJersey"),
      t("admin.csvPhoto"),
      t("admin.csvFeePaid"),
      t("admin.csvAttended"),
    ];
    const rows = w.registrations.map((r) => {
      const file = r.child?.sportFile;
      return [
        r.child ? r.child.firstName || t("memberDashboard.childUnnamed") : r.memberName,
        r.child ? String(r.child.age) : "",
        r.status === "waitlist" ? t("admin.workshopWaitlist") : t("admin.csvConfirmed"),
        r.memberName,
        r.memberEmail,
        r.memberPhone,
        file?.emergencyContactPhone ? `${file.emergencyContactName} ${file.emergencyContactPhone}` : "",
        file?.healthNotes || "",
        file?.jerseySize || "",
        r.child ? yesNo(file?.photoConsent ?? false) : "",
        w.feeAmount !== null ? yesNo(r.feePaid) : "",
        yesNo(r.attended),
      ];
    });
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    // BOM so Excel opens the accents correctly.
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const slug = w.title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    a.download = `activite-${w.startsAt.slice(0, 10)}-${slug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
            {memberActionError && (
              <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">
                {memberActionError}
              </p>
            )}
            <table className="w-full text-xs min-w-[820px]">
              <thead>
                <tr className="text-left text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-2 pr-3 font-bold">{t("admin.colName")}</th>
                  <th className="py-2 pr-3 font-bold">{t("admin.colEmail")}</th>
                  <th className="py-2 pr-3 font-bold">{t("admin.colPhone")}</th>
                  <th className="py-2 pr-3 font-bold">{t("admin.colCity")}</th>
                  <th className="py-2 pr-3 font-bold">{t("admin.colYear")}</th>
                  <th className="py-2 pr-3 font-bold">{t("admin.colCoop")}</th>
                  <th className="py-2 pr-3 font-bold">{t("admin.colStatus")}</th>
                  <th className="py-2 pr-3 font-bold">{t("admin.colActions")}</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => {
                  const isEditing = editingMemberId === m.memberId;
                  const isPlaceholderEmail = m.email.endsWith("@acafis.invalid");
                  return (
                    <tr key={m.memberId} className="border-b border-slate-50 align-top">
                      <td className="py-2.5 pr-3 font-semibold text-slate-900 whitespace-nowrap">
                        {m.firstName} {m.lastName}
                      </td>
                      <td className="py-2.5 pr-3 text-slate-600">
                        {isEditing ? (
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="w-full min-w-[160px] px-2 py-1 rounded-lg border border-slate-300 text-xs"
                          />
                        ) : (
                          <span title={isPlaceholderEmail ? t("admin.memberPlaceholderEmailHint") : undefined}>
                            {m.email}
                            {isPlaceholderEmail && (
                              <span className="ml-1.5 inline-block px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold align-middle">
                                !
                              </span>
                            )}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 pr-3 text-slate-600">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-full min-w-[110px] px-2 py-1 rounded-lg border border-slate-300 text-xs"
                          />
                        ) : (
                          m.phone || "—"
                        )}
                      </td>
                      <td className="py-2.5 pr-3 text-slate-600">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editCity}
                            onChange={(e) => setEditCity(e.target.value)}
                            className="w-full min-w-[110px] px-2 py-1 rounded-lg border border-slate-300 text-xs"
                          />
                        ) : (
                          m.city || "—"
                        )}
                      </td>
                      <td className="py-2.5 pr-3 text-slate-600">{m.membershipYear}</td>
                      <td className="py-2.5 pr-3 text-slate-600">{m.coopInterest ? "✓" : "—"}</td>
                      <td className="py-2.5 pr-3">
                        <button
                          onClick={() => togglePaymentStatus(m)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold cursor-pointer whitespace-nowrap ${
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
                      <td className="py-2.5 pr-3">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={saveEditMember}
                              className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer"
                            >
                              {t("admin.save")}
                            </button>
                            <button
                              onClick={cancelEditMember}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                            >
                              {t("admin.cancel")}
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditMember(m)}
                              title={t("admin.edit")}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteMember(m.memberId)}
                              title={t("admin.delete")}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
                  const isEditing = editingWorkshopId === w.id;
                  const confirmedCount = w.registrations.filter((r) => r.status === "confirmed").length;
                  const waitlistIds = w.registrations.filter((r) => r.status === "waitlist").map((r) => r.id);
                  const attendedCount = w.registrations.filter((r) => r.attended === true).length;
                  const dateLocale = lang === "en" ? "en-CA" : "fr-CA";
                  return (
                    <li key={w.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      {isEditing ? (
                        <form onSubmit={saveEditWorkshop} className="space-y-2">
                          <input
                            type="text"
                            required
                            value={editWs.title}
                            onChange={(e) => setEditWs((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder={t("admin.workshopTitleLabel")}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                          />
                          <input
                            type="text"
                            value={editWs.description}
                            onChange={(e) => setEditWs((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder={t("admin.workshopDescLabel")}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="datetime-local"
                              required
                              value={editWs.startsAt}
                              onChange={(e) => setEditWs((prev) => ({ ...prev, startsAt: e.target.value }))}
                              className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                            />
                            <input
                              type="text"
                              required
                              value={editWs.location}
                              onChange={(e) => setEditWs((prev) => ({ ...prev, location: e.target.value }))}
                              placeholder={t("admin.workshopLocationLabel")}
                              className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                            />
                            <input
                              type="number"
                              required
                              min={Math.max(1, confirmedCount)}
                              value={editWs.capacity}
                              onChange={(e) => setEditWs((prev) => ({ ...prev, capacity: e.target.value }))}
                              placeholder={t("admin.workshopCapacityLabel")}
                              className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <select
                              value={editWs.category}
                              onChange={(e) => setEditWs((prev) => ({ ...prev, category: e.target.value as WorkshopCategory }))}
                              aria-label={t("admin.workshopCategoryLabel")}
                              className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                            >
                              {ACTIVITY_CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                  {t(ACTIVITY_CATEGORY_LABEL_KEYS[c])}
                                </option>
                              ))}
                            </select>
                            <input
                              type="number"
                              min={0}
                              value={editWs.minAge}
                              onChange={(e) => setEditWs((prev) => ({ ...prev, minAge: e.target.value }))}
                              placeholder={t("admin.workshopMinAgeLabel")}
                              className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                            />
                            <input
                              type="number"
                              min={0}
                              value={editWs.maxAge}
                              onChange={(e) => setEditWs((prev) => ({ ...prev, maxAge: e.target.value }))}
                              placeholder={t("admin.workshopMaxAgeLabel")}
                              className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                            />
                          </div>
                          <ActivityOptionsFields
                            value={editWs.options}
                            onChange={(options) => setEditWs((prev) => ({ ...prev, options }))}
                            inputClassName="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="submit"
                              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer"
                            >
                              {t("admin.save")}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingWorkshopId(null)}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                            >
                              {t("admin.cancel")}
                            </button>
                          </div>
                        </form>
                      ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 flex flex-wrap items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                w.category === "sport" ? "bg-sky-100 text-sky-800" : "bg-violet-100 text-violet-800"
                              }`}
                            >
                              {t(ACTIVITY_CATEGORY_LABEL_KEYS[w.category])}
                            </span>
                            {w.genderRestriction && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                                {t(GENDER_RESTRICTION_LABEL_KEYS[w.genderRestriction])}
                              </span>
                            )}
                            {w.requiresPaidMembership && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                {t("memberDashboard.workshopMembersOnly")}
                              </span>
                            )}
                            {w.title}
                            {isPast && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                                {t("admin.workshopPast")}
                              </span>
                            )}
                            {!isPast && !w.registrationsOpen && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                {t("admin.workshopClosed")}
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
                          {formatAgeRange(w.minAge, w.maxAge, t) && (
                            <p className="text-xs text-slate-600 flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 shrink-0" />
                              {formatAgeRange(w.minAge, w.maxAge, t)}
                            </p>
                          )}
                          {w.registrationDeadline && (
                            <p className="text-xs text-slate-600 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 shrink-0" />
                              {t("memberDashboard.workshopDeadline")}{" "}
                              {new Date(w.registrationDeadline).toLocaleString(dateLocale, {
                                dateStyle: "long",
                                timeStyle: "short",
                              })}
                            </p>
                          )}
                          {w.feeAmount !== null && (
                            <p className="text-xs text-slate-600 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              {t("admin.workshopFeeShort")} {w.feeAmount} $ ·{" "}
                              {w.registrations.filter((r) => r.status === "confirmed" && r.feePaid).length}/{confirmedCount}{" "}
                              {t("admin.workshopFeePaid").toLowerCase()}
                            </p>
                          )}
                          {w.description && <p className="text-xs text-slate-500 mt-1">{w.description}</p>}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="flex flex-col items-end gap-1">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                confirmedCount >= w.capacity
                                  ? "bg-red-100 text-red-700"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {confirmedCount}/{w.capacity} {t("admin.workshopSeats")}
                            </span>
                            {waitlistIds.length > 0 && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                +{waitlistIds.length} {t("admin.workshopWaitlist").toLowerCase()}
                              </span>
                            )}
                            {isPast && confirmedCount > 0 && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                                {attendedCount}/{confirmedCount} {t("admin.workshopAttendanceCount")}
                              </span>
                            )}
                          </span>
                          {!isPast && (
                            <button
                              onClick={() => toggleWorkshopRegistrations(w)}
                              title={w.registrationsOpen ? t("admin.workshopCloseBtn") : t("admin.workshopOpenBtn")}
                              aria-label={w.registrationsOpen ? t("admin.workshopCloseBtn") : t("admin.workshopOpenBtn")}
                              className="p-2 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                            >
                              {w.registrationsOpen ? <LockOpen className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </button>
                          )}
                          {w.registrations.length > 0 && (
                            <button
                              onClick={() => exportWorkshopCsv(w)}
                              title={t("admin.workshopExportBtn")}
                              aria-label={t("admin.workshopExportBtn")}
                              className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => startEditWorkshop(w)}
                            title={t("admin.edit")}
                            aria-label={t("admin.edit")}
                            className="p-2 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveWorkshop(w.id)}
                            title={t("admin.delete")}
                            aria-label={t("admin.delete")}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      )}

                      {wsActionError[w.id] && (
                        <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                          {wsActionError[w.id]}
                        </p>
                      )}

                      {w.registrations.length === 0 ? (
                        <p className="text-[11px] text-slate-400">{t("admin.workshopNoRegistrations")}</p>
                      ) : (
                        <ul className="divide-y divide-slate-200 border-t border-slate-200 text-xs">
                          {w.registrations.map((r) => (
                            <AdminRegistrationRow
                              key={r.id}
                              registration={r}
                              category={w.category}
                              hasFee={w.feeAmount !== null}
                              isPast={isPast}
                              waitlistPosition={r.status === "waitlist" ? waitlistIds.indexOf(r.id) + 1 : null}
                              onUpdate={(fields) => updateRegistration(w.id, r.id, fields)}
                              onRemove={() => handleRemoveRegistration(w.id, r.id)}
                            />
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={wsCategory}
                  onChange={(e) => setWsCategory(e.target.value as WorkshopCategory)}
                  aria-label={t("admin.workshopCategoryLabel")}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
                >
                  {ACTIVITY_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {t(ACTIVITY_CATEGORY_LABEL_KEYS[c])}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  value={wsMinAge}
                  onChange={(e) => setWsMinAge(e.target.value)}
                  placeholder={t("admin.workshopMinAgeLabel")}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
                />
                <input
                  type="number"
                  min={0}
                  value={wsMaxAge}
                  onChange={(e) => setWsMaxAge(e.target.value)}
                  placeholder={t("admin.workshopMaxAgeLabel")}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
                />
              </div>
              <ActivityOptionsFields
                value={wsOptions}
                onChange={setWsOptions}
                inputClassName="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
              />
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
