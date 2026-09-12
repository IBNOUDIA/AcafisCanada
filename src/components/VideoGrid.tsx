import React from "react";
import { AcafisVideo } from "../data/acafisData";
import { RevealGroup } from "./Reveal";
import { FacebookVideoEmbed } from "./FacebookVideoEmbed";

interface VideoGridProps {
  videos: AcafisVideo[];
  className?: string;
}

// Shared video grid used across pages to render a themed slice of ACAFIS_VIDEOS
// (see acafisData.ts — each video is dispatched by category to its matching page).
export const VideoGrid: React.FC<VideoGridProps> = ({ videos, className = "" }) => {
  if (videos.length === 0) return null;

  return (
    <RevealGroup className={`grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto ${className}`}>
      {videos.map((video) => (
        <div key={video.id} className="space-y-3">
          <FacebookVideoEmbed url={video.url} />
          <div className="text-center">
            <h4 className="text-sm font-bold text-slate-900">{video.name}</h4>
            <span className="text-xs text-emerald-800 font-medium">{video.role}</span>
          </div>
        </div>
      ))}
    </RevealGroup>
  );
};
