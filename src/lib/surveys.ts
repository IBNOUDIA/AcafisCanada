// Survey model shared by the server (validation, aggregation) and the UI
// (editor, answer form, results). Questions are stored as JSON on the survey
// row and frozen once the survey is published, so every response answers the
// same questions.

export type SurveyQuestionType = "single" | "multiple" | "yesno" | "text";

export const SURVEY_QUESTION_TYPES: SurveyQuestionType[] = ["single", "multiple", "yesno", "text"];

export interface SurveyQuestion {
  id: string;
  type: SurveyQuestionType;
  label: string;
  required: boolean;
  // Choices for "single" / "multiple"; empty for the other types.
  options: string[];
}

// questionId -> chosen option (single, yesno), chosen options (multiple) or text.
export type SurveyAnswers = Record<string, string | string[]>;

export type SurveyStatus = "draft" | "open" | "closed";

export const YES_NO_OPTIONS = ["oui", "non", "abstention"] as const;

export const SURVEY_LIMITS = {
  questions: 50,
  options: 20,
  labelLength: 300,
  optionLength: 200,
  textAnswerLength: 2000,
};

// A survey past its closing date counts as closed even before the Bureau
// flips its status, so answers stop at the announced time.
export function effectiveSurveyStatus(status: SurveyStatus, closesAt: string | null): SurveyStatus {
  if (status === "open" && closesAt && new Date(closesAt).getTime() <= Date.now()) return "closed";
  return status;
}

export function newQuestionId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// Checks the question list an admin saves; returns an error message or null.
export function validateQuestions(questions: unknown): string | null {
  if (!Array.isArray(questions) || questions.length === 0) return "Le sondage doit contenir au moins une question.";
  if (questions.length > SURVEY_LIMITS.questions) return `Au plus ${SURVEY_LIMITS.questions} questions.`;

  const ids = new Set<string>();
  for (const [index, q] of questions.entries()) {
    const n = index + 1;
    if (!q || typeof q !== "object") return `Question ${n} invalide.`;
    const { id, type, label, required, options } = q as Record<string, unknown>;
    if (typeof id !== "string" || !id || ids.has(id)) return `Question ${n} : identifiant invalide.`;
    ids.add(id);
    if (!SURVEY_QUESTION_TYPES.includes(type as SurveyQuestionType)) return `Question ${n} : type invalide.`;
    if (typeof label !== "string" || !label.trim() || label.length > SURVEY_LIMITS.labelLength) {
      return `Question ${n} : l'intitulé est requis (${SURVEY_LIMITS.labelLength} caractères au plus).`;
    }
    if (typeof required !== "boolean") return `Question ${n} : réglage « obligatoire » invalide.`;
    if (!Array.isArray(options)) return `Question ${n} : choix invalides.`;
    if (type === "single" || type === "multiple") {
      const cleaned = options.map((o) => (typeof o === "string" ? o.trim() : ""));
      if (cleaned.length < 2 || cleaned.length > SURVEY_LIMITS.options) {
        return `Question ${n} : entre 2 et ${SURVEY_LIMITS.options} choix.`;
      }
      if (cleaned.some((o) => !o || o.length > SURVEY_LIMITS.optionLength)) return `Question ${n} : un choix est vide ou trop long.`;
      if (new Set(cleaned).size !== cleaned.length) return `Question ${n} : deux choix sont identiques.`;
    }
  }
  return null;
}

// Normalizes the stored shape (trims, drops options on types without choices).
export function cleanQuestions(questions: SurveyQuestion[]): SurveyQuestion[] {
  return questions.map((q) => ({
    id: q.id,
    type: q.type,
    label: q.label.trim(),
    required: q.required,
    options: q.type === "single" || q.type === "multiple" ? q.options.map((o) => o.trim()) : [],
  }));
}

// Checks a member's answers against the questions. Returns the cleaned
// answers (unknown or empty ones dropped) or an error message.
export function validateAnswers(
  questions: SurveyQuestion[],
  answers: unknown
): { answers: SurveyAnswers } | { error: string } {
  const input = answers && typeof answers === "object" ? (answers as Record<string, unknown>) : {};
  const cleaned: SurveyAnswers = {};

  for (const [index, q] of questions.entries()) {
    const n = index + 1;
    const value = input[q.id];
    const isEmpty =
      value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);

    if (isEmpty) {
      if (q.required) return { error: `La question ${n} est obligatoire.` };
      continue;
    }

    if (q.type === "single") {
      if (typeof value !== "string" || !q.options.includes(value)) return { error: `Question ${n} : choix invalide.` };
      cleaned[q.id] = value;
    } else if (q.type === "yesno") {
      if (typeof value !== "string" || !(YES_NO_OPTIONS as readonly string[]).includes(value)) {
        return { error: `Question ${n} : réponse invalide.` };
      }
      cleaned[q.id] = value;
    } else if (q.type === "multiple") {
      if (!Array.isArray(value) || value.some((v) => typeof v !== "string" || !q.options.includes(v))) {
        return { error: `Question ${n} : choix invalide.` };
      }
      cleaned[q.id] = [...new Set(value as string[])];
    } else {
      if (typeof value !== "string") return { error: `Question ${n} : réponse invalide.` };
      const text = value.trim().slice(0, SURVEY_LIMITS.textAnswerLength);
      if (!text) {
        if (q.required) return { error: `La question ${n} est obligatoire.` };
        continue;
      }
      cleaned[q.id] = text;
    }
  }

  return { answers: cleaned };
}

export interface SurveyQuestionResult {
  questionId: string;
  type: SurveyQuestionType;
  label: string;
  // How many responses answered this question (the percentage base).
  answered: number;
  // Choice questions: one entry per option, in the question's option order.
  counts: Array<{ option: string; count: number }>;
  // Text questions (admin only — withheld from members to protect authors).
  texts: string[];
}

export function aggregateSurveyResults(
  questions: SurveyQuestion[],
  responses: SurveyAnswers[],
  includeTexts: boolean
): SurveyQuestionResult[] {
  return questions.map((q) => {
    const values = responses.map((r) => r[q.id]).filter((v) => v !== undefined);
    const options = q.type === "yesno" ? [...YES_NO_OPTIONS] : q.options;
    const counts =
      q.type === "text"
        ? []
        : options.map((option) => ({
            option,
            count: values.filter((v) => (Array.isArray(v) ? v.includes(option) : v === option)).length,
          }));
    return {
      questionId: q.id,
      type: q.type,
      label: q.label,
      answered: values.length,
      counts,
      texts: q.type === "text" && includeTexts ? values.map(String) : [],
    };
  });
}
