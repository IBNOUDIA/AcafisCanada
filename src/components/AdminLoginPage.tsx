import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";
import { useTranslation } from "../i18n/translations";
import { useLanguage } from "../i18n/LanguageContext";
import { ADMIN_SESSION_KEY } from "../lib/adminSession";

export const AdminLoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { localizePath } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = `${t("admin.loginTitle")} — ACAFIS Canada`;
  }, [t]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(data));
        navigate(localizePath("/admin"));
      } else {
        setError(data.error || t("admin.errorGeneric"));
      }
    } catch {
      setError(t("admin.errorGeneric"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-100 via-white to-slate-100 min-h-[70vh] flex items-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 font-display">{t("admin.loginTitle")}</h1>
            <p className="text-xs text-slate-500">{t("admin.loginDesc")}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t("admin.labelEmail")}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t("admin.labelPassword")}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
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
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{isSubmitting ? t("admin.loggingIn") : t("admin.loginBtn")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
