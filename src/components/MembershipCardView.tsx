import React from "react";
import { QrCode } from "lucide-react";
import { SenegalFlagBadge } from "./SenegalFlagBadge";
import { useTranslation } from "../i18n/translations";
import acafisLogoOfficial from "../assets/images/acafis-logo-official.webp";

interface MembershipCardViewProps {
  memberId: string;
  holderName: string;
  year: number;
  city: string;
  // "specimen": the live preview on the membership form, never a valid card.
  // "valid": a member whose dues are paid, shown in their Espace Membre.
  variant: "specimen" | "valid";
  id?: string;
}

// The ACAFIS Canada membership card. A real card only exists in the Espace
// Membre once the treasury has confirmed the dues; elsewhere it's a marked
// specimen, so nobody can print an official-looking card before paying.
export const MembershipCardView: React.FC<MembershipCardViewProps> = ({
  memberId,
  holderName,
  year,
  city,
  variant,
  id,
}) => {
  const { t } = useTranslation();
  const isSpecimen = variant === "specimen";

  return (
    <div
      id={id}
      className="membership-card relative rounded-3xl p-6 sm:p-7 text-white shadow-2xl overflow-hidden bg-gradient-to-tr from-slate-950 via-emerald-950 to-teal-900 border border-emerald-500/30"
      style={{ minHeight: "260px" }}
    >
      <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none select-none text-9xl font-black">ACAFIS</div>

      {isSpecimen && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span className="-rotate-[18deg] text-5xl sm:text-6xl font-black tracking-[0.2em] text-white/20 border-4 border-white/20 rounded-2xl px-6 py-2">
            {t("card.specimen")}
          </span>
        </div>
      )}

      <div className="relative z-10 flex items-center justify-between border-b border-emerald-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <img
            src={acafisLogoOfficial}
            alt="Logo ACAFIS Canada"
            width={1024}
            height={558}
            className="h-10 w-auto max-w-[130px] rounded-xl object-contain bg-white/95 p-1 shadow-md border border-white/40"
          />
          <div>
            <p className="text-sm font-extrabold tracking-wider text-white">ACAFIS CANADA</p>
            <p className="text-[10px] text-emerald-300 font-medium">{t("adhesion.officialCard")}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold bg-slate-900/90 px-2.5 py-1 rounded-full border border-emerald-500/40">
          <span>🇨🇦</span>
          <span className="text-emerald-400">•</span>
          <SenegalFlagBadge size="sm" />
        </div>
      </div>

      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-10 h-8 rounded bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 border border-amber-500/60 shadow-inner flex items-center justify-center">
            <div className="w-6 h-4 border border-amber-700/40 rounded-xs" />
          </div>
          <div className="text-right">
            <span className="block text-[10px] uppercase text-emerald-300 tracking-wider">{t("adhesion.memberIdLabel")}</span>
            <span className="font-mono text-xs font-bold text-amber-300">{memberId}</span>
          </div>
        </div>
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-slate-300">{t("adhesion.cardHolderLabel")}</span>
          <p className="text-lg sm:text-xl font-black tracking-wide text-white font-display">{holderName}</p>
        </div>
      </div>

      <div className="relative z-10 mt-5 pt-3 border-t border-emerald-900/60 flex items-end justify-between text-xs">
        <div className="flex items-center gap-4 text-[11px] text-slate-300">
          <div>
            <span className="block text-[9px] uppercase text-slate-300">{t("adhesion.yearLabel")}</span>
            <span className="font-bold text-white">{year}</span>
          </div>
          <div>
            <span className="block text-[9px] uppercase text-slate-300">{t("adhesion.feeLabel")}</span>
            <span className="font-bold text-amber-300">25 CAD</span>
          </div>
          <div>
            <span className="block text-[9px] uppercase text-slate-300">{t("adhesion.cityLabel")}</span>
            <span className="font-medium text-slate-200">{city}</span>
          </div>
        </div>
        {isSpecimen ? (
          <div className="p-1.5 rounded-lg bg-white text-slate-950 flex items-center justify-center shadow-xs">
            <QrCode className="w-8 h-8" aria-hidden="true" />
          </div>
        ) : (
          <span className="px-2.5 py-1 rounded-full bg-emerald-400 text-emerald-950 text-[10px] font-extrabold uppercase tracking-wider">
            {t("card.validBadge").replace("{year}", String(year))}
          </span>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1.5 flex overflow-hidden">
        <div className="w-1/3 bg-[#00853F]" />
        <div className="w-1/3 bg-[#FDEF42] flex items-center justify-center text-[7px] text-[#00853F] font-bold">★</div>
        <div className="w-1/3 bg-[#E31B23]" />
      </div>
    </div>
  );
};

// Prints only the card: index.css hides everything else while <body> has
// the "printing-card" class.
export function printMembershipCard() {
  document.body.classList.add("printing-card");
  const done = () => {
    document.body.classList.remove("printing-card");
    window.removeEventListener("afterprint", done);
  };
  window.addEventListener("afterprint", done);
  window.print();
}
