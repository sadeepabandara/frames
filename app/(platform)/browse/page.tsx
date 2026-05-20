'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies,
  getMoviesByGenre, getPopularTV, getTopRatedTV, getTVByGenre, getTVByNetwork,
  GENRE_IDS, NETWORK_IDS,
} from '@/services/tmdb/client';
import { MediaCard, MediaCardSkeleton } from '@/components/media/MediaCard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const CATEGORY_MAP: Record<string, { label: string; fn: () => Promise<any>; type: 'movie' | 'tv' }> = {
  'movies-popular':    { label: 'Popular Movies',       fn: getPopularMovies,                           type: 'movie' },
  'movies-toprated':   { label: 'Top Rated Movies',     fn: getTopRatedMovies,                          type: 'movie' },
  'movies-nowplaying': { label: 'Now Playing',          fn: getNowPlayingMovies,                        type: 'movie' },
  'movies-upcoming':   { label: 'Coming Soon',          fn: getUpcomingMovies,                          type: 'movie' },
  'movies-action':     { label: 'Action & Adventure',   fn: () => getMoviesByGenre(GENRE_IDS.ACTION),   type: 'movie' },
  'movies-scifi':      { label: 'Sci-Fi & Fantasy',     fn: () => getMoviesByGenre(GENRE_IDS.SCIFI),    type: 'movie' },
  'movies-horror':     { label: 'Horror',               fn: () => getMoviesByGenre(GENRE_IDS.HORROR),   type: 'movie' },
  'movies-comedy':     { label: 'Comedy',               fn: () => getMoviesByGenre(GENRE_IDS.COMEDY),   type: 'movie' },
  'movies-thriller':   { label: 'Thriller',             fn: () => getMoviesByGenre(GENRE_IDS.THRILLER), type: 'movie' },
  'movies-romance':    { label: 'Romance',              fn: () => getMoviesByGenre(GENRE_IDS.ROMANCE),  type: 'movie' },
  'tv-popular':        { label: 'Popular Series',       fn: getPopularTV,                               type: 'tv' },
  'tv-toprated':       { label: 'Top Rated Series',     fn: getTopRatedTV,                              type: 'tv' },
  'tv-netflix':        { label: 'Netflix Originals',    fn: () => getTVByNetwork(NETWORK_IDS.NETFLIX),  type: 'tv' },
  'tv-drama':          { label: 'Drama Series',         fn: () => getTVByGenre(GENRE_IDS.DRAMA),        type: 'tv' },
  'tv-scifi':          { label: 'Sci-Fi Series',        fn: () => getTVByGenre(GENRE_IDS.SCIFI),        type: 'tv' },
  'tv-comedy':         { label: 'Comedy Series',        fn: () => getTVByGenre(GENRE_IDS.COMEDY),       type: 'tv' },
  'tv-crime':          { label: 'Crime & Mystery',      fn: () => getTVByGenre(GENRE_IDS.CRIME),        type: 'tv' },
};

function BrowseContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('c') || 'movies-popular';
  const meta = CATEGORY_MAP[category] || CATEGORY_MAP['movies-popular'];

  const { data, isLoading } = useQuery({
    queryKey: ['browse', category],
    queryFn: meta.fn,
  });

  const items = data?.results || [];

  return (
    <div className="pt-[58px] bg-[#0a0a0a] min-h-screen">
      <div className="px-6 lg:px-8 pt-10 pb-6 flex items-center gap-4">
        <Link href={meta.type === 'tv' ? '/tv' : '/movies'}
          className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] transition-colors">
          <ArrowLeft size={15} />
        </Link>
        <div>
          <h1 className="text-[1.8rem] font-extrabold tracking-tight text-white">{meta.label}</h1>
          <p className="text-[0.82rem] text-[#606060] mt-0.5">{items.length} titles</p>
        </div>
      </div>

      <div className="px-6 lg:px-8 pb-16">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {Array.from({ length: 18 }).map((_, i) => (
              <MediaCardSkeleton key={i} variant="poster" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {items.map((item: any) => (
              <MediaCard key={item.id} item={item} mediaType={meta.type} variant="poster" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="pt-[58px] bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#3b82f6] border-t-transparent animate-spin" />
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
