'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, VolumeX, Volume2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { tmdbImage } from '@/services/tmdb/client';
import { cn } from '@/lib/utils';

interface Props {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  backdropPath: string | null;
  trailerKey: string | null;
  seasons?: number;
}

export function TVDetailClient({ title, backdropPath, trailerKey }: Props) {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !trailerKey) return;
    const t = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(t);
  }, [mounted, trailerKey]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    try {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: next ? 'mute' : 'unMute', args: [] }), '*'
      );
      if (!next) {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }), '*'
        );
      }
    } catch {}
  };

  const embedUrl = trailerKey
    ? `https://www.youtube-nocookie.com/embed/${trailerKey}?` +
      new URLSearchParams({
        autoplay: '1',
        mute: '1',
        controls: '0',
        disablekb: '1',
        modestbranding: '1',
        rel: '0',
        iv_load_policy: '3',
        cc_load_policy: '0',
        fs: '0',
        playsinline: '1',
        loop: '1',
        playlist: trailerKey,
        enablejsapi: '1',
      }).toString()
    : null;

  return (
    <div className="relative h-[56vw] max-h-[700px] min-h-[400px] overflow-hidden bg-black">

      {backdropPath && (
        <Image
          src={tmdbImage(backdropPath, 'original')}
          alt={title}
          fill priority sizes="100vw"
          className={cn(
            'object-cover object-top transition-opacity duration-1000',
            ready ? 'opacity-0' : 'opacity-100'
          )}
          unoptimized
        />
      )}

      {mounted && embedUrl && (
        <div
          className={cn(
            'absolute transition-opacity duration-1000 pointer-events-none',
            ready ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            top: '50%',
            left: '50%',
            width: '166%',
            height: '300%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <iframe
            ref={iframeRef}
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
          />
        </div>
      )}

      <div className="absolute inset-0 z-[5]" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0a] via-[rgba(10,10,10,0.05)] to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[rgba(10,10,10,0.5)] to-transparent pointer-events-none" />

      <button
        onClick={() => router.back()}
        className="absolute top-20 left-6 z-20 w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-all backdrop-blur-sm"
      >
        <ArrowLeft size={18} />
      </button>

      {ready && trailerKey && (
        <button
          onClick={toggleMute}
          className="absolute top-20 right-6 z-20 w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-all backdrop-blur-sm"
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      )}
    </div>
  );
}
