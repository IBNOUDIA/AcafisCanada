import React from "react";

interface AcafisLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textColor?: "dark" | "light";
}

export const AcafisLogo: React.FC<AcafisLogoProps> = ({
  className = "",
  size = "md",
  showText = true,
  textColor = "dark",
}) => {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  const textSizeMap = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const subTextSizeMap = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-xs",
    xl: "text-sm",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`relative ${sizeMap[size]} rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 shrink-0 bg-white flex items-center justify-center`}
      >
        <img
          src="/src/assets/images/acafis_canada_logo_1788878217287.jpg"
          alt="Logo Officiel ACAFIS Canada"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain p-0.5"
          onError={(e) => {
            // Fallback SVG if asset image fails
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight font-display ${textSizeMap[size]} ${
                textColor === "light" ? "text-white" : "text-slate-900"
              }`}
            >
              ACAFIS
            </span>
            <span
              className={`px-1.5 py-0.2 rounded-md font-extrabold text-[10px] tracking-wide ${
                textColor === "light"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              CANADA
            </span>
          </div>
          <span
            className={`font-medium tracking-wide uppercase ${subTextSizeMap[size]} ${
              textColor === "light" ? "text-emerald-300/80" : "text-emerald-800 font-semibold"
            }`}
          >
            Diaspora Solidaire • Sénégal & Canada
          </span>
        </div>
      )}
    </div>
  );
};
