'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Play, Download, Search, ArrowDownUp, ChevronDown, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getTVSeasonEpisodes, tmdbImage } from '@/services/tmdb/client';
import { useUser, useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import type { TMDBEpisode } from '@/types/tmdb';

export function EpisodesSectionClient({ show }: { show: any }) {
  const seasons = (show.seasons || []).filter((s: any) => s.season_number > 0);
  const [selectedSeason, setSelectedSeason] = useState<number>(seasons[0]?.season_number || 1);
  const [search, setSearch] = useState('');
  const [reversed, setReversed] = useState(false);
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  // Which episode is currently playing (null = closed)
  const [playing, setPlaying] = useState<{ season: number; episode: number; name: string } | null>(null);

  const { data: episodes, isLoading } = useQuery<TMDBEpisode[]>({
    queryKey: ['tv-episodes', show.id, selectedSeason],
    queryFn: () => getTVSeasonEpisodes(show.id, selectedSeason),
  });

  const currentSeason = seasons.find((s: any) => s.season_number === selectedSeason) || seasons[0];
  if (!currentSeason) return null;

  let filteredEpisodes = episodes || [];

  if (search.trim()) {
    filteredEpisodes = filteredEpisodes.filter(ep =>
      ep.name.toLowerCase().includes(search.toLowerCase()) ||
      `episode ${ep.episode_number}`.includes(search.toLowerCase()) ||
      String(ep.episode_number).includes(search.trim())
    );
  }

  if (reversed) filteredEpisodes = [...filteredEpisodes].reverse();

  return (
    <>
      {/* VideoPlayer overlay — same page, gesture preserved, no play button in player */}
      {playing && (
        <VideoPlayer
          tmdbId={show.id}
          type="tv"
          title={show.name}
          season={playing.season}
          episode={playing.episode}
          episodeName={playing.name}
          onClose={() => setPlaying(null)}
        />
      )}

      <div className="mb-10">
        <h2 className="text-[1rem] font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#3b82f6] rounded-full inline-block" />
          Episodes
        </h2>

        {/* Controls */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {/* Season dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(v => !v)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1a1a1a] border border-white/[0.08] text-[0.8rem] text-white/70 font-medium hover:border-white/[0.14] transition-colors min-w-[120px]"
            >
              <span className="flex-1 text-left">Season {selectedSeason}</span>
              <ChevronDown size={12} className={cn('text-white/30 transition-transform flex-shrink-0', dropdownOpen && 'rotate-180')} />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full mt-1 left-0 z-20 bg-[#1a1a1a] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl min-w-[130px]">
                {seasons.map((s: any) => (
                  <button
                    key={s.season_number}
                    onClick={() => { setSelectedSeason(s.season_number); setDropdownOpen(false); setSearch(''); }}
                    className={cn(
                      'w-full text-left px-4 py-2.5 text-[0.8rem] transition-colors',
                      s.season_number === selectedSeason
                        ? 'text-[#3b82f6] bg-[rgba(59,130,246,0.08)]'
                        : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
                    )}
                  >
                    Season {s.season_number}
                    <span className="ml-1.5 text-white/20 text-[0.72rem]">({s.episode_count})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 flex-1 max-w-[260px] px-3 py-2 rounded-lg bg-[#1a1a1a] border border-white/[0.08] focus-within:border-white/[0.14] transition-colors">
            <Search size={13} className="text-white/25 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search episode..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[0.8rem] text-white/70 placeholder:text-white/20 outline-none"
            />
          </div>

          {/* Sort toggle */}
          <button
            onClick={() => setReversed(v => !v)}
            title="Reverse order"
            className={cn(
              'w-9 h-9 rounded-lg flex items-center justify-center border transition-colors',
              reversed
                ? 'bg-[rgba(59,130,246,0.1)] border-[rgba(59,130,246,0.3)] text-[#3b82f6]'
                : 'bg-[#1a1a1a] border-white/[0.08] text-white/30 hover:text-white/60 hover:border-white/[0.14]'
            )}
          >
            <ArrowDownUp size={14} />
          </button>
        </div>

        {/* Episode list */}
        <div className="bg-[#111] rounded-xl border border-white/[0.06] overflow-hidden divide-y divide-white/[0.04]">

          {isLoading && Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="w-24 h-[54px] rounded-lg bg-white/[0.04] animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 bg-white/[0.04] rounded animate-pulse" />
                <div className="h-2.5 w-1/3 bg-white/[0.03] rounded animate-pulse" />
              </div>
            </div>
          ))}

          {!isLoading && filteredEpisodes.map(ep => (
            <div key={ep.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors group">

              {/* Thumbnail — click opens player */}
              <button
                onClick={() => setPlaying({ season: selectedSeason, episode: ep.episode_number, name: ep.name || '' })}
                className="relative w-24 h-[54px] rounded-lg overflow-hidden bg-[#1a1a1a] flex-shrink-0 cursor-pointer"
              >
                {ep.still_path ? (
                  <Image
                    src={tmdbImage(ep.still_path, 'w300')}
                    alt={ep.name || `Episode ${ep.episode_number}`}
                    fill sizes="96px"
                    className="object-cover"
                    unoptimized
                  />
                ) : show.backdrop_path ? (
                  <Image
                    src={tmdbImage(show.backdrop_path, 'w300')}
                    alt={ep.name || `Episode ${ep.episode_number}`}
                    fill sizes="96px"
                    className="object-cover opacity-40"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white/20 text-[0.7rem] font-bold">{ep.episode_number}</span>
                  </div>
                )}

                {/* Episode number badge */}
                <div className="absolute bottom-1 left-1 w-5 h-5 rounded bg-black/70 flex items-center justify-center">
                  <span className="text-[0.6rem] font-bold text-white">{ep.episode_number}</span>
                </div>

                {/* Play icon on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                  <div className="w-7 h-7 rounded-full bg-black/70 border border-white/20 flex items-center justify-center">
                    <Play size={10} className="fill-white text-white ml-0.5" />
                  </div>
                </div>
              </button>

              {/* Info — click opens player */}
              <button
                onClick={() => setPlaying({ season: selectedSeason, episode: ep.episode_number, name: ep.name || '' })}
                className="flex-1 min-w-0 text-left"
              >
                <p className="text-[0.84rem] font-medium text-white/80 group-hover:text-white transition-colors truncate">
                  {ep.name || `Episode ${ep.episode_number}`}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[0.72rem] text-[#606060]">S{selectedSeason} E{ep.episode_number}</span>
                  {ep.runtime && (
                    <>
                      <span className="text-white/15">·</span>
                      <span className="flex items-center gap-1 text-[0.72rem] text-[#606060]">
                        <Clock size={9} />{ep.runtime}m
                      </span>
                    </>
                  )}
                </div>
                {ep.overview && (
                  <p className="text-[0.72rem] text-white/25 mt-0.5 line-clamp-1">{ep.overview}</p>
                )}
              </button>

              {/* Download — guests see sign-in prompt, members see Coming Soon */}
              {isSignedIn ? (
                <button
                  onClick={() => toast('Download coming soon!')}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-[#3b82f6] hover:bg-white/[0.05] transition-all flex-shrink-0"
                  title="Download — Coming Soon"
                >
                  <Download size={14} />
                </button>
              ) : (
                <button
                  onClick={() => openSignIn()}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-[#3b82f6] hover:bg-white/[0.05] transition-all flex-shrink-0"
                  title="Sign in to download"
                >
                  <Download size={14} />
                </button>
              )}
            </div>
          ))}

          {!isLoading && filteredEpisodes.length === 0 && (
            <div className="px-4 py-6 text-center text-[0.78rem] text-[#606060]">
              No episodes found
            </div>
          )}
        </div>
      </div>
    </>
  );
}
