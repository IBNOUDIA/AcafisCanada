import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { UserCheck, ShieldCheck, Mail, Phone, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslation } from "../i18n/translations";
import { useLanguage } from "../i18n/LanguageContext";

interface ClaimInfo {
  firstName: string;
  lastName: string;
  membershipYear: number;
}

export const ClaimProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { localizePath } = useLanguage();
  const { token } = useParams<{ token: string }>();

  const [status, setStatus] = useState<"loading" | "ready" | "invalid" | "done">("loading");
  const [info, setInfo] = useState<ClaimInfo | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmedMemberId, setConfirmedMemberId] = useState("");

  useEffect(() => {
    document.title = `${t("claimProfile.title")} — ACAFIS Canada`;
  }, [t]);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    fetch("/api/members/claim/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json().then((body) => ({ ok: res.ok, body })))
      .then(({ ok, body }) => {
        if (!ok) {
          setStatus("invalid");
          setError(body.error || t("claimProfile.errorGeneric"));
          return;
        }
        setInfo(body);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("invalid");
        setError(t("claimProfile.errorGeneric"));
      });
    // Deliberately only re-runs when the token itself changes: `t` is a new
    // function reference on every render, and including it here would re-run
    // this fetch after every state update — including the one right after a
    // successful claim, which would immediately overwrite the success screen
    // with a fresh "already confirmed" result.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/members/claim/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, phone, city }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || t("claimProfile.errorGeneric"));
        return;
      }
      setConfirmedMemberId(data.memberId || "");
      setStatus("done");
    } catch {
      setError(t("claimProfile.errorGeneric"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-sky-50 via-white to-sky-100/50 min-h-[70vh]">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-tr from-slate-950 via-emerald-950 to-teal-900 text-white p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-lg font-extrabold font-display">{t("claimProfile.title")}</h1>
          </div>

          <div className="p-6 sm:p-8">
            {status === "loading" && (
              <p className="text-sm text-slate-500 text-center py-6">{t("claimProfile.loading")}</p>
            )}

            {status === "invalid" && (
              <div className="text-center py-4 space-y-3">
                <p className="text-sm font-semibold text-red-600">{error || t("claimProfile.errorGeneric")}</p>
                <p className="text-xs text-slate-500">{t("claimProfile.invalidHelp")}</p>
              </div>
            )}

            {status === "ready" && info && (
              <>
                <p className="text-sm text-slate-700 text-center mb-1">
                  {t("claimProfile.greeting")} <strong>{info.firstName} {info.lastName}</strong>,
                </p>
                <p className="text-xs text-slate-500 text-center mb-6">
                  {t("claimProfile.memberSince")} {info.membershipYear}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t("claimProfile.labelEmail")}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre.nom@exemple.ca"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t("claimProfile.labelPhone")}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (514) 000-0000"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t("claimProfile.labelCity")}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Montréal"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <span>{isSubmitting ? t("claimProfile.submitting") : t("claimProfile.submit")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}

            {status === "done" && (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display">{t("claimProfile.doneTitle")}</h3>
                <p className="text-xs text-slate-600">{t("claimProfile.doneDesc")}</p>
                {confirmedMemberId && (
                  <div className="inline-block bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                    <span className="block text-[10px] uppercase tracking-wider text-emerald-700 font-bold">
                      {t("claimProfile.memberNumberLabel")}
                    </span>
                    <span className="text-sm font-extrabold text-emerald-900">{confirmedMemberId}</span>
                  </div>
                )}
                <div className="pt-2">
                  <Link
                    to={localizePath("/espace-membre")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    {t("claimProfile.goToLogin")}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
