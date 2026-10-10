import React, { useEffect, useState } from "react";
import { Send, FlaskConical } from "lucide-react";
import { useTranslation, TranslationKey } from "../i18n/translations";

type Audience = "all" | "coop" | "paid";

interface HistoryRow {
  id: string;
  subject: string;
  audience: Audience;
  sentCount: number;
  sentBy: string;
  createdAt: string;
}

const AUDIENCE_KEYS: Record<Audience, TranslationKey> = {
  all: "messages.audienceAll",
  coop: "messages.audienceCoop",
  paid: "messages.audiencePaid",
};

// Resend's free plan allows 100 emails a day.
const DAILY_QUOTA = 100;
const INPUT =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-hidden focus:border-slate-600 focus:ring-1 focus:ring-slate-600";

// Admin "Messages" tab: one email to a group of members, personalized with
// each first name, sent from notifications@acafis.ca with replies going to
// infos@acafis.ca. Recipients never see each other's addresses.
export const AdminMessages: React.FC<{ token: string }> = ({ token }) => {
  const { t, lang } = useTranslation();
  const [audiences, setAudiences] = useState<Record<Audience, number> | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [audience, setAudience] = useState<Audience>("all");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState<"test" | "send" | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const post = async (action: string, payload: Record<string, unknown>) => {
    const response = await fetch(`/api/admin/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, ...payload }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || t("admin.errorGeneric"));
    return data;
  };

  const load = () =>
    post("messages-list", {})
      .then((data) => {
        setAudiences(data.audiences);
        setHistory(data.history || []);
      })
      .catch(() => {});

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const count = audiences?.[audience] ?? 0;

  const send = async (test: boolean) => {
    setError("");
    setNotice("");
    if (!test) {
      const question = t("messages.confirm")
        .replace("{count}", String(count))
        .replace("{group}", t(AUDIENCE_KEYS[audience]).toLowerCase());
      if (!window.confirm(question)) return;
    }
    setBusy(test ? "test" : "send");
    try {
      const data = await post("messages-send", { subject, body, audience, test });
      if (test) {
        setNotice(t("messages.testSent"));
      } else {
        setNotice(t("messages.sent").replace("{count}", String(data.sent)));
        setSubject("");
        setBody("");
        load();
      }
    } catch (err) {
      setError((err as Error).message);
      if (!test) load();
    } finally {
      setBusy(null);
    }
  };

  const ready = subject.trim() !== "" && body.trim() !== "";

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(false);
        }}
        className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4"
      >
        <div>
          <h2 className="text-sm font-bold text-slate-900 font-display">{t("messages.title")}</h2>
          <p className="text-xs text-slate-500">{t("messages.desc")}</p>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t("messages.audienceLabel")}</legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(Object.keys(AUDIENCE_KEYS) as Audience[]).map((a) => (
              <label
                key={a}
                className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm cursor-pointer has-[:checked]:border-slate-900 has-[:checked]:bg-white"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="message-audience"
                    checked={audience === a}
                    onChange={() => setAudience(a)}
                    className="accent-slate-900"
                  />
                  {t(AUDIENCE_KEYS[a])}
                </span>
                <span className="text-xs font-bold text-slate-600 tabular-nums">{audiences ? audiences[a] : "…"}</span>
              </label>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">{t("messages.audienceNote")}</p>
        </fieldset>

        <input
          id="message-subject"
          type="text"
          required
          maxLength={150}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={t("messages.subjectLabel")}
          aria-label={t("messages.subjectLabel")}
          className={INPUT}
        />

        <div className="space-y-1">
          <p className="text-xs text-slate-500">
            {t("messages.greetingNote")} <span className="font-semibold text-slate-700">« {t("messages.greetingExample")} »</span>
          </p>
          <textarea
            id="message-body"
            required
            rows={10}
            maxLength={5000}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t("messages.bodyPlaceholder")}
            aria-label={t("messages.bodyLabel")}
            className={INPUT}
          />
          <p className="text-[11px] text-slate-500 text-right tabular-nums">{body.length} / 5000</p>
        </div>

        {count > DAILY_QUOTA && (
          <p className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            {t("messages.quotaWarning").replace("{count}", String(count))}
          </p>
        )}
        {error && (
          <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
        )}
        {notice && (
          <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
            {notice}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={!ready || busy !== null}
            onClick={() => send(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-default"
          >
            <FlaskConical className="w-4 h-4" />
            {t("messages.testBtn")}
          </button>
          <button
            type="submit"
            disabled={!ready || busy !== null || count === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-default"
          >
            <Send className="w-4 h-4" />
            {busy === "send" ? t("messages.sending") : t("messages.sendBtn").replace("{count}", String(count))}
          </button>
        </div>
      </form>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-3 overflow-x-auto">
        <h3 className="text-sm font-bold text-slate-900 font-display">{t("messages.historyTitle")}</h3>
        {history.length === 0 ? (
          <p className="text-xs text-slate-500">{t("messages.historyEmpty")}</p>
        ) : (
          <table className="w-full text-xs min-w-[560px]">
            <thead>
              <tr className="text-left text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="py-2 pr-3 font-bold">{t("messages.colDate")}</th>
                <th className="py-2 pr-3 font-bold">{t("messages.subjectLabel")}</th>
                <th className="py-2 pr-3 font-bold">{t("messages.audienceLabel")}</th>
                <th className="py-2 pr-3 font-bold text-right">{t("messages.colCount")}</th>
                <th className="py-2 pr-3 font-bold">{t("messages.colSender")}</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="border-b border-slate-50">
                  <td className="py-2 pr-3 text-slate-600 whitespace-nowrap">
                    {new Date(h.createdAt).toLocaleString(lang === "en" ? "en-CA" : "fr-CA", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="py-2 pr-3 font-semibold text-slate-900">{h.subject}</td>
                  <td className="py-2 pr-3 text-slate-600">{t(AUDIENCE_KEYS[h.audience])}</td>
                  <td className="py-2 pr-3 text-slate-900 text-right tabular-nums">{h.sentCount}</td>
                  <td className="py-2 pr-3 text-slate-600">{h.sentBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
