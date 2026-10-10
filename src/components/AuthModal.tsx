import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, LogIn, UserCheck, Mail, KeyRound, ArrowRight } from "lucide-react";
import { PAYMENT_INTERAC_INFO } from "../data/acafisData";
import { useTranslation } from "../i18n/translations";
import { useLanguage } from "../i18n/LanguageContext";
import { MEMBER_STORAGE_KEY } from "../lib/memberSession";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCardModal: () => void;
}

const INPUT_CLASS =
  "w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600";

// Member login in two steps: the member types their email, receives a
// 6-digit code there, and types it back. No password, and the member number
// printed on the card is no longer enough to get in.
export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onOpenCardModal }) => {
  const { t } = useTranslation();
  const { localizePath } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "code" | "done">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  if (!isOpen) return null;

  const post = async (body: Record<string, unknown>) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || t("authModal.errorGeneric"));
    return data;
  };

  const requestCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email) return;
    setError("");
    setNotice("");
    setIsSubmitting(true);
    try {
      await post({ email });
      setStep("code");
      setCode("");
      if (!e) setNotice(t("authModal.codeResent"));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setIsSubmitting(true);
    try {
      const data = await post({ email, code });
      localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify({ ...data.member, sessionToken: data.sessionToken }));
      setFirstName(data.member?.firstName || "");
      setStep("done");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToDashboard = () => {
    onClose();
    navigate(localizePath("/mon-espace-membre"));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label={t("common.close")}
        >
          <X className="w-5 h-5" />
        </button>

        {step === "done" ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <UserCheck className="w-7 h-7" />
            </div>
            <h3 id="auth-modal-title" className="text-xl font-bold text-slate-900 font-display">
              {t("authModal.welcomeTitle")}
            </h3>
            <p className="text-xs text-slate-600">
              {t("authModal.welcomeDesc1")} <strong>{firstName || email}</strong>
              {t("authModal.welcomeDesc2")}
            </p>
            <div className="pt-2">
              <button
                onClick={handleGoToDashboard}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                {t("authModal.dashboardBtn")}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto">
                <LogIn className="w-6 h-6" />
              </div>
              <h3 id="auth-modal-title" className="text-xl font-bold text-slate-900 font-display">
                {t("authModal.title")}
              </h3>
              <p className="text-xs text-slate-500">
                {step === "email" ? t("authModal.desc") : t("authModal.codeSentDesc").replace("{email}", email)}
              </p>
            </div>

            {step === "email" ? (
              <form onSubmit={requestCode} className="space-y-4">
                <div>
                  <label htmlFor="auth-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t("authModal.labelEmail")}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" aria-hidden="true" />
                    <input
                      id="auth-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.nom@exemple.ca"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
                {error && (
                  <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? t("authModal.sendingCode") : t("authModal.sendCodeBtn")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-slate-500 text-center">{t("authModal.noEmailHelp")}</p>
              </form>
            ) : (
              <form onSubmit={verifyCode} className="space-y-4">
                <div>
                  <label htmlFor="auth-code" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t("authModal.labelCode")}
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" aria-hidden="true" />
                    <input
                      id="auth-code"
                      type="text"
                      required
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9 ]{6,7}"
                      maxLength={7}
                      autoFocus
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="123456"
                      className={`${INPUT_CLASS} tracking-[0.3em] font-mono`}
                    />
                  </div>
                </div>
                {error && (
                  <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">{error}</p>
                )}
                {notice && (
                  <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5">
                    {notice}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? t("authModal.loggingIn") : t("authModal.loginBtn")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setError("");
                      setNotice("");
                    }}
                    className="font-semibold text-slate-600 hover:underline cursor-pointer"
                  >
                    {t("authModal.changeEmail")}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => requestCode()}
                    className="font-semibold text-emerald-700 hover:underline cursor-pointer disabled:opacity-60"
                  >
                    {t("authModal.resendCode")}
                  </button>
                </div>
              </form>
            )}

            <div className="pt-4 border-t border-slate-100 text-center text-xs space-y-2">
              <span className="text-slate-500">{t("authModal.notRegistered")}</span>
              <button
                onClick={() => {
                  onClose();
                  onOpenCardModal();
                }}
                className="block mx-auto font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                {t("authModal.generateCard")} ({PAYMENT_INTERAC_INFO.annualFeeCAD}$ CAD) →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
