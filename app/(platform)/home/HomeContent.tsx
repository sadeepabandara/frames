'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getTrending, getTopRatedMovies, getPopularMovies, getPopularTV,
  getMoviesByGenre, getTVByGenre, getTVByNetwork,
  GENRE_IDS, NETWORK_IDS,
} from '@/services/tmdb/client';
import { HeroBanner } from '@/components/media/HeroBanner';
import { MediaRow } from '@/components/media/MediaRow';
import { GenreChips } from '@/components/media/GenreChips';

export function HomeContent() {
  const [genreFilter, setGenreFilter] = useState<number | 'all'>('all');

  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending-all', genreFilter],
    queryFn: () =>
      genreFilter === 'all'
        ? getTrending('week')
        : getMoviesByGenre(genreFilter as number),
  });

  const { data: topRated, isLoading: topRatedLoading } = useQuery({
    queryKey: ['top-rated-movies'],
    queryFn: () => getTopRatedMovies(),
  });

  const { data: netflixOriginals, isLoading: netflixLoading } = useQuery({
    queryKey: ['netflix-originals'],
    queryFn: () => getTVByNetwork(NETWORK_IDS.NETFLIX),
  });

  const { data: actionMovies, isLoading: actionLoading } = useQuery({
    queryKey: ['action-movies'],
    queryFn: () => getMoviesByGenre(GENRE_IDS.ACTION),
  });

  const { data: scifiMovies, isLoading: scifiLoading } = useQuery({
    queryKey: ['scifi-movies'],
    queryFn: () => getMoviesByGenre(GENRE_IDS.SCIFI),
  });

  const { data: dramaSeries, isLoading: dramaLoading } = useQuery({
    queryKey: ['drama-series'],
    queryFn: () => getTVByGenre(GENRE_IDS.DRAMA),
  });

  const { data: comedyMovies, isLoading: comedyLoading } = useQuery({
    queryKey: ['comedy-movies'],
    queryFn: () => getMoviesByGenre(GENRE_IDS.COMEDY),
  });

  const { data: horrorMovies, isLoading: horrorLoading } = useQuery({
    queryKey: ['horror-movies'],
    queryFn: () => getMoviesByGenre(GENRE_IDS.HORROR),
  });

  const { data: popularTV, isLoading: popularTVLoading } = useQuery({
    queryKey: ['popular-tv'],
    queryFn: () => getPopularTV(),
  });

  return (
    <div className="bg-[#0a0a0a]">
      {/* Hero */}
      <HeroBanner />

      {/* Genre filter */}
      <div className="mt-8 mb-2">
        <GenreChips onSelect={setGenreFilter} />
      </div>

      {/* Content rows */}
      <div className="mt-6 space-y-8 pb-8">
        <MediaRow
          title="Trending Now" viewAllHref="/browse?c=movies-popular"
          items={trending?.results}
          isLoading={trendingLoading}
          mediaType="movie"
          variant="wide"
          eagerCount={1}
        />

        <MediaRow
          title="Top Rated Films" viewAllHref="/browse?c=movies-toprated"
          items={topRated?.results}
          isLoading={topRatedLoading}
          mediaType="movie"
          variant="backdrop"
          eagerCount={14}
        />

        <MediaRow
          title="Streaming Originals" viewAllHref="/browse?c=tv-netflix"
          items={netflixOriginals?.results}
          isLoading={netflixLoading}
          mediaType="tv"
          variant="poster"
          eagerCount={1}
        />

        <MediaRow
          title="Action & Thrills" viewAllHref="/browse?c=movies-action"
          items={actionMovies?.results}
          isLoading={actionLoading}
          mediaType="movie"
          variant="backdrop"
          eagerCount={1}
        />

        <MediaRow
          title="Sci-Fi & Fantasy" viewAllHref="/browse?c=movies-scifi"
          items={scifiMovies?.results}
          isLoading={scifiLoading}
          mediaType="movie"
          variant="backdrop"
          eagerCount={1}
        />

        <MediaRow
          title="Drama Series" viewAllHref="/browse?c=tv-drama"
          items={dramaSeries?.results}
          isLoading={dramaLoading}
          mediaType="tv"
          variant="wide"
          eagerCount={1}
        />

        <MediaRow
          title="Comedy & Feel-Good" viewAllHref="/browse?c=movies-comedy"
          items={comedyMovies?.results}
          isLoading={comedyLoading}
          mediaType="movie"
          variant="backdrop"
          eagerCount={1}
        />

        <MediaRow
          title="Horror & Suspense" viewAllHref="/browse?c=movies-horror"
          items={horrorMovies?.results}
          isLoading={horrorLoading}
          mediaType="movie"
          variant="backdrop"
          eagerCount={1}
        />

        <MediaRow
          title="Popular Series" viewAllHref="/browse?c=tv-popular"
          items={popularTV?.results}
          isLoading={popularTVLoading}
          mediaType="tv"
          variant="wide"
          eagerCount={1}
        />
      </div>
    </div>
  );
}
