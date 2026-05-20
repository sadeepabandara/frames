'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHorizontalScroll } from '@/hooks';
import { MediaCard, MediaCardSkeleton } from './MediaCard';
import type { TMDBMovie, TMDBTVShow, MediaType } from '@/types/tmdb';

type Media = TMDBMovie | TMDBTVShow;

interface MediaRowProps {
  title: string;
  items?: Media[];
  isLoading?: boolean;
  mediaType?: MediaType;
  variant?: 'backdrop' | 'poster' | 'wide';
  skeletonCount?: number;
  viewAllHref?: string;
  eagerCount?: number;
}

export function MediaRow({
  title,
  items,
  isLoading = false,
  mediaType = 'movie',
  variant = 'backdrop',
  skeletonCount = 10,
  viewAllHref,
  eagerCount = 0,
}: MediaRowProps) {
  const { ref, scroll } = useHorizontalScroll();
  const href = viewAllHref || (mediaType === 'tv' ? '/tv' : '/movies');

  return (
    <section className="mb-2">
      {/* Header */}
      <div className="flex items-center justify-between px-6 lg:px-8 mb-3">
        <h2 className="text-[1rem] font-bold text-white tracking-tight">{title}</h2>
        <a href={href} className="text-[0.72rem] font-semibold tracking-[0.07em] uppercase text-[#606060] hover:text-[#3b82f6] transition-colors">
          See all →
        </a>
      </div>

      {/* Row */}
      <div className="group/row relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none opacity-0 group-hover/row:opacity-100 transition-opacity" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none opacity-100 transition-opacity" />

        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-surface-2/95 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all hover:bg-[#282828] hover:scale-105 shadow-lg"
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Scroll container */}
        <div
          ref={ref}
          className="flex gap-2.5 overflow-x-auto scroll-smooth scrollbar-hide px-6 lg:px-8 pb-2"
        >
          {isLoading
            ? Array.from({ length: skeletonCount }).map((_, i) => (
                <MediaCardSkeleton key={i} variant={variant} />
              ))
            : (items || []).map((item, index) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  mediaType={mediaType}
                  variant={variant}
                  eager={index < eagerCount}
                />
              ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-surface-2/95 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all hover:bg-[#282828] hover:scale-105 shadow-lg"
          aria-label="Scroll right"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
