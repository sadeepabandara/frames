'use client';
import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Play, Plus, Check, Star, Clock, Tv } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useUIStore } from '@/store';
import { useWatchlist } from '@/hooks';
import { getMovieDetail, getTVDetail, tmdbImage } from '@/services/tmdb/client';
import { getMediaTitle, getYear, formatScore, formatRuntime, formatVoteCount, cn } from '@/lib/utils';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import type { TMDBMovieDetail, TMDBTVDetail, TMDBCastMember } from '@/types/tmdb';
import toast from 'react-hot-toast';

type DetailData = TMDBMovieDetail | TMDBTVDetail;

function isMovie(d: DetailData): d is TMDBMovieDetail {
  return 'title' in d && 'release_date' in d;
}

async function fetchDetail(id: number, type: 'movie' | 'tv'): Promise<DetailData> {
  if (type === 'tv') return getTVDetail(id);
  return getMovieDetail(id);
}

export function MediaModal() {
  const { activeModal, closeModal } = useUIStore();
  const { toggleItem, isInList } = useWatchlist();
  const [playing, setPlaying] = useState(false);

  // Close player if modal closes
  useEffect(() => {
    if (!activeModal) setPlaying(false);
  }, [activeModal]);

  useEffect(() => {
    document.body.style.overflow = activeModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeModal]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (playing) { setPlaying(false); return; }
      closeModal();
    }
  }, [closeModal, playing]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const { data, isLoading } = useQuery<DetailData>({
    queryKey: ['detail', activeModal?.type, activeModal?.id],
    queryFn: () => fetchDetail(activeModal!.id, activeModal!.type),
    enabled: !!activeModal,
  });

  if (!activeModal) return null;

  const trailer = data?.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  ) ?? data?.videos?.results?.find((v) => v.site === 'YouTube');

  const cast: TMDBCastMember[] = data?.credits?.cast?.slice(0, 8) ?? [];
  const director = data?.credits?.crew?.find((c) => c.job === 'Director');
  const inList = data ? isInList(data.id) : false;
  const similarItems: any[] = data
    ? ((data as any).similar?.results ?? []).filter((m: any) => m.poster_path).slice(0, 12)
    : [];

  const releaseDate = data
    ? isMovie(data) ? data.release_date : (data as TMDBTVDetail).first_air_date
    : undefined;
  const runtime = data && isMovie(data) ? data.runtime : undefined;
  const seasons = data && !isMovie(data) ? (data as TMDBTVDetail).number_of_seasons : undefined;

  const handleWatchlist = () => {
    if (!data) return;
    const added = toggleItem({
      id: data.id,
      type: activeModal.type,
      title: getMediaTitle(data),
      poster_path: data.poster_path,
      vote_average: data.vote_average,
    });
    toast(added ? '✓ Added to My List' : '✕ Removed from My List');
  };

  return (
    <>
      {/* VideoPlayer — rendered outside the modal, full screen, same page */}
      {playing && data && (
        <VideoPlayer
          tmdbId={data.id}
          type={activeModal.type}
          title={getMediaTitle(data)}
          onClose={() => setPlaying(false)}
        />
      )}

      <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm" onClick={closeModal} aria-hidden="true" />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
        <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#161616] rounded-xl border border-white/[0.08] shadow-2xl scrollbar-hide animate-fade-up">

          {/* Hero backdrop */}
          <div className="relative h-[280px] sm:h-[340px] rounded-t-xl overflow-hidden flex-shrink-0 bg-black">
            {isLoading ? (
              <div className="w-full h-full skeleton" />
            ) : data?.backdrop_path ? (
              <Image src={tmdbImage(data.backdrop_path, 'w1280')} alt={getMediaTitle(data)} fill sizes="800px" className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full bg-[#1a1a1a]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[rgba(22,22,22,0.2)] to-transparent" />
            {/* Play button — opens overlay on same page */}
            {data && (
              <button
                onClick={() => setPlaying(true)}
                className="absolute inset-0 flex items-center justify-center group"
              >
                <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-2xl transition-all group-hover:scale-110">
                  <Play size={26} className="fill-[#0a0a0a] text-[#0a0a0a] ml-1" />
                </div>
              </button>
            )}
          </div>

          {/* Close */}
          <button onClick={closeModal} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/70 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Close">
            <X size={14} />
          </button>

          {/* Body */}
          <div className="px-6 sm:px-8 pb-8 -mt-8 relative z-10">
            {isLoading ? <ModalSkeleton /> : data ? (
              <>
                {/* Genres */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {data.genres?.slice(0, 4).map((g) => (
                    <span key={g.id} className="px-2 py-0.5 rounded text-[0.65rem] font-semibold tracking-wide uppercase bg-white/[0.06] text-[#a0a0a0] border border-white/[0.08]">{g.name}</span>
                  ))}
                </div>

                <h2 className="text-[1.7rem] sm:text-[2rem] font-extrabold tracking-tight text-white mb-2 leading-tight">{getMediaTitle(data)}</h2>

                {/* Stats */}
                <div className="flex items-center flex-wrap gap-2 text-[0.78rem] text-[#a0a0a0] mb-4">
                  <span className="flex items-center gap-1 text-[#3b82f6] font-bold"><Star size={12} className="fill-[#3b82f6]" />{formatScore(data.vote_average)}</span>
                  <Dot /><span>{getYear(releaseDate)}</span>
                  {runtime && <><Dot /><span className="flex items-center gap-1"><Clock size={11} />{formatRuntime(runtime)}</span></>}
                  {seasons && <><Dot /><span className="flex items-center gap-1"><Tv size={11} />{seasons} Season{seasons > 1 ? 's' : ''}</span></>}
                  {data.vote_count && <><Dot /><span>{formatVoteCount(data.vote_count)}</span></>}
                </div>

                <p className="text-[0.87rem] text-white/65 leading-relaxed mb-6">{data.overview || 'No overview available.'}</p>

                {/* Actions */}
                <div className="flex items-center gap-2.5 flex-wrap mb-6">
                  <button
                    onClick={() => setPlaying(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-[#0a0a0a] text-[0.83rem] font-bold hover:bg-white/85 transition-all hover:-translate-y-0.5 shadow-lg"
                  >
                    <Play size={13} className="fill-[#0a0a0a]" />Play Now
                  </button>
                  <button onClick={handleWatchlist}
                    className={cn(
                      'flex items-center gap-2 px-5 py-2.5 rounded-lg text-[0.83rem] font-semibold border transition-all hover:-translate-y-0.5',
                      inList
                        ? 'bg-[rgba(59,130,246,0.1)] border-[rgba(59,130,246,0.3)] text-[#3b82f6]'
                        : 'bg-white/[0.07] border-white/[0.12] text-white hover:bg-white/[0.12]'
                    )}>
                    {inList ? <Check size={14} /> : <Plus size={14} />}
                    {inList ? 'In My List' : 'My List'}
                  </button>
                  <Link href={`/${activeModal.type === 'tv' ? 'tv' : 'movies'}/${data.id}`} onClick={closeModal}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[0.83rem] font-semibold bg-white/[0.07] border border-white/[0.12] text-[#a0a0a0] hover:text-white hover:bg-white/[0.12] transition-all">
                    Full Details
                  </Link>
                </div>

                {director && <p className="text-[0.78rem] text-[#606060] mb-4"><span className="text-[#a0a0a0]">Director:</span> {director.name}</p>}

                {/* Cast */}
                {cast.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#606060] mb-3">Cast</h3>
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                      {cast.map((member) => (
                        <div key={member.id} className="flex-shrink-0 text-center w-16">
                          <div className="w-14 h-14 rounded-full overflow-hidden bg-[#1e1e1e] mx-auto mb-1.5">
                            {member.profile_path ? (
                              <Image src={tmdbImage(member.profile_path, 'w185')} alt={member.name} width={56} height={56} className="object-cover w-full h-full" style={{ width: '100%', height: '100%' }} unoptimized />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[0.7rem] text-[#606060] font-bold">{member.name[0]}</div>
                            )}
                          </div>
                          <p className="text-[0.65rem] font-medium text-white/70 leading-tight line-clamp-2">{member.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="h-px bg-white/[0.06] mb-6" />

                {/* Similar */}
                {similarItems.length > 0 && (
                  <div>
                    <h3 className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#606060] mb-3">More Like This</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {similarItems.map((item) => (
                        <div key={item.id}
                          onClick={() => { closeModal(); setTimeout(() => useUIStore.getState().openModal(item.id, activeModal.type), 50); }}
                          className="relative rounded-md overflow-hidden cursor-pointer bg-[#1e1e1e] hover:scale-105 transition-transform"
                          style={{ paddingBottom: '150%' }}>
                          <Image src={tmdbImage(item.poster_path, 'w185')} alt={getMediaTitle(item)} fill sizes="120px" className="object-cover" unoptimized />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-[#606060] py-8 text-center">Failed to load details.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Dot() { return <span className="w-1 h-1 rounded-full bg-[#606060]" />; }

function ModalSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="flex gap-2">{[60, 70, 55].map((w, i) => <div key={i} className="h-5 rounded bg-white/[0.06]" style={{ width: w }} />)}</div>
      <div className="h-8 w-3/4 rounded bg-white/[0.07]" />
      <div className="h-4 w-1/2 rounded bg-white/[0.05]" />
      <div className="space-y-2 mt-4"><div className="h-3 rounded bg-white/[0.05]" /><div className="h-3 rounded bg-white/[0.05]" /><div className="h-3 w-4/5 rounded bg-white/[0.05]" /></div>
      <div className="flex gap-2 mt-4"><div className="w-32 h-10 rounded-lg bg-white/[0.07]" /><div className="w-28 h-10 rounded-lg bg-white/[0.07]" /></div>
    </div>
  );
}
