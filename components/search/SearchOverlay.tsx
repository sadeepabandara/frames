'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, TrendingUp, CornerDownLeft, Star } from 'lucide-react';
import { useUIStore } from '@/store';
import { useDebounce } from '@/hooks';
import { searchMulti, getTrendingLite, tmdbImage } from '@/services/tmdb/client';
import { getMediaTitle, getYear, getMediaDate, formatScore } from '@/lib/utils';

/** Rank results: exact title > starts with > contains, then by popularity. */
function rankResults(items: any[], q: string) {
  const needle = q.trim().toLowerCase();
  return items
    .map((item) => {
      const title = getMediaTitle(item).toLowerCase();
      let score = Math.log10(1 + (item.popularity || 0)) * 50;
      if (title === needle) score += 1000;
      else if (title.startsWith(needle)) score += 500;
      else if (title.includes(needle)) score += 200;
      score += (item.vote_average || 0) * 2;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((r) => r.item);
}

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUIStore();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 250);
  const isSearching = debouncedQuery.trim().length > 1;

  // Default: trending
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ['search-trending'],
    queryFn: getTrendingLite,
    enabled: searchOpen,
    staleTime: 5 * 60 * 1000,
  });

  // Typed query
  const { data: searchData, isFetching: searchLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchMulti(debouncedQuery.trim()),
    enabled: searchOpen && isSearching,
    staleTime: 60 * 1000,
  });

  const results = useMemo(() => {
    const valid = (r: any) => ['movie', 'tv'].includes(r.media_type) && r.poster_path;
    if (isSearching) {
      return rankResults((searchData?.results || []).filter(valid), debouncedQuery).slice(0, 8);
    }
    return (trendingData?.results || []).filter(valid).slice(0, 6);
  }, [isSearching, searchData, trendingData, debouncedQuery]);

  const loading = isSearching ? searchLoading : trendingLoading;

  // Reset on open
  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Reset highlighted row when the list changes
  useEffect(() => { setActiveIndex(0); }, [debouncedQuery]);

  // Keep highlighted row in view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Global shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setSearchOpen]);

  const open = (item: any) => {
    setSearchOpen(false);
    router.push(item.media_type === 'tv' ? `/tv/${item.id}` : `/movies/${item.id}`);
  };

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      open(results[activeIndex]);
    }
  };

  if (!searchOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-md"
        onClick={() => setSearchOpen(false)}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed left-1/2 top-[10vh] sm:top-[14vh] z-[151] w-[calc(100%-2rem)] max-w-[600px] -translate-x-1/2 rounded-3xl border border-white/10 bg-[#0e0e10] shadow-2xl shadow-black/60 overflow-hidden animate-fade-in">
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.07]">
          <Search size={20} className="text-white/60 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search movies, series, anime…"
            className="flex-1 bg-transparent text-white placeholder:text-white/30 text-[1.05rem] font-medium outline-none"
            aria-label="Search"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="px-2 py-1 rounded-md border border-white/10 bg-white/[0.04] text-[0.65rem] font-bold tracking-wide text-white/50 hover:text-white transition-colors"
            aria-label="Close search"
          >
            esc
          </button>
        </div>

        {/* Section label */}
        <div className="flex items-center gap-2 px-5 pt-4 pb-2 text-[0.7rem] font-semibold tracking-[0.15em] uppercase text-white/40">
          {isSearching ? <Search size={13} /> : <TrendingUp size={13} />}
          {isSearching ? 'Best matches' : 'Trending'}
        </div>

        {/* Results */}
        <div ref={listRef} className="px-2.5 pb-2 max-h-[52vh] overflow-y-auto scrollbar-hide">
          {loading && results.length === 0 &&
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5">
                <div className="w-[42px] h-[58px] rounded-md skeleton" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-2/3 rounded skeleton" />
                  <div className="h-3 w-1/3 rounded skeleton" />
                </div>
              </div>
            ))}

          {!loading && isSearching && results.length === 0 && (
            <p className="text-[0.85rem] text-white/40 py-10 text-center">
              No results found for &ldquo;{query}&rdquo;
            </p>
          )}

          {results.map((item: any, i: number) => {
            const active = i === activeIndex;
            return (
              <button
                key={`${item.media_type}-${item.id}`}
                data-index={i}
                onClick={() => open(item)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full flex items-center gap-3.5 p-2.5 rounded-2xl text-left transition-colors ${
                  active ? 'bg-white/[0.07]' : 'bg-transparent'
                }`}
              >
                <div className="relative w-[42px] h-[58px] rounded-md overflow-hidden shrink-0 bg-surface-2">
                  <Image
                    src={tmdbImage(item.poster_path, 'w92')}
                    alt={getMediaTitle(item)}
                    fill
                    sizes="42px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.95rem] font-semibold text-white truncate">
                    {getMediaTitle(item)}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[0.75rem] text-white/45">
                    <span>{getYear(getMediaDate(item))}</span>
                    <span>·</span>
                    <span>{item.media_type === 'tv' ? 'Series' : 'Film'}</span>
                    <span>·</span>
                    <Star size={11} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-yellow-400/90 font-medium">{formatScore(item.vote_average)}</span>
                  </p>
                </div>
                {active && <CornerDownLeft size={16} className="text-white/50 shrink-0 mr-1" />}
              </button>
            );
          })}
        </div>

        {/* Footer hints */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.07] text-[0.75rem] text-white/40">
          <div className="hidden sm:flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04] font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04] font-mono">↓</kbd>
              move
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04] font-mono">↵</kbd>
              open
            </span>
          </div>
          <span className="flex items-center gap-1.5 ml-auto">
            <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04] font-mono">⌘K</kbd>
            anywhere
          </span>
        </div>
      </div>
    </>
  );
}
