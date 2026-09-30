import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, BarChart3, Download, Send, Lock, LockOpen, Mail } from "lucide-react";
import { useTranslation, TranslationKey } from "../../i18n/translations";
import {
  SURVEY_QUESTION_TYPES,
  SurveyAnswers,
  SurveyQuestion,
  SurveyQuestionType,
  SurveyStatus,
  newQuestionId,
} from "../../lib/surveys";
import { toDateTimeLocal } from "../AdminActivityParts";
import { SurveyResultBars, SurveyResults, YES_NO_LABEL_KEYS } from "./SurveyResultBars";

interface AdminSurvey {
  id: string;
  title: string;
  description: string | null;
  questions: SurveyQuestion[];
  isAnonymous: boolean;
  resultsVisible: boolean;
  status: SurveyStatus;
  state: SurveyStatus;
  closesAt: string | null;
  publishedAt: string | null;
  participantCount: number;
}

interface AdminSurveyResults extends SurveyResults {
  responses: Array<{ member: string | null; answers: SurveyAnswers }>;
}

// Editor state: choices are edited as one-per-line text.
interface EditorQuestion {
  id: string;
  type: SurveyQuestionType;
  label: string;
  required: boolean;
  optionsText: string;
}

interface EditorState {
  id?: string;
  locked: boolean; // published: only closing date and results visibility can change
  title: string;
  description: string;
  isAnonymous: boolean;
  resultsVisible: boolean;
  closesAt: string;
  questions: EditorQuestion[];
}

const TYPE_LABEL_KEYS: Record<SurveyQuestionType, TranslationKey> = {
  single: "surveys.type.single",
  multiple: "surveys.type.multiple",
  yesno: "surveys.type.yesno",
  text: "surveys.type.text",
};

const STATE_STYLES: Record<SurveyStatus, { key: TranslationKey; className: string }> = {
  draft: { key: "surveys.draft", className: "bg-slate-200 text-slate-700" },
  open: { key: "surveys.open", className: "bg-emerald-100 text-emerald-800" },
  closed: { key: "surveys.closed", className: "bg-slate-800 text-white" },
};

const INPUT = "w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white";

