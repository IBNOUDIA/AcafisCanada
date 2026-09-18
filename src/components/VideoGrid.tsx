import React from "react";
import { AcafisVideo } from "../data/acafisData";
import { RevealGroup } from "./Reveal";
import { FacebookVideoEmbed } from "./FacebookVideoEmbed";
import { YouTubeEmbed } from "./YouTubeEmbed";
import { useTranslation } from "../i18n/translations";

interface VideoGridProps {
  videos: AcafisVideo[];
  className?: string;
}

const extractYouTubeId = (url: string): string | null => {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

// Shared video grid used across pages to render a themed slice of ACAFIS_VIDEOS
// (see acafisData.ts — each video is dispatched by category to its matching page).
export const VideoGrid: React.FC<VideoGridProps> = ({ videos, className = "" }) => {
  const { lang } = useTranslation();
  if (videos.length === 0) return null;

  return (
    <RevealGroup className={`grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto ${className}`}>
      {videos.map((video) => {
        const youtubeId = video.platform === "youtube" ? extractYouTubeId(video.url) : null;
        return (
          <div key={video.id} className="space-y-3">
            {youtubeId ? <YouTubeEmbed videoId={youtubeId} /> : <FacebookVideoEmbed url={video.url} />}
            <div className="text-center">
              <h4 className="text-sm font-bold text-slate-900">{video.name[lang]}</h4>
              <span className="text-xs text-emerald-800 font-medium">{video.role[lang]}</span>
            </div>
          </div>
        );
      })}
    </RevealGroup>
  );
};
