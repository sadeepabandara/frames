// ─── TMDB Core Types ───────────────────────────────────────────────────────

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  genres?: TMDBGenre[];
  popularity: number;
  adult: boolean;
  video: boolean;
  original_language: string;
  runtime?: number;
  status?: string;
  tagline?: string;
  budget?: number;
  revenue?: number;
  production_companies?: TMDBProductionCompany[];
  belongs_to_collection?: { id: number; name: string; poster_path: string; backdrop_path: string } | null;
  media_type?: 'movie';
}

export interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  genres?: TMDBGenre[];
  popularity: number;
  origin_country: string[];
  original_language: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  episode_run_time?: number[];
  status?: string;
  tagline?: string;
  networks?: TMDBNetwork[];
  created_by?: { id: number; name: string; profile_path: string | null }[];
  media_type?: 'tv';
}

export interface TMDBPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  media_type?: 'person';
  known_for?: (TMDBMovie | TMDBTVShow)[];
}

export type TMDBMedia = (TMDBMovie & { media_type: 'movie' }) | (TMDBTVShow & { media_type: 'tv' });

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBNetwork {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface TMDBProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: 'Trailer' | 'Teaser' | 'Clip' | 'Featurette' | 'Behind the Scenes' | 'Bloopers';
  official: boolean;
  published_at: string;
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TMDBCredits {
  cast: TMDBCastMember[];
  crew: TMDBCrewMember[];
}

export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieDetail extends TMDBMovie {
  genres: TMDBGenre[];
  credits?: TMDBCredits;
  videos?: { results: TMDBVideo[] };
  similar?: TMDBPaginatedResponse<TMDBMovie>;
  recommendations?: TMDBPaginatedResponse<TMDBMovie>;
}

export interface TMDBTVDetail extends TMDBTVShow {
  genres: TMDBGenre[];
  credits?: TMDBCredits;
  videos?: { results: TMDBVideo[] };
  similar?: TMDBPaginatedResponse<TMDBTVShow>;
  recommendations?: TMDBPaginatedResponse<TMDBTVShow>;
}

// ─── App Types ─────────────────────────────────────────────────────────────

export interface WatchlistItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  vote_average: number;
  addedAt: string;
}

export interface SearchResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
}

export type MediaType = 'movie' | 'tv';
export type ImageSize = 'w92' | 'w185' | 'w300' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original';

export interface TMDBEpisode {
  id: number;
  episode_number: number;
  season_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  runtime: number | null;
  air_date: string | null;
  vote_average: number;
}
