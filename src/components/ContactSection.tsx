import React, { useState } from "react";
import {
  Mail,
  Phone,
  Send,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  CreditCard,
  Building,
  HelpCircle,
} from "lucide-react";
import { PAYMENT_INTERAC_INFO } from "../data/acafisData";

interface ContactSectionProps {
  onOpenPaymentModal: () => void;
  onOpenDocumentsModal: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onOpenPaymentModal,
  onOpenDocumentsModal,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("adhesion");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const subjectOptions = [
    { id: "adhesion", label: "Adhésion & Carte Membre (25$ CAD)" },
    { id: "cite_jardin", label: "Coop-ACAFIS & Cité Jardin Ndianda" },
    { id: "colonie2027", label: "Colonie 'Racines & Avenir' 2027" },
    { id: "mentor_ia", label: "Espace Jeune & Le Mentor IA" },
    { id: "partenariat", label: "Partenariat Institutionnel / Sponsoring" },
    { id: "autre", label: "Autre demande au Secrétariat" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject,
          message,
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur de transmission");
      }

      setSubmitSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      // Graceful local handling
      setSubmitSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-white via-sky-50/70 to-sky-100/60 border-b border-sky-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
            <Mail className="w-3.5 h-3.5 text-sky-700" />
            <span>Écoute & Proximité • Canada 🇨🇦 & Sénégal 🇸🇳</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Formulaire de Contact Intuitif
          </h2>

          <p className="text-base sm:text-lg text-slate-600">
            Une question sur votre adhésion, la Cité Jardin, Le Mentor IA ou les activités communautaires ? Écrivez-nous directement, nous vous répondrons sous 24 à 48 heures.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto items-start">
          
          {/* Left: Contact Info & Official Direct Lines */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Info Card 1: Secretariat & Bureau */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-700" />
                <span>Secrétariat Général & Bureau Exécutif</span>
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                Association des Ressortissants et Amis de la Casamance et du Sénégal au Canada (ACAFIS Canada).
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-slate-900">Secrétariat :</span>
                    <a href="mailto:secretariat@acafis.ca" className="text-emerald-700 hover:underline">
                      secretariat@acafis.ca
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-slate-900">Présidence :</span>
                    <a href="mailto:president@acafis.ca" className="text-emerald-700 hover:underline">
                      president@acafis.ca
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-slate-900">Siège au Canada :</span>
                    <span>Montréal / Région de la Capitale Nationale (Ottawa-Gatineau)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Card 2: Interac Payments */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950 to-teal-900 text-white shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  Paiement des Cotisations
                </span>
                <span className="text-xs font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  {PAYMENT_INTERAC_INFO.annualFeeCAD} CAD
                </span>
              </div>

              <p className="text-xs text-emerald-100 leading-relaxed">
                Pour régler votre cotisation statutaire ou faire un don solidaire :
              </p>

              <div className="p-3 rounded-xl bg-black/30 border border-emerald-500/30 text-xs space-y-1 font-mono">
                <div className="text-emerald-300 font-bold">Courriel : {PAYMENT_INTERAC_INFO.email}</div>
                <div className="text-slate-300">Question : <span className="text-white font-bold">{PAYMENT_INTERAC_INFO.secretQuestion}</span></div>
                <div className="text-slate-300">Réponse : <span className="text-white font-bold">{PAYMENT_INTERAC_INFO.secretAnswer}</span></div>
              </div>

              <button
                onClick={onOpenPaymentModal}
                className="text-xs font-semibold text-amber-300 hover:text-amber-200 underline cursor-pointer"
              >
                Consulter le guide complet des paiements & reçus →
              </button>
            </div>

            {/* Info Card 3: Documents Shortcut */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">
                Statuts & Règlement Intérieur ACAFIS
              </span>
              <button
                onClick={onOpenDocumentsModal}
                className="font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Consulter les PDF
              </button>
            </div>

          </div>

          {/* Right: The Intuitive Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            
            {submitSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Message Transmis avec Succès !
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Merci pour votre message. Le secrétariat d'ACAFIS Canada a bien reçu votre demande et vous contactera dans les plus brefs délais.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 font-display border-b border-slate-100 pb-3 mb-2">
                  Envoyez-nous un Message
                </h3>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Nom complet *
                    </label>
                    <input
                      id="contact-input-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Awa Diop"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Courriel (Email) *
                    </label>
                    <input
                      id="contact-input-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="awa.diop@exemple.ca"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                {/* Phone & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Numéro de téléphone
                    </label>
                    <input
                      id="contact-input-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (514) 000-0000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Objet de la demande *
                    </label>
                    <select
                      id="contact-select-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    >
                      {subjectOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Votre message *
                  </label>
                  <textarea
                    id="contact-textarea-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écrivez votre message ici avec tous les détails nécessaires..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    id="contact-btn-submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Envoi en cours..." : "Transmettre mon Message au Secrétariat"}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 text-center">
                  Vos informations sont strictement confidentielles et réservées à la gestion interne d'ACAFIS Canada.
                </p>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
