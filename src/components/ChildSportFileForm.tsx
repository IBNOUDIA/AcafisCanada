import React, { useState } from "react";
import { useTranslation } from "../i18n/translations";
import { JERSEY_SIZES } from "../lib/activity";
import { MemberChild, MemberRecord } from "../types";

interface ChildSportFileFormProps {
  member: MemberRecord;
  child: MemberChild;
  onSaved: (child: MemberChild) => void;
  onCancel: () => void;
}

const INPUT_CLASS =
  "w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600";

// The parent fills this once per child and season; it's required before
// signing the child up for a sport activity (see register_for_workshop).
export const ChildSportFileForm: React.FC<ChildSportFileFormProps> = ({ member, child, onSaved, onCancel }) => {
  const { t } = useTranslation();
  const file = child.sportFile;
  const [emergencyName, setEmergencyName] = useState(file?.emergencyContactName || "");
  const [emergencyPhone, setEmergencyPhone] = useState(file?.emergencyContactPhone || "");
  const [healthNotes, setHealthNotes] = useState(file?.healthNotes || "");
  const [jerseySize, setJerseySize] = useState(file?.jerseySize || "");
  const [photoConsent, setPhotoConsent] = useState(file?.photoConsent ?? false);
  // Always re-ticked: saving the form is what renews the consent for the year.
  const [parentalConsent, setParentalConsent] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);
    try {
      const response = await fetch("/api/members/children/sport-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: member.email,
          memberId: member.memberId,
          childId: child.id,
          emergencyContactName: emergencyName,
          emergencyContactPhone: emergencyPhone,
          healthNotes,
          jerseySize: jerseySize || undefined,
          photoConsent,
          parentalConsent,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        onSaved(data.child);
      } else {
        setError(data.error || t("memberDashboard.sportFileError"));
      }
    } catch {
      setError(t("memberDashboard.sportFileError"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 p-4 rounded-xl bg-white border border-sky-200 space-y-3">
      <div>
        <p className="text-xs font-bold text-slate-900">
          {t("memberDashboard.sportFileTitle")} {child.firstName || t("memberDashboard.childUnnamed")}
        </p>
        <p className="text-[11px] text-slate-500">{t("memberDashboard.sportFileDesc")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          type="text"
          required
          value={emergencyName}
          onChange={(e) => setEmergencyName(e.target.value)}
          placeholder={t("memberDashboard.sportEmergencyName")}
          className={INPUT_CLASS}
        />
        <input
          type="tel"
          required
          value={emergencyPhone}
          onChange={(e) => setEmergencyPhone(e.target.value)}
          placeholder={t("memberDashboard.sportEmergencyPhone")}
          className={INPUT_CLASS}
        />
      </div>
      <textarea
        value={healthNotes}
        onChange={(e) => setHealthNotes(e.target.value)}
        placeholder={t("memberDashboard.sportHealthNotes")}
        rows={2}
        maxLength={1000}
        className={INPUT_CLASS}
      />
      <select value={jerseySize} onChange={(e) => setJerseySize(e.target.value)} className={INPUT_CLASS}>
        <option value="">{t("memberDashboard.sportJerseyNone")}</option>
        {JERSEY_SIZES.map((size) => (
          <option key={size} value={size}>
            {t("memberDashboard.sportJerseySize")} {size}
          </option>
        ))}
      </select>

      <label className="flex items-start gap-2 text-[11px] text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={photoConsent}
          onChange={(e) => setPhotoConsent(e.target.checked)}
          className="mt-0.5 accent-emerald-700"
        />
        <span>{t("memberDashboard.sportPhotoConsent")}</span>
      </label>
      <label className="flex items-start gap-2 text-[11px] text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          required
          checked={parentalConsent}
          onChange={(e) => setParentalConsent(e.target.checked)}
          className="mt-0.5 accent-emerald-700"
        />
        <span className="font-semibold">{t("memberDashboard.sportParentalConsent")}</span>
      </label>

      {error && (
        <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
      )}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors cursor-pointer disabled:opacity-60"
        >
          {t("memberDashboard.sportFileSave")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          {t("admin.cancel")}
        </button>
      </div>
    </form>
  );
};
