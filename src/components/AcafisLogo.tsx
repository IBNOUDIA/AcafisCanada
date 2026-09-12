import React from "react";
import acafisLogoOfficial from "../assets/images/acafis-logo-official.jpg";

interface AcafisLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textColor?: "dark" | "light";
}

// Official logo file is a wide lockup (icon + "ACAFIS" wordmark + full name) on a
// light cream background — sized by height only so its aspect ratio stays intact.
const LOGO_ASPECT_RATIO = 1408 / 768;

export const AcafisLogo: React.FC<AcafisLogoProps> = ({
  className = "",
  size = "md",
  showText = true,
  textColor = "dark",
}) => {
  const heightMap = {
    sm: "h-10",
    md: "h-16",
    lg: "h-20",
    xl: "h-28",
  };

  const subTextSizeMap = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-xs",
    xl: "text-sm",
  };

  const logoImg = (
    <img
      src={acafisLogoOfficial}
      alt="Logo Officiel ACAFIS — Association Canadienne d'Aide aux Familles Immigrantes Sénégalaises"
      referrerPolicy="no-referrer"
      className={`${heightMap[size]} w-auto object-contain shrink-0`}
      style={{ aspectRatio: LOGO_ASPECT_RATIO }}
    />
  );

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {textColor === "light" ? (
        // On dark backgrounds, wrap in a light card so the logo's own cream
        // background reads as an intentional badge rather than a clash.
        <div className="rounded-xl bg-white/95 shadow-sm ring-1 ring-black/5 px-2 py-1.5">
          {logoImg}
        </div>
      ) : (
        logoImg
      )}

      {showText && (
        <span
          className={`font-medium tracking-wide uppercase leading-tight ${subTextSizeMap[size]} ${
            textColor === "light" ? "text-emerald-300/80" : "text-emerald-800 font-semibold"
          }`}
        >
          Diaspora Solidaire
          <br />
          Sénégal & Canada
        </span>
      )}
    </div>
  );
};
