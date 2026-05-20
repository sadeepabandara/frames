import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WatchlistItem } from '@/types/tmdb';

// ─── Watchlist Store ────────────────────────────────────────────────────────
interface WatchlistStore {
  items: WatchlistItem[];
  addItem: (item: Omit<WatchlistItem, 'addedAt'>) => void;
  removeItem: (id: number) => void;
  toggleItem: (item: Omit<WatchlistItem, 'addedAt'>) => boolean; // returns true if added
  isInList: (id: number) => boolean;
  clearAll: () => void;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((s) => ({
          items: [{ ...item, addedAt: new Date().toISOString() }, ...s.items],
        })),
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      toggleItem: (item) => {
        const inList = get().isInList(item.id);
        if (inList) {
          get().removeItem(item.id);
        } else {
          get().addItem(item);
        }
        return !inList;
      },
      isInList: (id) => get().items.some((i) => i.id === id),
      clearAll: () => set({ items: [] }),
    }),
    { name: 'fxs-watchlist' }
  )
);

// ─── UI Store ───────────────────────────────────────────────────────────────
interface UIStore {
  searchOpen: boolean;
  mobileMenuOpen: boolean;
  authOpen: boolean;
  authTab: 'login' | 'signup';
  activeModal: { id: number; type: 'movie' | 'tv' } | null;
  videoPlayerOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  setMobileMenuOpen: (v: boolean) => void;
  setAuthOpen: (v: boolean, tab?: 'login' | 'signup') => void;
  openModal: (id: number, type: 'movie' | 'tv') => void;
  closeModal: () => void;
  setVideoPlayerOpen: (v: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  searchOpen: false,
  mobileMenuOpen: false,
  authOpen: false,
  authTab: 'login',
  activeModal: null,
  videoPlayerOpen: false,
  setSearchOpen: (v) => set({ searchOpen: v }),
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
  setAuthOpen: (v, tab = 'login') => set({ authOpen: v, authTab: tab }),
  openModal: (id, type) => set({ activeModal: { id, type } }),
  closeModal: () => set({ activeModal: null }),
  setVideoPlayerOpen: (v) => set({ videoPlayerOpen: v }),
}));

// ─── Hero Store ─────────────────────────────────────────────────────────────
interface HeroStore {
  currentIndex: number;
  setIndex: (i: number) => void;
  next: (max: number) => void;
}

export const useHeroStore = create<HeroStore>((set) => ({
  currentIndex: 0,
  setIndex: (i) => set({ currentIndex: i }),
  next: (max) => set((s) => ({ currentIndex: (s.currentIndex + 1) % max })),
}));
