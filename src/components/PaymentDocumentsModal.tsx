import React, { useState } from "react";
import {
  X,
  CreditCard,
  FileText,
  Copy,
  CheckCircle2,
  Download,
  ShieldCheck,
  Building,
  HelpCircle,
} from "lucide-react";
import { PAYMENT_INTERAC_INFO, OFFICIAL_DOCUMENTS } from "../data/acafisData";

interface PaymentDocumentsModalProps {
  isOpen: boolean;
  initialTab?: "payment" | "documents";
  onClose: () => void;
}

export const PaymentDocumentsModal: React.FC<PaymentDocumentsModalProps> = ({
  isOpen,
  initialTab = "payment",
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"payment" | "documents">(initialTab);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string>("statuts");

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const currentDoc =
    OFFICIAL_DOCUMENTS.find((d) => d.id === selectedDocId) || OFFICIAL_DOCUMENTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("payment")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "payment"
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              Paiement Cotisation (Interac)
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "documents"
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              Documents Officiels
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* 1. Payment Tab */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <div className="text-center max-w-lg mx-auto space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Paiement par Virement Interac (Canada)
                </h3>
                <p className="text-xs text-slate-600">
                  Conformément aux directives de la Trésorerie Générale d'ACAFIS Canada, réglez facilement votre cotisation annuelle de <strong>25$ canadien (25 CAD)</strong> depuis votre application bancaire canadienne (Desjardins, RBC, TD, BMO, CIBC, Banque Nationale, etc.).
                </p>
              </div>

              {/* Interac Credentials Table */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 space-y-4">
                
                {/* Email */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-emerald-100 shadow-xs">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Destinataire (Courriel Interac)
                    </span>
                    <span className="font-mono text-sm font-bold text-emerald-900">
                      {PAYMENT_INTERAC_INFO.email}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(PAYMENT_INTERAC_INFO.email, "email")}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedField === "email" ? "Copié !" : "Copier"}</span>
                  </button>
                </div>

                {/* Secret Question */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-emerald-100 shadow-xs">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Question secrète obligatoire
                    </span>
                    <span className="font-semibold text-sm text-slate-900">
                      {PAYMENT_INTERAC_INFO.secretQuestion}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(PAYMENT_INTERAC_INFO.secretQuestion, "question")}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedField === "question" ? "Copié !" : "Copier"}</span>
                  </button>
                </div>

                {/* Secret Answer */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-emerald-100 shadow-xs">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Réponse secrète exacte
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-900">
                      {PAYMENT_INTERAC_INFO.secretAnswer}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(PAYMENT_INTERAC_INFO.secretAnswer, "answer")}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedField === "answer" ? "Copié !" : "Copier"}</span>
                  </button>
                </div>

                {/* Amount */}
                <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-600">
                  <span>Montant de la cotisation annuelle :</span>
                  <span className="font-bold text-slate-900 text-sm">{PAYMENT_INTERAC_INFO.annualFeeCAD} CAD</span>
                </div>
              </div>

              {/* Memo Note Guideline */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <strong className="text-slate-900 block font-semibold">
                  ⚠️ Note importante pour le virement :
                </strong>
                <p>
                  Dans la case <em>« Message / Note »</em> de votre virement, mentionnez impérativement vos <strong>Nom & Prénom</strong> ainsi que la mention <em>« Cotisation ACAFIS 2026 »</em> pour faciliter la validation de votre reçu officiel.
                </p>
              </div>
            </div>
          )}

          {/* 2. Documents Tab */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="text-center max-w-lg mx-auto space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Documents Fondateurs ACAFIS Canada
                </h3>
                <p className="text-xs text-slate-600">
                  Consultez en toute transparence les statuts officiels et le règlement intérieur de l'organisation.
                </p>
              </div>

              {/* Document Selector Pills */}
              <div className="grid grid-cols-2 gap-3">
                {OFFICIAL_DOCUMENTS.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedDocId === doc.id
                        ? "bg-emerald-50 border-emerald-600 ring-1 ring-emerald-600"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block text-xs font-bold text-slate-900">
                      {doc.title}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {doc.type} • {doc.size}
                    </span>
                  </button>
                ))}
              </div>

              {/* Document Preview Box */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-display">
                      {currentDoc.title}
                    </h4>
                    <p className="text-xs text-slate-500">{currentDoc.description}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {currentDoc.size}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Articles et dispositions clés :
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {currentDoc.contentSummary.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Document officiel certifié par le Secrétariat Général
                  </span>
                  <button
                    onClick={() => {
                      alert(`Téléchargement de "${currentDoc.title}" initié.`);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger le PDF</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Agrément officiel ACAFIS Canada
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
