import React from "react";

interface SenegalFlagBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  withLabel?: boolean;
}

export const SenegalFlagBadge: React.FC<SenegalFlagBadgeProps> = ({
  className = "",
  size = "md",
  withLabel = false,
}) => {
  const heightMap = {
    sm: "h-3.5 w-6",
    md: "h-4.5 w-8",
    lg: "h-6 w-10",
  };

  const starSizeMap = {
    sm: "text-[8px]",
    md: "text-[10px]",
    lg: "text-xs",
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* 3-stripe official Senegal flag with green star in the center */}
      <div
        className={`${heightMap[size]} rounded-sm overflow-hidden flex shadow-xs ring-1 ring-black/10 shrink-0 select-none`}
        title="Drapeau du Sénégal (Vert, Jaune, Rouge avec étoile verte)"
      >
        {/* Vert */}
        <div className="w-1/3 h-full bg-[#00853F]" />
        {/* Jaune / Or with Étoile Verte */}
        <div className="w-1/3 h-full bg-[#FDEF42] flex items-center justify-center leading-none text-[#00853F]">
          <span className={`font-black ${starSizeMap[size]} -mt-0.5`}>★</span>
        </div>
        {/* Rouge */}
        <div className="w-1/3 h-full bg-[#E31B23]" />
      </div>

      {withLabel && (
        <span className="text-xs font-bold text-slate-800 tracking-tight">
          Sénégal
        </span>
      )}
    </div>
  );
};

export const SenegalRibbon: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`w-full h-1.5 flex select-none ${className}`}>
      <div className="w-1/3 bg-[#00853F]" />
      <div className="w-1/3 bg-[#FDEF42] relative flex items-center justify-center">
        <span className="absolute -top-1.5 text-[9px] text-[#00853F] font-black">★</span>
      </div>
      <div className="w-1/3 bg-[#E31B23]" />
    </div>
  );
};
