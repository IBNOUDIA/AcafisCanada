import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  LogIn,
  ShieldCheck,
  UserCheck,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { PAYMENT_INTERAC_INFO } from "../data/acafisData";
import { useTranslation } from "../i18n/translations";
import { useLanguage } from "../i18n/LanguageContext";
import { MEMBER_STORAGE_KEY } from "../lib/memberSession";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCardModal: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onOpenCardModal,
}) => {
  const { t } = useTranslation();
  const { localizePath } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [memberId, setMemberId] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, memberId }),
      });
      const data = await response.json();
      if (response.ok) {
        setFirstName(data.member?.firstName || "");
        localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(data.member));
        setIsLogged(true);
      } else {
        setError(data.error || t("authModal.errorGeneric"));
      }
    } catch {
      setError(t("authModal.errorGeneric"));
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
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label={t("common.close")}
        >
          <X className="w-5 h-5" />
        </button>

        {isLogged ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <UserCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              {t("authModal.welcomeTitle")}
            </h3>
            <p className="text-xs text-slate-600">
              {t("authModal.welcomeDesc1")} <strong>{firstName || email}</strong>{t("authModal.welcomeDesc2")}
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
              <h3 className="text-xl font-bold text-slate-900 font-display">
                {t("authModal.title")}
              </h3>
              <p className="text-xs text-slate-500">
                {t("authModal.desc")}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t("authModal.labelEmail")}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
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
                  {t("authModal.labelPassword")}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    placeholder="Ex: ACAFIS-2026-XXXX"
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
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? t("authModal.loggingIn") : t("authModal.loginBtn")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

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
