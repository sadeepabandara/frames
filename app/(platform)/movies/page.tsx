'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies, getMoviesByGenre, GENRE_IDS } from '@/services/tmdb/client';
import { MediaRow } from '@/components/media/MediaRow';

export default function MoviesPage() {
  return (
    <div className="pt-[58px] bg-[#0a0a0a] min-h-screen">
      {/* Page header */}
      <div className="px-6 lg:px-8 pt-10 pb-6">
        <h1 className="text-[2rem] font-extrabold tracking-tight text-white">
          Movies
        </h1>
        <p className="text-[0.85rem] text-[#606060] mt-1">Thousands of films, handpicked for you.</p>
      </div>

      <MoviesContent />
    </div>
  );
}

function MoviesContent() {
  const { data: popular, isLoading: popularLoading } = useQuery({ queryKey: ['movies-popular'], queryFn: () => getPopularMovies() });
  const { data: topRated, isLoading: topLoading } = useQuery({ queryKey: ['movies-toprated'], queryFn: () => getTopRatedMovies() });
  const { data: nowPlaying, isLoading: nowLoading } = useQuery({ queryKey: ['movies-nowplaying'], queryFn: () => getNowPlayingMovies() });
  const { data: upcoming, isLoading: upcomingLoading } = useQuery({ queryKey: ['movies-upcoming'], queryFn: () => getUpcomingMovies() });
  const { data: action } = useQuery({ queryKey: ['movies-action'], queryFn: () => getMoviesByGenre(GENRE_IDS.ACTION) });
  const { data: scifi } = useQuery({ queryKey: ['movies-scifi'], queryFn: () => getMoviesByGenre(GENRE_IDS.SCIFI) });
  const { data: horror } = useQuery({ queryKey: ['movies-horror'], queryFn: () => getMoviesByGenre(GENRE_IDS.HORROR) });
  const { data: comedy } = useQuery({ queryKey: ['movies-comedy'], queryFn: () => getMoviesByGenre(GENRE_IDS.COMEDY) });
  const { data: thriller } = useQuery({ queryKey: ['movies-thriller'], queryFn: () => getMoviesByGenre(GENRE_IDS.THRILLER) });
  const { data: romance } = useQuery({ queryKey: ['movies-romance'], queryFn: () => getMoviesByGenre(GENRE_IDS.ROMANCE) });

  return (
    <div className="space-y-8 pb-16">
      <MediaRow title="Popular Movies" items={popular?.results} isLoading={popularLoading} mediaType="movie" variant="backdrop" viewAllHref="/browse?c=movies-popular" />
      <MediaRow title="Now Playing" items={nowPlaying?.results} isLoading={nowLoading} mediaType="movie" variant="wide" viewAllHref="/browse?c=movies-nowplaying" />
      <MediaRow title="Top Rated" items={topRated?.results} isLoading={topLoading} mediaType="movie" variant="backdrop" viewAllHref="/browse?c=movies-toprated" />
      <MediaRow title="Coming Soon" items={upcoming?.results} isLoading={upcomingLoading} mediaType="movie" variant="poster" viewAllHref="/browse?c=movies-upcoming" />
      <MediaRow title="Action & Adventure" items={action?.results} mediaType="movie" variant="backdrop" viewAllHref="/browse?c=movies-action" />
      <MediaRow title="Sci-Fi & Fantasy" items={scifi?.results} mediaType="movie" variant="backdrop" viewAllHref="/browse?c=movies-scifi" />
      <MediaRow title="Horror" items={horror?.results} mediaType="movie" variant="backdrop" viewAllHref="/browse?c=movies-horror" />
      <MediaRow title="Comedy" items={comedy?.results} mediaType="movie" variant="backdrop" viewAllHref="/browse?c=movies-comedy" />
      <MediaRow title="Thriller" items={thriller?.results} mediaType="movie" variant="backdrop" viewAllHref="/browse?c=movies-thriller" />
      <MediaRow title="Romance" items={romance?.results} mediaType="movie" variant="backdrop" viewAllHref="/browse?c=movies-romance" />
    </div>
  );
}
