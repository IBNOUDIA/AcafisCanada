import React from "react";
import { Trash2 } from "lucide-react";
import { useTranslation } from "../i18n/translations";
import { ChildSportFile, WorkshopCategory } from "../types";

// ---------------------------------------------------------------------------
// Eligibility/logistics options of an activity, shared by the create and edit
// forms of the admin Activités tab.
// ---------------------------------------------------------------------------

export interface ActivityOptionsForm {
  genderRestriction: "" | "feminin" | "masculin";
  registrationDeadline: string; // datetime-local value, "" = none
  requiresPaidMembership: boolean;
  feeAmount: string; // "" = free
}

export const EMPTY_ACTIVITY_OPTIONS: ActivityOptionsForm = {
  genderRestriction: "",
  registrationDeadline: "",
  requiresPaidMembership: false,
  feeAmount: "",
};

// datetime-local inputs take local wall-clock time with no timezone, so an
// ISO timestamp from the server has to be shifted before prefilling one.
export function toDateTimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function activityOptionsFrom(w: {
  genderRestriction: "feminin" | "masculin" | null;
  registrationDeadline: string | null;
  requiresPaidMembership: boolean;
  feeAmount: number | null;
}): ActivityOptionsForm {
  return {
    genderRestriction: w.genderRestriction ?? "",
    registrationDeadline: w.registrationDeadline ? toDateTimeLocal(w.registrationDeadline) : "",
    requiresPaidMembership: w.requiresPaidMembership,
    feeAmount: w.feeAmount === null ? "" : String(w.feeAmount),
  };
}

export function activityOptionsPayload(form: ActivityOptionsForm) {
  return {
    genderRestriction: form.genderRestriction || null,
    // Converted here so it's read as the admin's local time, not the server's.
    registrationDeadline: form.registrationDeadline ? new Date(form.registrationDeadline).toISOString() : null,
    requiresPaidMembership: form.requiresPaidMembership,
    feeAmount: form.feeAmount === "" ? null : Number(form.feeAmount),
  };
}

export const ActivityOptionsFields: React.FC<{
  value: ActivityOptionsForm;
  onChange: (value: ActivityOptionsForm) => void;
  inputClassName: string;
}> = ({ value, onChange, inputClassName }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <select
          value={value.genderRestriction}
          onChange={(e) =>
            onChange({ ...value, genderRestriction: e.target.value as ActivityOptionsForm["genderRestriction"] })
          }
          aria-label={t("admin.workshopGenderLabel")}
          className={inputClassName}
        >
          <option value="">{t("activity.genderMixed")}</option>
          <option value="masculin">{t("activity.genderBoys")}</option>
          <option value="feminin">{t("activity.genderGirls")}</option>
        </select>
        <label className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {t("admin.workshopDeadlineLabel")}
          </span>
          <input
            type="datetime-local"
            value={value.registrationDeadline}
            onChange={(e) => onChange({ ...value, registrationDeadline: e.target.value })}
            className={inputClassName}
          />
        </label>
        <input
          type="number"
          min={0}
          step="0.01"
          value={value.feeAmount}
          onChange={(e) => onChange({ ...value, feeAmount: e.target.value })}
          placeholder={t("admin.workshopFeeLabel")}
          className={`${inputClassName} self-end`}
        />
      </div>
      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={value.requiresPaidMembership}
          onChange={(e) => onChange({ ...value, requiresPaidMembership: e.target.checked })}
          className="accent-slate-900"
        />
        {t("admin.workshopRequiresPaidLabel")}
      </label>
    </div>
  );
};

// ---------------------------------------------------------------------------
// One registration line in an activity card: who, waitlist status, fee and
// attendance toggles, and the child's fiche sportive for sport activities.
// ---------------------------------------------------------------------------

export interface AdminRegistration {
  id: string;
  status: "confirmed" | "waitlist";
  feePaid: boolean;
  attended: boolean | null;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  child: { firstName: string | null; age: number; gender: string; sportFile: ChildSportFile } | null;
}

export const AdminRegistrationRow: React.FC<{
  registration: AdminRegistration;
  category: WorkshopCategory;
  hasFee: boolean;
  isPast: boolean;
  waitlistPosition: number | null;
  onUpdate: (fields: { feePaid?: boolean; attended?: boolean | null }) => void;
  onRemove: () => void;
}> = ({ registration: r, category, hasFee, isPast, waitlistPosition, onUpdate, onRemove }) => {
  const { t } = useTranslation();
  const file = r.child?.sportFile;
  const toggleClass = (active: boolean, activeColors: string) =>
    `px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${active ? activeColors : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`;

  return (
    <li className="py-2 space-y-1">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold text-slate-800 flex flex-wrap items-center gap-1.5">
          {r.child
            ? `${r.child.firstName || t("memberDashboard.childUnnamed")} (${r.child.age} ${t("memberDashboard.childAgeSuffix")})`
            : r.memberName}
          {r.status === "waitlist" && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              {t("admin.workshopWaitlist")} n°{waitlistPosition}
            </span>
          )}
        </span>
        <span className="flex flex-wrap items-center gap-1.5 text-slate-500">
          <span>
            {r.child ? `${r.memberName} · ` : `${t("admin.workshopSelf")} · `}
            {r.memberEmail}
            {r.memberPhone && ` · ${r.memberPhone}`}
          </span>
          {r.status === "confirmed" && hasFee && (
            <button
              onClick={() => onUpdate({ feePaid: !r.feePaid })}
              className={toggleClass(r.feePaid, "bg-emerald-100 text-emerald-800")}
            >
              {r.feePaid ? t("admin.workshopFeePaid") : t("admin.workshopFeeDue")}
            </button>
          )}
          {r.status === "confirmed" && isPast && (
            <>
              <button
                onClick={() => onUpdate({ attended: r.attended === true ? null : true })}
                className={toggleClass(r.attended === true, "bg-emerald-100 text-emerald-800")}
              >
                {t("admin.workshopAttended")}
              </button>
              <button
                onClick={() => onUpdate({ attended: r.attended === false ? null : false })}
                className={toggleClass(r.attended === false, "bg-red-100 text-red-700")}
              >
                {t("admin.workshopAbsent")}
              </button>
            </>
          )}
          <button
            onClick={onRemove}
            title={t("admin.workshopRegistrationRemove")}
            aria-label={t("admin.workshopRegistrationRemove")}
            className="p-0.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </span>
      </div>

      {category === "sport" && r.child && (
        <p className="text-[11px] text-slate-500 pl-2 border-l-2 border-sky-200">
          {file?.emergencyContactPhone ? (
            <>
              {t("admin.workshopEmergency")} : {file.emergencyContactName} {file.emergencyContactPhone}
              {file.healthNotes && (
                <>
                  {" · "}
                  <span className="text-red-700 font-semibold">
                    {t("admin.workshopHealth")} : {file.healthNotes}
                  </span>
                </>
              )}
              {file.jerseySize && ` · ${t("admin.workshopJersey")} ${file.jerseySize}`}
              {" · "}
              {file.photoConsent ? t("admin.workshopPhotoOk") : t("admin.workshopPhotoNo")}
            </>
          ) : (
            <span className="text-amber-700 font-semibold">{t("admin.workshopNoSportFile")}</span>
          )}
        </p>
      )}
    </li>
  );
};
