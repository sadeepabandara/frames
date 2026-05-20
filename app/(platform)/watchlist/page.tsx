'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Star, Film, Tv } from 'lucide-react';
import { useWatchlist } from '@/hooks';
import { tmdbImage } from '@/services/tmdb/client';
import { getYear, formatScore } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function WatchlistPage() {
  const { items, removeItem } = useWatchlist();

  const handleRemove = (e: React.MouseEvent, id: number, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeItem(id);
    toast(`✕ Removed "${title}" from My List`);
  };

  return (
    <div className="pt-[58px] bg-[#0a0a0a] min-h-screen">
      <div className="px-6 lg:px-8 pt-10 pb-6">
        <h1 className="text-[2rem] font-extrabold tracking-tight text-white">My List</h1>
        <p className="text-[0.85rem] text-[#606060] mt-1">
          {items.length > 0 ? `${items.length} title${items.length > 1 ? 's' : ''} saved` : 'Your watchlist is empty'}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-[#181818] flex items-center justify-center mb-6">
            <Film size={32} className="text-[#404040]" />
          </div>
          <h2 className="text-[1.2rem] font-bold text-white mb-2">Nothing saved yet</h2>
          <p className="text-[0.85rem] text-[#606060] max-w-sm mb-8">
            Browse movies and series and add them to your list using the + button.
          </p>
          <Link href="/home" className="px-6 py-2.5 rounded-lg bg-white text-[#0a0a0a] font-bold text-[0.85rem] hover:bg-white/85 transition-colors">
            Browse Content
          </Link>
        </div>
      ) : (
        <div className="px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
            {items.map((item) => (
              <div key={item.id} className="group relative">
                <Link
                  href={`/${item.type === 'tv' ? 'tv' : 'movies'}/${item.id}`}
                  className="block rounded-lg overflow-hidden bg-[#181818] hover:scale-[1.03] hover:-translate-y-1 transition-all duration-200 shadow-lg"
                  style={{ position: 'relative', paddingBottom: '150%' }}
                >
                  <Image
                    src={tmdbImage(item.poster_path, 'w342')}
                    alt={item.title}
                    fill sizes="200px"
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    <p className="text-[0.75rem] font-semibold text-white line-clamp-2 leading-tight">{item.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {item.type === 'tv' ? <Tv size={9} className="text-[#3b82f6]" /> : <Film size={9} className="text-[#3b82f6]" />}
                      <span className="text-[0.65rem] text-[#606060] flex items-center gap-1">
                        <Star size={8} className="fill-[#3b82f6] text-[#3b82f6]" />{formatScore(item.vote_average)}
                      </span>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={(e) => handleRemove(e, item.id, item.title)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/80 border border-white/10 text-white/60 hover:text-red-400 hover:border-red-400/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
                  aria-label="Remove from list"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
