'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Search, X, Film, Tv } from 'lucide-react';
import { useUIStore } from '@/store';
import { useDebounce } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { searchMulti, tmdbImage } from '@/services/tmdb/client';
import { getMediaTitle, getYear, getMediaDate, formatScore } from '@/lib/utils';

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUIStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 380);

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchMulti(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });

  const results = (data?.results || []).filter(
    (r) => ['movie', 'tv'].includes(r.media_type) && r.poster_path
  ).slice(0, 20);

  // Focus input when opened
  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [searchOpen]);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setSearchOpen]);

  if (!searchOpen) return null;

  return (
    <>
      {/* Overlay backdrop */}
      <div
        className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm"
        onClick={() => setSearchOpen(false)}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed top-0 left-0 right-0 z-[151] bg-[#0e0e0e] border-b border-white/8 animate-fade-up">
        {/* Input */}
        <div className="flex items-center gap-3 px-6 lg:px-8 py-4 border-b border-white/6">
          <Search size={18} className="text-faint shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, series..."
            className="flex-1 bg-transparent text-white placeholder:text-[#404040] text-[0.95rem] font-medium outline-none"
            aria-label="Search"
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-faint hover:text-white hover:bg-white/6 transition-colors"
            aria-label="Close search"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="px-6 lg:px-8 py-4 max-h-[65vh] overflow-y-auto scrollbar-hide">
          {!query && (
            <p className="text-[0.8rem] text-[#404040] py-6 text-center">
              Start typing to search movies and series...
            </p>
          )}

          {query && isLoading && (
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-2.5 pb-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="aspect-2/3 rounded-md skeleton" />
              ))}
            </div>
          )}

          {query && !isLoading && results.length === 0 && debouncedQuery.length > 1 && (
            <p className="text-[0.82rem] text-[#404040] py-8 text-center">
              No results found for &ldquo;{query}&rdquo;
            </p>
          )}

          {results.length > 0 && (
            <>
              <p className="text-[0.7rem] font-semibold tracking-widest uppercase text-[#404040] mb-3">
                {data?.total_results} results
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-2.5 pb-4">
                {results.map((item) => (
                  <SearchResultCard
                    key={item.id}
                    item={item}
                    onSelect={() => setSearchOpen(false)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="px-6 lg:px-8 py-2.5 border-t border-white/5 flex items-center gap-4">
          <span className="text-[0.68rem] text-[#404040]">Press <kbd className="px-1.5 py-0.5 rounded bg-white/6 text-faint font-mono">Esc</kbd> to close</span>
          <span className="text-[0.68rem] text-[#404040]"><kbd className="px-1.5 py-0.5 rounded bg-white/6 text-faint font-mono">Ctrl K</kbd> to open</span>
        </div>
      </div>
    </>
  );
}

function SearchResultCard({ item, onSelect }: { item: any; onSelect: () => void }) {
  const href = item.media_type === 'tv' ? `/tv/${item.id}` : `/movies/${item.id}`;

  return (
    <a
      href={href}
      onClick={onSelect}
      className="group relative rounded-md overflow-hidden cursor-pointer bg-surface-2 hover:scale-105 hover:-translate-y-0.5 transition-all duration-200"
      style={{ position: 'relative', paddingBottom: '150%', display: 'block' }}
    >
      <Image
        src={tmdbImage(item.poster_path, 'w185')}
        alt={getMediaTitle(item)}
        fill
        sizes="100px"
        className="object-cover"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 right-0 p-1.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
        <p className="text-[0.62rem] font-semibold text-white line-clamp-2 leading-tight">
          {getMediaTitle(item)}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          {item.media_type === 'tv'
            ? <Tv size={8} className="text-accent" />
            : <Film size={8} className="text-accent" />
          }
          <span className="text-[0.6rem] text-faint">{getYear(getMediaDate(item))}</span>
        </div>
      </div>
    </a>
  );
}
