import React, { useState } from "react";
import {
  UserCheck,
  CreditCard,
  QrCode,
  Download,
  Printer,
  Copy,
  CheckCircle2,
  Sparkles,
  Shield,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { PAYMENT_INTERAC_INFO } from "../data/acafisData";
import { SenegalFlagBadge } from "./SenegalFlagBadge";
import { MemberRecord } from "../types";

interface MembershipCardGeneratorProps {
  onOpenPaymentModal: () => void;
}

export const MembershipCardGenerator: React.FC<MembershipCardGeneratorProps> = ({
  onOpenPaymentModal,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Montréal");

  const [generatedMember, setGeneratedMember] = useState<MemberRecord | null>(null);
  const [copiedInterac, setCopiedInterac] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenerateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;

    setIsSubmitting(true);
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
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedMember(data.member);
      } else {
        throw new Error("Erreur");
      }
    } catch {
      // Fallback generator
      const memberId = `ACAFIS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedMember({
        memberId,
        firstName: firstName.trim(),
        lastName: lastName.trim().toUpperCase(),
        email: email.trim(),
        phone: phone.trim() || "Non renseigné",
        city: city.trim() || "Canada",
        membershipYear: new Date().getFullYear(),
        annualFee: "25 CAD",
        issuedAt: new Date().toLocaleDateString("fr-CA"),
        status: "Validé (Attente cotisation)",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyInteracEmail = () => {
    navigator.clipboard.writeText(PAYMENT_INTERAC_INFO.email);
    setCopiedInterac(true);
    setTimeout(() => setCopiedInterac(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="adhesion" className="py-20 bg-gradient-to-b from-sky-50 via-white to-sky-100/50 border-b border-sky-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
            <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Adhésion Solidaire • Canada 🇨🇦 & Sénégal 🇸🇳</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Devenir Membre d'ACAFIS Canada
          </h2>

          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Rejoignez notre réseau de solidarité. Enregistrez vos coordonnées pour générer immédiatement votre carte numérique officielle et régler votre cotisation annuelle de <strong>25$ canadien (25 CAD)</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-6xl mx-auto">
          
          {/* Form Side */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Formulaire d'Enregistrement
              </h3>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                Cotisation : 25$ CAD / an
              </span>
            </div>

            <form onSubmit={handleGenerateCard} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Prénom *
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
                    Nom *
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
                  Courriel (Email) *
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
                    Téléphone
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
                    Ville / Région
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="member-input-city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Montréal, Ottawa, etc."
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  id="member-btn-generate"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isSubmitting ? "Création en cours..." : "Générer ma Carte de Membre"}</span>
                </button>
              </div>

              {/* Interac reminder box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Paiement Cotisation (Virement Interac) :</span>
                  <button
                    type="button"
                    onClick={copyInteracEmail}
                    className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedInterac ? "Copié !" : "Copier le courriel"}</span>
                  </button>
                </div>
                <p className="font-mono text-emerald-800 font-semibold">{PAYMENT_INTERAC_INFO.email}</p>
                <p className="text-[11px] text-slate-500">
                  Question secrète : <strong>{PAYMENT_INTERAC_INFO.secretQuestion}</strong> | Réponse : <strong>{PAYMENT_INTERAC_INFO.secretAnswer}</strong>
                </p>
              </div>
            </form>
          </div>

          {/* Live Card Preview Side */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Aperçu Numérique de la Carte
              </span>
              {generatedMember && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Générée avec succès
                </span>
              )}
            </div>

            {/* The Badge Card */}
            <div
              id="membership-card-badge"
              className="relative rounded-3xl p-6 sm:p-7 text-white shadow-2xl overflow-hidden bg-gradient-to-tr from-slate-950 via-emerald-950 to-teal-900 border border-emerald-500/30"
              style={{ minHeight: "260px" }}
            >
              {/* Background watermark */}
              <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none select-none text-9xl font-black">
                ACAFIS
              </div>

              {/* Top Row: Logo and Flag */}
              <div className="relative z-10 flex items-center justify-between border-b border-emerald-800/80 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/src/assets/images/acafis_canada_logo_1788878217287.jpg"
                    alt="Logo ACAFIS Canada"
                    className="w-10 h-10 rounded-xl object-contain bg-white/95 p-0.5 shadow-md border border-white/40"
                  />
                  <div>
                    <h4 className="text-sm font-extrabold tracking-wider text-white">
                      ACAFIS CANADA
                    </h4>
                    <p className="text-[10px] text-emerald-300 font-medium">
                      Carte Officielle d'Adhérent
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold bg-slate-900/90 px-2.5 py-1 rounded-full border border-emerald-500/40">
                  <span>🇨🇦</span>
                  <span className="text-emerald-400">•</span>
                  <SenegalFlagBadge size="sm" />
                </div>
              </div>

              {/* Middle Row: Chip & Name */}
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  {/* Hologram / Chip Icon */}
                  <div className="w-10 h-8 rounded bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 border border-amber-500/60 shadow-inner flex items-center justify-center">
                    <div className="w-6 h-4 border border-amber-700/40 rounded-xs" />
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] uppercase text-emerald-300 tracking-wider">
                      Identifiant Membre
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-300">
                      {generatedMember ? generatedMember.memberId : "ACAFIS-2026-0000"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                    Titulaire de la carte
                  </span>
                  <h3 className="text-lg sm:text-xl font-black tracking-wide text-white font-display">
                    {generatedMember
                      ? `${generatedMember.firstName} ${generatedMember.lastName}`
                      : firstName && lastName
                      ? `${firstName} ${lastName.toUpperCase()}`
                      : "Babacar NDIAYE"}
                  </h3>
                </div>
              </div>

              {/* Bottom Row: Details & QR simulation */}
              <div className="relative z-10 mt-5 pt-3 border-t border-emerald-900/60 flex items-end justify-between text-xs">
                <div>
                  <div className="flex items-center gap-4 text-[11px] text-slate-300">
                    <div>
                      <span className="block text-[9px] uppercase text-slate-400">Année</span>
                      <span className="font-bold text-white">2026</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase text-slate-400">Cotisation</span>
                      <span className="font-bold text-amber-300">25 CAD</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase text-slate-400">Ville</span>
                      <span className="font-medium text-slate-200">
                        {generatedMember ? generatedMember.city : city || "Montréal"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-white text-slate-950 flex items-center justify-center shadow-xs">
                  <QrCode className="w-8 h-8" />
                </div>
              </div>

              {/* Senegal Tricolor Accent Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 flex overflow-hidden">
                <div className="w-1/3 bg-[#00853F]" />
                <div className="w-1/3 bg-[#FDEF42] flex items-center justify-center text-[7px] text-[#00853F] font-bold">★</div>
                <div className="w-1/3 bg-[#E31B23]" />
              </div>
            </div>

            {/* Action buttons below card */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Imprimer ma Carte</span>
              </button>

              <button
                onClick={onOpenPaymentModal}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Payer les 25$ CAD (Interac)</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
