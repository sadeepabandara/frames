import type { Metadata } from 'next';
import { HomeContent } from './HomeContent';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Discover trending movies and series on FRAMEZ.',
};

export default function HomePage() {
  return <HomeContent />;
}
