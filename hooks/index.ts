'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function useScrollPosition(threshold = 60): boolean {
  const [scrolled, setScrolled] = useState(false);
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  return scrolled;
}

export function useHorizontalScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = useCallback((direction: 'left' | 'right', amount = 640) => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  }, []);
  return { ref, scroll };
}
export { useWatchlist } from './useWatchlist';
