import React, { useState } from "react";
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
  const [email, setEmail] = useState("");
  const [memberId, setMemberId] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLogged(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {isLogged ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <UserCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              Bienvenue sur votre Espace Membre
            </h3>
            <p className="text-xs text-slate-600">
              Connecté en tant que <strong>{email}</strong>. Vous avez accès aux votes de l'Assemblée Générale, au suivi foncier de la Cité Jardin et aux ateliers nTIC.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                Accéder au Tableau de Bord
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
                Espace Membre ACAFIS
              </h3>
              <p className="text-xs text-slate-500">
                Identifiez-vous avec votre adresse courriel ou votre numéro de membre ACAFIS.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Courriel du Membre
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
                  Numéro de Carte ou Mot de Passe (Facultatif)
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

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Connexion Sécurisée</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center text-xs space-y-2">
              <span className="text-slate-500">Pas encore inscrit pour 2026 ?</span>
              <button
                onClick={() => {
                  onClose();
                  onOpenCardModal();
                }}
                className="block mx-auto font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Générer ma carte & Adhérer (50 CAD) →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
