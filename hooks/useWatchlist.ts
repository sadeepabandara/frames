import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWatchlistStore } from '@/store';
import toast from 'react-hot-toast';
import type { WatchlistItem } from '@/types/tmdb';

type AddItem = Omit<WatchlistItem, 'addedAt'>;

// ─── API helpers ─────────────────────────────────────────────────────────────
async function fetchWatchlist(): Promise<WatchlistItem[]> {
  const res = await fetch('/api/watchlist');
  if (!res.ok) throw new Error('Failed to fetch watchlist');
  const data = await res.json();
  return data.items;
}

async function apiAdd(item: AddItem): Promise<void> {
  const res = await fetch('/api/watchlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to add item');
}

async function apiRemove(id: number): Promise<void> {
  const res = await fetch('/api/watchlist', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Failed to remove item');
}

// ─── Main hook ────────────────────────────────────────────────────────────────
export function useWatchlist() {
  const { isSignedIn } = useUser();
  const qc = useQueryClient();
  const local = useWatchlistStore();

  // Only fetch from DB when signed in
  const { data: dbItems = [] } = useQuery<WatchlistItem[]>({
    queryKey: ['watchlist'],
    queryFn: fetchWatchlist,
    enabled: !!isSignedIn,
    staleTime: 30_000,
  });

  const items: WatchlistItem[] = isSignedIn ? dbItems : local.items;

  const addMutation = useMutation({
    mutationFn: apiAdd,
    onMutate: async (item) => {
      // Optimistic update
      await qc.cancelQueries({ queryKey: ['watchlist'] });
      const prev = qc.getQueryData<WatchlistItem[]>(['watchlist']) ?? [];
      qc.setQueryData<WatchlistItem[]>(['watchlist'], [
        { ...item, addedAt: new Date().toISOString() },
        ...prev,
      ]);
      return { prev };
    },
    onError: (_err, _item, ctx) => {
      if (ctx?.prev) qc.setQueryData(['watchlist'], ctx.prev);
      toast.error('Failed to save to list');
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['watchlist'] }),
  });

  const removeMutation = useMutation({
    mutationFn: apiRemove,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['watchlist'] });
      const prev = qc.getQueryData<WatchlistItem[]>(['watchlist']) ?? [];
      qc.setQueryData<WatchlistItem[]>(['watchlist'], prev.filter((i) => i.id !== id));
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['watchlist'], ctx.prev);
      toast.error('Failed to remove from list');
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['watchlist'] }),
  });

  const isInList = (id: number) =>
    isSignedIn
      ? (qc.getQueryData<WatchlistItem[]>(['watchlist']) ?? []).some((i) => i.id === id)
      : local.isInList(id);

  const toggleItem = (item: AddItem): boolean => {
    if (isSignedIn) {
      const inList = (qc.getQueryData<WatchlistItem[]>(['watchlist']) ?? []).some(
        (i) => i.id === item.id
      );
      if (inList) {
        removeMutation.mutate(item.id);
      } else {
        addMutation.mutate(item);
      }
      return !inList;
    } else {
      return local.toggleItem(item);
    }
  };

  const removeItem = (id: number) => {
    if (isSignedIn) {
      removeMutation.mutate(id);
    } else {
      local.removeItem(id);
    }
  };

  return { items, isInList, toggleItem, removeItem };
}
