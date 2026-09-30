import React from "react";
import { useTranslation, TranslationKey } from "../../i18n/translations";
import { SurveyQuestionResult } from "../../lib/surveys";

export interface SurveyResults {
  respondents: number;
  questions: SurveyQuestionResult[];
}

export const YES_NO_LABEL_KEYS: Record<string, TranslationKey> = {
  oui: "surveys.yes",
  non: "surveys.no",
  abstention: "surveys.abstain",
};

// One horizontal bar per choice, single hue: the bars compare shares of the
// same question, so there's no series identity to encode. Values are printed
// next to each bar and repeated in the hover title.
export const SurveyResultBars: React.FC<{ results: SurveyResults; showTexts: boolean }> = ({ results, showTexts }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      {results.questions.map((q, index) => (
        <div key={q.questionId} className="space-y-2">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {index + 1}. {q.label}
            </p>
            <p className="text-[11px] text-slate-500">
              {q.answered} {t("surveys.responsesCount")}
              {q.type === "multiple" && ` · ${t("surveys.multipleHint")}`}
            </p>
          </div>

          {q.type === "text" ? (
            showTexts ? (
              q.texts.length === 0 ? (
                <p className="text-xs text-slate-400">{t("surveys.noAnswers")}</p>
              ) : (
                <ul className="space-y-1.5 max-h-72 overflow-y-auto">
                  {q.texts.map((text, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 whitespace-pre-wrap"
                    >
                      {text}
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <p className="text-xs text-slate-500">
                {q.answered} {t("surveys.textWithheld")}
              </p>
            )
          ) : (
            <ul className="space-y-1.5">
              {q.counts.map(({ option, count }) => {
                const pct = q.answered > 0 ? Math.round((count / q.answered) * 100) : 0;
                const label = q.type === "yesno" ? t(YES_NO_LABEL_KEYS[option]) : option;
                return (
                  <li
                    key={option}
                    title={`${label} : ${count} / ${q.answered} (${pct} %)`}
                    className="grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,14rem)_1fr_auto] items-center gap-x-3 gap-y-1"
                  >
                    <span className="text-xs text-slate-700 truncate">{label}</span>
                    <span className="order-last col-span-2 sm:order-none sm:col-span-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <span
                        className="block h-full bg-emerald-600 rounded-r-[4px]"
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="text-xs font-semibold text-slate-900 tabular-nums text-right">
                      {count} · {pct} %
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};
