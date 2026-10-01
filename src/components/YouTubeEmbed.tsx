import React, { useState } from "react";
import { Play } from "lucide-react";
import { useTranslation } from "../i18n/translations";

interface YouTubeEmbedProps {
  videoId: string;
  className?: string;
}

// Shows the video's thumbnail and only loads YouTube's player (~1 MB of
// scripts per video) once the visitor clicks play — pages with several
// videos used to download every player up front.
export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, className = "" }) => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-slate-950 ${className}`} style={{ aspectRatio: "16 / 9" }}>
      {isPlaying ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={t("media.videoTitle")}
          className="absolute inset-0 w-full h-full"
          style={{ border: "none" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label={t("media.playVideo")}
          className="group absolute inset-0 w-full h-full cursor-pointer"
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            width={480}
            height={360}
            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-16 h-16 rounded-full bg-red-600 group-hover:bg-red-700 group-focus-visible:ring-4 group-focus-visible:ring-white text-white flex items-center justify-center shadow-xl transition-colors">
              <Play className="w-7 h-7 ml-1" fill="currentColor" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
};
