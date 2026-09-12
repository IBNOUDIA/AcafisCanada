import React from "react";

interface YouTubeEmbedProps {
  videoId: string;
  className?: string;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, className = "" }) => {
  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-slate-950 ${className}`} style={{ aspectRatio: "16 / 9" }}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Vidéo ACAFIS"
        className="absolute inset-0 w-full h-full"
        style={{ border: "none" }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};
