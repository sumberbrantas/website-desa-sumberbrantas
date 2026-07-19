"use client";

import { useEffect, useState } from "react";
import { useVillageSettings } from "@/hooks/useVillageSettings";
import { extractYouTubeId } from "@/lib/villageSettingsService";
import { FiPlay } from "react-icons/fi";

interface VideoHeroProps {
  className?: string;
}

const VideoHero = ({ className = "" }: VideoHeroProps) => {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { settings } = useVillageSettings();

  const videoUrl = settings?.videoUrl || "";
  const videoId = extractYouTubeId(videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;

  const villageName = settings?.villageName || "Desa";
  const villageTagline = settings?.villageTagline || "";

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!videoUrl || !videoId) {
    // Fallback: Show placeholder when no video
    return (
      <section className={`relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] ${className}`}>
        <div className={`absolute inset-0 flex flex-col items-center justify-center text-white p-8 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{villageName}</h1>
            {villageTagline && <p className="text-xl md:text-2xl text-white/90 mb-6">{villageTagline}</p>}
            <p className="text-white/70 mb-8">Video profile belum tersedia. Silakan atur URL YouTube di pengaturan desa.</p>
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white/10 border-2 border-dashed border-white/30">
              <FiPlay size={40} className="text-white/50 ml-2" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative min-h-[70vh] overflow-hidden ${className}`}>
      {/* Video Background */}
      <div className="absolute inset-0">
        {isPlaying ? (
          <iframe
            src={embedUrl || ""}
            title="Video Profile"
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {/* Thumbnail */}
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt="Video Thumbnail"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                // Fallback to hqdefault if maxresdefault not available
                const target = e.currentTarget as HTMLImageElement;
                target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" />
          </>
        )}
      </div>

      {/* Play Button */}
      {!isPlaying && (
        <div className={`absolute inset-0 flex items-center justify-center z-10 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
          <button
            onClick={() => setIsPlaying(true)}
            className="group flex flex-col items-center"
            aria-label="Putar video"
          >
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
              <FiPlay size={48} className="text-white ml-1" />
            </div>
            <span className="mt-4 text-white/90 text-sm md:text-base font-medium">Putar Video Profile</span>
          </button>
        </div>
      )}

      {/* Village Info Overlay */}
      <div className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 md:p-8 smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">{villageName}</h1>
          {villageTagline && <p className="text-lg md:text-xl text-white/80">{villageTagline}</p>}
        </div>
      </div>

      {/* Stop Button (when playing) */}
      {isPlaying && (
        <button
          onClick={() => setIsPlaying(false)}
          className="absolute top-4 right-4 z-30 px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-lg text-sm hover:bg-black/70 transition-colors"
        >
          Tutup Video
        </button>
      )}
    </section>
  );
};

export default VideoHero;
