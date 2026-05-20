'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { GENRES_LIST } from '@/services/tmdb/client';

interface GenreChipsProps {
  onSelect?: (id: number | 'all') => void;
}

export function GenreChips({ onSelect }: GenreChipsProps) {
  const [active, setActive] = useState<number | 'all'>('all');

  const handleSelect = (id: number | 'all') => {
    setActive(id);
    onSelect?.(id);
  };

  return (
    <div className="flex gap-2 px-6 lg:px-8 overflow-x-auto scrollbar-hide py-1">
      {GENRES_LIST.map((g) => (
        <button
          key={g.id}
          onClick={() => handleSelect(g.id as number | 'all')}
          className={cn(
            'flex-shrink-0 px-4 py-1.5 rounded-md text-[0.78rem] font-medium border transition-all whitespace-nowrap',
            active === g.id
              ? 'bg-[rgba(59,130,246,0.1)] border-[rgba(59,130,246,0.3)] text-[#3b82f6]'
              : 'bg-[#181818] border-white/[0.06] text-[#a0a0a0] hover:border-white/[0.14] hover:text-white'
          )}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
