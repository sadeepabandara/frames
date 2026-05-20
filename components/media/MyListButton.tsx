'use client';
import { Plus, Check } from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useWatchlist } from '@/hooks';
import toast from 'react-hot-toast';
import type { WatchlistItem } from '@/types/tmdb';

interface Props {
  item?: Omit<WatchlistItem, 'addedAt'>;
  className?: string;
}

export function MyListButton({ item, className }: Props) {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const { isInList, toggleItem } = useWatchlist();

  const inList = item ? isInList(item.id) : false;

  const handleClick = () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    if (!item) return;
    const added = toggleItem(item);
    toast(added ? `✓ Added to My List` : `✕ Removed from My List`);
  };

  return (
    <button onClick={handleClick} className={className}>
      {inList ? <Check size={15} /> : <Plus size={15} />}
      {inList ? 'In My List' : 'My List'}
    </button>
  );
}