function blankQuestion(): EditorQuestion {
  return { id: newQuestionId(), type: "single", label: "", required: true, optionsText: "" };
}

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export const AdminSurveys: React.FC<{ token: string }> = ({ token }) => {
  const { t, lang } = useTranslation();
  const [surveys, setSurveys] = useState<AdminSurvey[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [resultsView, setResultsView] = useState<{ survey: AdminSurvey; results: AdminSurveyResults } | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [announcingId, setAnnouncingId] = useState<string | null>(null);

  const post = async (action: string, body: Record<string, unknown>) => {
    const response = await fetch(`/api/admin/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, ...body }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || t("admin.errorGeneric"));
    return data;
  };

  const load = () =>
    post("surveys-list", {})
      .then((data) => {
        setSurveys(data.surveys || []);
        setMemberCount(data.memberCount || 0);
      })
      .catch(() => {});

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const run = async (action: string, body: Record<string, unknown>) => {
    setError("");
    try {
      await post(action, body);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  // First announcement and later reminders are the same action: the server
  // only emails members who haven't answered yet.
  const announce = async (survey: AdminSurvey) => {
    const remaining = Math.max(0, memberCount - survey.participantCount);
    if (!window.confirm(t("surveys.announceConfirm").replace("{count}", String(remaining)))) return;
    setError("");
    setNotice("");
    setAnnouncingId(survey.id);
    try {
      const data = await post("surveys-announce", { id: survey.id });
      setNotice(t("surveys.announceSent").replace("{count}", String(data.sent)));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAnnouncingId(null);
    }
  };

  const startNew = () => {
    setError("");
    setEditor({
      locked: false,
      title: "",
      description: "",
      isAnonymous: false,
      resultsVisible: false,
      closesAt: "",
      questions: [blankQuestion()],
    });
  };

  const startEdit = (s: AdminSurvey) => {
    setError("");
    setEditor({
      id: s.id,
      locked: s.status !== "draft",
      title: s.title,
      description: s.description || "",
      isAnonymous: s.isAnonymous,
      resultsVisible: s.resultsVisible,
      closesAt: s.closesAt ? toDateTimeLocal(s.closesAt) : "",
      questions: s.questions.map((q) => ({ ...q, optionsText: q.options.join("\n") })),
    });
  };

  const updateQuestion = (index: number, fields: Partial<EditorQuestion>) =>
    setEditor((prev) =>
      prev && { ...prev, questions: prev.questions.map((q, i) => (i === index ? { ...q, ...fields } : q)) }
    );

  const moveQuestion = (index: number, delta: number) =>
    setEditor((prev) => {
      if (!prev) return prev;
      const questions = [...prev.questions];
      const [moved] = questions.splice(index, 1);
      questions.splice(index + delta, 0, moved);
      return { ...prev, questions };
    });

  const saveEditor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;
    setError("");
    try {
      await post("surveys-save", {
        id: editor.id,
        title: editor.title,
        description: editor.description,
        isAnonymous: editor.isAnonymous,
        resultsVisible: editor.resultsVisible,
        // datetime-local has no timezone: converted here as the admin's local time.
        closesAt: editor.closesAt ? new Date(editor.closesAt).toISOString() : null,
        questions: editor.questions.map((q) => ({
          id: q.id,
          type: q.type,
          label: q.label,
          required: q.required,
          options:
            q.type === "single" || q.type === "multiple"
              ? q.optionsText
                  .split("\n")
                  .map((o) => o.trim())
                  .filter(Boolean)
              : [],
        })),
      });
      setEditor(null);
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const openResults = async (survey: AdminSurvey) => {
    setError("");
    try {
      const data = await post("surveys-results", { id: survey.id });
      setResultsView({ survey, results: data.results });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const exportCsv = () => {
    if (!resultsView) return;
    const { survey, results } = resultsView;
    const format = (q: SurveyQuestion, value: string | string[] | undefined) => {
      if (value === undefined) return "";
      if (Array.isArray(value)) return value.join(" | ");
      return q.type === "yesno" ? t(YES_NO_LABEL_KEYS[value]) : value;
    };
    const header = [t("surveys.csvMember"), ...survey.questions.map((q, i) => `${i + 1}. ${q.label}`)];
    const rows = results.responses.map((r) => [
      r.member ?? t("surveys.csvAnonymous"),
      ...survey.questions.map((q) => format(q, r.answers[q.id])),
    ]);
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    // BOM so Excel opens the accents correctly.
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const slug = survey.title
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    a.download = `sondage-${slug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const dateLocale = lang === "en" ? "en-CA" : "fr-CA";
  const errorBox = error && (
    <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
  );

  // ---------------------------------------------------------------- results
  if (resultsView) {
    const { survey, results } = resultsView;
    const rate = memberCount > 0 ? Math.round((survey.participantCount / memberCount) * 100) : 0;
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500">{t("surveys.resultsBtn")}</p>
            <h2 className="text-base font-bold text-slate-900 font-display">{survey.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            {results.respondents > 0 && (
              <button
                onClick={exportCsv}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {t("surveys.exportCsv")}
              </button>
            )}
            <button
              onClick={() => setResultsView(null)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer"
            >
              {t("surveys.back")}
            </button>
          </div>
        </div>

        <div className="inline-block p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="block text-[11px] uppercase tracking-wider font-bold text-slate-500">
            {t("surveys.participation")}
          </span>
          <span className="text-2xl font-extrabold text-slate-900 tabular-nums">{rate} %</span>
          <span className="block text-xs text-slate-500">
            {survey.participantCount} / {memberCount} {t("surveys.membersWord")}
            {survey.isAnonymous && ` · ${t("surveys.anonymous")}`}
          </span>
        </div>

        {results.respondents === 0 ? (
          <p className="text-xs text-slate-500">{t("surveys.noAnswers")}</p>
        ) : (
          <SurveyResultBars results={results} showTexts />
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------- editor
  if (editor) {
    const locked = editor.locked;
    return (
      <form onSubmit={saveEditor} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 font-display">
          {editor.id ? editor.title || t("surveys.title") : t("surveys.newBtn")}
        </h2>
        {locked && (
          <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            {t("surveys.lockedNote")}
          </p>
        )}

        <input
          type="text"
          required
          disabled={locked}
          maxLength={200}
          value={editor.title}
          onChange={(e) => setEditor({ ...editor, title: e.target.value })}
          placeholder={t("surveys.titleLabel")}
          className={`${INPUT} disabled:bg-slate-100`}
        />
        <textarea
          disabled={locked}
          rows={2}
          value={editor.description}
          onChange={(e) => setEditor({ ...editor, description: e.target.value })}
          placeholder={t("surveys.descLabel")}
          className={`${INPUT} disabled:bg-slate-100`}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                disabled={locked}
                checked={editor.isAnonymous}
                onChange={(e) => setEditor({ ...editor, isAnonymous: e.target.checked })}
                className="mt-0.5 accent-slate-900"
              />
              {t("surveys.anonymousLabel")}
            </label>
            <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={editor.resultsVisible}
                onChange={(e) => setEditor({ ...editor, resultsVisible: e.target.checked })}
                className="mt-0.5 accent-slate-900"
              />
              {t("surveys.resultsVisibleLabel")}
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t("surveys.closesAtLabel")}</span>
            <input
              type="datetime-local"
              value={editor.closesAt}
              onChange={(e) => setEditor({ ...editor, closesAt: e.target.value })}
              className={INPUT}
            />
          </label>
        </div>

        <ol className="space-y-3">
          {editor.questions.map((q, index) => (
            <li key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  {t("surveys.question")} {index + 1}
                </span>
                <select
                  disabled={locked}
                  value={q.type}
                  onChange={(e) => updateQuestion(index, { type: e.target.value as SurveyQuestionType })}
                  className="px-2 py-1 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  {SURVEY_QUESTION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {t(TYPE_LABEL_KEYS[type])}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={locked}
                    checked={q.required}
                    onChange={(e) => updateQuestion(index, { required: e.target.checked })}
                    className="accent-slate-900"
                  />
                  {t("surveys.requiredLabel")}
                </label>
                {!locked && (
                  <span className="ml-auto flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveQuestion(index, -1)}
                      aria-label={t("surveys.moveUp")}
                      className="p-1 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === editor.questions.length - 1}
                      onClick={() => moveQuestion(index, 1)}
                      aria-label={t("surveys.moveDown")}
                      className="p-1 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={editor.questions.length === 1}
                      onClick={() =>
                        setEditor({ ...editor, questions: editor.questions.filter((_, i) => i !== index) })
                      }
                      aria-label={t("surveys.removeQuestion")}
                      className="p-1 rounded text-slate-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                disabled={locked}
                maxLength={300}
                value={q.label}
                onChange={(e) => updateQuestion(index, { label: e.target.value })}
                placeholder={t("surveys.questionLabel")}
                className={`${INPUT} disabled:bg-slate-100`}
              />
              {(q.type === "single" || q.type === "multiple") && (
                <textarea
                  required
                  disabled={locked}
                  rows={4}
                  value={q.optionsText}
                  onChange={(e) => updateQuestion(index, { optionsText: e.target.value })}
                  placeholder={t("surveys.optionsLabel")}
                  className={`${INPUT} disabled:bg-slate-100`}
                />
              )}
              {q.type === "yesno" && (
                <p className="text-[11px] text-slate-500">
                  {t("surveys.yes")} / {t("surveys.no")} / {t("surveys.abstain")}
                </p>
              )}
            </li>
          ))}
        </ol>

        {!locked && (
          <button
            type="button"
            onClick={() => setEditor({ ...editor, questions: [...editor.questions, blankQuestion()] })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {t("surveys.addQuestion")}
          </button>
        )}

        {errorBox}

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer"
          >
            {t("surveys.saveDraft")}
          </button>
          <button
            type="button"
            onClick={() => setEditor(null)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
          >
            {t("admin.cancel")}
          </button>
        </div>
      </form>
    );
  }

  // ---------------------------------------------------------------- list
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 font-display">{t("surveys.title")}</h2>
          <p className="text-xs text-slate-500">{t("surveys.adminDesc")}</p>
        </div>
        <button
          onClick={startNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {t("surveys.newBtn")}
        </button>
      </div>

      {errorBox}
      {notice && (
        <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
          {notice}
        </p>
      )}

      {surveys.length === 0 ? (
        <p className="text-xs text-slate-500">{t("surveys.empty")}</p>
      ) : (
        <ul className="space-y-3">
          {surveys.map((s) => {
            const style = STATE_STYLES[s.state];
            const rate = memberCount > 0 ? Math.round((s.participantCount / memberCount) * 100) : 0;
            return (
              <li key={s.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${style.className}`}>{t(style.key)}</span>
                      {s.isAnonymous && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-800">
                          {t("surveys.anonymous")}
                        </span>
                      )}
                      {s.resultsVisible && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                          {t("surveys.resultsPublic")}
                        </span>
                      )}
                      {s.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {s.questions.length} {t("surveys.questionsWord")}
                      {s.status !== "draft" && (
                        <>
                          {" · "}
                          {t("surveys.participation")} : {s.participantCount} / {memberCount} ({rate} %)
                        </>
                      )}
                      {s.closesAt && (
                        <>
                          {" · "}
                          {t("surveys.until")}{" "}
                          {new Date(s.closesAt).toLocaleString(dateLocale, { dateStyle: "long", timeStyle: "short" })}
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {s.status === "draft" && (
                      <button
                        onClick={() => window.confirm(t("surveys.publishConfirm")) && run("surveys-set-status", { id: s.id, status: "open" })}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {t("surveys.publishBtn")}
                      </button>
                    )}
                    {s.state === "open" && (
                      <button
                        onClick={() => announce(s)}
                        disabled={announcingId === s.id}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 cursor-pointer disabled:opacity-60"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {s.participantCount > 0 ? t("surveys.remindBtn") : t("surveys.announceBtn")}
                      </button>
                    )}
                    {s.state === "open" && (
                      <button
                        onClick={() => run("surveys-set-status", { id: s.id, status: "closed" })}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        {t("surveys.closeBtn")}
                      </button>
                    )}
                    {s.state === "closed" && (
                      <button
                        onClick={() => run("surveys-set-status", { id: s.id, status: "open" })}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 cursor-pointer"
                      >
                        <LockOpen className="w-3.5 h-3.5" />
                        {t("surveys.reopenBtn")}
                      </button>
                    )}
                    {s.status !== "draft" && (
                      <button
                        onClick={() => openResults(s)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        {t("surveys.resultsBtn")}
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(s)}
                      title={t("admin.edit")}
                      aria-label={t("admin.edit")}
                      className="p-2 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => window.confirm(t("surveys.deleteConfirm")) && run("surveys-delete", { id: s.id })}
                      title={t("admin.delete")}
                      aria-label={t("admin.delete")}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
