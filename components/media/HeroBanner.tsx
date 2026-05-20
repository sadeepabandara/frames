'use client';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Play, Info, Plus, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getTrending, tmdbImage, GENRES_LIST } from '@/services/tmdb/client';
import { useWatchlist } from '@/hooks';
import { useUser, useClerk } from '@clerk/nextjs';
import { getMediaTitle, getMediaDate, getYear, formatScore, truncate, cn } from '@/lib/utils';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import toast from 'react-hot-toast';

export function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { isInList, toggleItem } = useWatchlist();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const { data, isLoading } = useQuery({
    queryKey: ['trending-hero'],
    queryFn: () => getTrending('week'),
  });

  const items = (data?.results || [])
    .filter((m) => m.backdrop_path && m.overview)
    .slice(0, 6);
  const current = items[index];

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % Math.max(items.length, 1));
  }, [items.length]);

  useEffect(() => {
    if (!items.length) return;
    const t = setInterval(next, 12000);
    return () => clearInterval(t);
  }, [items.length, next]);

  if (isLoading) return <HeroBannerSkeleton />;
  if (!current) return null;

  const mediaType: 'movie' | 'tv' = (current as any).media_type === 'tv' ? 'tv' : 'movie';
  const inList = isInList(current.id);
  const detailHref = `/${mediaType === 'tv' ? 'tv' : 'movies'}/${current.id}`;

  const genreNames = (current.genre_ids || [])
    .slice(0, 3)
    .map((id) => GENRES_LIST.find((g) => g.id === id)?.name)
    .filter(Boolean);

  return (
    <>
      {/* VideoPlayer overlay — same page, user gesture preserved */}
      {playing && (
        <VideoPlayer
          tmdbId={current.id}
          type={mediaType}
          title={getMediaTitle(current)}
          onClose={() => setPlaying(false)}
        />
      )}

      <section className="relative h-screen min-h-[560px] max-h-[900px] overflow-hidden">

        {/* Static backdrop */}
        <div className="absolute inset-0">
          <Image
            key={current.id}
            src={tmdbImage(current.backdrop_path, 'original')}
            alt={getMediaTitle(current)}
            fill loading="eager" fetchPriority="high" sizes="100vw"
            className="object-cover object-top transition-opacity duration-700"
            unoptimized
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[rgba(10,10,10,0.55)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[rgba(10,10,10,0.25)]" />

        <div className="relative z-10 h-full flex items-end pb-[10vh] px-8 lg:px-16">
          <div className="max-w-[560px] animate-fade-up">

            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-0.5 bg-[#3b82f6] rounded-full" />
              <span className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase text-[#3b82f6]">
                Featured Today
              </span>
            </div>

            <h1 className="text-[clamp(2rem,4.5vw,3.8rem)] font-extrabold tracking-tight leading-[1.05] text-white mb-3">
              {getMediaTitle(current)}
            </h1>

            <div className="flex items-center flex-wrap gap-2 mb-3">
              <span className="px-2.5 py-1 rounded bg-[rgba(59,130,246,0.12)] border border-[rgba(59,130,246,0.25)] text-[0.72rem] font-semibold text-[#3b82f6]">
                ★ {formatScore(current.vote_average)}
              </span>
              <span className="px-2.5 py-1 rounded bg-white/[0.07] border border-white/[0.12] text-[0.72rem] font-medium text-[#a0a0a0]">
                {getYear(getMediaDate(current))}
              </span>
              {genreNames.map((g) => (
                <span key={g} className="px-2.5 py-1 rounded bg-white/[0.07] border border-white/[0.12] text-[0.72rem] font-medium text-[#a0a0a0]">
                  {g}
                </span>
              ))}
              <span className="px-2.5 py-1 rounded bg-white/[0.07] border border-white/[0.12] text-[0.72rem] font-medium text-[#a0a0a0]">HD</span>
            </div>

            <p className="text-[0.87rem] text-white/70 leading-relaxed mb-7 line-clamp-3">
              {truncate(current.overview, 220)}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Play — opens overlay on same page, preserving user gesture */}
              <button
                onClick={() => setPlaying(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-[#0a0a0a] text-[0.85rem] font-bold hover:bg-white/85 transition-all hover:-translate-y-0.5 shadow-lg"
              >
                <Play size={15} className="fill-[#0a0a0a]" />
                Play Now
              </button>

              <a
                href={detailHref}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white/[0.1] text-white text-[0.85rem] font-semibold border border-white/[0.15] hover:bg-white/[0.18] transition-all hover:-translate-y-0.5 backdrop-blur-sm"
              >
                <Info size={15} />
                More Info
              </a>

              <button
                onClick={() => {
                  if (!isSignedIn) {
                    openSignIn();
                    return;
                  }
                  const added = toggleItem({
                    id: current.id,
                    type: mediaType,
                    title: getMediaTitle(current),
                    poster_path: current.poster_path ?? null,
                    vote_average: current.vote_average,
                  });
                  toast(added ? '✓ Added to My List' : '✕ Removed from My List');
                }}
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center border transition-all hover:-translate-y-0.5',
                  inList
                    ? 'bg-[rgba(59,130,246,0.15)] border-[rgba(59,130,246,0.35)] text-[#3b82f6]'
                    : 'bg-white/[0.08] border-white/[0.15] text-white hover:bg-white/[0.14]'
                )}
              >
                {inList ? <Check size={16} /> : <Plus size={16} />}
              </button>
            </div>
          </div>
        </div>

        {items.length > 1 && (
          <div className="absolute bottom-10 right-8 z-10 flex items-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={cn(
                  'h-[3px] rounded-full transition-all duration-300',
                  i === index ? 'w-8 bg-[#3b82f6]' : 'w-5 bg-white/20 hover:bg-white/40'
                )}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function HeroBannerSkeleton() {
  return (
    <div className="relative h-screen min-h-[560px] max-h-[900px] bg-[#111] animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
      <div className="absolute bottom-[10vh] left-8 lg:left-16 space-y-4 max-w-[500px]">
        <div className="w-24 h-3 bg-white/10 rounded" />
        <div className="w-80 h-10 bg-white/10 rounded" />
        <div className="w-60 h-8 bg-white/10 rounded" />
        <div className="w-96 h-4 bg-white/10 rounded" />
        <div className="flex gap-3 mt-6">
          <div className="w-32 h-10 bg-white/10 rounded-lg" />
          <div className="w-32 h-10 bg-white/10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
