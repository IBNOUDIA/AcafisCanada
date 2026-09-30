import type { TranslationKey } from "../i18n/translations";
import type { MemberChild, WorkshopCategory } from "../types";

// Adding a category: extend WorkshopCategory (types.ts), the three maps
// below, WORKSHOP_CATEGORIES (src/server/adminHandlers.ts) and the
// workshops_category_check constraint (supabase/schema.sql).
export const ACTIVITY_CATEGORIES: WorkshopCategory[] = ["ntic", "sport", "autre"];

export const ACTIVITY_CATEGORY_LABEL_KEYS: Record<WorkshopCategory, TranslationKey> = {
  ntic: "activity.categoryNtic",
  sport: "activity.categorySport",
  autre: "activity.categoryAutre",
};

export const ACTIVITY_CATEGORY_BADGE_CLASSES: Record<WorkshopCategory, string> = {
  ntic: "bg-violet-100 text-violet-800",
  sport: "bg-sky-100 text-sky-800",
  autre: "bg-rose-100 text-rose-800",
};

// "13–17 ans", "13 ans et +", "Jusqu'à 17 ans", or null when unrestricted.
export function formatAgeRange(
  minAge: number | null,
  maxAge: number | null,
  t: (key: TranslationKey) => string
): string | null {
  if (minAge !== null && maxAge !== null) {
    return t("activity.ageRange").replace("{min}", String(minAge)).replace("{max}", String(maxAge));
  }
  if (minAge !== null) return t("activity.ageMin").replace("{min}", String(minAge));
  if (maxAge !== null) return t("activity.ageMax").replace("{max}", String(maxAge));
  return null;
}

// Mirrors the checks in register_for_workshop (supabase/schema.sql): a
// child's age is counted in the activity's year; the member themself (child
// null) is an adult with no stored gender, so gendered activities are
// children-only.
export function isEligibleForActivity(
  activity: {
    startsAt: string;
    minAge: number | null;
    maxAge: number | null;
    genderRestriction: "feminin" | "masculin" | null;
  },
  child: { birthYear: number; gender: string } | null
): boolean {
  if (child === null) {
    return (activity.maxAge === null || activity.maxAge >= 18) && activity.genderRestriction === null;
  }
  const age = new Date(activity.startsAt).getFullYear() - child.birthYear;
  return (
    (activity.minAge === null || age >= activity.minAge) &&
    (activity.maxAge === null || age <= activity.maxAge) &&
    (activity.genderRestriction === null || child.gender === activity.genderRestriction)
  );
}

// A child's fiche sportive counts for sport activities of the year the
// parental consent was given in (renewed each season).
export function hasValidSportFile(child: MemberChild, year: number): boolean {
  const f = child.sportFile;
  return (
    !!f?.parentalConsentAt &&
    new Date(f.parentalConsentAt).getFullYear() === year &&
    f.emergencyContactPhone.trim() !== ""
  );
}

export const JERSEY_SIZES = ["YXS", "YS", "YM", "YL", "S", "M", "L", "XL"];

export const GENDER_RESTRICTION_LABEL_KEYS: Record<"feminin" | "masculin", TranslationKey> = {
  feminin: "activity.genderGirls",
  masculin: "activity.genderBoys",
};
