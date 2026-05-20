import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMediaTitle(media: { title?: string; name?: string; original_title?: string; original_name?: string }): string {
  return media.title || media.name || media.original_title || media.original_name || 'Unknown';
}

export function getMediaDate(media: { release_date?: string; first_air_date?: string }): string {
  return media.release_date || media.first_air_date || '';
}

export function getYear(dateStr: string | undefined): string {
  if (!dateStr) return '';
  return dateStr.slice(0, 4);
}

export function formatScore(score: number | undefined): string {
  if (!score) return '–';
  return score.toFixed(1);
}

export function formatRuntime(minutes: number | undefined): string {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatVoteCount(count: number | undefined): string {
  if (!count) return '';
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k votes`;
  return `${count} votes`;
}

export function truncate(str: string | undefined, len: number): string {
  if (!str) return '';
  return str.length > len ? str.slice(0, len - 1) + '…' : str;
}
