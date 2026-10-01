import React, { useState } from "react";
import { Phone, MapPin, Pencil } from "lucide-react";
import { useTranslation } from "../i18n/translations";
import { MemberRecord } from "../types";

const INPUT_CLASS =
  "w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600";

// "Mes coordonnées": the member keeps their own phone and city current, so
// the Bureau's list fills in over time. The email (their login) is shown but
// only the Bureau can change it.
export const MemberContactForm: React.FC<{ member: MemberRecord; onSaved: (member: MemberRecord) => void }> = ({
  member,
  onSaved,
}) => {
  const { t } = useTranslation();
  const hasPhone = !!member.phone && member.phone !== "Non renseigné";
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(hasPhone ? member.phone : "");
  const [city, setCity] = useState(member.city || "");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);
    try {
      const response = await fetch("/api/members/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: member.email, memberId: member.memberId, phone, city }),
      });
      const data = await response.json();
      if (response.ok) {
        onSaved(data.member);
        setIsEditing(false);
      } else {
        setError(data.error || t("memberDashboard.contactError"));
      }
    } catch {
      setError(t("memberDashboard.contactError"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-6 sm:mx-8 mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{t("memberDashboard.contactTitle")}</p>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-white border border-emerald-200 hover:bg-emerald-50 cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            {t("memberDashboard.contactEditBtn")}
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <p className="flex items-center gap-2 text-slate-900">
            <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
            {hasPhone ? (
              member.phone
            ) : (
              <span className="text-amber-700 text-xs font-semibold">{t("memberDashboard.contactPhoneMissing")}</span>
            )}
          </p>
          <p className="flex items-center gap-2 text-slate-900">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
            {member.city || <span className="text-slate-500 text-xs">—</span>}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("memberDashboard.contactPhoneLabel")}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              maxLength={80}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={t("memberDashboard.cityLabel")}
              className={INPUT_CLASS}
            />
          </div>
          <p className="text-[11px] text-slate-500">{t("memberDashboard.contactEmailNote")}</p>
          {error && (
            <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
          )}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 cursor-pointer disabled:opacity-60"
            >
              {t("admin.save")}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
            >
              {t("admin.cancel")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
