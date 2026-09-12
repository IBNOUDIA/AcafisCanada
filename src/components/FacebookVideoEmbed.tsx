import React from "react";

interface FacebookVideoEmbedProps {
  url: string;
  className?: string;
}

// Wraps Facebook's official Video Plugin iframe (works for public videos/posts).
export const FacebookVideoEmbed: React.FC<FacebookVideoEmbedProps> = ({ url, className = "" }) => {
  const src = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
    url
  )}&show_text=false&width=560&t=0`;

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-slate-950 ${className}`} style={{ aspectRatio: "16 / 9" }}>
      <iframe
        src={src}
        title="Témoignage vidéo ACAFIS"
        className="absolute inset-0 w-full h-full"
        style={{ border: "none", overflow: "hidden" }}
        scrolling="no"
        frameBorder={0}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};
