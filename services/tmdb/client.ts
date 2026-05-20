import type {
  TMDBPaginatedResponse,
  TMDBMovie,
  TMDBTVShow,
  TMDBMovieDetail,
  TMDBTVDetail,
  SearchResult,
  TMDBVideo,
  ImageSize,
} from '@/types/tmdb';

// ─── Base fetch helper ───────────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY  = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';

async function tmdbFetch<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (res.status === 401) throw new Error('Invalid TMDB API key');
  if (res.status === 404) throw new Error('Not found');
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return res.json();
}

// ─── Image Helpers ───────────────────────────────────────────────────────────
const IMG_BASE = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

export function tmdbImage(path: string | null | undefined, size: ImageSize = 'w500'): string {
  if (!path) return '/placeholder.png';
  return `${IMG_BASE}/${size}${path}`;
}

// ─── Genre Map ───────────────────────────────────────────────────────────────
export const GENRE_IDS = {
  ACTION: 28, COMEDY: 35, HORROR: 27, ROMANCE: 10749,
  DOCUMENTARY: 99, THRILLER: 53, ANIMATION: 16, CRIME: 80,
  SCIFI: 878, DRAMA: 18, FANTASY: 14, FAMILY: 10751, HISTORY: 36,
} as const;

export const NETWORK_IDS = {
  NETFLIX: 213, HBO: 49, APPLE_TV: 2552, DISNEY: 2739, AMAZON: 1024,
} as const;

export const GENRES_LIST = [
  { id: 'all', name: 'All' },
  { id: 28,    name: 'Action' },
  { id: 878,   name: 'Sci-Fi' },
  { id: 18,    name: 'Drama' },
  { id: 35,    name: 'Comedy' },
  { id: 27,    name: 'Horror' },
  { id: 53,    name: 'Thriller' },
  { id: 10749, name: 'Romance' },
  { id: 99,    name: 'Documentary' },
  { id: 16,    name: 'Animation' },
  { id: 80,    name: 'Crime' },
  { id: 14,    name: 'Fantasy' },
  { id: 10751, name: 'Family' },
];

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function getTrending(timeWindow: 'day' | 'week' = 'week') {
  const data = await tmdbFetch<TMDBPaginatedResponse<TMDBMovie & { media_type: string }>>(
    `/trending/all/${timeWindow}`
  );
  const topItems = data.results.filter(m => m.backdrop_path && m.overview).slice(0, 6);
  await Promise.all(topItems.map(async (item) => {
    try {
      const type = (item as any).media_type === 'tv' ? 'tv' : 'movie';
      const res = await tmdbFetch<{ results: TMDBVideo[] }>(`/${type}/${item.id}/videos`);
      const trailer = res.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')
        || res.results.find(v => v.site === 'YouTube');
      if (trailer) (item as any).trailerKey = trailer.key;
    } catch { /* no trailer */ }
  }));
  return data;
}

export async function getTopRatedMovies(page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>('/movie/top_rated', { page });
}

export async function getTopRatedTV(page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBTVShow>>('/tv/top_rated', { page });
}

export async function getPopularMovies(page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>('/movie/popular', { page });
}

export async function getPopularTV(page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBTVShow>>('/tv/popular', { page });
}

export async function getNowPlayingMovies() {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>('/movie/now_playing');
}

export async function getUpcomingMovies() {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>('/movie/upcoming');
}

export async function getMoviesByGenre(genreId: number, page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>('/discover/movie', {
    with_genres: genreId, sort_by: 'popularity.desc', page,
  });
}

export async function getTVByGenre(genreId: number, page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBTVShow>>('/discover/tv', {
    with_genres: genreId, sort_by: 'popularity.desc', page,
  });
}

export async function getTVByNetwork(networkId: number) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBTVShow>>('/discover/tv', {
    with_networks: networkId, sort_by: 'popularity.desc',
  });
}

export async function getMovieDetail(id: number): Promise<TMDBMovieDetail> {
  return tmdbFetch<TMDBMovieDetail>(`/movie/${id}`, {
    append_to_response: 'credits,videos,similar,recommendations',
  });
}

export async function getTVDetail(id: number): Promise<TMDBTVDetail> {
  return tmdbFetch<TMDBTVDetail>(`/tv/${id}`, {
    append_to_response: 'credits,videos,similar,recommendations',
  });
}

export async function getMovieVideos(id: number): Promise<TMDBVideo[]> {
  const data = await tmdbFetch<{ results: TMDBVideo[] }>(`/movie/${id}/videos`);
  return data.results;
}

export async function getTVVideos(id: number): Promise<TMDBVideo[]> {
  const data = await tmdbFetch<{ results: TMDBVideo[] }>(`/tv/${id}/videos`);
  return data.results;
}

export async function getTVSeasonEpisodes(tvId: number, seasonNumber: number) {
  const data = await tmdbFetch<{ episodes: import('@/types/tmdb').TMDBEpisode[] }>(
    `/tv/${tvId}/season/${seasonNumber}`
  );
  return data.episodes || [];
}

export async function searchMulti(query: string, page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<SearchResult>>('/search/multi', {
    query: encodeURIComponent(query), page, include_adult: 'false',
  });
}

export async function searchMovies(query: string, page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>('/search/movie', {
    query: encodeURIComponent(query), page,
  });
}

export async function searchTV(query: string, page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBTVShow>>('/search/tv', {
    query: encodeURIComponent(query), page,
  });
}
