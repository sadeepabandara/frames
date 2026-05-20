'use client';
import { useState } from 'react';
import { Play } from 'lucide-react';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { useUIStore } from '@/store';

interface Props {
  tmdbId: number;
  title: string;
  season?: number;
  episode?: number;
  episodeName?: string;
}

export function TVPlayButton({ tmdbId, title, season = 1, episode = 1, episodeName }: Props) {
  const [playing, setPlaying] = useState(false);
  const { setVideoPlayerOpen } = useUIStore();

  const handlePlay = () => {
    setPlaying(true);
    setVideoPlayerOpen(true);
  };

  const handleClose = () => {
    setPlaying(false);
    setVideoPlayerOpen(false);
  };

  return (
    <>
      <button
        onClick={handlePlay}
        className="flex items-center gap-2 px-7 py-3 rounded-xl bg-white text-[#0a0a0a] font-bold text-[0.88rem] hover:bg-white/85 transition-all hover:-translate-y-0.5 shadow-lg"
      >
        <Play size={16} className="fill-[#0a0a0a]" /> Play
      </button>

      {playing && (
        <VideoPlayer
          tmdbId={tmdbId}
          type="tv"
          title={title}
          season={season}
          episode={episode}
          episodeName={episodeName}
          onClose={handleClose}
        />
      )}
    </>
  );
}
