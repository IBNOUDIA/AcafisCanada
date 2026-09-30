import type { TranslationKey } from "../i18n/translations";
import type { WorkshopCategory } from "../types";

export const ACTIVITY_CATEGORIES: WorkshopCategory[] = ["ntic", "sport"];

export const ACTIVITY_CATEGORY_LABEL_KEYS: Record<WorkshopCategory, TranslationKey> = {
  ntic: "activity.categoryNtic",
  sport: "activity.categorySport",
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

// Mirrors the check in register_for_workshop (supabase/schema.sql): a child's
// age is counted in the activity's year, and the member themself is an adult.
export function isEligibleForActivity(
  activity: { startsAt: string; minAge: number | null; maxAge: number | null },
  birthYear: number | null
): boolean {
  if (birthYear === null) return activity.maxAge === null || activity.maxAge >= 18;
  const age = new Date(activity.startsAt).getFullYear() - birthYear;
  return (activity.minAge === null || age >= activity.minAge) && (activity.maxAge === null || age <= activity.maxAge);
}
