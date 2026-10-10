import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserCheck,
  CreditCard,
  Copy,
  CheckCircle2,
  Sparkles,
  Shield,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { PAYMENT_INTERAC_INFO } from "../data/acafisData";
import { MembershipCardView } from "./MembershipCardView";
import { Reveal } from "./Reveal";
import { useTranslation } from "../i18n/translations";
import { useLanguage } from "../i18n/LanguageContext";
import adhesionHeroPhoto from "../assets/images/adhesion-hero.webp";

interface MembershipCardGeneratorProps {
  onOpenPaymentModal: () => void;
}

export const MembershipCardGenerator: React.FC<MembershipCardGeneratorProps> = ({
  onOpenPaymentModal,
}) => {
  const { t, lang } = useTranslation();
  const { localizePath } = useLanguage();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Montréal");
  const [coopInterest, setCoopInterest] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  // Set once the registration request is saved: the visitor then sees what
  // happens next (pay, wait for the treasury), never a printable card.
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [copiedInterac, setCopiedInterac] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenerateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !acceptedPrivacy) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/members/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          city,
          coopInterest,
        }),
      });

      if (!response.ok) throw new Error();
      setSubmittedName(firstName.trim());
    } catch {
      // No made-up member number on failure: the request didn't go through.
      setSubmitError(t("adhesion.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyInteracEmail = () => {
    navigator.clipboard.writeText(PAYMENT_INTERAC_INFO.email);
    setCopiedInterac(true);
    setTimeout(() => setCopiedInterac(false), 2500);
  };

  return (
    <section id="adhesion" className="py-20 bg-gradient-to-b from-sky-50 via-white to-sky-100/50 border-b border-sky-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero photo — a warm welcome for future members */}
        <Reveal className="relative rounded-3xl overflow-hidden mb-12 h-64 sm:h-80 shadow-lg">
          <img
            src={adhesionHeroPhoto}
            alt="Femmes de la communauté ACAFIS réunies, souriantes"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <span className="text-sm sm:text-base font-bold text-white font-display">
              {t("adhesion.photoCaption")}
            </span>
          </div>
        </Reveal>

        {/* Title */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
            <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t("adhesion.badge")}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            {t("adhesion.title")}
          </h2>

          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            {t("adhesion.intro1")} <strong>{t("adhesion.introAmount")}</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-6xl mx-auto">
          
          {/* Form Side */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                {t("adhesion.formTitle")}
              </h3>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                {t("adhesion.formFeeBadge")}
              </span>
            </div>

            <form onSubmit={handleGenerateCard} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t("adhesion.labelFirstName")}
                  </label>
                  <input
                    id="member-input-firstname"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ex: Babacar"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t("adhesion.labelLastName")}
                  </label>
                  <input
                    id="member-input-lastname"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ex: Ndiaye"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t("adhesion.labelEmail")}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="member-input-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="babacar.ndiaye@exemple.ca"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t("adhesion.labelPhone")}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="member-input-phone"
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
                    {t("adhesion.labelCity")}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="member-input-city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={t("adhesion.placeholderCity")}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-2.5 p-3.5 rounded-xl bg-sky-50 border border-sky-200 cursor-pointer">
                <input
                  id="member-input-coop-interest"
                  type="checkbox"
                  checked={coopInterest}
                  onChange={(e) => setCoopInterest(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-emerald-700 shrink-0"
                />
                <span className="text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block">{t("adhesion.coopInterestLabel")}</span>
                  {t("adhesion.coopInterestDesc")}
                </span>
              </label>

              <label className="flex items-start gap-2.5 px-1 cursor-pointer">
                <input
                  id="member-input-accept-privacy"
                  type="checkbox"
                  required
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-emerald-700 shrink-0"
                />
                <span className="text-xs text-slate-600">
                  {t("privacyPolicy.consentPrefix")}{" "}
                  <Link to={localizePath("/politique-confidentialite")} target="_blank" className="text-emerald-700 hover:underline font-semibold">
                    {t("privacyPolicy.consentLinkLabel")}
                  </Link>
                  .
                </span>
              </label>

              <div className="pt-3">
                <button
                  id="member-btn-generate"
                  type="submit"
                  disabled={isSubmitting || !acceptedPrivacy}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isSubmitting ? t("adhesion.generating") : t("adhesion.generateBtn")}</span>
                </button>
                {submitError && (
                  <p className="mt-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5" role="alert">
                    {submitError}
                  </p>
                )}
              </div>

              {/* Interac reminder box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{t("adhesion.interacReminder")}</span>
                  <button
                    type="button"
                    onClick={copyInteracEmail}
                    className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedInterac ? t("common.copied") : t("adhesion.copyEmail")}</span>
                  </button>
                </div>
                <p className="font-mono text-emerald-800 font-semibold">{PAYMENT_INTERAC_INFO.email}</p>
                <p className="text-[11px] text-slate-500">
                  {t("adhesion.secretQuestionLabel")} <strong>{PAYMENT_INTERAC_INFO.secretQuestion[lang]}</strong> | {t("adhesion.secretAnswerLabel")} <strong>{PAYMENT_INTERAC_INFO.secretAnswer}</strong>
                </p>
              </div>
            </form>
          </div>

          {/* Card preview (specimen) or, once submitted, the next steps */}
          <div className="lg:col-span-6 space-y-4">
            {submittedName !== null ? (
              <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-4" role="status">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">{t("adhesion.receivedTitle")}</h3>
                    <p className="text-xs text-slate-600">
                      {t("adhesion.receivedThanks").replace("{name}", submittedName)}
                    </p>
                  </div>
                </div>
                <ol className="space-y-3 text-sm text-slate-700 list-decimal pl-5">
                  <li>
                    {t("adhesion.receivedStepPay")}{" "}
                    <strong className="font-mono text-emerald-800">{PAYMENT_INTERAC_INFO.email}</strong>
                    <span className="block text-xs text-slate-500">
                      {t("adhesion.secretQuestionLabel")} <strong>{PAYMENT_INTERAC_INFO.secretQuestion[lang]}</strong> |{" "}
                      {t("adhesion.secretAnswerLabel")} <strong>{PAYMENT_INTERAC_INFO.secretAnswer}</strong>
                    </span>
                  </li>
                  <li>{t("adhesion.receivedStepConfirm")}</li>
                  <li>{t("adhesion.receivedStepCard")}</li>
                </ol>
                <button
                  onClick={onOpenPaymentModal}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{t("adhesion.payInterac")}</span>
                </button>
              </div>
            ) : (
              <>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t("adhesion.cardPreviewLabel")}
                </span>
                <MembershipCardView
                  variant="specimen"
                  memberId="ACAFIS-0000"
                  holderName={firstName && lastName ? `${firstName} ${lastName.toUpperCase()}` : "Babacar NDIAYE"}
                  year={new Date().getFullYear()}
                  city={city || "Montréal"}
                />
                <p className="text-xs text-slate-500">{t("adhesion.specimenNote")}</p>
              </>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
