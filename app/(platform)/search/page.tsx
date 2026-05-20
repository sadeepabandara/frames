'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Search, Film, Tv, SlidersHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { searchMulti } from '@/services/tmdb/client';
import { tmdbImage } from '@/services/tmdb/client';
import { useDebounce } from '@/hooks';
import { useUIStore } from '@/store';
import { getMediaTitle, getYear, getMediaDate, formatScore, cn } from '@/lib/utils';

type Filter = 'all' | 'movie' | 'tv';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const debouncedQuery = useDebounce(query, 380);
  const { openModal } = useUIStore();

  const { data, isLoading } = useQuery({
    queryKey: ['search-page', debouncedQuery],
    queryFn: () => searchMulti(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });

  const results = (data?.results || [])
    .filter((r) => {
      if (!['movie', 'tv'].includes(r.media_type)) return false;
      if (!r.poster_path) return false;
      if (filter !== 'all' && r.media_type !== filter) return false;
      return true;
    });

  return (
    <div className="pt-14.5 bg-background min-h-screen">
      <div className="px-6 lg:px-8 pt-10 pb-6">
        <h1 className="text-[2rem] font-extrabold tracking-tight text-white mb-6">Search</h1>

        {/* Search input */}
        <div className="flex items-center gap-3 bg-[#161616] border border-white/8 rounded-xl px-4 py-3 max-w-2xl transition-colors focus-within:border-[rgba(59,130,246,0.3)]">
          <Search size={18} className="text-[#404040] shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, series..."
            className="flex-1 bg-transparent text-white placeholder:text-[#404040] text-[0.95rem] font-medium outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#404040] hover:text-white transition-colors text-lg leading-none">×</button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 mt-4">
          {(['all', 'movie', 'tv'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-1.5 rounded-md text-[0.78rem] font-semibold border transition-all capitalize',
                filter === f
                  ? 'bg-[rgba(59,130,246,0.1)] border-[rgba(59,130,246,0.3)] text-accent'
                  : 'bg-surface-2 border-white/6 text-faint hover:text-white'
              )}
            >
              {f === 'all' ? 'All' : f === 'tv' ? 'TV Series' : 'Movies'}
            </button>
          ))}
          {data && (
            <span className="ml-2 text-[0.75rem] text-[#404040]">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="px-6 lg:px-8 pb-16">
        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-3">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="aspect-2/3 rounded-lg skeleton" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!query && !isLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-surface-2 flex items-center justify-center mb-5">
              <Search size={30} className="text-[#404040]" />
            </div>
            <p className="text-[1rem] font-semibold text-white/40">Search for anything</p>
            <p className="text-[0.82rem] text-[#404040] mt-1">Movies, TV series, actors...</p>
          </div>
        )}

        {/* No results */}
        {debouncedQuery.length > 1 && !isLoading && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-[1rem] font-semibold text-white/40">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-[0.82rem] text-[#404040] mt-1">Try a different search term or filter.</p>
          </div>
        )}

        {/* Results grid */}
        {results.length > 0 && !isLoading && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-3">
            {results.map((item) => (
              <div key={item.id}
                onClick={() => openModal(item.id, item.media_type as 'movie' | 'tv')}
                className="group relative rounded-lg overflow-hidden cursor-pointer bg-surface-2 hover:scale-[1.04] hover:-translate-y-1 transition-all duration-200 shadow-md"
                style={{ paddingBottom: '150%' }}
                >
                <Image src={tmdbImage(item.poster_path, 'w342')} alt={getMediaTitle(item)} fill sizes="180px" className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Media type badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/75 backdrop-blur-sm rounded px-1.5 py-0.5">
                  {item.media_type === 'tv'
                    ? <Tv size={9} className="text-accent" />
                    : <Film size={9} className="text-accent" />}
                  <span className="text-[0.6rem] font-bold text-muted">{item.media_type === 'tv' ? 'TV' : 'Movie'}</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <p className="text-[0.72rem] font-semibold text-white line-clamp-2 leading-tight">{getMediaTitle(item)}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[0.62rem] text-accent font-semibold">{formatScore(item.vote_average)}</span>
                    <span className="w-1 h-1 rounded-full bg-faint" />
                    <span className="text-[0.62rem] text-faint">{getYear(getMediaDate(item))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
