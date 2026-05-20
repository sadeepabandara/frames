'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Play } from 'lucide-react';
import { tmdbImage } from '@/services/tmdb/client';
import { getMediaTitle, getYear, getMediaDate, formatScore, cn } from '@/lib/utils';
import type { TMDBMovie, TMDBTVShow, MediaType } from '@/types/tmdb';

type Media = TMDBMovie | TMDBTVShow;

interface MediaCardProps {
  item: Media;
  mediaType?: MediaType;
  variant?: 'backdrop' | 'poster' | 'wide';
  className?: string;
  eager?: boolean;
}

const DIMENSIONS = {
  poster:   { w: 150, h: 225, imgSize: 'w342' as const },
  backdrop: { w: 220, h: 124, imgSize: 'w500' as const },
  wide:     { w: 260, h: 146, imgSize: 'w500' as const },
};

export function MediaCard({ item, mediaType = 'movie', variant = 'backdrop', className, eager = false }: MediaCardProps) {
  const dim = DIMENSIONS[variant];
  const isPortrait = variant === 'poster';
  const imagePath = isPortrait ? item.poster_path : (item.backdrop_path || item.poster_path);
  // Priority: explicit media_type on item (trending) > passed mediaType prop > title field guess
  const type: MediaType = (
    (item as any).media_type === 'tv' ? 'tv' :
    (item as any).media_type === 'movie' ? 'movie' :
    mediaType
  ) as MediaType;
  const href = type === 'tv' ? `/tv/${item.id}` : `/movies/${item.id}`;

  return (
    <Link
      href={href}
      aria-label={getMediaTitle(item)}
      className={cn(
        'group relative shrink-0 rounded-lg overflow-hidden cursor-pointer bg-surface-2',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-[0_20px_48px_rgba(0,0,0,0.7)] hover:z-10',
        className
      )}
      style={{ width: dim.w, height: dim.h, position: 'relative' }}
    >
      <Image
        src={tmdbImage(imagePath, dim.imgSize)}
        alt={getMediaTitle(item)}
        fill
        loading={eager ? 'eager' : undefined}
        fetchPriority={eager ? 'high' : undefined}
        sizes={`${dim.w}px`}
        className="object-cover"
        unoptimized
      />
      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/75 backdrop-blur-sm rounded px-1.5 py-0.5 border border-white/10">
        <Star size={8} className="fill-accent text-accent" />
        <span className="text-[0.65rem] font-bold text-accent">{formatScore(item.vote_average)}</span>
      </div>
      <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-sm rounded px-1.5 py-0.5 border border-white/10">
        <span className="text-[0.58rem] font-bold text-muted tracking-wide">HD</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="w-11 h-11 rounded-full bg-accent/90 flex items-center justify-center shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
          <Play size={14} className="fill-background text-background ml-0.5" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <p className="text-[0.75rem] font-semibold text-white line-clamp-2 leading-tight mb-1">{getMediaTitle(item)}</p>
        <div className="flex items-center gap-1.5 text-[0.67rem] text-faint">
          <span>{getYear(getMediaDate(item))}</span>
          <span className="w-1 h-1 rounded-full bg-faint" />
          <span className="text-accent font-semibold">{formatScore(item.vote_average)}</span>
        </div>
      </div>
    </Link>
  );
}

export function MediaCardSkeleton({ variant = 'backdrop' }: { variant?: 'backdrop' | 'poster' | 'wide' }) {
  const dim = DIMENSIONS[variant];
  return <div className="shrink-0 rounded-lg skeleton" style={{ width: dim.w, height: dim.h }} />;
}
