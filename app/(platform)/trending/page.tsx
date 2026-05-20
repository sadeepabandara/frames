'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTrending } from '@/services/tmdb/client';
import { MediaRow } from '@/components/media/MediaRow';
import { cn } from '@/lib/utils';

export default function TrendingPage() {
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('week');

  const { data, isLoading } = useQuery({
    queryKey: ['trending-page', timeWindow],
    queryFn: () => getTrending(timeWindow),
  });

  return (
    <div className="pt-[58px] bg-[#0a0a0a] min-h-screen">
      <div className="px-6 lg:px-8 pt-10 pb-6">
        <h1 className="text-[2rem] font-extrabold tracking-tight text-white">Trending</h1>
        <p className="text-[0.85rem] text-[#606060] mt-1">What the world is watching right now.</p>
        <div className="flex items-center gap-2 mt-5">
          {(['day', 'week'] as const).map((w) => (
            <button key={w} onClick={() => setTimeWindow(w)}
              className={cn('px-4 py-1.5 rounded-md text-[0.82rem] font-semibold border transition-all',
                timeWindow === w
                  ? 'bg-[rgba(59,130,246,0.12)] border-[rgba(59,130,246,0.3)] text-[#3b82f6]'
                  : 'bg-[#181818] border-white/[0.06] text-[#606060] hover:text-white')}>
              {w === 'day' ? 'Today' : 'This Week'}
            </button>
          ))}
        </div>
      </div>
      <div className="pb-16">
        <MediaRow title={timeWindow === 'day' ? 'Trending Today' : 'Trending This Week'}
          items={data?.results} isLoading={isLoading} mediaType="movie" variant="wide" skeletonCount={15} />
      </div>
    </div>
  );
}
