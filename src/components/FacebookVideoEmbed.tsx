import React, { useState } from "react";
import { Play } from "lucide-react";
import { useTranslation } from "../i18n/translations";

interface FacebookVideoEmbedProps {
  url: string;
  className?: string;
}

// Wraps Facebook's official Video Plugin iframe (works for public videos/posts).
// The player is only loaded once the visitor clicks play: as soon as it is on
// screen, Facebook's player downloads 1 to 3 MB (scripts plus the start of the
// video), even for visitors who never watch it.
export const FacebookVideoEmbed: React.FC<FacebookVideoEmbedProps> = ({ url, className = "" }) => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const src = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
    url
  )}&show_text=false&width=560&t=0&autoplay=1`;

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-slate-950 ${className}`} style={{ aspectRatio: "16 / 9" }}>
      {isPlaying ? (
        <iframe
          src={src}
          title={t("media.videoTitle")}
          className="absolute inset-0 w-full h-full"
          style={{ border: "none", overflow: "hidden" }}
          scrolling="no"
          frameBorder={0}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label={t("media.playVideo")}
          className="group absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 cursor-pointer"
        >
          <span className="w-16 h-16 rounded-full bg-[#1877F2] group-hover:bg-[#166FE5] group-focus-visible:ring-4 group-focus-visible:ring-white text-white flex items-center justify-center shadow-xl transition-colors">
            <Play className="w-7 h-7 ml-1" fill="currentColor" />
          </span>
          <span className="text-xs font-semibold text-white/85">{t("media.playFacebookVideo")}</span>
        </button>
      )}
    </div>
  );
};
