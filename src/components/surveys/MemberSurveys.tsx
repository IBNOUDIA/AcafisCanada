import React, { useEffect, useState } from "react";
import { ClipboardList, CheckCircle2, Lock } from "lucide-react";
import { useTranslation } from "../../i18n/translations";
import { SurveyAnswers, SurveyQuestion, YES_NO_OPTIONS } from "../../lib/surveys";
import { MemberRecord } from "../../types";
import { SurveyResultBars, SurveyResults, YES_NO_LABEL_KEYS } from "./SurveyResultBars";

interface MemberSurvey {
  id: string;
  title: string;
  description: string | null;
  isAnonymous: boolean;
  closesAt: string | null;
  state: "open" | "closed";
  hasAnswered: boolean;
  resultsAvailable: boolean;
  questions: SurveyQuestion[];
}

const CHOICE_CLASS =
  "flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 cursor-pointer hover:border-emerald-400 has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50";

export const MemberSurveys: React.FC<{ member: MemberRecord }> = ({ member }) => {
  const { t, lang } = useTranslation();
  const [surveys, setSurveys] = useState<MemberSurvey[]>([]);
  const [openFormId, setOpenFormId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, SurveyAnswers>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, SurveyResults | null>>({});
  const credentials = { email: member.email, memberId: member.memberId };

  useEffect(() => {
    fetch("/api/members/surveys/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setSurveys(data.surveys || []))
      .catch(() => setSurveys([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member.memberId]);

  const setAnswer = (surveyId: string, questionId: string, value: string | string[]) =>
    setAnswers((prev) => ({ ...prev, [surveyId]: { ...prev[surveyId], [questionId]: value } }));

  const toggleMultiple = (surveyId: string, questionId: string, option: string) => {
    const current = (answers[surveyId]?.[questionId] as string[] | undefined) || [];
    setAnswer(
      surveyId,
      questionId,
      current.includes(option) ? current.filter((o) => o !== option) : [...current, option]
    );
  };

  const handleSubmit = async (e: React.FormEvent, survey: MemberSurvey) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, [survey.id]: "" }));
    setBusyId(survey.id);
    try {
      const response = await fetch("/api/members/surveys/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...credentials, surveyId: survey.id, answers: answers[survey.id] || {} }),
      });
      const data = await response.json();
      if (response.ok) {
        setSurveys((prev) => prev.map((s) => (s.id === survey.id ? { ...s, hasAnswered: true, questions: [] } : s)));
        setOpenFormId(null);
      } else {
        setErrors((prev) => ({ ...prev, [survey.id]: data.error || t("surveys.error") }));
      }
    } catch {
      setErrors((prev) => ({ ...prev, [survey.id]: t("surveys.error") }));
    } finally {
      setBusyId(null);
    }
  };

  const toggleResults = async (surveyId: string) => {
    if (results[surveyId] !== undefined) {
      setResults((prev) => {
        const next = { ...prev };
        delete next[surveyId];
        return next;
      });
      return;
    }
    try {
      const response = await fetch("/api/members/surveys/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...credentials, surveyId }),
      });
      const data = await response.json();
      setResults((prev) => ({ ...prev, [surveyId]: response.ok ? data.results : null }));
    } catch {
      setResults((prev) => ({ ...prev, [surveyId]: null }));
    }
  };

  const dateLocale = lang === "en" ? "en-CA" : "fr-CA";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4">
      <h2 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
        <ClipboardList className="w-4 h-4 text-emerald-700" />
        {t("surveys.title")}
      </h2>
      <p className="text-xs text-slate-500">{t("surveys.memberDesc")}</p>

      {surveys.length === 0 ? (
        <p className="text-xs text-slate-500">{t("surveys.empty")}</p>
      ) : (
        <ul className="space-y-3">
          {surveys.map((s) => {
            const canAnswer = s.state === "open" && !s.hasAnswered;
            const surveyResults = results[s.id];
            return (
              <li key={s.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{s.title}</p>
                    {s.description && <p className="text-xs text-slate-500 mt-0.5 whitespace-pre-wrap">{s.description}</p>}
                    <p className="text-[11px] text-slate-500 mt-1">
                      {s.isAnonymous ? t("surveys.anonymousNote") : t("surveys.namedNote")}
                      {s.state === "open" && s.closesAt && (
                        <>
                          {" · "}
                          {t("surveys.until")}{" "}
                          {new Date(s.closesAt).toLocaleString(dateLocale, { dateStyle: "long", timeStyle: "short" })}
                        </>
                      )}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      s.state === "open" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {s.state === "open" ? t("surveys.open") : t("surveys.closed")}
                  </span>
                </div>

                {s.hasAnswered && (
                  <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {t("surveys.answered")}
                  </p>
                )}

                {canAnswer && openFormId !== s.id && (
                  <button
                    onClick={() => setOpenFormId(s.id)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors cursor-pointer"
                  >
                    {t("surveys.answerBtn")}
                  </button>
                )}

                {canAnswer && openFormId === s.id && (
                  <form onSubmit={(e) => handleSubmit(e, s)} className="space-y-4 pt-1">
                    {s.questions.map((q, index) => {
                      const value = answers[s.id]?.[q.id];
                      return (
                        <fieldset key={q.id} className="space-y-2">
                          <legend className="text-xs font-semibold text-slate-900 mb-1.5">
                            {index + 1}. {q.label}
                            {q.required && <span className="text-red-600"> *</span>}
                            {q.type === "multiple" && (
                              <span className="font-normal text-slate-500"> ({t("surveys.multipleHint")})</span>
                            )}
                          </legend>

                          {(q.type === "single" || q.type === "yesno") && (
                            <div className={q.type === "yesno" ? "flex flex-wrap gap-2" : "grid gap-1.5"}>
                              {(q.type === "yesno" ? [...YES_NO_OPTIONS] : q.options).map((option) => (
                                <label key={option} className={CHOICE_CLASS}>
                                  <input
                                    type="radio"
                                    name={`${s.id}-${q.id}`}
                                    checked={value === option}
                                    onChange={() => setAnswer(s.id, q.id, option)}
                                    className="accent-emerald-700"
                                  />
                                  {q.type === "yesno" ? t(YES_NO_LABEL_KEYS[option]) : option}
                                </label>
                              ))}
                            </div>
                          )}

                          {q.type === "multiple" && (
                            <div className="grid gap-1.5">
                              {q.options.map((option) => (
                                <label key={option} className={CHOICE_CLASS}>
                                  <input
                                    type="checkbox"
                                    checked={Array.isArray(value) && value.includes(option)}
                                    onChange={() => toggleMultiple(s.id, q.id, option)}
                                    className="accent-emerald-700"
                                  />
                                  {option}
                                </label>
                              ))}
                            </div>
                          )}

                          {q.type === "text" && (
                            <textarea
                              value={typeof value === "string" ? value : ""}
                              onChange={(e) => setAnswer(s.id, q.id, e.target.value)}
                              rows={3}
                              maxLength={2000}
                              placeholder={t("surveys.textPlaceholder")}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                            />
                          )}
                        </fieldset>
                      );
                    })}

                    {errors[s.id] && (
                      <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                        {errors[s.id]}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={busyId === s.id}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors cursor-pointer disabled:opacity-60"
                      >
                        {t("surveys.submitBtn")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenFormId(null)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        {t("admin.cancel")}
                      </button>
                    </div>
                  </form>
                )}

                {s.state === "closed" && !s.resultsAvailable && (
                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    {t("surveys.resultsPrivate")}
                  </p>
                )}

                {s.resultsAvailable && (
                  <div className="space-y-3">
                    <button
                      onClick={() => toggleResults(s.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                    >
                      {surveyResults !== undefined ? t("surveys.hideResults") : t("surveys.seeResults")}
                    </button>
                    {surveyResults && (
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                        <p className="text-xs text-slate-500">
                          {surveyResults.respondents} {t("surveys.respondents")}
                        </p>
                        <SurveyResultBars results={surveyResults} showTexts={false} />
                      </div>
                    )}
                    {surveyResults === null && <p className="text-xs text-red-600">{t("surveys.error")}</p>}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
