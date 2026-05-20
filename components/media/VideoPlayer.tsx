'use client';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft } from 'lucide-react';

interface VideoPlayerProps {
  tmdbId: number;
  type: 'movie' | 'tv';
  title: string;
  season?: number;
  episode?: number;
  episodeName?: string;
  onClose: () => void;
}

export function VideoPlayer({
  tmdbId,
  type,
  title,
  season = 1,
  episode = 1,
  episodeName,
  onClose,
}: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Accent color matches the design system accent: #3b82f6
  const accentColor = '3b82f6';

  const src =
    type === 'movie'
      ? `https://player.videasy.net/movie/${tmdbId}?color=${accentColor}`
      : `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}?nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true&color=${accentColor}`;

  const label =
    type === 'tv' && episodeName
      ? `${title}  ·  S${season} E${episode}  ·  ${episodeName}`
      : title;

  // Portal renders directly on document.body — escapes ALL parent stacking
  // contexts so z-[9999] always beats the navbar's z-50 no matter where
  // VideoPlayer is called from (detail page, episodes section, modal, etc.)
  return createPortal(
    <div className="fixed inset-0 bg-black z-[9999]">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 py-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-black/60 border border-white/20 hover:bg-black/80 flex items-center justify-center text-white transition-colors pointer-events-auto flex-shrink-0 backdrop-blur-sm"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-white/60 text-[0.8rem] font-medium truncate pointer-events-none select-none">
          {label}
        </span>
      </div>

      <iframe
        ref={iframeRef}
        src={src}
        className="absolute inset-0 w-full h-full border-none"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        referrerPolicy="origin"
        title={title || 'Video Player'}
      />
    </div>,
    document.body
  );
}
